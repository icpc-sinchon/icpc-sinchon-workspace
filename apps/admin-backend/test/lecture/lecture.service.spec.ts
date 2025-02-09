import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";
import { Level, Season } from "@prisma/client";
import { LectureEntity } from "@/lecture/entities/lecture.entity";
import { CreateLectureDto } from "@/lecture/dto/create-lecture.dto";
import { UpdateLectureDto } from "@/lecture/dto/update-lecture.dto";
import { LectureRepository } from "@/lecture/lecture.repository";
import { SemesterRepository } from "@/semester/semester.repository";
import { LectureService } from "@/lecture/lecture.service";

const mockLectureRepository = mockDeep<LectureRepository>();
const mockSemesterRepository = mockDeep<SemesterRepository>();

describe("LectureService", () => {
  let lectureService: LectureService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LectureService, LectureRepository, SemesterRepository],
    })
      .overrideProvider(LectureRepository)
      .useValue(mockLectureRepository)
      .overrideProvider(SemesterRepository)
      .useValue(mockSemesterRepository)
      .compile();

    lectureService = moduleRef.get<LectureService>(LectureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createLectureWithTasks", () => {
    test("새 강의를 생성하고 반환해야 합니다", async () => {
      const createLectureDto: CreateLectureDto = {
        level: Level.Expert,
        lectureNumber: 15,
        bojGroupId: 103,
        semesterId: 2,
      };
      const semester = { id: 2, year: 2024, season: Season.Spring };
      const createdLecture: LectureEntity = { id: 1, ...createLectureDto };

      mockSemesterRepository.getSemesterById.mockResolvedValue(semester);
      mockLectureRepository.createLectureWithTasks.mockResolvedValue(
        createdLecture,
      );

      const result =
        await lectureService.createLectureWithTasks(createLectureDto);

      expect(result).toEqual(createdLecture);
      expect(mockSemesterRepository.getSemesterById).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemesterById).toHaveBeenCalledWith(2);
      expect(
        mockLectureRepository.createLectureWithTasks,
      ).toHaveBeenCalledTimes(1);
      expect(mockLectureRepository.createLectureWithTasks).toHaveBeenCalledWith(
        expect.objectContaining({
          level: createLectureDto.level,
          lectureNumber: createLectureDto.lectureNumber,
          bojGroupId: createLectureDto.bojGroupId,
          lectureSemester: { connect: { id: 2 } },
        }),
      );
    });

    test("존재하지 않는 학기에 강의를 생성하면 NotFoundException을 던져야 합니다", async () => {
      const createLectureDto: CreateLectureDto = {
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 201,
        semesterId: 99,
      };

      mockSemesterRepository.getSemesterById.mockResolvedValue(null);

      await expect(
        lectureService.createLectureWithTasks(createLectureDto),
      ).rejects.toThrow(NotFoundException);
    });

    test("잘못된 데이터로 강의를 생성하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<CreateLectureDto> = {};

      mockLectureRepository.createLectureWithTasks.mockRejectedValue(
        new BadRequestException("Invalid lecture data"),
      );

      await expect(
        lectureService.createLectureWithTasks(invalidDto as CreateLectureDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("getAllLectures", () => {
    test("모든 강의를 반환해야 합니다", async () => {
      const lectures = [
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

      mockLectureRepository.getAllLectures.mockResolvedValue(lectures);

      const result = await lectureService.getAllLectures();

      expect(result).toEqual(lectures);
      expect(mockLectureRepository.getAllLectures).toHaveBeenCalledTimes(1);
    });
  });

  describe("getLectureById", () => {
    test("특정 ID의 강의를 반환해야 합니다", async () => {
      const lecture = {
        id: 1,
        level: Level.Expert,
        lectureNumber: 15,
        bojGroupId: 103,
        semesterId: 2,
      };

      mockLectureRepository.getLectureById.mockResolvedValue(lecture);

      const result = await lectureService.getLectureById(1);

      expect(result).toEqual(lecture);
      expect(mockLectureRepository.getLectureById).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 강의를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockLectureRepository.getLectureById.mockResolvedValue(null);

      await expect(lectureService.getLectureById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getLecturesBySemester", () => {
    test("특정 연도와 계절의 강의 목록을 반환해야 합니다", async () => {
      const year = 2024;
      const season = Season.Summer;
      const semester = { id: 1, year, season };
      const lectures = [
        { id: 1, level: Level.Novice, lectureNumber: 10, bojGroupId: 101, semesterId: 1 },
        { id: 2, level: Level.Advanced, lectureNumber: 12, bojGroupId: 102, semesterId: 1 },
      ];
  
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(semester);
      mockLectureRepository.getLecturesBySemester.mockResolvedValue(lectures);
  
      const result = await lectureService.getLecturesBySemester(year, season);
  
      expect(result).toEqual(lectures);
      expect(mockSemesterRepository.getSemesterByYearAndSeason).toHaveBeenCalledWith(year, season);
      expect(mockLectureRepository.getLecturesBySemester).toHaveBeenCalledWith(semester.id);
    });
  
    test("존재하지 않는 학기의 강의를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(null);
  
      await expect(lectureService.getLecturesBySemester(2025, Season.Winter)).rejects.toThrow(
        NotFoundException,
      );
    });
  
    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockRejectedValue(new Error("Database error"));
  
      await expect(lectureService.getLecturesBySemester(2024, Season.Spring)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  
  describe("getLectureBySemesterAndLevel", () => {
    test("특정 연도, 계절, 레벨의 강의를 반환해야 합니다", async () => {
      const year = 2024;
      const season = Season.Summer;
      const level = Level.Advanced;
      const semester = { id: 1, year, season };
      const lecture = { id: 2, level, lectureNumber: 12, bojGroupId: 102, semesterId: 1 };
  
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(semester);
      mockLectureRepository.getLectureBySemesterAndLevel.mockResolvedValue(lecture);
  
      const result = await lectureService.getLectureBySemesterAndLevel(year, season, level);
  
      expect(result).toEqual(lecture);
      expect(mockSemesterRepository.getSemesterByYearAndSeason).toHaveBeenCalledWith(year, season);
      expect(mockLectureRepository.getLectureBySemesterAndLevel).toHaveBeenCalledWith(
        semester.id,
        level,
      );
    });
  
    test("존재하지 않는 학기의 강의를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(null);
  
      await expect(
        lectureService.getLectureBySemesterAndLevel(2025, Season.Winter, Level.Novice),
      ).rejects.toThrow(NotFoundException);
    });
  
    test("존재하지 않는 레벨의 강의를 조회하면 NotFoundException을 던져야 합니다", async () => {
      const semester = { id: 1, year: 2024, season: Season.Summer };
  
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(semester);
      mockLectureRepository.getLectureBySemesterAndLevel.mockResolvedValue(null);
  
      await expect(
        lectureService.getLectureBySemesterAndLevel(2024, Season.Summer, Level.Expert),
      ).rejects.toThrow(NotFoundException);
    });
  
    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockRejectedValue(new Error("DB error"));
  
      await expect(
        lectureService.getLectureBySemesterAndLevel(2024, Season.Spring, Level.Advanced),
      ).rejects.toThrow(BadRequestException);
    });
  });
  
  describe("getLecturesWithTasksBySemester", () => {
    test("특정 연도와 계절의 강의 목록(과제 포함)을 반환해야 합니다", async () => {
      const year = 2024;
      const season = Season.Summer;
      const semester = { id: 1, year, season };
      const lecturesWithTasks = [
        { id: 1, level: Level.Novice, lectureNumber: 10, bojGroupId: 101, semesterId: 1, tasks: [] },
        { id: 2, level: Level.Advanced, lectureNumber: 12, bojGroupId: 102, semesterId: 1, tasks: [] },
      ];
  
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(semester);
      mockLectureRepository.getLecturesWithTasksBySemester.mockResolvedValue(lecturesWithTasks);
  
      const result = await lectureService.getLecturesWithTasksBySemester(year, season);
  
      expect(result).toEqual(lecturesWithTasks);
      expect(mockSemesterRepository.getSemesterByYearAndSeason).toHaveBeenCalledWith(year, season);
      expect(mockLectureRepository.getLecturesWithTasksBySemester).toHaveBeenCalledWith(semester.id);
    });
  
    test("존재하지 않는 학기의 강의를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(null);
  
      await expect(lectureService.getLecturesWithTasksBySemester(2025, Season.Winter)).rejects.toThrow(
        NotFoundException,
      );
    });
  
    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockRejectedValue(new Error("DB error"));
  
      await expect(lectureService.getLecturesWithTasksBySemester(2024, Season.Spring)).rejects.toThrow(
        BadRequestException,
      );
    });
  });  

  describe("updateLecture", () => {
    test("강의를 수정하고 반환해야 합니다", async () => {
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

      mockLectureRepository.getLectureById.mockResolvedValue(existingLecture);
      mockLectureRepository.updateLecture.mockResolvedValue(updatedLecture);

      const result = await lectureService.updateLecture(1, updateLectureDto);

      expect(result).toEqual(updatedLecture);
      expect(mockLectureRepository.updateLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureRepository.updateLecture).toHaveBeenCalledWith(
        1,
        updateLectureDto,
      );
    });

    test("존재하지 않는 강의를 수정하면 NotFoundException을 던져야 합니다", async () => {
      const updateLectureDto: UpdateLectureDto = {
        level: Level.Expert,
        lectureNumber: 20,
      };

      mockLectureRepository.getLectureById.mockResolvedValue(null);

      await expect(
        lectureService.updateLecture(999, updateLectureDto),
      ).rejects.toThrow(NotFoundException);
    });

    test("잘못된 데이터로 강의를 수정하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<UpdateLectureDto> = {};
      const existingLecture: LectureEntity = {
        id: 1,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 101,
        semesterId: 1,
      };

      mockLectureRepository.getLectureById.mockResolvedValue(existingLecture);
      mockLectureRepository.updateLecture.mockRejectedValue(
        new BadRequestException("Invalid update data"),
      );

      await expect(
        lectureService.updateLecture(1, invalidDto as UpdateLectureDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("deleteLecture", () => {
    test("강의를 삭제하고 반환해야 합니다", async () => {
      const deletedLecture = {
        id: 1,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 101,
        semesterId: 1,
      };

      mockLectureRepository.getLectureById.mockResolvedValue(deletedLecture);
      mockLectureRepository.deleteLecture.mockResolvedValue(deletedLecture);

      const result = await lectureService.deleteLecture(1);

      expect(result).toEqual(deletedLecture);
      expect(mockLectureRepository.deleteLecture).toHaveBeenCalledTimes(1);
      expect(mockLectureRepository.deleteLecture).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 강의를 삭제하려고 하면 NotFoundException을 던져야 합니다", async () => {
      mockLectureRepository.getLectureById.mockResolvedValue(null);

      await expect(lectureService.deleteLecture(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("잘못된 ID로 강의를 삭제하면 BadRequestException을 던져야 합니다", async () => {
      mockLectureRepository.deleteLecture.mockRejectedValue(
        new BadRequestException("Invalid lecture ID"),
      );

      const invalidId: number | null = null;
      await expect(
        lectureService.deleteLecture(invalidId as number),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
