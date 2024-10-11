import express from "express";
import SemesterController from "controllers/semester_controller";
import { loginRequired } from "utils/jwt";

const semesterRouter = express.Router();
const semesterController = SemesterController.getInstance();

semesterRouter.use(express.json());
semesterRouter.use(express.urlencoded({ extended: false }));

semesterRouter.get("/", loginRequired, (req, res) => {
	semesterController.getAllSemesters(req, res);
});

semesterRouter.get<"/:id">("/:id", loginRequired, (req, res) => {
	semesterController.getSemesterById(req, res);
});

semesterRouter.post<"/">("/", loginRequired, (req, res) => {
	semesterController.createSemester(req, res);
});

export default semesterRouter;
