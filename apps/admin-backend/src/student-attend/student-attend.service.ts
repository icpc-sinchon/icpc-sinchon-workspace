import { Injectable } from "@nestjs/common";
import { CreateStudentAttendDto } from "./dto/create-student-attend.dto";
import {
  UpdateAttendanceDto,
  UpdateStudentAttendDto,
} from "./dto/update-student-attend.dto";
import { Lecture, Prisma, RefundPolicy } from "@prisma/client";
import { StudentAttendRepository } from "./student-attend.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { WeeklyAttendLogRepository } from "@/weekly-attend-log/weekly-attend-log.repository";
import puppeteer, { Cookie } from "puppeteer";
import * as cheerio from "cheerio";
import * as fs from "node:fs";
import { TaskRepository } from "@/task/task.repository";
import { RefundPolicyRepository } from "@/refund-policy/refund-policy.repository";

type BojAttendance = {
  bojHandle: string;
  solved: number[];
};

const studentWithWeeklyAttendLog =
  Prisma.validator<Prisma.StudentDefaultArgs>()({
    select: {
      id: true,
      name: true,
      bojHandle: true,
      weeklyAttendLog: {
        select: { round: true, lectureDone: true, taskDone: true },
      },
      studentLectureLog: {
        select: {
          refundAccount: true,
          refundOption: true,
          lecture: {
            select: {
              id: true,
              level: true,
              lectureNumber: true,
              semesterId: true,
            },
          },
        },
      },
    },
  });

type StudentWithWeeklyAttendLog = Prisma.StudentGetPayload<
  typeof studentWithWeeklyAttendLog
>;

@Injectable()
export class StudentAttendService {
  constructor(
    private readonly studentAttendRepository: StudentAttendRepository,
    private readonly lectureRepository: LectureRepository, // TODO: 환급정책 관련
    private readonly taskRepository: TaskRepository,
    private readonly weeklyAttendLogRepository: WeeklyAttendLogRepository,
    private readonly refundPolicyRepository: RefundPolicyRepository
  ) {}
  private cookies: Cookie[] = [];

  private getHeaders(): Record<string, string> {
    return {
      Cookie: this.cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; "),
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      Referer: "https://www.acmicpc.net/login",
      Connection: "keep-alive",
    };
  }

  async reLogin(): Promise<void> {
    const boj_id = process.env.SINCHON_BOJ_ID;
    const boj_pw = process.env.SINCHON_BOJ_PW;

    if (!boj_id || !boj_pw) {
      throw new Error("BOJ 계정이 서버에 등록되어 있지 않습니다.");
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    try {
      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );

      await page.goto("https://www.acmicpc.net/login");

      // Log the page content for debugging
      // console.log("Page content:", await page.content());

      await page.type('input[name="login_user_id"]', boj_id);
      await page.type('input[name="login_password"]', boj_pw);
      await page.click('input[name="auto_login"]');
      await Promise.all([
        page.click("#submit_button"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);

      const cookies = await page.cookies();
      fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));

      console.log("Re-login success.");
    } catch (err) {
      console.error("Re-login error:", err);
      throw new Error("Re-login failed");
    } finally {
      await browser.close();
    }
  }

  async fetchPageContent(url: string): Promise<cheerio.CheerioAPI> {
    if (this.cookies.length === 0) {
      const cookiesFile = fs.readFileSync("cookies.json", "utf-8");
      this.cookies = JSON.parse(cookiesFile);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page content: ${response.statusText}`);
    }

    const html = await response.text();
    return cheerio.load(html);
  }

  async getStudentAttendances(
    taskId: number,
    groupId: number,
    practiceId: number
  ) {
    const $ = await this.fetchPageContent(
      `https://www.acmicpc.net/group/practice/view/${groupId}/${practiceId}`
    );

    // 연습의 문제들
    const problems = $("table > thead > tr > th > a")
      .map((_, element) =>
        Number.parseInt(element.attribs.href.split("/")[2], 10)
      )
      .get();

    const attendances: BojAttendance[] = $("table > tbody > tr")
      .map((_, tr) => {
        const $tr = $(tr);

        return {
          bojHandle: $tr.find("th").eq(1).text(),
          solved: $tr
            .find("td")
            .slice(0, -1)
            .map((index, td) =>
              $(td).attr("class") === "accepted" ? problems[index] : null
            )
            .get()
            // type predicates
            .filter((problem) => problem !== null),
        };
      })
      .get();

    console.log(
      "참여자들: ",
      attendances.filter((a) => a.solved.length > 0)
    );

    const task = await this.taskRepository.getTaskWithProblemsById(taskId);

    if (!task) {
      throw new Error(`Task not found for ${taskId}`);
    }

    const taskProblems = task.problems;

    const studentAttendances = attendances.map((attendance) => {
      const solvedEssentialProblemsCount = taskProblems.filter(
        (problem) =>
          problem.essential &&
          attendance.solved.includes(problem.bojProblemNumber)
      ).length;

      return {
        bojHandle: attendance.bojHandle,
        taskDone: solvedEssentialProblemsCount >= task.minSolveCount,
      };
    });
    console.log(
      "필수 문제 풀이 완료자: ",
      studentAttendances.filter((a) => a.taskDone)
    );

    return studentAttendances;
  }

