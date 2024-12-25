import { Injectable, NotFoundException } from "@nestjs/common";
import { ProblemRepository } from "./problem.repository";
import { CreateProblemDto } from "./dto/create-problem.dto";
import { UpdateProblemDto } from "./dto/update-problem.dto";

@Injectable()
export class ProblemService {
  constructor(private readonly problemRepository: ProblemRepository) {}

  createProblem(createProblemDto: CreateProblemDto) {
    return this.problemRepository.createProblem({
      data: {
        ...createProblemDto,
        task: { connect: { id: createProblemDto.taskId } }, // 관계 설정
      },
    });
  }

  findProblemById(id: number) {
    return this.problemRepository.getProblem({ where: { id } });
  }

  findProblemsByTask(taskId: number) {
    return this.problemRepository.getProblems({ where: { taskId } });
  }

  updateProblem(id: number, updateProblemDto: UpdateProblemDto) {
    return this.problemRepository.updateProblem({
      where: { id },
      data: updateProblemDto,
    });
  }

  getAllProblems() {
    return this.problemRepository.getAllProblems();
  }

  removeProblem(id: number) {
    return this.problemRepository.deleteProblem({ where: { id } });
  }
}
