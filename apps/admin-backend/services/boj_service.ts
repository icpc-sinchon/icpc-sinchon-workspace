import TaskRepository from "repositories/task_repository";
import LectureRepository from "repositories/lecture_repository";
import StudentRepository from "repositories/student_repository";
import ProblemRepository from "repositories/problem_repository";
import WeeklyAttendLogRepository from "repositories/weekly_attend_log_repository";
import StudentWithAttendRepository from "repositories/student_with_attend_repository";
import type { Problem } from "@prisma/client";

export type BojAttendance = {
	bojHandle: string;
	problems: number[];
};

export default class BojService {
	private static instance: BojService;
	private taskRepository: typeof TaskRepository;
	private lectureRepository: typeof LectureRepository;
	private studentRepository: typeof StudentRepository;
	private studentWithAttendRepository: typeof StudentWithAttendRepository;
	private problemRepository: typeof ProblemRepository;
	private weeklyAttendLogRepository: typeof WeeklyAttendLogRepository;

	// 의존성 주입받도록 변경?
	private constructor() {
		this.taskRepository = TaskRepository;
		this.lectureRepository = LectureRepository;
		this.studentRepository = StudentRepository;
		this.studentWithAttendRepository = StudentWithAttendRepository;
		this.problemRepository = ProblemRepository;
		this.weeklyAttendLogRepository = WeeklyAttendLogRepository;
	}

	public static getInstance(): BojService {
		if (!BojService.instance) {
			BojService.instance = new BojService();
		}
		return BojService.instance;
	}

	async findGroupIdAndPracticeIdByTaskId(taskId: number) {
		const task = await this.taskRepository.findTaskWithProblemsById(taskId);
		if (!task) throw new Error("Task not found");

		const lecture = await this.lectureRepository.findLectureById(
			task.lectureId,
		);
		if (!lecture) throw new Error("Lecture not found");

		return {
			groupId: lecture.bojGroupId,
			practiceId: task.practiceId,
		};
	}

	// 이 학생이 푼 필수 문제의 개수를 세어 반환
	private countSolvedEssentialProblems(
		taskProblems: Problem[],
		attendance: BojAttendance,
	) {
		return taskProblems.filter(
			(problem) =>
				problem.essential &&
				attendance.problems.includes(problem.bojProblemNumber),
		).length;
	}

	private processAttendance(
		attendances: BojAttendance,
		minSolveCount: number,
		taskProblems: Problem[],
	) {
		const essentialSolvedCount = this.countSolvedEssentialProblems(
			taskProblems,
			attendances,
		);

		return {
			bojHandle: attendances.bojHandle,
			taskDone: essentialSolvedCount >= minSolveCount,
		};
	}

	async updateWeeklyAttendLogsByBojScrap(
		taskId: number,
		// boj 핸들, 학생이 푼 문제 목록이 들어 있다
		attendances: BojAttendance[],
	) {
		const task = await this.taskRepository.findTaskWithProblemsById(taskId);
		if (!task) {
			throw new Error(`task not found: ${taskId}`);
		}
		// 필수 문제 목록을 가져온다
		const taskProblems = task.problems;
		const studentAttendStatus = attendances.map((attendance) =>
			this.processAttendance(attendance, task.minSolveCount, taskProblems),
		);

		// 출석 조건을 충족시킨 학생들의 boj 핸들 배열
		const attendedStudentsBojHandles = studentAttendStatus
			.filter((attendance) => attendance.taskDone)
			.map((attendance) => attendance.bojHandle);

		// 출석 조건을 충족시키지 못한 학생들의 boj 핸들 배열
		const notAttendedStudentsBojHandles = studentAttendStatus
			.filter((attendance) => !attendance.taskDone)
			.map((attendance) => attendance.bojHandle);

		await StudentWithAttendRepository.upsertStudentWeeklyAttendLogsByBojHandlesAndLectureIdAndRound(
			notAttendedStudentsBojHandles,
			task.lectureId,
			task.round,
			{ taskDone: false },
		);

		await StudentWithAttendRepository.upsertStudentWeeklyAttendLogsByBojHandlesAndLectureIdAndRound(
			attendedStudentsBojHandles,
			task.lectureId,
			task.round,
			{ taskDone: true },
		);

		// boj 핸들들의 weeklyAttendLog 업데이트
		return studentAttendStatus;
	}
}
