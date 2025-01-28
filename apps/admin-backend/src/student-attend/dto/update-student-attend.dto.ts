import { PartialType } from '@nestjs/swagger';
import { CreateStudentAttendDto } from './create-student-attend.dto';

export class UpdateStudentAttendDto extends PartialType(CreateStudentAttendDto) {}
