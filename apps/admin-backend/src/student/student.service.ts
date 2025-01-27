import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { CreateStudentDto } from "./dto/create-student.dto";
import type { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentRepository } from "./student.repository";
import { StudentEntity } from "./entities/student.entity";

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentEntity> {
    try {
      return await this.studentRepository.createStudent({
        data: createStudentDto,
      });
    } catch (error) {
      throw new BadRequestException(
        `Student creation failed: ${error.message}`,
      );
    }
  }

  async getAllStudents(): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.getAllStudents();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve students: ${error.message}`,
      );
    }
  }

  async findStudentById(id: number): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.getStudent({
        where: { id },
      });
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve student: ${error.message}`,
      );
    }
  }

  async findStudentByBojHandle(bojHandle: string): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.getStudent({
        where: { bojHandle },
      });
      if (!student) {
        throw new NotFoundException(
          `Student with BojHandle ${bojHandle} not found`,
        );
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve student by BojHandle: ${error.message}`,
      );
    }
  }

  async updateStudent(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity> {
    try {
      await this.findStudentById(id);
      return await this.studentRepository.updateStudent({
        where: { id },
        data: updateStudentDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Student update failed: ${error.message}`);
    }
  }

  async removeStudent(id: number): Promise<StudentEntity> {
    try {
      await this.findStudentById(id);
      return await this.studentRepository.deleteStudent({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Student deletion failed: ${error.message}`,
      );
    }
  }
}
