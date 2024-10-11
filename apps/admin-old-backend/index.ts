import app from "./app";
import dotenv from "dotenv";
import { startBot } from "./discord/bot";

dotenv.config();

const port = process.env.DEV_PORT || 8080;

app.listen(port, () => {
	startBot();
	console.log(`SERVER 실행됨 ${port}`);
});
