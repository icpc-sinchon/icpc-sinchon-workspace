import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

dotenv.config();

const doc = {
	info: {
		title: "Sinchon API",
		description: "어쩌구저쩌구",
	},
	host: `${process.env.DB_HOST}:${process.env.DEV_PORT}`,
};

const outputFile = "./swagger-output.json";
const routes = ["../routes/routes.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
