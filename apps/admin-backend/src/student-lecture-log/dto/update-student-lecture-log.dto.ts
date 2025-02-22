import { PartialType } from '@nestjs/swagger';
import { CreateStudentLectureLogDto } from './create-student-lecture-log.dto';

export class UpdateStudentLectureLogDto extends PartialType(CreateStudentLectureLogDto) {}
