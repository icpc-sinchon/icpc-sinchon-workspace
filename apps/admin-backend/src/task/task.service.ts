import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TaskRepository } from "./task.repository";

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask({
      data: {
        ...createTaskDto,
        lecture: { connect: { id: createTaskDto.lectureId } },
      },
    });
  }

  findTaskById(id: number) {
    return this.taskRepository.getTask({ where: { id } });
  }

  findTasksByLecture(lectureId: number) {
    return this.taskRepository.getTasks({ where: { lectureId } });
  }

  updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.updateTask({
      where: { id },
      data: updateTaskDto,
    });
  }

  getAllTasks() {
    return this.taskRepository.getAllTasks();
  }

  removeTask(id: number) {
    return this.taskRepository.deleteTask({ where: { id } });
  }
}
