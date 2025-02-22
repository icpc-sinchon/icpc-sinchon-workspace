import { Lecture, RefundOption, StudentLectureLog } from "@prisma/client";

export class StudentLectureLogEntity implements StudentLectureLog {
  id: number;
  studentId: number;
  lectureId: number;
  refundOption: RefundOption;
  refundAccount: string;
  isInvited: boolean;
  isCancelled: boolean;
}
