import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

export default class Connection {
	prismaClient: PrismaClient;

	constructor() {
		const { env } = process;
		let url: string | undefined = "";
		if (env.NODE_ENV === "test") {
			url = process.env.DATABASE_URL;
			console.log({ url });
		} else {
			dotenv.config();
			if (env.NODE_ENV === "production") {
				console.log("it's a production");
				url = `mysql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
			} else if (env.NODE_ENV === "development") {
				console.log("it's a development");
				url = "";
			} else {
				console.log("err: no NODE_ENV");
				process.exit(1);
			}
		}

		this.prismaClient = new PrismaClient({ datasourceUrl: url });
	}
}
