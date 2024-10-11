import express from "express";

// router
import studentRouter from "./student";
import semesterRouter from "./semester";
import lectureRouter from "./lecture";
import taskRouter from "./task";
import refundPolicyRouter from "./refund_policy";

// login
import authRouter from "./auth";
import bojScrapRouter from "./boj_scrap";
import studentAttendanceRouter from "./student_attendance";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());

// 여기엔 use만, 라우터 연결은 여기서
router.use("/auth", authRouter);

router.use("/student", studentRouter);
router.use("/student-attendance", studentAttendanceRouter);
router.use("/semester", semesterRouter);
router.use("/lecture", lectureRouter);
router.use("/task", taskRouter);
router.use("/refund", refundPolicyRouter);
router.use("/boj-scrap", bojScrapRouter);

export default router;
