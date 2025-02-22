import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { Season, Level } from "@prisma/client";
import { LectureEntity } from "@/lecture/entities/lecture.entity";
import { CreateLectureDto } from "@/lecture/dto/create-lecture.dto";
import { UpdateLectureDto } from "@/lecture/dto/update-lecture.dto";
import { LectureService } from "@/lecture/lecture.service";
import { LectureController } from "@/lecture/lecture.controller";

const mockLectureService = mockDeep<LectureService>();

describe("LectureController", () => {
  let lectureController: LectureController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [LectureController],
      providers: [LectureService],
    })
      .overrideProvider(LectureService)
      .useValue(mockLectureService)
      .compile();

    lectureController = moduleRef.get<LectureController>(LectureController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createLecture", () => {
    test("새 강의를 생성하고 반환해야 합니다", async () => {
      const createLectureDto: CreateLectureDto = {
        level: Level.Expert,
        lectureNumber: 15,
        bojGroupId: 103,
        semesterId: 2,
      };
      const createdLecture: LectureEntity = { id: 3, ...createLectureDto };

      mockLectureService.createLectureWithTasks.mockResolvedValue(
        createdLecture,
      );

      const result = await lectureController.createLecture(createLectureDto);

      expect(result).toEqual(createdLecture);
      expect(mockLectureService.createLectureWithTasks).toHaveBeenCalledTimes(
        1,
      );
      expect(mockLectureService.createLectureWithTasks).toHaveBeenCalledWith(
        createLectureDto,
      );
    });
  });

  describe("getLectures", () => {
    test("특정 학기의 강의 목록을 반환해야 합니다", async () => {
      const year = 2024;
      const season = Season.Spring;
      const lectures: LectureEntity[] = [
        {
          id: 1,
          level: Level.Novice,
          lectureNumber: 10,
          bojGroupId: 101,
          semesterId: 1,
        },
        {
          id: 2,
          level: Level.Advanced,
          lectureNumber: 12,
          bojGroupId: 102,
          semesterId: 1,
        },
      ];

      mockLectureService.getLecturesWithTasksBySemester.mockResolvedValue(
        lectures,
      );

      const result = await lectureController.getLectures(year, season);

      expect(result).toEqual(lectures);
      expect(
        mockLectureService.getLecturesWithTasksBySemester,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockLectureService.getLecturesWithTasksBySemester,
      ).toHaveBeenCalledWith(year, season);
    });
  });

  describe("updateLecture", () => {
    test("특정 강의를 수정하고 반환해야 합니다", async () => {
      const updateLectureDto: UpdateLectureDto = {
        level: Level.Advanced,
        lectureNumber: 20,
      };
      const existingLecture: LectureEntity = {
        id: 1,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 101,
        semesterId: 1,
      };
      const updatedLecture: LectureEntity = {
        ...existingLecture,
        ...updateLectureDto,
      };

      mockLectureService.updateLecture.mockResolvedValue(updatedLecture);

      const result = await lectureController.updateLecture(1, updateLectureDto);

      expect(result).toEqual(updatedLecture);
      expect(mockLectureService.updateLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureService.updateLecture).toHaveBeenCalledWith(
        1,
        updateLectureDto,
      );
    });
  });

  describe("deleteLecture", () => {
    test("특정 강의를 삭제하고 반환해야 합니다", async () => {
      const deletedLecture: LectureEntity = {
        id: 1,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 101,
        semesterId: 1,
      };

      mockLectureService.deleteLecture.mockResolvedValue(deletedLecture);

      const result = await lectureController.deleteLecture(1);

      expect(result).toEqual(deletedLecture);
      expect(mockLectureService.deleteLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureService.deleteLecture).toHaveBeenCalledWith(1);
    });
  });
});
