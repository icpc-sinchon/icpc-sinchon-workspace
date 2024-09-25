import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

let client: PrismaClient;

let url: string;
const { env } = process;
if (env.NODE_ENV === "test") {
	console.log("it's a test");
	url = "mysql://root:icpc-sinchon.io@localhost:3306/attendance_db_test";
} else if (env.NODE_ENV === "production") {
	console.log("it's a production");
	url = `mysql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
	console.log(url);
} else if (env.NODE_ENV === "development") {
	console.log("it's a development");
	url = "";
} else {
	console.log("err: no NODE_ENV");
	process.exit(1);
}

try {
	client = new PrismaClient({
		datasourceUrl: url,
	});
	console.log("Prisma 클라이언트 초기화 성공");
} catch (error) {
	console.error("Prisma 클라이언트 초기화 에러:", error);
	process.exit(1);
}

export default client;
