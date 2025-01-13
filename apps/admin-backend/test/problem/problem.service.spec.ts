import { Test, TestingModule } from "@nestjs/testing";
import { ProblemService } from "@/problem/problem.service";
import { ProblemRepository } from "@/problem/problem.repository";
import { CreateProblemDto } from "@/problem/dto/create-problem.dto";
import { UpdateProblemDto } from "@/problem/dto/update-problem.dto";
import { Problem } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

const mockProblemRepository = mockDeep<ProblemRepository>();

describe("ProblemService", () => {
  let problemService: ProblemService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ProblemService, ProblemRepository],
    })
      .overrideProvider(ProblemRepository)
      .useValue(mockProblemRepository)
      .compile();

    problemService = moduleRef.get<ProblemService>(ProblemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProblem", () => {
    test("문제를 생성하고 반환해야 합니다.", async () => {
      const createProblemDto: CreateProblemDto = {
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      const expectedProblem: Problem = {
        id: 1,
        ...createProblemDto,
      };

      mockProblemRepository.createProblem.mockResolvedValue(expectedProblem);

      const result = await problemService.createProblem(createProblemDto);

      expect(result).toEqual(expectedProblem);
      expect(mockProblemRepository.createProblem).toHaveBeenCalledTimes(1);
      expect(mockProblemRepository.createProblem).toHaveBeenCalledWith({
        data: {
          ...createProblemDto,
          task: { connect: { id: createProblemDto.taskId } },
        },
      });
    });
  });

  describe("findProblemById", () => {
    test("특정 ID를 가진 문제를 반환해야 합니다", async () => {
      const problemId = 1;
      const expectedProblem: Problem = {
        id: problemId,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      mockProblemRepository.getProblem.mockResolvedValue(expectedProblem);

      const result = await problemService.findProblemById(problemId);

      expect(result).toEqual(expectedProblem);
      expect(mockProblemRepository.getProblem).toHaveBeenCalledTimes(1);
      expect(mockProblemRepository.getProblem).toHaveBeenCalledWith({
        where: { id: problemId },
      });
    });
  });

  describe("findProblemsByTask", () => {
    test("특정 과제(Task ID)에 속한 문제들을 반환해야 합니다.", async () => {
      const taskId = 1;
      const expectedProblems: Problem[] = [
        { id: 1, bojProblemNumber: 1001, essential: true, taskId },
        { id: 2, bojProblemNumber: 1002, essential: false, taskId },
      ];

      mockProblemRepository.getProblems.mockResolvedValue(expectedProblems);

      const result = await problemService.findProblemsByTask(taskId);

      expect(result).toEqual(expectedProblems);
      expect(mockProblemRepository.getProblems).toHaveBeenCalledWith({
        where: { taskId },
      });
    });
  });

  describe("updateProblem", () => {
    test("문제 정보를 업데이트해야 합니다.", async () => {
      const problemId = 1;
      const updateProblemDto: UpdateProblemDto = { essential: false };
      const existingProblem: Problem = {
        id: problemId,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };
      const updatedProblem: Problem = {
        ...existingProblem,
        ...updateProblemDto,
      };

      mockProblemRepository.getProblem.mockResolvedValue(existingProblem);
      mockProblemRepository.updateProblem.mockResolvedValue(updatedProblem);

      const result = await problemService.updateProblem(
        problemId,
        updateProblemDto,
      );

      expect(result).toEqual(updatedProblem);
      expect(mockProblemRepository.updateProblem).toHaveBeenCalledTimes(1);
      expect(mockProblemRepository.updateProblem).toHaveBeenCalledWith({
        where: { id: problemId },
        data: updateProblemDto,
      });
    });
  });

  describe("getAllProblems", () => {
    test("모든 문제를 반환해야 합니다.", async () => {
      const expectedProblems: Problem[] = [
        { id: 1, bojProblemNumber: 1001, essential: true, taskId: 1 },
        { id: 2, bojProblemNumber: 1002, essential: false, taskId: 1 },
      ];

      mockProblemRepository.getAllProblems.mockResolvedValue(expectedProblems);

      const result = await problemService.getAllProblems();

      expect(result).toEqual(expectedProblems);
      expect(mockProblemRepository.getAllProblems).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeProblem", () => {
    test("특정 ID를 가진 문제를 삭제해야 합니다.", async () => {
      const problemId = 1;
      const existingProblem: Problem = {
        id: problemId,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      mockProblemRepository.getProblem.mockResolvedValue(existingProblem);
      mockProblemRepository.deleteProblem.mockResolvedValue(existingProblem);

      const result = await problemService.removeProblem(problemId);

      expect(result).toEqual(existingProblem);
      expect(mockProblemRepository.deleteProblem).toHaveBeenCalledTimes(1);
      expect(mockProblemRepository.deleteProblem).toHaveBeenCalledWith({
        where: { id: problemId },
      });
    });
  });
});
