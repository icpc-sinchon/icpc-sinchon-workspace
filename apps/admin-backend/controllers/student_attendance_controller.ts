import type { Request, Response } from "express";
import type { Lecture, Semester } from "@prisma/client";
import type { EmptyObject, StudentAttendance, LectureQuery } from "types";
import StudentAttendService from "services/student_attend_service";
import type { StudentPatchBody } from "types";

class StudentAttendanceController {
	private static instance: StudentAttendanceController;
	private studentAttendService: StudentAttendService;

	private constructor() {
		this.studentAttendService = StudentAttendService.getInstance();
	}

	public static getInstance(): StudentAttendanceController {
		if (!StudentAttendanceController.instance) {
			StudentAttendanceController.instance = new StudentAttendanceController();
		}
		return StudentAttendanceController.instance;
	}

	public async getStudentAttendanceLogs(
		req: Request<EmptyObject, EmptyObject, EmptyObject, LectureQuery>,
		res: Response,
	): Promise<void> {
		try {
			const { year, season, lectureLevel } = req.query;

			const studentWithAttendLogs =
				await this.studentAttendService.findAllStudentsAttendLogs(
					Number.parseInt(year as string),
					season,
					lectureLevel,
				);
			res.json(studentWithAttendLogs);
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
	}

	public async updateStudentAttendanceLogs(
		req: Request<{ studentId: string }, EmptyObject, StudentPatchBody>,
		res: Response,
	): Promise<void> {
		try {
			const studentId = Number.parseInt(req.params.studentId);

			const { year, season, lectureLevel, attendLog } = req.body;

			await this.studentAttendService.updateStudentAttendLogs(
				studentId,
				Number.parseInt(year),
				season,
				lectureLevel,
				attendLog,
			);

			res.status(200).send("update success");
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
	}
}

export default StudentAttendanceController;
