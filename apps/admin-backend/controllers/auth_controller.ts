import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { generateToken, verifyToken } from "utils/jwt";
import AdminRepository from "repositories/admin_repository";
import type { EmptyObject } from "types";

export type Admin = {
	username: string;
	password: string;
};

export interface AuthenticatedRequest extends Request {
	user?: {
		id: number;
		username: string;
	};
}

class AuthController {
	private static instance: AuthController;

	private constructor() {}

	public static getInstance(): AuthController {
		if (!AuthController.instance) {
			AuthController.instance = new AuthController();
		}
		return AuthController.instance;
	}

	public async register(
		req: Request<EmptyObject, EmptyObject, Admin>,
		res: Response,
	) {
		const { username, password } = req.body;
		try {
			const user = await AdminRepository.findAdminByUsername(username);
			if (user) {
				res
					.status(400)
					.json({ success: false, message: "User already exists" });
				return;
			}
			const hashedPassword = bcrypt.hashSync(password, 10);
			const newUser = await AdminRepository.createAdmin({
				username,
				password: hashedPassword,
			});
			res.json({ success: true, data: newUser });
		} catch (err) {
			console.error("Registration error:", err);
			res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	}

	public async login(
		req: Request<EmptyObject, EmptyObject, Admin>,
		res: Response,
	): Promise<void> {
		const { username, password } = req.body;
		try {
			const user = await AdminRepository.findAdminByUsername(username);
			if (!user) {
				res.status(401).json({ success: false, message: "User not found" });
				return;
			}
			const isMatch = bcrypt.compareSync(password, user.password);
			if (isMatch) {
				const payload = { id: user.id, username: user.username };
				const token = generateToken(payload);
				res.cookie("token", token, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					maxAge: 3600000,
				});
				res.json({ success: true, message: "Login successful", token });
			} else {
				res.status(401).json({ success: false, message: "Incorrect password" });
			}
		} catch (err) {
			console.error("Login error:", err);
			res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	}

	public async logout(req: Request, res: Response): Promise<void> {
		const token = req.cookies.token;
		if (!token) {
			res.status(400).json({ success: false, message: "No token provided" });
			return;
		}

		const decoded = verifyToken(token);
		if (!decoded) {
			res.status(401).json({ success: false, message: "Invalid token" });
			return;
		}

		res.clearCookie("token", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});
		res.json({ success: true, message: "Logout successful" });
	}

	public async check(req: AuthenticatedRequest, res: Response): Promise<void> {
		const decoded = verifyToken(req.cookies.token);
		if (!decoded) {
			res.status(401).json({ success: false, message: "Invalid token" });
			return;
		}

		res.json({
			isAuthenticated: true,
			user: {
				id: decoded.id,
				username: decoded.username,
			},
		});
	}

	public async reset(req: Request, res: Response): Promise<void> {
		try {
			await AdminRepository.reset();
			res.status(200).send("reset success");
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
	}
}

export default AuthController;
