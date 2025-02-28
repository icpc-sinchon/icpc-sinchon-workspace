import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { CreateStudentDto } from "./dto/create-student.dto";
import type { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentEntity } from "./entities/student.entity";
import { StudentRepository } from "./student.repository";

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async createStudent(
    createStudentDto: CreateStudentDto
  ): Promise<StudentEntity> {
    try {
      return await this.studentRepository.createStudent(createStudentDto);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create student: ${error.message}`
      );
    }
  }

  async createManyStudents(createStudentDtos: CreateStudentDto[]) {
    try {
      return await this.studentRepository.createManyStudents(createStudentDtos);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create students: ${error.message}`
      );
    }
  }

  async getAllStudents(): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.getAllStudents();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve all students: ${error.message}`
      );
    }
  }

  async getStudentById(id: number): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.getStudentById(id);
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve student for id ${id}: ${error.message}`
      );
    }
  }

  async getStudentByBojHandle(bojHandle: string): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.getStudentByBojHandle(
        bojHandle
      );
      if (!student) {
        throw new NotFoundException(
          `Student with BojHandle ${bojHandle} not found`
        );
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve student for boj handle ${bojHandle}: ${error.message}`
      );
    }
  }

  async updateStudent(
    id: number,
    updateStudentDto: UpdateStudentDto
  ): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.getStudentById(id);
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return await this.studentRepository.updateStudent(id, updateStudentDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update student: ${error.message}`
      );
    }
  }

  async deleteStudent(id: number): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.getStudentById(id);
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return await this.studentRepository.deleteStudent(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete student: ${error.message}`
      );
    }
  }
}
