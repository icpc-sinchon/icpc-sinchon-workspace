import { ApiProperty } from "@nestjs/swagger";
import { StudentLectureLog, RefundOption } from "@prisma/client";

export class StudentLectureLogEntity implements StudentLectureLog {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({ description: "학생의 ID 값" })
  studentId: number;

  @ApiProperty({ description: "강의의 ID 값" })
  lectureId: number;

  @ApiProperty({ description: "학생이 BOJ 그룹에 초대되었는지 여부" })
  isInvited: boolean;

  @ApiProperty({ description: "수강신청이 취소되었는지 여부" })
  isCancelled: boolean;

  @ApiProperty({
    enum: RefundOption,
    description: "학생의 환급 옵션 (환급, 비환급 중 하나)",
  })
  refundOption: RefundOption;

  @ApiProperty({ description: "학생의 환불 계좌" })
  refundAccount: string;
}
