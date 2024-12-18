import { Test, TestingModule } from "@nestjs/testing";
import { LectureService } from "@/lecture/lecture.service";
import { LectureRepository } from "@/lecture/lecture.repository";
import { CreateLectureDto } from "@/lecture/dto/create-lecture.dto";
import { UpdateLectureDto } from "@/lecture/dto/update-lecture.dto";
import { Lecture, Level, Season } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

const mockLectureRepository = mockDeep<LectureRepository>();

describe("LectureService", () => {
  let lectureService: LectureService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LectureService, LectureRepository],
    })
      .overrideProvider(LectureRepository)
      .useValue(mockLectureRepository)
      .compile();

    lectureService = moduleRef.get<LectureService>(LectureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createLecture", () => {
    test("강의를 생성하고 반환해야 합니다.", async () => {
      const createLectureDto: CreateLectureDto = {
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 12345,
        semesterId: 1,
      };

      const expectedLecture = {
        id: 1,
        ...createLectureDto,
      } as Lecture;

      mockLectureRepository.createLecture.mockResolvedValue(expectedLecture);

      const result = await lectureService.createLecture(createLectureDto);

      expect(result).toEqual(expectedLecture);
      expect(mockLectureRepository.createLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureRepository.createLecture).toHaveBeenCalledWith({
        data: {
          ...createLectureDto,
          lectureSemester: { connect: { id: createLectureDto.semesterId } },
        },
      });
    });
  });

  describe("findLectureById", () => {
    test("특정 ID를 가진 강의를 반환해야 합니다", async () => {
      const lectureId = 1;
      const expectedLecture = {
        id: lectureId,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 1234,
        semesterId: 1,
      };

      mockLectureRepository.getLecture.mockResolvedValue(expectedLecture);

      const result = await lectureService.findLectureById(lectureId);

      expect(result).toEqual(expectedLecture);
      expect(mockLectureRepository.getLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureRepository.getLecture).toHaveBeenCalledWith({
        where: { id: lectureId },
      });
    });
  });

  describe("findLecturesBySemester", () => {
    test("학기별 강의를 반환해야 합니다.", async () => {
      const year = 2024;
      const season = Season.Summer;
      const expectedLectures = [
        {
          id: 1,
          level: Level.Novice,
          lectureNumber: 10,
          bojGroupId: 1234,
          semesterId: 1,
        },
      ];

      mockLectureRepository.getLectures.mockResolvedValue(expectedLectures);

      const result = await lectureService.findLecturesBySemester(year, season);

      expect(result).toEqual(expectedLectures);
      expect(mockLectureRepository.getLectures).toHaveBeenCalledWith({
        where: {
          lectureSemester: {
            year: 2024,
            season: Season.Summer,
          },
        },
      });
    });
  });

  describe("findLectureBySemesterAndLevel", () => {
    test("학기와 난이도로 강의를 반환해야 합니다.", async () => {
      const year = 2024;
      const season = Season.Summer;
      const level = Level.Novice;
      const expectedLectures = [
        {
          id: 1,
          level: Level.Novice,
          lectureNumber: 10,
          bojGroupId: 1234,
          semesterId: 1,
        },
      ];

      mockLectureRepository.getLectures.mockResolvedValue(expectedLectures);

      const result = await lectureService.findLectureBySemesterAndLevel(
        year,
        season,
        level,
      );

      expect(result).toEqual(expectedLectures);
      expect(mockLectureRepository.getLectures).toHaveBeenCalledWith({
        where: {
          lectureSemester: {
            year: 2024,
            season: Season.Summer,
          },
          level: Level.Novice,
        },
      });
    });
  });

  describe("findLecturesWithTasksBySemester", () => {
    test("학기별 강의를 과제를 포함하여 반환해야 합니다.", async () => {
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

      mockLectureRepository.getLecturesWithTasks.mockResolvedValue(
        expectedLectures,
      );

      const result = await lectureService.findLecturesWithTasksBySemester(
        year,
        season,
      );

      expect(result).toEqual(expectedLectures);
      expect(mockLectureRepository.getLecturesWithTasks).toHaveBeenCalledWith({
        where: {
          lectureSemester: {
            year: 2024,
            season: Season.Summer,
          },
        },
      });
    });
  });

  describe("updateLecture", () => {
    test("강의 정보를 업데이트해야 합니다.", async () => {
      const lectureId = 1;
      const updateLectureDto: UpdateLectureDto = {
        lectureNumber: 12,
        level: Level.Novice,
      };
      const existingLecture = {
        id: lectureId,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 1234,
        semesterId: 1,
      };
      const updatedLecture = {
        id: lectureId,
        ...updateLectureDto,
      } as Lecture;

      mockLectureRepository.getLecture.mockResolvedValue(existingLecture);
      mockLectureRepository.updateLecture.mockResolvedValue(updatedLecture);

      const result = await lectureService.updateLecture(
        lectureId,
        updateLectureDto,
      );

      expect(result).toEqual(updatedLecture);
      expect(mockLectureRepository.updateLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureRepository.updateLecture).toHaveBeenCalledWith({
        where: { id: lectureId },
        data: updateLectureDto,
      });
    });
  });

  describe("getAllLectures", () => {
    test("모든 강의를 반환해야 합니다.", async () => {
      const expectedLectures = [
        {
          id: 1,
          level: Level.Novice,
          lectureNumber: 10,
          bojGroupId: 1234,
          semesterId: 1,
        },
      ];

      mockLectureRepository.getAllLectures.mockResolvedValue(expectedLectures);

      const result = await lectureService.getAllLectures();

      expect(result).toEqual(expectedLectures);
      expect(mockLectureRepository.getAllLectures).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeLecture", () => {
    test("특정 ID를 가진 강의를 삭제해야 합니다.", async () => {
      const lectureId = 1;
      const existingLecture = {
        id: lectureId,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 1234,
        semesterId: 1,
      };

      mockLectureRepository.getLecture.mockResolvedValue(existingLecture);
      mockLectureRepository.deleteLecture.mockResolvedValue(existingLecture);

      const result = await lectureService.removeLecture(lectureId);

      expect(result).toEqual(existingLecture);
      expect(mockLectureRepository.deleteLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureRepository.deleteLecture).toHaveBeenCalledWith({
        where: { id: lectureId },
      });
    });
  });
});
