import { ApiProperty } from "@nestjs/swagger";
import { School, PaymentStatus, Student } from "@prisma/client";

export class StudentEntity implements Student {
  id: number;
  name: string;
  bojHandle: string;
  email: string;
  phone: string;
  @ApiProperty({ enum: School })
  school: School;
  studentNumber: string;
  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;
  refundAccount: string;
}
