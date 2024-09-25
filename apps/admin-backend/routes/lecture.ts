import express, { type Request } from "express";
import LectureController from "controllers/lecture_controller";
import type { EmptyObject, SemesterQuery } from "types";
import { loginRequired } from "utils/jwt";

const lectureRouter = express.Router();
const lectureController = LectureController.getInstance();

lectureRouter.use(express.json());
lectureRouter.use(express.urlencoded({ extended: false }));

lectureRouter.get(
	"/",
	loginRequired,
	(req: Request<EmptyObject, EmptyObject, EmptyObject, SemesterQuery>, res) => {
		lectureController.getLectures(req, res);
	},
);

lectureRouter.get<"/:id">("/:id", loginRequired, (req, res) => {
	lectureController.getLectureById(req, res);
});

lectureRouter.post<"/">("/", (req, res) => {
	lectureController.createLecture(req, res);
});

lectureRouter.patch<"/:lectureId">("/:lectureId", (req, res) => {
	lectureController.updateLecture(req, res);
});

lectureRouter.delete<"/:lectureId">("/:lectureId", (req, res) => {
	lectureController.deleteLecture(req, res);
});

export default lectureRouter;
