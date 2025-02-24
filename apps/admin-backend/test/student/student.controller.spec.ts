import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { School } from "@prisma/client";
import { StudentEntity } from "@/student/entities/student.entity";
import { CreateStudentDto } from "@/student/dto/create-student.dto";
import { UpdateStudentDto } from "@/student/dto/update-student.dto";
import { StudentService } from "@/student/student.service";
import { StudentController } from "@/student/student.controller";

const mockStudentService = mockDeep<StudentService>();

describe("StudentController", () => {
  let studentController: StudentController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [StudentService],
    })
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .compile();

    studentController = moduleRef.get<StudentController>(StudentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllStudents", () => {
    test("모든 학생 목록을 반환해야 합니다", async () => {
      const students: StudentEntity[] = [
        { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" },
        { id: 2, name: "Bob", bojHandle: "bob321", email: "bob@example.com", phone: "010-8765-4321", school: School.YONSEI, studentNumber: "20210002" },
      ];

      mockStudentService.getAllStudents.mockResolvedValue(students);

      const result = await studentController.getAllStudents();

      expect(result).toEqual(students);
      expect(mockStudentService.getAllStudents).toHaveBeenCalledTimes(1);
    });
  });

  describe("findStudentById", () => {
    test("특정 ID의 학생을 반환해야 합니다", async () => {
      const student: StudentEntity = { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" };

      mockStudentService.getStudentById.mockResolvedValue(student);

      const result = await studentController.findStudentById(1);

      expect(result).toEqual(student);
      expect(mockStudentService.getStudentById).toHaveBeenCalledTimes(1);
      expect(mockStudentService.getStudentById).toHaveBeenCalledWith(1);
    });
  });

  describe("createStudent", () => {
    test("새 학생을 생성하고 반환해야 합니다", async () => {
      const createStudentDto: CreateStudentDto = { name: "Charlie", bojHandle: "charlie789", email: "charlie@example.com", phone: "010-5555-6666", school: School.HONGIK, studentNumber: "20210003" };
      const createdStudent: StudentEntity = { id: 3, ...createStudentDto };

      mockStudentService.createStudent.mockResolvedValue(createdStudent);

      const result = await studentController.createStudent(createStudentDto);

      expect(result).toEqual(createdStudent);
      expect(mockStudentService.createStudent).toHaveBeenCalledTimes(1);
      expect(mockStudentService.createStudent).toHaveBeenCalledWith(createStudentDto);
    });
  });

  describe("createManyStudents", () => {
    test("여러 학생을 생성하고 생성된 개수를 반환해야 합니다", async () => {
      const createStudentDtos: CreateStudentDto[] = [
        { name: "Dave", bojHandle: "dave456", email: "dave@example.com", phone: "010-3333-4444", school: School.EWHA, studentNumber: "20210004" },
        { name: "Eve", bojHandle: "eve654", email: "eve@example.com", phone: "010-2222-1111", school: School.SOOKMYUNG, studentNumber: "20210005" },
      ];
      const response = { count: 2 };

      mockStudentService.createManyStudents.mockResolvedValue(response);

      const result = await studentController.createManyStudents(createStudentDtos);

      expect(result).toEqual(response);
      expect(mockStudentService.createManyStudents).toHaveBeenCalledTimes(1);
      expect(mockStudentService.createManyStudents).toHaveBeenCalledWith(createStudentDtos);
    });
  });

  describe("updateStudent", () => {
    test("특정 학생을 수정하고 반환해야 합니다", async () => {
      const updateStudentDto: UpdateStudentDto = { name: "Updated Alice", phone: "010-9999-8888" };
      const existingStudent: StudentEntity = { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" };
      const updatedStudent: StudentEntity = { ...existingStudent, ...updateStudentDto };

      mockStudentService.updateStudent.mockResolvedValue(updatedStudent);

      const result = await studentController.updateStudent(1, updateStudentDto);

      expect(result).toEqual(updatedStudent);
      expect(mockStudentService.updateStudent).toHaveBeenCalledTimes(1);
      expect(mockStudentService.updateStudent).toHaveBeenCalledWith(1, updateStudentDto);
    });
  });

  describe("deleteStudent", () => {
    test("특정 학생을 삭제하고 반환해야 합니다", async () => {
      const deletedStudent: StudentEntity = { id: 1, name: "Alice", bojHandle: "alice123", email: "alice@example.com", phone: "010-1234-5678", school: School.SOGANG, studentNumber: "20210001" };

      mockStudentService.deleteStudent.mockResolvedValue(deletedStudent);

      const result = await studentController.deleteStudent(1);

      expect(result).toEqual(deletedStudent);
      expect(mockStudentService.deleteStudent).toHaveBeenCalledTimes(1);
      expect(mockStudentService.deleteStudent).toHaveBeenCalledWith(1);
    });
  });
});
