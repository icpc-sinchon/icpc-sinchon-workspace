import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";
import { ProblemEntity } from "@/problem/entities/problem.entity";
import { TaskEntity } from "@/task/entities/task.entity";
import { CreateProblemDto } from "@/problem/dto/create-problem.dto";
import { UpdateProblemDto } from "@/problem/dto/update-problem.dto";
import { ProblemRepository } from "@/problem/problem.repository";
import { TaskRepository } from "@/task/task.repository";
import { ProblemService } from "@/problem/problem.service";

const mockProblemRepository = mockDeep<ProblemRepository>();
const mockTaskRepository = mockDeep<TaskRepository>();

describe("ProblemService", () => {
  let problemService: ProblemService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ProblemService, ProblemRepository, TaskRepository],
    })
      .overrideProvider(ProblemRepository)
      .useValue(mockProblemRepository)
      .overrideProvider(TaskRepository)
      .useValue(mockTaskRepository)
      .compile();

    problemService = moduleRef.get<ProblemService>(ProblemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProblem", () => {
    test("새 문제를 생성하고 반환해야 합니다", async () => {
      const createProblemDto: CreateProblemDto = {
        taskId: 1,
        bojProblemNumber: 1001,
        essential: true,
      };
      const task: TaskEntity = {
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };
      const createdProblem: ProblemEntity = { id: 3, ...createProblemDto };

      mockTaskRepository.getTaskById.mockResolvedValue(task);
      mockProblemRepository.createProblem.mockResolvedValue(createdProblem);

      const result = await problemService.createProblem(createProblemDto);

      expect(result).toEqual(createdProblem);
      expect(mockProblemRepository.createProblem).toHaveBeenCalledWith(
        expect.objectContaining({
          bojProblemNumber: createProblemDto.bojProblemNumber,
          essential: createProblemDto.essential,
          task: { connect: { id: createProblemDto.taskId } },
        }),
      );
    });

    test("존재하지 않는 과제에 문제를 생성하면 NotFoundException을 던져야 합니다", async () => {
      const createProblemDto: CreateProblemDto = {
        taskId: 99,
        bojProblemNumber: 1002,
        essential: false,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(null);

      await expect(
        problemService.createProblem(createProblemDto),
      ).rejects.toThrow(NotFoundException);
    });

    test("task id가 없으면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<CreateProblemDto> = {};

      mockProblemRepository.createProblem.mockRejectedValue(
        new BadRequestException("Invalid problem data"),
      );

      await expect(
        problemService.createProblem(invalidDto as CreateProblemDto),
      ).rejects.toThrow(BadRequestException);
    });

    test("잘못된 데이터로 문제를 생성하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<CreateProblemDto> = { taskId: 1 };

      mockTaskRepository.getTaskById.mockResolvedValue({
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      });
      mockProblemRepository.createProblem.mockRejectedValue(
        new BadRequestException("Invalid problem data"),
      );

      await expect(
        problemService.createProblem(invalidDto as CreateProblemDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("getAllProblems", () => {
    test("모든 문제를 반환해야 합니다", async () => {
      const problems: ProblemEntity[] = [
        { id: 1, bojProblemNumber: 1001, essential: true, taskId: 1 },
        { id: 2, bojProblemNumber: 1002, essential: false, taskId: 1 },
      ];

      mockProblemRepository.getAllProblems.mockResolvedValue(problems);

      const result = await problemService.getAllProblems();

      expect(result).toEqual(problems);
      expect(mockProblemRepository.getAllProblems).toHaveBeenCalledTimes(1);
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockProblemRepository.getAllProblems.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(problemService.getAllProblems()).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getProblemById", () => {
    test("특정 ID의 문제를 반환해야 합니다", async () => {
      const problem: ProblemEntity = {
        id: 1,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      mockProblemRepository.getProblemById.mockResolvedValue(problem);

      const result = await problemService.getProblemById(1);

      expect(result).toEqual(problem);
      expect(mockProblemRepository.getProblemById).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 문제를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockProblemRepository.getProblemById.mockResolvedValue(null);

      await expect(problemService.getProblemById(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockProblemRepository.getProblemById.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(problemService.getProblemById(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getProblemsByTaskId", () => {
    test("특정 과제에 속한 문제 목록을 반환해야 합니다", async () => {
      const taskId = 1;
      const problems: ProblemEntity[] = [
        { id: 1, bojProblemNumber: 1001, essential: true, taskId },
        { id: 2, bojProblemNumber: 1002, essential: false, taskId },
      ];

      mockTaskRepository.getTaskById.mockResolvedValue({
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      });
      mockProblemRepository.getProblemsByTaskId.mockResolvedValue(problems);

      const result = await problemService.getProblemsByTaskId(taskId);

      expect(result).toEqual(problems);
      expect(mockProblemRepository.getProblemsByTaskId).toHaveBeenCalledWith(
        taskId,
      );
    });

    test("존재하지 않는 과제의 문제를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockTaskRepository.getTaskById.mockResolvedValue(null);

      await expect(problemService.getProblemsByTaskId(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockTaskRepository.getTaskById.mockResolvedValue({
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      });
      
      mockProblemRepository.getProblemsByTaskId.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(problemService.getProblemsByTaskId(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getProblemByBojProblemNumber", () => {
    test("특정 BOJ 문제 번호로 문제를 조회하고 반환해야 합니다", async () => {
      const taskId = 1;
      const bojProblemNumber = 1001;
      const problem: ProblemEntity = {
        id: 1,
        bojProblemNumber,
        essential: true,
        taskId,
      };

      mockProblemRepository.getProblemByTaskIdAndBojProblemNumber.mockResolvedValue(
        problem,
      );

      const result = await problemService.getProblemByBojProblemNumber(
        taskId,
        bojProblemNumber,
      );

      expect(result).toEqual(problem);
      expect(
        mockProblemRepository.getProblemByTaskIdAndBojProblemNumber,
      ).toHaveBeenCalledWith(taskId, bojProblemNumber);
    });

    test("존재하지 않는 BOJ 문제 번호를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockProblemRepository.getProblemByTaskIdAndBojProblemNumber.mockResolvedValue(
        null,
      );

      await expect(
        problemService.getProblemByBojProblemNumber(1, 9999),
      ).rejects.toThrow(NotFoundException);
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockProblemRepository.getProblemByTaskIdAndBojProblemNumber.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        problemService.getProblemByBojProblemNumber(1, 101),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateProblem", () => {
    test("문제를 수정하고 반환해야 합니다", async () => {
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
      const updatedProblem: ProblemEntity = {
        ...existingProblem,
        ...updateProblemDto,
      };

      mockProblemRepository.getProblemById.mockResolvedValue(existingProblem);
      mockProblemRepository.updateProblem.mockResolvedValue(updatedProblem);

      const result = await problemService.updateProblem(1, updateProblemDto);

      expect(result).toEqual(updatedProblem);
      expect(mockProblemRepository.updateProblem).toHaveBeenCalledWith(
        1,
        updateProblemDto,
      );
    });

    test("존재하지 않는 문제를 수정하려고 하면 NotFoundException을 던져야 합니다", async () => {
      const updateProblemDto: UpdateProblemDto = {
        bojProblemNumber: 2001,
        essential: false,
      };

      mockProblemRepository.getProblemById.mockResolvedValue(null);

      await expect(
        problemService.updateProblem(999, updateProblemDto),
      ).rejects.toThrow(NotFoundException);
    });

    test("잘못된 데이터로 문제를 수정하려고 하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<UpdateProblemDto> = {};
      const existingProblem: ProblemEntity = {
        id: 1,
        bojProblemNumber: 1001,
        essential: true,
        taskId: 1,
      };

      mockProblemRepository.getProblemById.mockResolvedValue(existingProblem);
      mockProblemRepository.updateProblem.mockRejectedValue(
        new BadRequestException("Invalid update data"),
      );

      await expect(
        problemService.updateProblem(1, invalidDto as UpdateProblemDto),
      ).rejects.toThrow(BadRequestException);
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

      mockProblemRepository.getProblemById.mockResolvedValue(deletedProblem);
      mockProblemRepository.deleteProblem.mockResolvedValue(deletedProblem);

      const result = await problemService.deleteProblem(1);

      expect(result).toEqual(deletedProblem);
      expect(mockProblemRepository.deleteProblem).toHaveBeenCalledWith(1);
    });
  });

  test("존재하지 않는 문제를 삭제하려고 하면 NotFoundException을 던져야 합니다", async () => {
    mockProblemRepository.getProblemById.mockResolvedValue(null);

    await expect(problemService.deleteProblem(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  test("잘못된 ID로 문제를 삭제하려고 하면 BadRequestException을 던져야 합니다", async () => {
    mockTaskRepository.deleteTask.mockRejectedValue(
      new BadRequestException("Invalid semester ID"),
    );

    const invalidId: number | null = null;
    await expect(
      problemService.deleteProblem(invalidId as number),
    ).rejects.toThrow(BadRequestException);
  });
});
