import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { Season, School, RefundOption, Level } from "@prisma/client";
import { StudentLectureService } from "@/student-lecture/student-lecture.service";
import { StudentLectureController } from "@/student-lecture/student-lecture.controller";

const mockStudentLectureService = mockDeep<StudentLectureService>();

describe("StudentLectureController", () => {
  let studentLectureController: StudentLectureController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [StudentLectureController],
      providers: [StudentLectureService],
    })
      .overrideProvider(StudentLectureService)
      .useValue(mockStudentLectureService)
      .compile();

    studentLectureController = moduleRef.get<StudentLectureController>(
      StudentLectureController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getStudentsWithLectureLevelsBySemester", () => {
    test("특정 학기의 수강생 목록을 반환해야 합니다", async () => {
      const year = 2024;
      const season = Season.Summer;
      const students = [
        {
          id: 1,
          name: "Alice",
          bojHandle: "alice123",
          email: "alice@example.com",
          phone: "010-1234-5678",
          school: School.SOGANG,
          studentNumber: "20210001",
          lectureLogs: [
            {
              id: 101,
              refundOption: RefundOption.Refund,
              refundAccount: "123-456-789",
              level: Level.Novice,
            },
          ],
        },
        {
          id: 2,
          name: "Bob",
          bojHandle: "bob321",
          email: "bob@example.com",
          phone: "010-8765-4321",
          school: School.YONSEI,
          studentNumber: "20210002",
          lectureLogs: [
            {
              id: 102,
              refundOption: RefundOption.NonRefund,
              refundAccount: "987-654-321",
              level: Level.Advanced,
            },
          ],
        },
      ];

      mockStudentLectureService.getStudentsWithLectureLevelsBySemester.mockResolvedValue(
        students,
      );

      const result =
        await studentLectureController.getStudentsWithLectureLevelsBySemester(
          year,
          season,
        );

      expect(result).toEqual(students);
      expect(
        mockStudentLectureService.getStudentsWithLectureLevelsBySemester,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockStudentLectureService.getStudentsWithLectureLevelsBySemester,
      ).toHaveBeenCalledWith(year, season);
    });
  });
});
