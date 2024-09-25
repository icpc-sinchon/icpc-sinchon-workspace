import type { Request, Response } from "express";
import type { Lecture, Prisma, Semester } from "@prisma/client";
import type {
	EmptyObject,
	StudentAttendance,
	NewStudent,
	SemesterQuery,
} from "types";
import StudentService from "services/student_service";
import StudentLectureService from "services/student_lecture_service";

class StudentLectureController {
	private static instance: StudentLectureController;
	private studentService: StudentService;
	private studentLectureService: StudentLectureService;

	private constructor() {
		this.studentService = StudentService.getInstance();
		this.studentLectureService = StudentLectureService.getInstance();
	}

	public static getInstance(): StudentLectureController {
		if (!StudentLectureController.instance) {
			StudentLectureController.instance = new StudentLectureController();
		}
		return StudentLectureController.instance;
	}

	public async getStudents(
		req: Request<EmptyObject, EmptyObject, EmptyObject, SemesterQuery>,
		res: Response,
	): Promise<void> {
		const year = Number.parseInt(req.query.year);
		const season = req.query.season;
		if (!year || !season) {
			res.status(400).send("year, season query required");
			return;
		}
		try {
			const students =
				await this.studentLectureService.findStudentsWithLectureLevelsBySemester(
					year,
					season,
				);
			res.json(students);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	// TODO: lecture 수강 내역도 가져오도록 수정해야 하지만 지금은 쓰이고 있지 않아서 미구현
	public async getStudentById(
		req: Request<{ id: string }>,
		res: Response,
	): Promise<void> {
		const studentId = Number.parseInt(req.params.id);
		if (Number.isNaN(studentId)) {
			res.status(400).send("id query string required");
			return;
		}
		try {
			const student = await this.studentService.findStudentById(studentId);
			res.json(student);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async createStudent(
		req: Request<EmptyObject, EmptyObject, NewStudent>,
		res: Response,
	): Promise<void> {
		try {
			const newStudent = req.body;
			const { lectureInfo, ...studentData } = newStudent;
			await this.studentLectureService.createStudentWithLectureLog(
				studentData,
				lectureInfo,
			);
			res.status(200).send("add success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async createMultipleStudents(
		req: Request<EmptyObject, EmptyObject, NewStudent[]>,
		res: Response,
	): Promise<void> {
		try {
			const students: NewStudent[] = req.body;
			const formattedStudents = students.map((student) => {
				const { lectureInfo, ...rest } = student;
				return {
					student: rest,
					lectureInfo,
				};
			});
			await this.studentLectureService.createStudentsWithLectureLog(
				formattedStudents,
			);
			res.status(200).send("add success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async updateStudent(
		req: Request<{ studentId: string }, EmptyObject, Prisma.StudentUpdateInput>,
		res: Response,
	): Promise<void> {
		try {
			const studentId = Number.parseInt(req.params.studentId);
			const studentUpdateData = req.body;
			console.log(studentUpdateData);
			await this.studentService.updateStudent(studentId, studentUpdateData);
			res.status(200).send(`update student ${studentId} success`);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async deleteStudent(
		req: Request<{ studentId: string }>,
		res: Response,
	): Promise<void> {
		try {
			const studentId = Number.parseInt(req.params.studentId);
			await this.studentService.deleteStudent(studentId);
			res.status(200).send(`delete student ${studentId} success`);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}
}

export default StudentLectureController;
