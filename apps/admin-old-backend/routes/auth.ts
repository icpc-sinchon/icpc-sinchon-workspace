import express from "express";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { generateToken, loginRequired, verifyToken } from "utils/jwt";
import AdminRepository from "repositories/admin_repository";
import AuthController, {
	type Admin,
	type AuthenticatedRequest,
} from "controllers/auth_controller";
import type { EmptyObject } from "types";

const authRouter = express.Router();

// TODO: 회원가입, 로그인, 로그아웃 API 테스트 구현
const authController = AuthController.getInstance();

// 회원가입: 로그인 요구
authRouter.post<EmptyObject, EmptyObject, Admin>(
	"/register",
	loginRequired,
	(req, res) => authController.register(req, res),
);
// 로그인: 로그인을 해야 하는 상황이므로 로그인 요구 없음
authRouter.post<EmptyObject, EmptyObject, Admin>("/login", (req, res) =>
	authController.login(req, res),
);
// 로그아웃: 로그인 요구
authRouter.post("/logout", loginRequired, (req, res) =>
	authController.logout(req, res),
);
// 로그인 상태 확인: 로그인 요구
// TODO: res 타입 체크?
authRouter.get("/check", loginRequired, (req: AuthenticatedRequest, res) =>
	authController.check(req, res),
);
// 초기화: 로그인 요구
authRouter.post("/reset", loginRequired, (req, res) =>
	authController.reset(req, res),
);

export default authRouter;
