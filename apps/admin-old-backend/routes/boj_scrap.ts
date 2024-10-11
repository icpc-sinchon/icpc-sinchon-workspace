import express, { Request } from "express";
import cors from "cors";
import BojScrapController from "controllers/boj_controller";
import { loginRequired } from "utils/jwt";
import type { BojLoginCredentials, EmptyObject } from "types";
import cookieParser from "cookie-parser";

const bojScrapRouter = express.Router();
const bojScrapController = BojScrapController.getInstance();

bojScrapRouter.use(express.json());
bojScrapRouter.use(express.urlencoded({ extended: false }));
bojScrapRouter.use(cors());
bojScrapRouter.use(cookieParser());

// BOJ 로그인
bojScrapRouter.post<"/login", EmptyObject, EmptyObject>(
	"/login",
	loginRequired,
	(req, res) => bojScrapController.login(req, res),
);

// bojScrapRouter.get("/problem/:taskId", (req, res) =>
// 	bojScrapController.getProblem(req, res),
// );

// bojScrapRouter.get("/user/:taskId", (req, res) =>
// 	bojScrapController.getUser(req, res),
// );

bojScrapRouter.post<
	"/attendance",
	EmptyObject,
	EmptyObject,
	{ taskId: number }
>("/attendance", loginRequired, (req, res) =>
	bojScrapController.getAttendance(req, res),
);

export default bojScrapRouter;