  private mapAttendanceData(
    studentData: StudentWithWeeklyAttendLog,
    lectureNumber: number
  ) {
    return {
      studentId: studentData.id,
      lectureId: studentData.studentLectureLog[0]?.lecture.id,
      name: studentData.name,
      bojHandle: studentData.bojHandle,
      attendLog: Array.from({ length: lectureNumber }, (_, index) => {
        const log = studentData.weeklyAttendLog.find(
          (log) => log.round === index + 1
        );
        return log
          ? {
              lectureDone: log.lectureDone,
              taskDone: log.taskDone,
              round: log.round,
            }
          : { lectureDone: false, taskDone: false, round: index + 1 };
      }),
      refundAccount: studentData.studentLectureLog[0]?.refundAccount,
      refundOption: studentData.studentLectureLog[0]?.refundOption,
      refundAmount: 0,
    };
  }

  async findAllStudentsAttendLogsInLecture(
    semesterId: number,
    lectureLevel: Lecture["level"]
  ) {
    const lecture = await this.lectureRepository.getLectureBySemesterAndLevel(
      semesterId,
      lectureLevel
    );

    if (!lecture) {
      throw new Error(`Lecture not found for ${lectureLevel}`);
    }

    const studentsWithAttendLogs =
      await this.studentAttendRepository.getAllStudentsWithAttendLogInLecture(
        lecture.id
      );

    const studentsAttendLogs = studentsWithAttendLogs.map((student) =>
      this.mapAttendanceData(student, lecture.lectureNumber)
    );

    const refundPolicies =
      await this.refundPolicyRepository.getRefundPoliciesBySemester(semesterId);
    // console.log(refundPolicies);

    const lectureRefundPolicies = refundPolicies.filter(
      (policy) => policy.type === "LECTURE"
    );
    const taskRefundPolicies = refundPolicies.filter(
      (policy) => policy.type === "TASK"
    );

    for (const studentsAttendLog of studentsAttendLogs) {
      studentsAttendLog.refundAmount =
        studentsAttendLog.refundOption === "NonRefund"
          ? 0
          : await this.calculateTotalRefundAmount(
              studentsAttendLog.attendLog,
              lectureRefundPolicies,
              taskRefundPolicies
            );
      console.log(studentsAttendLog);
    }

    return studentsAttendLogs;
  }

  /**
   * Calculates refund amount for a specific type (lecture or task)
   *
   * @param attendCount - Number of completed items (lectures or tasks)
   * @param policies - Array of refund policies
   * @returns The refund amount for the specific type
   */
  private calculateRefundForType(
    attendCount: number,
    policies: RefundPolicy[]
  ): number {
    for (const policy of policies) {
      if (attendCount >= policy.minAttend && attendCount <= policy.maxAttend) {
        return policy.refundAmount;
      }
    }
    return 0;
  }

  /**
   * Calculates the total refund amount based on attendances and refund policies
   *
   * @param attendances - Array of attendance records
   * @param lectureRefundPolicies - Array of lecture refund policies
   * @param taskRefundPolicies - Array of task refund policies
   * @returns The total refund amount
   */
  async calculateTotalRefundAmount(
    attendances: { lectureDone: boolean; taskDone: boolean }[],
    lectureRefundPolicies: RefundPolicy[],
    taskRefundPolicies: RefundPolicy[]
  ): Promise<number> {
    let totalRefundAmount = 0;
    const lectureCount = attendances.filter((a) => a.lectureDone).length;
    const taskCount = attendances.filter((a) => a.taskDone).length;

    totalRefundAmount += this.calculateRefundForType(
      lectureCount,
      lectureRefundPolicies
    );
    totalRefundAmount += this.calculateRefundForType(
      taskCount,
      taskRefundPolicies
    );

    return totalRefundAmount;
  }

  updateMultipleAttendance(dto: UpdateAttendanceDto[]) {
    console.log("bulk update attendance", dto);
    const updates = dto.map((data) => {
      this.weeklyAttendLogRepository.upsertWeeklyAttendLog({
        where: {
          studentId_lectureId_round: {
            lectureId: data.lectureId,
            round: data.round,
            studentId: data.studentId,
          },
        },
        update: {
          lectureDone: data.lectureDone,
          taskDone: data.taskDone,
        },
        create: {
          lectureDone: data.lectureDone,
          taskDone: data.taskDone,
          round: data.round,
          student: { connect: { id: data.studentId } },
          lecture: { connect: { id: data.lectureId } },
        },
      });
    });

    return Promise.all(updates);
  }
}
