import { Test, TestingModule } from "@nestjs/testing";
import { SemesterService } from "../../src/semester/semester.service";
import { SemesterRepository } from "../../src/semester/semester.repository";
import { NotFoundException } from "@nestjs/common";
import { CreateSemesterDto } from "src/semester/dto/create-semester.dto";
import { Season } from "@prisma/client";

const mockSemesterRepository = {
  createSemester: jest.fn(),
  getSemesters: jest.fn(),
  getSemester: jest.fn(),
  updateSemester: jest.fn(),
  deleteSemester: jest.fn(),
};

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

    jest.clearAllMocks();
  });

  describe("createSemester", () => {
    test("학기를 생성하고 반환해야 합니다", async () => {
      const createSemesterDto: CreateSemesterDto = {
        year: 2024,
        season: Season.Summer, // Season Enum 사용
      };
      const createdSemester = { id: 1, ...createSemesterDto };

      mockSemesterRepository.createSemester.mockResolvedValue(createdSemester);

      const result = await semesterService.createSemester(createSemesterDto);
      expect(result).toEqual(createdSemester);
      expect(mockSemesterRepository.createSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.createSemester).toHaveBeenCalledWith({
        data: createSemesterDto,
      });
    });
  });

  describe("getSemesters", () => {
    test("모든 학기를 반환해야 합니다", async () => {
      const semesters = [
        { id: 1, year: 2024, season: Season.Summer },
        { id: 2, year: 2023, season: Season.Winter },
      ];

      mockSemesterRepository.getSemesters.mockResolvedValue(semesters);

      const result = await semesterService.getSemesters();
      expect(result).toEqual(semesters);
      expect(mockSemesterRepository.getSemesters).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemesters).toHaveBeenCalledWith();
    });
  });

  describe("getSemesterById", () => {
    test("ID로 특정 학기를 반환해야 합니다", async () => {
      const semester = { id: 1, year: 2024, season: Season.Summer };

      mockSemesterRepository.getSemester.mockResolvedValue(semester);

      const result = await semesterService.getSemesterById(1);
      expect(result).toEqual(semester);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("존재하지 않는 학기를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemester.mockResolvedValue(null);

      await expect(semesterService.getSemesterById(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("updateSemester", () => {
    test("학기를 수정하고 반환해야 합니다", async () => {
      const updateSemesterDto = { year: 2025, season: Season.Fall };
      const existingSemester = { id: 1, year: 2024, season: Season.Spring };
      const updatedSemester = { id: 1, ...updateSemesterDto };

      // 기존 학기를 찾도록 mock 설정
      mockSemesterRepository.getSemester.mockResolvedValue(existingSemester);
      mockSemesterRepository.updateSemester.mockResolvedValue(updatedSemester);

      const result = await semesterService.updateSemester(1, updateSemesterDto);

      expect(result).toEqual(updatedSemester);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockSemesterRepository.updateSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.updateSemester).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateSemesterDto,
      });
    });

    test("존재하지 않는 학기를 수정하려고 하면 NotFoundException을 던져야 합니다", async () => {
      const updateSemesterDto = { year: 2025, season: Season.Fall };

      mockSemesterRepository.getSemester.mockResolvedValue(null);

      await expect(
        semesterService.updateSemester(999, updateSemesterDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockSemesterRepository.getSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("deleteSemester", () => {
    test("학기를 삭제하고 삭제된 학기를 반환해야 합니다", async () => {
      const existingSemester = { id: 1, year: 2024, season: Season.Spring };

      // 기존 학기를 찾도록 mock 설정
      mockSemesterRepository.getSemester.mockResolvedValue(existingSemester);
      mockSemesterRepository.deleteSemester.mockResolvedValue(existingSemester);

      const result = await semesterService.deleteSemester(1);

      expect(result).toEqual(existingSemester);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockSemesterRepository.deleteSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.deleteSemester).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("존재하지 않는 학기를 삭제하려고 하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterRepository.getSemester.mockResolvedValue(null);

      await expect(semesterService.deleteSemester(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockSemesterRepository.getSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});
