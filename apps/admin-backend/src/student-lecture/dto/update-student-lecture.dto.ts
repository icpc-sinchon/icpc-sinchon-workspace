import { PartialType } from '@nestjs/swagger';
import { CreateStudentLectureDto } from './create-student-lecture.dto';

export class UpdateStudentLectureDto extends PartialType(CreateStudentLectureDto) {}
