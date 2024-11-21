import { Test, TestingModule } from "@nestjs/testing";
import { SemesterService } from "../../src/semester/semester.service";
import { SemesterRepository } from "../../src/semester/semester.repository";
import { NotFoundException } from "@nestjs/common";
import { UpdateSemesterDto } from "src/semester/dto/update-semester.dto";
import { CreateSemesterDto } from "src/semester/dto/create-semester.dto";

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SemesterService,
        {
          provide: SemesterRepository,
          useValue: mockSemesterRepository,
        },
      ],
    }).compile();

    semesterService = module.get<SemesterService>(SemesterService);

    jest.clearAllMocks();
  });

  describe("createSemester", () => {
    test("학기를 생성하고 반환해야 합니다", async () => {
      const createSemesterDto = {
        year: 2024,
        season: "Spring",
        lecture: [],
        refundPolicy: [],
      };
      const createdSemester = {
        id: 1,
        ...createSemesterDto,
      };

      mockSemesterRepository.createSemester.mockResolvedValue(createdSemester);

      const result = await semesterService.createSemester(
        createSemesterDto as CreateSemesterDto,
      );
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
        { id: 1, year: 2024, season: "Spring", lecture: [], refundPolicy: [] },
        { id: 2, year: 2023, season: "Fall", lecture: [], refundPolicy: [] },
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
      const semester = {
        id: 1,
        year: 2024,
        season: "Spring",
        lecture: [],
        refundPolicy: [],
      };

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
      const updateSemesterDto = { lecture: [], refundPolicy: [] };
      const existingSemester = {
        id: 1,
        year: 2024,
        season: "Spring",
        lecture: [],
        refundPolicy: [],
      };
      const updatedSemester = { ...existingSemester, ...updateSemesterDto };

      // 기존 학기를 찾도록 mock 설정
      mockSemesterRepository.getSemester.mockResolvedValue(existingSemester);
      mockSemesterRepository.updateSemester.mockResolvedValue(updatedSemester);

      const result = await semesterService.updateSemester(
        1,
        updateSemesterDto as UpdateSemesterDto,
      );

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
      const updateSemesterDto = { lecture: [], refundPolicy: [] };

      mockSemesterRepository.getSemester.mockResolvedValue(null);

      await expect(
        semesterService.updateSemester(999, updateSemesterDto as UpdateSemesterDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockSemesterRepository.getSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterRepository.getSemester).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("deleteSemester", () => {
    test("학기를 삭제하고 삭제된 학기를 반환해야 합니다", async () => {
      const existingSemester = {
        id: 1,
        year: 2024,
        season: "Spring",
        lecture: [],
        refundPolicy: [],
      };

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