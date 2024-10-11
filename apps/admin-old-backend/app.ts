import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import router from "./routes/route";

// import swaggerUi from "swagger-ui-express";
// import swaggerFile from "./swagger/swagger-output.json" with { type: "json" };

dotenv.config();

const app = express();

// Automatically parse request body as form data.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(passport.initialize());

// app.use("/", router);
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;
