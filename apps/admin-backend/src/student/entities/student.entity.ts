import { ApiProperty } from "@nestjs/swagger";
import { Student, School } from "@prisma/client";

export class StudentEntity implements Student {
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
}
