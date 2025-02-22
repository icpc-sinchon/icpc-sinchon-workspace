import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { TaskEntity } from "@/task/entities/task.entity";
import { CreateTaskDto } from "@/task/dto/create-task.dto";
import { UpdateTaskDto } from "@/task/dto/update-task.dto";
import { TaskService } from "@/task/task.service";
import { TaskController } from "@/task/task.controller";

const mockTaskService = mockDeep<TaskService>();

describe("TaskController", () => {
  let taskController: TaskController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    })
      .overrideProvider(TaskService)
      .useValue(mockTaskService)
      .compile();

    taskController = moduleRef.get<TaskController>(TaskController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    test("새로운 과제를 생성하고 반환해야 합니다", async () => {
      const createTaskDto: CreateTaskDto = {
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };
      const createdTask: TaskEntity = { id: 3, ...createTaskDto };

      mockTaskService.createTask.mockResolvedValue(createdTask);

      const result = await taskController.createTask(createTaskDto);

      expect(result).toEqual(createdTask);
      expect(mockTaskService.createTask).toHaveBeenCalledTimes(1);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe("getTasksByLecture", () => {
    test("특정 강의의 과제 목록을 반환해야 합니다", async () => {
      const lectureId = 1;
      const tasks: TaskEntity[] = [
        {
          id: 1,
          round: 1,
          practiceId: 101,
          lectureId,
          minSolveCount: 3,
        },
        {
          id: 2,
          round: 2,
          practiceId: 102,
          lectureId,
          minSolveCount: 2,
        },
      ];

      mockTaskService.getTasksByLectureId.mockResolvedValue(tasks);

      const result = await taskController.getTasksByLecture(lectureId);

      expect(result).toEqual(tasks);
      expect(mockTaskService.getTasksByLectureId).toHaveBeenCalledTimes(1);
      expect(mockTaskService.getTasksByLectureId).toHaveBeenCalledWith(
        lectureId,
      );
    });
  });

  describe("getTaskById", () => {
    test("특정 과제를 조회하고 반환해야 합니다", async () => {
      const task: TaskEntity = {
        id: 1,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 3,
      };

      mockTaskService.getTaskById.mockResolvedValue(task);

      const result = await taskController.getTaskById(1);

      expect(result).toEqual(task);
      expect(mockTaskService.getTaskById).toHaveBeenCalledTimes(1);
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(1);
    });
  });

  describe("updateTask", () => {
    test("특정 과제를 수정하고 반환해야 합니다", async () => {
      const updateTaskDto: UpdateTaskDto = {
        round: 2,
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

      mockTaskService.updateTask.mockResolvedValue(updatedTask);

      const result = await taskController.updateTask(1, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockTaskService.updateTask).toHaveBeenCalledTimes(1);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, updateTaskDto);
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

      mockTaskService.deleteTask.mockResolvedValue(deletedTask);

      const result = await taskController.deleteTask(1);

      expect(result).toEqual(deletedTask);
      expect(mockTaskService.deleteTask).toHaveBeenCalledTimes(1);
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});
