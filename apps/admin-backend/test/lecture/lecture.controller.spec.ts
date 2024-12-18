import { Test, TestingModule } from "@nestjs/testing";
import { LectureController } from "@/lecture/lecture.controller";
import { LectureService } from "@/lecture/lecture.service";
import { CreateLectureDto } from "@/lecture/dto/create-lecture.dto";
import { UpdateLectureDto } from "@/lecture/dto/update-lecture.dto";
import { Lecture, Level, Season } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";

const mockLectureService = mockDeep<LectureService>();

describe("LectureController", () => {
  let controller: LectureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureController],
      providers: [LectureService],
    })
      .overrideProvider(LectureService)
      .useValue(mockLectureService)
      .compile();

    controller = module.get<LectureController>(LectureController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findLectures", () => {
    test("should return lectures with tasks for given semester", async () => {
      const year = 2024;
      const season = Season.Summer;
      const expectedLectures = [
        {
          id: 1,
          level: Level.Novice,
          lectureNumber: 10,
          bojGroupId: 1234,
          semesterId: 1,
          task: [
            {
              id: 1,
              round: 1,
              practiceId: 1,
              problems: [],
            },
          ],
        },
      ];

      mockLectureService.findLecturesWithTasksBySemester.mockResolvedValue(
        expectedLectures,
      );

      const result = await controller.findLectures(year, season);

      expect(
        mockLectureService.findLecturesWithTasksBySemester,
      ).toHaveBeenCalledWith(year, season);
      expect(result).toEqual(expectedLectures);
    });

    test("유효하지 않은 연도 쿼리에 대해서 에러 발생", async () => {
      const invalidYear = "invalid" as unknown as number;
      const season = Season.Summer;

      mockLectureService.findLecturesWithTasksBySemester.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.findLectures(invalidYear, season),
      ).rejects.toThrow(BadRequestException);
      expect(
        mockLectureService.findLecturesWithTasksBySemester,
      ).toHaveBeenCalledWith(invalidYear, season);
      expect(
        mockLectureService.findLecturesWithTasksBySemester,
      ).toHaveBeenCalledTimes(1);
    });

    test("유효하지 않은 계절 쿼리에 대해 에러 발생", async () => {
      const year = 2024;
      const invalidSeason = "INVALID" as Season;

      await expect(
        controller.findLectures(year, invalidSeason),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("createLecture", () => {
    test("should create a new lecture", async () => {
      const createLectureDto: CreateLectureDto = {
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 1234,
        semesterId: 1,
      };

      const expectedLecture = {
        id: 1,
        ...createLectureDto,
      } as Lecture;

      mockLectureService.createLecture.mockResolvedValue(expectedLecture);

      const result = await controller.createLecture(createLectureDto);

      expect(mockLectureService.createLecture).toHaveBeenCalledWith(
        createLectureDto,
      );
      expect(result).toEqual(expectedLecture);
    });

    test("should validate create lecture dto", async () => {
      const invalidDto = {
        level: "INVALID" as Level,
        lectureNumber: "invalid",
        bojGroupId: "invalid",
        semesterId: "invalid",
      };

      mockLectureService.createLecture.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.createLecture(invalidDto as unknown as CreateLectureDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateLecture", () => {
    test("should update an existing lecture", async () => {
      const lectureId = 1;
      const updateLectureDto: UpdateLectureDto = {
        lectureNumber: 12,
      };

      const expectedLecture = {
        id: lectureId,
        level: Level.Novice,
        lectureNumber: 12,
        bojGroupId: 1234,
        semesterId: 1,
      };

      mockLectureService.updateLecture.mockResolvedValue(expectedLecture);

      const result = await controller.updateLecture(
        lectureId,
        updateLectureDto,
      );

      expect(mockLectureService.updateLecture).toHaveBeenCalledWith(
        lectureId,
        updateLectureDto,
      );
      expect(result).toEqual(expectedLecture);
    });

    test("should validate update lecture dto", async () => {
      const lectureId = 1;
      const invalidDto = {
        level: "INVALID" as Level,
        lectureNumber: "invalid",
      };

      mockLectureService.updateLecture.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.updateLecture(
          lectureId,
          invalidDto as unknown as UpdateLectureDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("removeLecture", () => {
    test("should remove an existing lecture", async () => {
      const lectureId = 1;
      const expectedLecture = {
        id: lectureId,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 1234,
        semesterId: 1,
      };

      mockLectureService.removeLecture.mockResolvedValue(expectedLecture);

      const result = await controller.removeLecture(lectureId);

      expect(mockLectureService.removeLecture).toHaveBeenCalledWith(lectureId);
      expect(result).toEqual(expectedLecture);
    });
  });
});
