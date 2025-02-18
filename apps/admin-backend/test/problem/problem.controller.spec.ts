import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { ProblemEntity } from "@/problem/entities/problem.entity";
import { CreateProblemDto } from "@/problem/dto/create-problem.dto";
import { UpdateProblemDto } from "@/problem/dto/update-problem.dto";
import { ProblemService } from "@/problem/problem.service";
import { ProblemController } from "@/problem/problem.controller";

const mockProblemService = mockDeep<ProblemService>();

describe("ProblemController", () => {
  let problemController: ProblemController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProblemController],
      providers: [ProblemService],
    })
      .overrideProvider(ProblemService)
      .useValue(mockProblemService)
      .compile();

    problemController = moduleRef.get<ProblemController>(ProblemController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProblemsByTask", () => {
    test("특정 과제에 속한 문제 목록을 반환해야 합니다", async () => {
      const taskId = 1;
      const problems: ProblemEntity[] = [
        { id: 1, bojProblemNumber: 1001, essential: true, taskId },
        { id: 2, bojProblemNumber: 1002, essential: false, taskId },
      ];

      mockProblemService.getProblemsByTaskId.mockResolvedValue(problems);

      const result = await problemController.getProblemsByTask(taskId);

      expect(result).toEqual(problems);
      expect(mockProblemService.getProblemsByTaskId).toHaveBeenCalledTimes(1);
      expect(mockProblemService.getProblemsByTaskId).toHaveBeenCalledWith(taskId);
    });
  });

  describe("createProblem", () => {
    test("새로운 문제를 생성하고 반환해야 합니다", async () => {
      const createProblemDto: CreateProblemDto = {
        bojProblemNumber: 1003,
        essential: true,
        taskId: 1,
      };
      const createdProblem: ProblemEntity = { id: 3, ...createProblemDto };

      mockProblemService.createProblem.mockResolvedValue(createdProblem);

      const result = await problemController.createProblem(createProblemDto);

      expect(result).toEqual(createdProblem);
      expect(mockProblemService.createProblem).toHaveBeenCalledTimes(1);
      expect(mockProblemService.createProblem).toHaveBeenCalledWith(createProblemDto);
    });
  });

  describe("updateProblem", () => {
    test("특정 문제의 정보를 수정하고 반환해야 합니다", async () => {
      const updateProblemDto: UpdateProblemDto = {
        bojProblemNumber: 2001,
        essential: false,
      };
      const existingProblem: ProblemEntity = {
        id: 1,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };
      const updatedProblem: ProblemEntity = { ...existingProblem, ...updateProblemDto };

      mockProblemService.updateProblem.mockResolvedValue(updatedProblem);

      const result = await problemController.updateProblem(1, updateProblemDto);

      expect(result).toEqual(updatedProblem);
      expect(mockProblemService.updateProblem).toHaveBeenCalledTimes(1);
      expect(mockProblemService.updateProblem).toHaveBeenCalledWith(1, updateProblemDto);
    });
  });

  describe("deleteProblem", () => {
    test("특정 문제를 삭제하고 반환해야 합니다", async () => {
      const deletedProblem: ProblemEntity = {
        id: 1,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      mockProblemService.deleteProblem.mockResolvedValue(deletedProblem);

      const result = await problemController.deleteProblem(1);

      expect(result).toEqual(deletedProblem);
      expect(mockProblemService.deleteProblem).toHaveBeenCalledTimes(1);
      expect(mockProblemService.deleteProblem).toHaveBeenCalledWith(1);
    });
  });
});
