import { WeeklyAttendLog } from "@prisma/client";

export class WeeklyAttendLogEntity implements WeeklyAttendLog {
  id: number;
  round: number;
  lectureDone: boolean;
  taskDone: boolean;
  studentId: number;
  lectureId: number;
}
