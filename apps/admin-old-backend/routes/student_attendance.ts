import express, { type Request } from "express";
import StudentAttendanceController from "controllers/student_attendance_controller";
import type { EmptyObject, LectureQuery } from "types";
import { loginRequired } from "utils/jwt";

const studentAttendanceRouter = express.Router();
const studentAttendanceController = StudentAttendanceController.getInstance();

studentAttendanceRouter.use(express.json());
studentAttendanceRouter.use(express.urlencoded({ extended: false }));

studentAttendanceRouter.get(
	"/",
	loginRequired,
	(req: Request<EmptyObject, EmptyObject, EmptyObject, LectureQuery>, res) => {
		studentAttendanceController.getStudentAttendanceLogs(req, res);
	},
);

studentAttendanceRouter.patch<"/:studentId">(
	"/:studentId",
	loginRequired,
	(req, res) => {
		studentAttendanceController.updateStudentAttendanceLogs(req, res);
	},
);

export default studentAttendanceRouter;
