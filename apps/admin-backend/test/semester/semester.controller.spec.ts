import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { Season } from "@prisma/client";
import { SemesterEntity } from "@/semester/entities/semester.entity";
import { CreateSemesterDto } from "@/semester/dto/create-semester.dto";
import { UpdateSemesterDto } from "@/semester/dto/update-semester.dto";
import { SemesterService } from "@/semester/semester.service";
import { SemesterController } from "@/semester/semester.controller";

const mockSemesterService = mockDeep<SemesterService>();

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createSemester", () => {
    test("새 학기를 생성하고 반환해야 합니다", async () => {
      const createSemesterDto: CreateSemesterDto = {
        year: 2024,
        season: Season.Spring,
      };
      const createdSemester: SemesterEntity = { id: 1, ...createSemesterDto };

      mockSemesterService.createSemester.mockResolvedValue(createdSemester);

      const result = await semesterController.createSemester(createSemesterDto);
      
      expect(result).toEqual(createdSemester);
      expect(mockSemesterService.createSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.createSemester).toHaveBeenCalledWith(
        createSemesterDto,
      );
    });
  });

  describe("getAllSemesters", () => {
    test("모든 학기를 반환해야 합니다", async () => {
      const semesters: SemesterEntity[] = [
        { id: 1, year: 2024, season: Season.Spring },
        { id: 2, year: 2023, season: Season.Fall },
      ];

      mockSemesterService.getAllSemesters.mockResolvedValue(semesters);

      const result = await semesterController.getAllSemesters();

      expect(result).toEqual(semesters);
      expect(mockSemesterService.getAllSemesters).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSemesterById", () => {
    test("특정 ID의 학기를 반환해야 합니다", async () => {
      const semester: SemesterEntity = {
        id: 1,
        year: 2024,
        season: Season.Spring,
      };

      mockSemesterService.getSemesterById.mockResolvedValue(semester);

      const result = await semesterController.getSemesterById(1);

      expect(result).toEqual(semester);
      expect(mockSemesterService.getSemesterById).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.getSemesterById).toHaveBeenCalledWith(1);
    });
  });

  describe("updateSemester", () => {
    test("특정 학기를 수정하고 반환해야 합니다", async () => {
      const updateSemesterDto: UpdateSemesterDto = {
        year: 2025,
        season: Season.Fall,
      };
      const existingSemester: SemesterEntity = {
        id: 1,
        year: 2024,
        season: Season.Spring,
      };
      const updatedSemester: SemesterEntity = {
        ...existingSemester,
        ...updateSemesterDto,
      };

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
  });

  describe("deleteSemester", () => {
    test("특정 학기를 삭제하고 반환해야 합니다", async () => {
      const deletedSemester: SemesterEntity = {
        id: 1,
        year: 2024,
        season: Season.Spring,
      };

      mockSemesterService.deleteSemester.mockResolvedValue(deletedSemester);

      const result = await semesterController.deleteSemester(1);
      
      expect(result).toEqual(deletedSemester);
      expect(mockSemesterService.deleteSemester).toHaveBeenCalledTimes(1);
      expect(mockSemesterService.deleteSemester).toHaveBeenCalledWith(1);
    });
  });
});
