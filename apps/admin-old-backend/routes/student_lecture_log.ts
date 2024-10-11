import express, { type Request, type Response } from "express";
import StudentLectureLogRepository from "repositories/student_lecture_log_repository";
import StudentLectureService from "services/student_lecture_service";

// TODO: student lecture log를 다루는 이 API들을 용도에 맞게 리팩토링
const studentLectureLogRouter = express.Router();

studentLectureLogRouter.use(express.json());
studentLectureLogRouter.use(express.urlencoded({ extended: false }));

const studentLectureService = StudentLectureService.getInstance();

studentLectureLogRouter.patch("/:id", async (req: Request, res: Response) => {
	try {
		const id = Number.parseInt(req.params.id);
		const studentLectureLog = req.body;
		console.log(studentLectureLog);
		// studentLectureService 메서드를 사용하도록 할 것
		// await StudentLectureLogRepository.updateStudentLectureLog(
		// 	id,
		// 	studentLectureLog,
		// );
		res.status(200).send("update success");
	} catch (err) {
		console.error(err);
		res.status(500).send(err instanceof Error ? err.message : "Unknown error");
	}
});

// 특정 학생의 특정 학기+특정난이도 강의(유일하다) 정보 수정
// isInvited 등을 바꿀 때 사용
studentLectureLogRouter.patch(
	"/student-lecture-log/:studentId",
	async (req: Request, res: Response) => {
		try {
			const studentId = Number.parseInt(req.params.studentId);
			console.log(req.body);
			// TODO: 타입 수정
			// studentLectureService 메서드를 사용하도록 할 것
			// await studentLectureService.updateStudentLectureLogByStudentId(
			// 	studentId,
			// 	req.body,
			// );
			res.status(200).send("update success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	},
);

studentLectureLogRouter.patch(
	"/change-student-lecture/:studentId",
	async (req: Request, res: Response) => {
		try {
			const studentId = Number.parseInt(req.params.studentId);
			await studentLectureService.updateLectureOfStudent(studentId, req.body);
			res.status(200).send("update success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	},
);

studentLectureLogRouter.delete("/:id", async (req: Request, res: Response) => {
	try {
		const id = Number.parseInt(req.params.id);
		await StudentLectureLogRepository.deleteStudentLectureLog(id);
		res.status(200).send("delete success");
	} catch (err) {
		console.error(err);
		res.status(500).send(err instanceof Error ? err.message : "Unknown error");
	}
});

studentLectureLogRouter.patch(
	"/delete-student-lecture/:studentId",
	async (req: Request, res: Response) => {
		try {
			const studentId = Number.parseInt(req.params.studentId);
			console.log(req.body);
			await studentLectureService.deleteStudentLectureLogByStudentId(
				studentId,
				req.body,
			);
			res.status(200).send("update success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	},
);

export default studentLectureLogRouter;
