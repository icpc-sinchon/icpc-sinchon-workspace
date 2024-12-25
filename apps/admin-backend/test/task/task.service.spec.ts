import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "@/task/task.service";
import { TaskRepository } from "@/task/task.repository";
import { CreateTaskDto } from "@/task/dto/create-task.dto";
import { UpdateTaskDto } from "@/task/dto/update-task.dto";
import { Task } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

const mockTaskRepository = mockDeep<TaskRepository>();

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [TaskService, TaskRepository],
    })
      .overrideProvider(TaskRepository)
      .useValue(mockTaskRepository)
      .compile();

    taskService = moduleRef.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    test("과제를 생성하고 반환해야 합니다.", async () => {
      const createTaskDto: CreateTaskDto = {
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 5,
      };

      const expectedTask = { id: 1, ...createTaskDto } as Task;

      mockTaskRepository.createTask.mockResolvedValue(expectedTask);

      const result = await taskService.createTask(createTaskDto);

      expect(result).toEqual(expectedTask);
      expect(mockTaskRepository.createTask).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.createTask).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          lecture: { connect: { id: createTaskDto.lectureId } },
        },
      });
    });
  });

  describe("findTaskById", () => {
    test("특정 ID를 가진 과제를 반환해야 합니다.", async () => {
      const taskId = 1;
      const expectedTask = {
        id: taskId,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 5,
      } as Task;

      mockTaskRepository.getTask.mockResolvedValue(expectedTask);

      const result = await taskService.findTaskById(taskId);

      expect(result).toEqual(expectedTask);
      expect(mockTaskRepository.getTask).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.getTask).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });
  });

  describe("findTasksByLecture", () => {
    test("특정 강의에 속한 과제를 반환해야 합니다.", async () => {
      const lectureId = 1;
      const expectedTasks = [
        {
          id: 1,
          round: 1,
          practiceId: 101,
          lectureId: lectureId,
          minSolveCount: 5,
        },
      ] as Task[];

      mockTaskRepository.getTasks.mockResolvedValue(expectedTasks);

      const result = await taskService.findTasksByLecture(lectureId);

      expect(result).toEqual(expectedTasks);
      expect(mockTaskRepository.getTasks).toHaveBeenCalledWith({
        where: { lectureId: lectureId },
      });
    });
  });

  describe("updateTask", () => {
    test("과제 정보를 업데이트해야 합니다.", async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { minSolveCount: 10 };

      const existingTask = {
        id: taskId,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 5,
      } as Task;

      const updatedTask = { ...existingTask, ...updateTaskDto } as Task;

      mockTaskRepository.getTask.mockResolvedValue(existingTask);
      mockTaskRepository.updateTask.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
      });
    });
  });

  describe("getAllTasks", () => {
    test("모든 과제를 반환해야 합니다.", async () => {
      const expectedTasks = [
        {
          id: 1,
          round: 1,
          practiceId: 101,
          lectureId: 1,
          minSolveCount: 5,
        },
      ] as Task[];

      mockTaskRepository.getAllTasks.mockResolvedValue(expectedTasks);

      const result = await taskService.getAllTasks();

      expect(result).toEqual(expectedTasks);
      expect(mockTaskRepository.getAllTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeTask", () => {
    test("특정 ID를 가진 과제를 삭제해야 합니다.", async () => {
      const taskId = 1;
      const existingTask = {
        id: taskId,
        round: 1,
        practiceId: 101,
        lectureId: 1,
        minSolveCount: 5,
      } as Task;

      mockTaskRepository.getTask.mockResolvedValue(existingTask);
      mockTaskRepository.deleteTask.mockResolvedValue(existingTask);

      const result = await taskService.removeTask(taskId);

      expect(result).toEqual(existingTask);
      expect(mockTaskRepository.deleteTask).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });
  });
});
