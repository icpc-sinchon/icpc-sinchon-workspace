import express, { type Request } from "express";
import StudentLectureController from "controllers/student_lecture_controller";
import type { EmptyObject, SemesterQuery } from "types";
import { loginRequired } from "utils/jwt";

const studentRouter = express.Router();
const studentLectureController = StudentLectureController.getInstance();

studentRouter.use(express.json());
studentRouter.use(express.urlencoded({ extended: false }));

studentRouter.get(
	"/",
	loginRequired,
	(req: Request<EmptyObject, EmptyObject, EmptyObject, SemesterQuery>, res) => {
		studentLectureController.getStudents(req, res);
	},
);

studentRouter.get<"/:id", { id: string }>("/:id", loginRequired, (req, res) => {
	studentLectureController.getStudentById(req, res);
});

studentRouter.post<"/">("/", loginRequired, (req, res) => {
	studentLectureController.createStudent(req, res);
});

studentRouter.post<"/multiple">("/multiple", loginRequired, (req, res) => {
	studentLectureController.createMultipleStudents(req, res);
});

studentRouter.patch<"/:studentId">("/:studentId", loginRequired, (req, res) => {
	studentLectureController.updateStudent(req, res);
});

studentRouter.delete<"/:studentId">(
	"/:studentId",
	loginRequired,
	(req, res) => {
		studentLectureController.deleteStudent(req, res);
	},
);

export default studentRouter;
