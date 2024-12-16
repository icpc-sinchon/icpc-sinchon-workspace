import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@Injectable()
export class LectureService {
  create(createLectureDto: CreateLectureDto) {
    return 'This action adds a new lecture';
  }

  findAll() {
    return `This action returns all lecture`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lecture`;
  }

  update(id: number, updateLectureDto: UpdateLectureDto) {
    return `This action updates a #${id} lecture`;
  }

  remove(id: number) {
    return `This action removes a #${id} lecture`;
  }
}
