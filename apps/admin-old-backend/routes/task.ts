import express from "express";
import TaskController from "controllers/task_controller";
import { loginRequired } from "utils/jwt";

const taskRouter = express.Router();
const taskController = TaskController.getInstance();

taskRouter.use(express.json());
taskRouter.use(express.urlencoded({ extended: false }));

taskRouter.get("/", loginRequired, (req, res) => {
	taskController.getAllTasks(req, res);
});

taskRouter.get<"/:taskId">("/:taskId", loginRequired, (req, res) => {
	taskController.getTaskById(req, res);
});

taskRouter.post<"/">("/", loginRequired, (req, res) => {
	taskController.createTask(req, res);
});

taskRouter.post<"/multiple">("/multiple", loginRequired, (req, res) => {
	taskController.createMultipleTasks(req, res);
});

taskRouter.patch<"/:taskId">("/:taskId", loginRequired, (req, res) => {
	taskController.updateTask(req, res);
});

taskRouter.delete<"/:taskId">("/:taskId", loginRequired, (req, res) => {
	taskController.deleteTask(req, res);
});

export default taskRouter;
