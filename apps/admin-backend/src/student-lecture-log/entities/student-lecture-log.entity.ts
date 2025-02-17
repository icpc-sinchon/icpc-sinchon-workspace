import { Lecture, RefundOption, StudentLectureLog } from "@prisma/client";

export class StudentLectureLogEntity implements StudentLectureLog {
  id: number;
  studentId: number;
  lectureId: number;
  isInvited: boolean;
  isCancelled: boolean;
  refundAccount: string;
  refundOption: RefundOption;
  lecture?: Lecture;
}
