import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";
import { Level } from "@prisma/client";
import { TaskEntity } from "@/task/entities/task.entity";
import { LectureEntity } from "@/lecture/entities/lecture.entity";
import { CreateTaskDto } from "@/task/dto/create-task.dto";
import { UpdateTaskDto } from "@/task/dto/update-task.dto";
import { TaskRepository } from "@/task/task.repository";
import { ProblemRepository } from "@/problem/problem.repository";
import { LectureRepository } from "@/lecture/lecture.repository";
import { TaskService } from "@/task/task.service";

const mockTaskRepository = mockDeep<TaskRepository>();
const mockProblemRepository = mockDeep<ProblemRepository>();
const mockLectureRepository = mockDeep<LectureRepository>();

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        TaskRepository,
        ProblemRepository,
        LectureRepository,
      ],
    })
      .overrideProvider(TaskRepository)
      .useValue(mockTaskRepository)
      .overrideProvider(ProblemRepository)
      .useValue(mockProblemRepository)
      .overrideProvider(LectureRepository)
      .useValue(mockLectureRepository)
      .compile();

    taskService = moduleRef.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    test("새 과제를 생성하고 반환해야 합니다", async () => {
      const createTaskDto: CreateTaskDto = {
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };
      const lecture: LectureEntity = {
        id: 1,
        level: Level.Expert,
        lectureNumber: 15,
        bojGroupId: 103,
        semesterId: 2,
      };
      const createdTask: TaskEntity = { id: 3, ...createTaskDto };

      mockLectureRepository.getLectureById.mockResolvedValue(lecture);
      mockTaskRepository.createTask.mockResolvedValue(createdTask);

      const result = await taskService.createTask(createTaskDto);

      expect(result).toEqual(createdTask);
      expect(mockLectureRepository.getLectureById).toHaveBeenCalledWith(1);
      expect(mockTaskRepository.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          round: createTaskDto.round,
          practiceId: createTaskDto.practiceId,
          lecture: { connect: { id: createTaskDto.lectureId } },
        }),
      );
    });

    test("존재하지 않는 강의에 과제를 생성하면 NotFoundException을 던져야 합니다", async () => {
      const createTaskDto: CreateTaskDto = {
        round: 1,
        practiceId: 101,
        lectureId: 99,
        minSolveCount: 3,
      };

      mockLectureRepository.getLectureById.mockResolvedValue(null);

      await expect(taskService.createTask(createTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("lecture id가 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<CreateTaskDto> = {};

      mockTaskRepository.createTask.mockRejectedValue(
        new BadRequestException("Invalid task data"),
      );

      await expect(
        taskService.createTask(invalidDto as CreateTaskDto),
      ).rejects.toThrow(BadRequestException);
    });

    test("잘못된 데이터로 과제를 생성하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<CreateTaskDto> = { lectureId: 1 };

      mockLectureRepository.getLectureById.mockResolvedValue({
        id: 1,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 101,
        semesterId: 1,
      });
      mockTaskRepository.createTask.mockRejectedValue(
        new BadRequestException("Invalid task data"),
      );

      await expect(
        taskService.createTask(invalidDto as CreateTaskDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("getAllTasks", () => {
    test("모든 과제를 반환해야 합니다", async () => {
      const tasks: TaskEntity[] = [
        {
          id: 1,
          round: 1,
          practiceId: 101,
          lectureId: 1,
          minSolveCount: 3,
        },
        {
          id: 2,
          round: 2,
          practiceId: 102,
          lectureId: 1,
          minSolveCount: 2,
        },
      ];

      mockTaskRepository.getAllTasks.mockResolvedValue(tasks);

      const result = await taskService.getAllTasks();

      expect(result).toEqual(tasks);
      expect(mockTaskRepository.getAllTasks).toHaveBeenCalledTimes(1);
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockTaskRepository.getAllTasks.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(taskService.getAllTasks()).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getTaskById", () => {
    test("특정 ID의 과제를 반환해야 합니다", async () => {
      const task: TaskEntity = {
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(task);

      const result = await taskService.getTaskById(1);

      expect(result).toEqual(task);
      expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 과제를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockTaskRepository.getTaskById.mockResolvedValue(null);

      await expect(taskService.getTaskById(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockTaskRepository.getTaskById.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(taskService.getTaskById(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getTasksByLectureId", () => {
    test("특정 강의의 과제 목록을 반환해야 합니다", async () => {
      const lectureId = 1;
      const tasks: TaskEntity[] = [
        { id: 1, round: 1, practiceId: 101, lectureId, minSolveCount: 3 },
        { id: 2, round: 2, practiceId: 102, lectureId, minSolveCount: 2 },
      ];

      mockLectureRepository.getLectureById.mockResolvedValue({
        id: lectureId,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 101,
        semesterId: 1,
      });

      mockTaskRepository.getTasksWithProblemsByLectureId.mockResolvedValue(
        tasks,
      );

      const result = await taskService.getTasksByLectureId(lectureId);

      expect(result).toEqual(tasks);
      expect(mockLectureRepository.getLectureById).toHaveBeenCalledWith(
        lectureId,
      );
      expect(
        mockTaskRepository.getTasksWithProblemsByLectureId,
      ).toHaveBeenCalledWith(lectureId);
    });

    test("존재하지 않는 강의의 과제를 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockLectureRepository.getLectureById.mockResolvedValue(null);

      await expect(taskService.getTasksByLectureId(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockLectureRepository.getLectureById.mockResolvedValue({
        id: 1,
        level: Level.Novice,
        lectureNumber: 10,
        bojGroupId: 101,
        semesterId: 1,
      });

      mockTaskRepository.getTasksWithProblemsByLectureId.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(taskService.getTasksByLectureId(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("updateTask", () => {
    test("과제를 수정하고 반환해야 합니다", async () => {
      const updateTaskDto: UpdateTaskDto = {
        practiceId: 102,
      };
      const existingTask: TaskEntity = {
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };
      const updatedTask: TaskEntity = { ...existingTask, ...updateTaskDto };

      mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
      mockTaskRepository.updateTask.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
        1,
        updateTaskDto,
      );
    });

    test("존재하지 않는 과제를 수정하려고 하면 NotFoundException을 던져야 합니다", async () => {
      const updateTaskDto: UpdateTaskDto = {
        round: 2,
        practiceId: 102,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(null);

      await expect(taskService.updateTask(999, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("잘못된 데이터로 과제를 수정하려고 하면 BadRequestException을 던져야 합니다", async () => {
      const invalidDto: Partial<UpdateTaskDto> = {};
      const existingTask: TaskEntity = {
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(existingTask);
      mockTaskRepository.updateTask.mockRejectedValue(
        new BadRequestException("Invalid update data"),
      );

      await expect(
        taskService.updateTask(1, invalidDto as UpdateTaskDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("deleteTask", () => {
    test("특정 과제를 삭제하고 반환해야 합니다", async () => {
      const deletedTask: TaskEntity = {
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };

      mockTaskRepository.getTaskById.mockResolvedValue(deletedTask);
      mockTaskRepository.deleteTask.mockResolvedValue(deletedTask);

      const result = await taskService.deleteTask(1);

      expect(result).toEqual(deletedTask);
      expect(mockTaskRepository.deleteTask).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 과제를 삭제하려고 하면 NotFoundException을 던져야 합니다", async () => {
      mockTaskRepository.getTaskById.mockResolvedValue(null);

      await expect(taskService.deleteTask(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    test("잘못된 ID로 과제를 삭제하려고 하면 BadRequestException을 던져야 합니다", async () => {
      mockTaskRepository.deleteTask.mockRejectedValue(
        new BadRequestException("Invalid semester ID"),
      );

      const invalidId: number | null = null;
      await expect(taskService.deleteTask(invalidId as number)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
