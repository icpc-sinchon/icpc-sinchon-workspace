import { Controller } from '@nestjs/common';
import type { SemesterService } from "./semester.service";

@Controller("semester")
export class SemesterController {
  constructor(private semesterService: SemesterService) {}
}
