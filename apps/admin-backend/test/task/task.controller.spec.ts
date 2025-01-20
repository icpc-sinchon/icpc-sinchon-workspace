import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "@/task/task.controller";
import { TaskService } from "@/task/task.service";
import { CreateTaskDto } from "@/task/dto/create-task.dto";
import { UpdateTaskDto } from "@/task/dto/update-task.dto";
import { Task } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";

const mockTaskService = mockDeep<TaskService>();

describe("TaskController", () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    })
      .overrideProvider(TaskService)
      .useValue(mockTaskService)
      .compile();

    controller = module.get<TaskController>(TaskController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findTasks", () => {
    test("should return tasks for a given lecture", async () => {
      const lectureId = 1;
      const expectedTasks: Task[] = [
        {
          id: 1,
          round: 1,
          practiceId: 101,
          lectureId,
          minSolveCount: 5,
        },
      ];

      mockTaskService.findTasksByLecture.mockResolvedValue(expectedTasks);

      const result = await controller.findTasksByLecture(lectureId);

      expect(mockTaskService.findTasksByLecture).toHaveBeenCalledWith(lectureId);
      expect(result).toEqual(expectedTasks);
    });

    test("should throw an error for an invalid lecture ID", async () => {
      const invalidLectureId = "invalid" as unknown as number;

      mockTaskService.findTasksByLecture.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.findTasksByLecture(invalidLectureId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("createTask", () => {
    test("should create a new task", async () => {
      const createTaskDto: CreateTaskDto = {
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 5,
      };

      const expectedTask: Task = {
        id: 1,
        ...createTaskDto,
      };

      mockTaskService.createTask.mockResolvedValue(expectedTask);

      const result = await controller.createTask(createTaskDto);

      expect(mockTaskService.createTask).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual(expectedTask);
    });

    test("should throw a validation error for invalid createTaskDto", async () => {
      const invalidDto = {
        round: "invalid",
        practiceId: "invalid",
        lectureId: "invalid",
        minSolveCount: "invalid",
      };

      mockTaskService.createTask.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.createTask(invalidDto as unknown as CreateTaskDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateTask", () => {
    test("should update an existing task", async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { minSolveCount: 10 };

      const expectedTask: Task = {
        id: taskId,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 10,
      };

      mockTaskService.updateTask.mockResolvedValue(expectedTask);

      const result = await controller.updateTask(taskId, updateTaskDto);

      expect(mockTaskService.updateTask).toHaveBeenCalledWith(
        taskId,
        updateTaskDto,
      );
      expect(result).toEqual(expectedTask);
    });

    test("should throw an error for invalid updateTaskDto", async () => {
      const taskId = 1;
      const invalidDto = { minSolveCount: "invalid" };

      mockTaskService.updateTask.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.updateTask(taskId, invalidDto as unknown as UpdateTaskDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("removeTask", () => {
    test("should remove an existing task", async () => {
      const taskId = 1;
      const expectedTask: Task = {
        id: taskId,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 5,
      };

      mockTaskService.removeTask.mockResolvedValue(expectedTask);

      const result = await controller.removeTask(taskId);

      expect(mockTaskService.removeTask).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedTask);
    });

    test("should throw an error for an invalid task ID", async () => {
      const invalidTaskId = "invalid" as unknown as number;

      mockTaskService.removeTask.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.removeTask(invalidTaskId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
