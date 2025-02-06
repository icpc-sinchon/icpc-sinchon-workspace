import { ApiProperty } from "@nestjs/swagger";
import { School, PaymentStatus } from "@prisma/client";
import { StudentLectureLogEntity } from "../../student-lecture-log/entities/student-lecture-log.entity";

export class StudentLectureEntity {
  @ApiProperty({ description: "고유 ID 값" })
  id: number;

  @ApiProperty({ description: "학생의 이름" })
  name: string;

  @ApiProperty({
    description: "학생의 BOJ 핸들 (문제풀이 체크 및 관리에 사용)",
  })
  bojHandle: string;

  @ApiProperty({ description: "학생의 이메일" })
  email: string;

  @ApiProperty({ description: "학생의 전화번호" })
  phone: string;

  @ApiProperty({
    enum: School,
    description:
      "학생이 소속된 학교. 연세대, 서강대, 홍익대, 이화여대, 숙명여대 중 하나",
  })
  school: School;

  @ApiProperty({ description: "학생의 학번" })
  studentNumber: string;

  @ApiProperty({
    enum: PaymentStatus,
    description: "학생의 납부 상태 (3만원 비환급 / 6만원 환급 옵션)",
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({ description: "학생의 환불 계좌" })
  refundAccount: string;

  @ApiProperty({
    description: "학생과 연관된 강의 로그 목록",
    type: () => [StudentLectureLogEntity],
  })
  studentLectureLog: StudentLectureLogEntity[];
}
