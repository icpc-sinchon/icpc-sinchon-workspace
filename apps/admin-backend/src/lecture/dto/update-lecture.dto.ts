import { PartialType } from "@nestjs/swagger";
import { CreateLectureDto } from "./create-lecture.dto";

export class UpdateLectureDto extends PartialType(CreateLectureDto) {}
