import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { mockDeep } from "jest-mock-extended";
import { School } from "@prisma/client";
import { StudentEntity } from "@/student/entities/student.entity";
import { CreateStudentDto } from "@/student/dto/create-student.dto";
import { UpdateStudentDto } from "@/student/dto/update-student.dto";
import { StudentRepository } from "@/student/student.repository";
import { StudentService } from "@/student/student.service";

const mockStudentRepository = mockDeep<StudentRepository>();

describe("StudentService", () => {
  let studentService: StudentService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [StudentService, StudentRepository],
    })
      .overrideProvider(StudentRepository)
      .useValue(mockStudentRepository)
      .compile();

    studentService = moduleRef.get<StudentService>(StudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createStudent", () => {
    test("새 학생을 생성하고 반환해야 합니다", async () => {
      const createStudentDto: CreateStudentDto = {
        name: "Charlie",
        bojHandle: "charlie789",
        email: "charlie@example.com",
        phone: "010-5555-6666",
        school: School.HONGIK,
        studentNumber: "20210003",
      };
      const createdStudent: StudentEntity = { id: 3, ...createStudentDto };

      mockStudentRepository.createStudent.mockResolvedValue(createdStudent);

      const result = await studentService.createStudent(createStudentDto);

      expect(result).toEqual(createdStudent);
      expect(mockStudentRepository.createStudent).toHaveBeenCalledTimes(1);
      expect(mockStudentRepository.createStudent).toHaveBeenCalledWith(createStudentDto);
    });

    test("잘못된 데이터로 학생을 생성하면 BadRequestException을 던져야 합니다", async () => {
      mockStudentRepository.createStudent.mockRejectedValue(new BadRequestException("Invalid student data"));

      await expect(studentService.createStudent({} as CreateStudentDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("createManyStudents", () => {
    test("여러 학생을 생성하고 생성된 개수를 반환해야 합니다", async () => {
      const createStudentDtos: CreateStudentDto[] = [
        { name: "Dave", bojHandle: "dave456", email: "dave@example.com", phone: "010-3333-4444", school: School.EWHA, studentNumber: "20210004" },
        { name: "Eve", bojHandle: "eve654", email: "eve@example.com", phone: "010-2222-1111", school: School.SOOKMYUNG, studentNumber: "20210005" },
      ];
      const response = { count: 2 };

      mockStudentRepository.createManyStudents.mockResolvedValue(response);

      const result = await studentService.createManyStudents(createStudentDtos);

      expect(result).toEqual(response);
      expect(mockStudentRepository.createManyStudents).toHaveBeenCalledTimes(1);
      expect(mockStudentRepository.createManyStudents).toHaveBeenCalledWith(createStudentDtos);
    });

    test("잘못된 데이터로 여러 학생을 생성하면 BadRequestException을 던져야 합니다", async () => {
      mockStudentRepository.createManyStudents.mockRejectedValue(new BadRequestException("Invalid student data"));

      await expect(studentService.createManyStudents([])).rejects.toThrow(BadRequestException);
    });
  });

  describe("getAllStudents", () => {
    test("모든 학생 목록을 반환해야 합니다", async () => {
      const students: StudentEntity[] = [
        { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" },
        { id: 2, name: "Bob", bojHandle: "bob321", email: "bob@example.com", phone: "010-8765-4321", school: School.YONSEI, studentNumber: "20210002" },
      ];

      mockStudentRepository.getAllStudents.mockResolvedValue(students);

      const result = await studentService.getAllStudents();

      expect(result).toEqual(students);
      expect(mockStudentRepository.getAllStudents).toHaveBeenCalledTimes(1);
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockStudentRepository.getAllStudents.mockRejectedValue(new Error("Database error"));

      await expect(studentService.getAllStudents()).rejects.toThrow(BadRequestException);
    });
  });

  describe("getStudentById", () => {
    test("특정 ID의 학생을 반환해야 합니다", async () => {
      const student: StudentEntity = { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" };

      mockStudentRepository.getStudentById.mockResolvedValue(student);

      const result = await studentService.getStudentById(1);

      expect(result).toEqual(student);
      expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 학생을 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockStudentRepository.getStudentById.mockResolvedValue(null);

      await expect(studentService.getStudentById(999)).rejects.toThrow(NotFoundException);
    });

    test("잘못된 ID로 학생을 조회하면 BadRequestException을 던져야 합니다", async () => {
      mockStudentRepository.getStudentById.mockRejectedValue(new BadRequestException("Invalid student ID"));

      await expect(studentService.getStudentById(null as unknown as number)).rejects.toThrow(BadRequestException);
    });
  });

  describe("getStudentByBojHandle", () => {
    test("BOJ 핸들로 특정 학생을 반환해야 합니다", async () => {
      const student: StudentEntity = { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" };

      mockStudentRepository.getStudentByBojHandle.mockResolvedValue(student);

      const result = await studentService.getStudentByBojHandle("alice123");

      expect(result).toEqual(student);
      expect(mockStudentRepository.getStudentByBojHandle).toHaveBeenCalledWith("alice123");
    });

    test("존재하지 않는 BOJ 핸들의 학생을 조회하면 NotFoundException을 던져야 합니다", async () => {
      mockStudentRepository.getStudentByBojHandle.mockResolvedValue(null);

      await expect(studentService.getStudentByBojHandle("unknown"))
        .rejects.toThrow(NotFoundException);
    });

    test("예기치 않은 오류가 발생하면 BadRequestException을 던져야 합니다", async () => {
      mockStudentRepository.getStudentByBojHandle.mockRejectedValue(new Error("Database error"));

      await expect(studentService.getStudentByBojHandle("alice123"))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe("updateStudent", () => {
    test("특정 학생을 수정하고 반환해야 합니다", async () => {
      const updateStudentDto: UpdateStudentDto = { name: "Updated Alice", phone: "010-9999-8888" };
      const existingStudent: StudentEntity = { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" };
      const updatedStudent: StudentEntity = { ...existingStudent, ...updateStudentDto };

      mockStudentRepository.getStudentById.mockResolvedValue(existingStudent);
      mockStudentRepository.updateStudent.mockResolvedValue(updatedStudent);

      const result = await studentService.updateStudent(1, updateStudentDto);

      expect(result).toEqual(updatedStudent);
      expect(mockStudentRepository.updateStudent).toHaveBeenCalledWith(1, updateStudentDto);
    });

    test("존재하지 않는 학생을 수정하면 NotFoundException을 던져야 합니다", async () => {
      const updateStudentDto: UpdateStudentDto = { name: "Updated Alice", phone: "010-9999-8888" };

      mockStudentRepository.getStudentById.mockResolvedValue(null);

      await expect(studentService.updateStudent(999, updateStudentDto)).rejects.toThrow(NotFoundException);
    });

    test("잘못된 데이터로 학생을 수정하면 BadRequestException을 던져야 합니다", async () => {
      mockStudentRepository.updateStudent.mockRejectedValue(new BadRequestException("Invalid update data"));

      await expect(studentService.updateStudent(1, {} as UpdateStudentDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("deleteStudent", () => {
    test("특정 학생을 삭제하고 반환해야 합니다", async () => {
      const deletedStudent: StudentEntity = { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" };

      mockStudentRepository.getStudentById.mockResolvedValue(deletedStudent);
      mockStudentRepository.deleteStudent.mockResolvedValue(deletedStudent);

      const result = await studentService.deleteStudent(1);

      expect(result).toEqual(deletedStudent);
      expect(mockStudentRepository.deleteStudent).toHaveBeenCalledWith(1);
    });

    test("존재하지 않는 학생을 삭제하면 NotFoundException을 던져야 합니다", async () => {
      mockStudentRepository.getStudentById.mockResolvedValue(null);

      await expect(studentService.deleteStudent(999)).rejects.toThrow(NotFoundException);
    });

    test("잘못된 ID로 학생을 삭제하면 BadRequestException을 던져야 합니다", async () => {
      mockStudentRepository.deleteStudent.mockRejectedValue(new BadRequestException("Invalid student ID"));

      await expect(studentService.deleteStudent(null as unknown as number)).rejects.toThrow(BadRequestException);
    });
  });
});
