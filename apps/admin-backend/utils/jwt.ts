import jwt, {
	type SignOptions,
	type JwtPayload,
	type VerifyOptions,
} from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "controllers/auth_controller";

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
	throw new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
}

const TOKEN_EXPIRATION = "12h";
const ALGORITHM = "HS256";
const TOKEN_REFRESH_THRESHOLD = 600; // 10분

interface TokenPayload extends JwtPayload {
	id: number;
	username: string;
}

// req.currentUserId를 사용할 수 있도록 Express의 Request 인터페이스를 확장
declare global {
	namespace Express {
		interface Request {
			currentUserId?: string;
		}
	}
}

// 새로운 토큰을 생성하는 함수
export const generateToken = (payload: TokenPayload) => {
	const options: SignOptions = {
		expiresIn: TOKEN_EXPIRATION,
		algorithm: ALGORITHM,
	};
	const token = jwt.sign(payload, secretKey, options);
	return token;
};

export const verifyToken = (token: string): TokenPayload | null => {
	try {
		const options: VerifyOptions = {
			algorithms: [ALGORITHM],
		};
		return jwt.verify(token, secretKey, options) as TokenPayload;
	} catch (error) {
		return null;
	}
};

// 기존 토큰을 사용하여 새로운 토큰을 생성하는 함수
export const refreshToken = (token: string): string | null => {
	try {
		const decoded = verifyToken(token);
		if (!decoded) return null;
		const payload: TokenPayload = {
			id: decoded.id,
			username: decoded.username,
		};
		const newToken = generateToken(payload);
		return newToken;
	} catch (error) {
		console.error("Error refreshing token:", error);
		return null;
	}
};

function extractToken(req: AuthenticatedRequest): string | null {
	const headerToken = req.headers.authorization?.split(" ")[1];
	const cookieToken = req.cookies.token;
	return headerToken || cookieToken || null;
}

export function checkAndRefreshToken(token: string, res: Response) {
	const decoded = verifyToken(token);

	if (!decoded) {
		return { isValid: false, user: null };
	}

	const user = {
		id: decoded.id,
		username: decoded.username,
	};
}

// 로그인이 필요한 api 요청 시
export function loginRequired(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	// 헤더에서 토큰 가져오기
	try {
		const token = extractToken(req);

		// 토큰이 없을 경우
		if (!token) {
			console.log("Authorization 토큰 없음");
			res.status(401).json({
				result: "forbidden-approach",
				message: "Log in required",
			});
			return;
		}

		// 해당 토큰이 정상적인 토큰인지 확인
		const jwtDecoded = verifyToken(token);

		if (!jwtDecoded) {
			res.status(401).json({
				result: "forbidden-approach",
				message: "Invalid token",
			});
			return;
		}

		req.currentUserId = jwtDecoded.id.toString();
		// 만료 시간이 10분 이내일 경우 토큰 갱신
		if (jwtDecoded.exp && jwtDecoded.exp - Date.now() / 1000 < 600) {
			const newToken = refreshToken(token);
			if (newToken) {
				res.cookie("token", newToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					maxAge: 3600000,
				});
			}
		}

		next();
	} catch (error) {
		console.error("Error in loginRequired middleware:", error);
		res.status(500).json({
			result: "error",
			message: error instanceof Error ? error.message : "Internal server error",
		});
	}
}
