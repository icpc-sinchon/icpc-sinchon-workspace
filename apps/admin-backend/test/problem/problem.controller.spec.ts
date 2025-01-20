import { Test, TestingModule } from "@nestjs/testing";
import { ProblemController } from "@/problem/problem.controller";
import { ProblemService } from "@/problem/problem.service";
import { CreateProblemDto } from "@/problem/dto/create-problem.dto";
import { UpdateProblemDto } from "@/problem/dto/update-problem.dto";
import { ProblemEntity } from "@/problem/entities/problem.entity";
import { NotFoundException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";

const mockProblemService = mockDeep<ProblemService>();

describe("ProblemController", () => {
  let controller: ProblemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemController],
      providers: [ProblemService],
    })
      .overrideProvider(ProblemService)
      .useValue(mockProblemService)
      .compile();

    controller = module.get<ProblemController>(ProblemController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findProblemsByTask", () => {
    test("should return all problems for a specific task", async () => {
      const taskId = 1;
      const expectedProblems: ProblemEntity[] = [
        { id: 1, bojProblemNumber: 1001, essential: true, taskId },
        { id: 2, bojProblemNumber: 1002, essential: false, taskId },
      ];

      mockProblemService.findProblemsByTask.mockResolvedValue(expectedProblems);

      const result = await controller.findProblemsByTask(taskId);

      expect(mockProblemService.findProblemsByTask).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedProblems);
    });

    test("should throw NotFoundException for invalid task ID", async () => {
      const taskId = 999;

      mockProblemService.findProblemsByTask.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findProblemsByTask(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("createProblem", () => {
    test("should create a new problem", async () => {
      const createProblemDto: CreateProblemDto = {
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      const expectedProblem: ProblemEntity = {
        id: 1,
        ...createProblemDto,
      };

      mockProblemService.createProblem.mockResolvedValue(expectedProblem);

      const result = await controller.createProblem(createProblemDto);

      expect(mockProblemService.createProblem).toHaveBeenCalledWith(
        createProblemDto,
      );
      expect(result).toEqual(expectedProblem);
    });

    test("should throw an error for invalid DTO", async () => {
      const invalidDto = {
        bojProblemNumber: "invalid",
        essential: "invalid",
        taskId: "invalid",
      };

      mockProblemService.createProblem.mockRejectedValue(new Error("Bad Request"));

      await expect(
        controller.createProblem(invalidDto as unknown as CreateProblemDto),
      ).rejects.toThrow(Error);
    });
  });

  describe("updateProblem", () => {
    test("should update an existing problem", async () => {
      const problemId = 1;
      const updateProblemDto: UpdateProblemDto = { essential: false };

      const expectedProblem: ProblemEntity = {
        id: problemId,
        bojProblemNumber: 1001,
        essential: false,
        taskId: 1,
      };

      mockProblemService.updateProblem.mockResolvedValue(expectedProblem);

      const result = await controller.updateProblem(problemId, updateProblemDto);

      expect(mockProblemService.updateProblem).toHaveBeenCalledWith(
        problemId,
        updateProblemDto,
      );
      expect(result).toEqual(expectedProblem);
    });

    test("should throw NotFoundException for non-existing problem", async () => {
      const problemId = 999;
      const updateProblemDto: UpdateProblemDto = { essential: false };

      mockProblemService.updateProblem.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.updateProblem(problemId, updateProblemDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("removeProblem", () => {
    test("should delete an existing problem", async () => {
      const problemId = 1;
      const expectedProblem: ProblemEntity = {
        id: problemId,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      mockProblemService.removeProblem.mockResolvedValue(expectedProblem);

      const result = await controller.removeProblem(problemId);

      expect(mockProblemService.removeProblem).toHaveBeenCalledWith(problemId);
      expect(result).toEqual(expectedProblem);
    });

    test("should throw NotFoundException for non-existing problem", async () => {
      const problemId = 999;

      mockProblemService.removeProblem.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.removeProblem(problemId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
