import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";
import { Season, Level, RefundOption } from "@prisma/client";
import { LectureIdentifier } from "@/types";
import { StudentLectureRepository } from "@/student-lecture/student-lecture.repository";
import { SemesterRepository } from "@/semester/semester.repository";
import { StudentRepository } from "@/student/student.repository";
import { StudentLectureLogRepository } from "@/student-lecture-log/student-lecture-log.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { StudentLectureService } from "@/student-lecture/student-lecture.service";

const mockSemesterRepository = mockDeep<SemesterRepository>();
const mockStudentRepository = mockDeep<StudentRepository>();
const mockLectureRepository = mockDeep<LectureRepository>();
const mockStudentLectureRepository = mockDeep<StudentLectureRepository>();
const mockStudentLectureLogRepository = mockDeep<StudentLectureLogRepository>();

describe("StudentLectureService", () => {
  let studentLectureService: StudentLectureService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        StudentLectureService,
        StudentLectureRepository,
        SemesterRepository,
        StudentRepository,
        StudentLectureLogRepository,
        LectureRepository,
      ],
    })
      .overrideProvider(StudentLectureRepository)
      .useValue(mockStudentLectureRepository)
      .overrideProvider(SemesterRepository)
      .useValue(mockSemesterRepository)
      .overrideProvider(StudentRepository)
      .useValue(mockStudentRepository)
      .overrideProvider(StudentLectureLogRepository)
      .useValue(mockStudentLectureLogRepository)
      .overrideProvider(LectureRepository)
      .useValue(mockLectureRepository)
      .compile();

    studentLectureService = moduleRef.get<StudentLectureService>(StudentLectureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getStudentLectureLogByStudentId", () => {
    test("학생의 특정 학기 및 레벨 강의 로그를 반환해야 합니다", async () => {
      const studentId = 1;
      const query: LectureIdentifier = { year: 2024, season: Season.Summer, level: Level.Advanced };
      const semester = { id: 1, year: 2024, season: Season.Summer };
      const lecture = { id: 2, level: Level.Advanced, lectureNumber: 10, bojGroupId: 101, semesterId: 1 };
      const lectureLog = { id: 101, refundOption: RefundOption.Refund, refundAccount: "123-456-789", studentId: 1, lectureId: 2, isInvited: false, isCancelled: false };

      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(semester);
      mockLectureRepository.getLectureBySemesterAndLevel.mockResolvedValue(lecture);
      mockStudentLectureLogRepository.getStudentLectureLogByLectureId.mockResolvedValue(lectureLog);

      const result = await studentLectureService.getStudentLectureLogByStudentId(studentId, query);

      expect(result).toEqual(lectureLog);
      expect(mockSemesterRepository.getSemesterByYearAndSeason).toHaveBeenCalledWith(query.year, query.season);
      expect(mockLectureRepository.getLectureBySemesterAndLevel).toHaveBeenCalledWith(semester.id, query.level);
    });

    test("존재하지 않는 학기의 로그를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(null);

      await expect(studentLectureService.getStudentLectureLogByStudentId(1, { year: 2025, season: Season.Winter, level: Level.Novice })).rejects.toThrow(NotFoundException);
    });

    test("잘못된 요청이 들어오면 BadRequestException을 던져야 합니다", async () => {
      mockStudentLectureLogRepository.getStudentLectureLogByLectureId.mockRejectedValue(new Error("Database error"));

      await expect(studentLectureService.getStudentLectureLogByStudentId(1, { year: 2024, season: Season.Summer, level: Level.Advanced })).rejects.toThrow(BadRequestException);
    });
  });
});
