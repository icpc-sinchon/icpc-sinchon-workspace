import { ApiProperty } from "@nestjs/swagger";
import { Task } from "@prisma/client";

export class TaskEntity implements Task {
  id: number;
  round: number;
  practiceId: number;
  lectureId: number;
  minSolveCount: number;
}
