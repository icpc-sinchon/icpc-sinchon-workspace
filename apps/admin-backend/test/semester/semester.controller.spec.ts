import { Test, TestingModule } from "@nestjs/testing";
import { SemesterController } from "../../src/semester/semester.controller";
import { SemesterService } from "../../src/semester/semester.service";
import { NotFoundException } from "@nestjs/common";
import { CreateSemesterDto } from "../../src/semester/dto/create-semester.dto";
import { UpdateSemesterDto } from "../../src/semester/dto/update-semester.dto";
import { Season } from "@prisma/client";

const mockSemesterService = {
  getSemesters: jest.fn(),
  getSemesterById: jest.fn(),
  createSemester: jest.fn(),
  updateSemester: jest.fn(),
  deleteSemester: jest.fn(),
};

describe("SemesterController", () => {
  let semesterController: SemesterController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SemesterController],
      providers: [SemesterService],
    })
      .overrideProvider(SemesterService)
      .useValue(mockSemesterService)
      .compile();

    semesterController = moduleRef.get<SemesterController>(SemesterController);

    jest.clearAllMocks();
  });

  describe("getAllSemester", () => {
    test("모든 학기를 반환해야 합니다", async () => {
      const semesters = [
        { id: 1, year: 2024, season: Season.Spring },
        { id: 2, year: 2023, season: Season.Fall },
      ];
      mockSemesterService.getSemesters.mockResolvedValue(semesters);

      const result = await semesterController.getAllSemester();
      expect(result).toEqual(semesters);
      expect(mockSemesterService.getSemesters).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSemesterById", () => {
    test("ID로 특정 학기를 반환해야 합니다", async () => {
      const semester = { id: 1, year: 2024, season: Season.Spring };
      mockSemesterService.getSemesterById.mockResolvedValue(semester);

      const result = await semesterController.getSemesterById(1);
      expect(result).toEqual(semester);
      expect(mockSemesterService.getSemesterById).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.getSemesterById).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 학기를 조회하려고 하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterService.getSemesterById.mockRejectedValue(
        new NotFoundException("Semester with ID 999 not found"),
      );

      await expect(semesterController.getSemesterById(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockSemesterService.getSemesterById).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.getSemesterById).toHaveBeenCalledWith(999);
    });
  });

  describe("createSemester", () => {
    test("새 학기를 생성하고 반환해야 합니다", async () => {
      const createSemesterDto: CreateSemesterDto = {
        year: 2024,
        season: Season.Spring,
      };
      const createdSemester = { id: 1, ...createSemesterDto };
      mockSemesterService.createSemester.mockResolvedValue(createdSemester);

      const result = await semesterController.createSemester(createSemesterDto);
      expect(result).toEqual(createdSemester);
      expect(mockSemesterService.createSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.createSemester).toHaveBeenCalledWith(
        createSemesterDto,
      );
    });
  });

  describe("updateSemester", () => {
    test("학기를 수정하고 반환해야 합니다", async () => {
      const updateSemesterDto: UpdateSemesterDto = {
        year: 2025,
        season: Season.Fall,
      };
      const updatedSemester = { id: 1, ...updateSemesterDto };

      mockSemesterService.updateSemester.mockResolvedValue(updatedSemester);

      const result = await semesterController.updateSemester(
        1,
        updateSemesterDto,
      );
      expect(result).toEqual(updatedSemester);
      expect(mockSemesterService.updateSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.updateSemester).toHaveBeenCalledWith(
        1,
        updateSemesterDto,
      );
    });

    test("존재하지 않는 학기를 수정하려고 하면 NotFoundException을 던져야 합니다", async () => {
      const updateSemesterDto: UpdateSemesterDto = {
        year: 2025,
        season: Season.Fall,
      };

      mockSemesterService.updateSemester.mockRejectedValue(
        new NotFoundException("Semester with ID 999 not found"),
      );

      await expect(
        semesterController.updateSemester(999, updateSemesterDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockSemesterService.updateSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.updateSemester).toHaveBeenCalledWith(
        999,
        updateSemesterDto,
      );
    });
  });

  describe("deleteSemester", () => {
    test("학기를 삭제하고 삭제된 학기를 반환해야 합니다", async () => {
      const deletedSemester = { id: 1, year: 2024, season: Season.Spring };

      mockSemesterService.deleteSemester.mockResolvedValue(deletedSemester);

      const result = await semesterController.deleteSemester(1);
      expect(result).toEqual(deletedSemester);
      expect(mockSemesterService.deleteSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.deleteSemester).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 학기를 삭제하려고 하면 NotFoundException을 던져야 합니다", async () => {
      mockSemesterService.deleteSemester.mockRejectedValue(
        new NotFoundException("Semester with ID 999 not found"),
      );

      await expect(semesterController.deleteSemester(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockSemesterService.deleteSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.deleteSemester).toHaveBeenCalledWith(999);
    });
  });
});
