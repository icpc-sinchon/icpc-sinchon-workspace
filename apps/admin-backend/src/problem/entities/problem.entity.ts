import { Problem } from "@prisma/client";

export class ProblemEntity implements Problem {
  id: number;
  bojProblemNumber: number;
  essential: boolean;
  taskId: number;
}
