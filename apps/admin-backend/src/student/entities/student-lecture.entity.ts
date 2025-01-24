import { ApiProperty } from "@nestjs/swagger";
import { School, PaymentStatus } from "@prisma/client";
import { StudentLectureLogEntity } from "../../student-lecture-log/entities/student-lecture-log.entity";

export class StudentLectureEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  bojHandle: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: School })
  school: School;

  @ApiProperty()
  studentNumber: string;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty()
  refundAccount: string;

  @ApiProperty({
    description: "List of lecture logs associated with the student",
    type: () => [StudentLectureLogEntity],
  })
  studentLectureLog: StudentLectureLogEntity[];
}