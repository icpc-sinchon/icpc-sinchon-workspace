import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";
import { Season } from "@prisma/client";
import { SemesterEntity } from "@/semester/entities/semester.entity";
import { CreateSemesterDto } from "@/semester/dto/create-semester.dto";
import { UpdateSemesterDto } from "@/semester/dto/update-semester.dto";
import { SemesterRepository } from "@/semester/semester.repository";
import { SemesterService } from "@/semester/semester.service";

const mockSemesterRepository = mockDeep<SemesterRepository>();

describe("SemesterService", () => {
  let semesterService: SemesterService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [SemesterService, SemesterRepository],
    })
      .overrideProvider(SemesterRepository)
      .useValue(mockSemesterRepository)
      .compile();

    semesterService = moduleRef.get<SemesterService>(SemesterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createSemester", () => {
    test("새 학기를 생성하고 반환해야 합니다", async () => {
      const createSemesterDto: CreateSemesterDto = {
        year: 2024,
        season: Season.Summer,
      };
      const createdSemester = { id: 1, ...createSemesterDto };

      mockSemesterRepository.createSemester.mockResolvedValue(createdSemester);

      const result = await semesterService.createSemester(createSemesterDto);

      expect(result).toEqual(createdSemester);
      expect(mockSemesterRepository.createSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.createSemester).toHaveBeenCalledWith(
        createSemesterDto,
      );
    });

    test("잘못된 데이터로 학기를 생성하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<CreateSemesterDto> = {};

      mockSemesterRepository.createSemester.mockRejectedValue(
        new BadRequestException("Invalid semester data"),
      );

      await expect(
        semesterService.createSemester(invalidDto as CreateSemesterDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("getAllSemesters", () => {
    test("모든 학기를 반환해야 합니다", async () => {
      const semesters: SemesterEntity[] = [
        { id: 1, year: 2024, season: Season.Spring },
        { id: 2, year: 2023, season: Season.Fall },
      ];

      mockSemesterRepository.getAllSemesters.mockResolvedValue(semesters);

      const result = await semesterService.getAllSemesters();

      expect(result).toEqual(semesters);
      expect(mockSemesterRepository.getAllSemesters).toHaveBeenCalledTimes(1);
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockSemesterRepository.getAllSemesters.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(semesterService.getAllSemesters()).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getSemesterById", () => {
    test("특정 ID의 학기를 반환해야 합니다", async () => {
      const semester: SemesterEntity = {
        id: 1,
        year: 2024,
        season: Season.Summer,
      };

      mockSemesterRepository.getSemesterById.mockResolvedValue(semester);

      const result = await semesterService.getSemesterById(1);

      expect(result).toEqual(semester);
      expect(mockSemesterRepository.getSemesterById).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 학기를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterById.mockResolvedValue(null);

      await expect(semesterService.getSemesterById(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterById.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(semesterService.getSemesterById(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getSemesterByYearAndSeason", () => {
    test("특정 연도와 계절의 학기를 반환해야 합니다", async () => {
      const year = 2024;
      const season = Season.Summer;
      const semester: SemesterEntity = { id: 1, year, season };

      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(
        semester,
      );

      const result = await semesterService.getSemesterByYearAndSeason(
        year,
        season,
      );

      expect(result).toEqual(semester);
      expect(
        mockSemesterRepository.getSemesterByYearAndSeason,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockSemesterRepository.getSemesterByYearAndSeason,
      ).toHaveBeenCalledWith(year, season);
    });

    test("존재하지 않는 학기를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockResolvedValue(null);

      await expect(
        semesterService.getSemesterByYearAndSeason(2025, Season.Winter),
      ).rejects.toThrow(NotFoundException);
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterByYearAndSeason.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(
        semesterService.getSemesterByYearAndSeason(2024, Season.Spring),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateSemester", () => {
    test("학기를 수정하고 반환해야 합니다", async () => {
      const updateSemesterDto: UpdateSemesterDto = {
        year: 2025,
        season: Season.Fall,
      };
      const existingSemester: SemesterEntity = {
        id: 1,
        year: 2024,
        season: Season.Spring,
      };

      mockSemesterRepository.getSemesterById.mockResolvedValue(
        existingSemester,
      );
      mockSemesterRepository.updateSemester.mockResolvedValue({
        ...existingSemester,
        ...updateSemesterDto,
      });

      const result = await semesterService.updateSemester(1, updateSemesterDto);

      expect(result).toEqual({ id: 1, year: 2025, season: Season.Fall });
      expect(mockSemesterRepository.updateSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.updateSemester).toHaveBeenCalledWith(
        1,
        updateSemesterDto,
      );
    });

    test("존재하지 않는 학기를 수정하려고 하면 NotFoundException을 던져야 합니다", async () => {
      const updateSemesterDto: UpdateSemesterDto = {
        year: 2025,
        season: Season.Fall,
      };

      mockSemesterRepository.getSemesterById.mockResolvedValue(null);

      await expect(
        semesterService.updateSemester(999, updateSemesterDto),
      ).rejects.toThrow(NotFoundException);
    });

    test("잘못된 데이터로 학기를 수정하려고 하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<UpdateSemesterDto> = {};
      const existingSemester: SemesterEntity = {
        id: 1,
        year: 2024,
        season: Season.Spring,
      };

      mockSemesterRepository.getSemesterById.mockResolvedValue(
        existingSemester,
      );
      mockSemesterRepository.updateSemester.mockRejectedValue(
        new BadRequestException("Invalid update data"),
      );

      await expect(
        semesterService.updateSemester(1, invalidDto as UpdateSemesterDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("deleteSemester", () => {
    test("학기를 삭제하고 반환해야 합니다", async () => {
      const deletedSemester: SemesterEntity = {
        id: 1,
        year: 2024,
        season: Season.Spring,
      };

      mockSemesterRepository.getSemesterById.mockResolvedValue(deletedSemester);
      mockSemesterRepository.deleteSemester.mockResolvedValue(deletedSemester);

      const result = await semesterService.deleteSemester(1);

      expect(result).toEqual(deletedSemester);
      expect(mockSemesterRepository.deleteSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.deleteSemester).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 학기를 삭제하려고 하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemesterById.mockResolvedValue(null);

      await expect(semesterService.deleteSemester(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("잘못된 ID로 학기를 삭제하려고 하면 BadRequestException을 던져야 합니다", async () => {
      mockSemesterRepository.deleteSemester.mockRejectedValue(
        new BadRequestException("Invalid semester ID"),
      );

      const invalidId: number | null = null;
      await expect(
        semesterService.deleteSemester(invalidId as number),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
