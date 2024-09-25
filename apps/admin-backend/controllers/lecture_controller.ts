import type { Request, Response } from "express";
import LectureRepository from "repositories/lecture_repository";
import TaskRepository from "repositories/task_repository";
import SemesterRepository from "repositories/semester_repository";
import type { Lecture, Prisma, Semester } from "@prisma/client";
import type { EmptyObject, LectureInput, SemesterQuery } from "types";

const DEFAULT_PRACTICE_ID = 1;
const DEFAULT_MIN_SOLVE_COUNT = 1;

class LectureController {
	private static instance: LectureController;

	private constructor() {}

	public static getInstance(): LectureController {
		if (!LectureController.instance) {
			LectureController.instance = new LectureController();
		}
		return LectureController.instance;
	}

	public async getLectures(
		req: Request<EmptyObject, EmptyObject, EmptyObject, SemesterQuery>,
		res: Response,
	): Promise<void> {
		const year = Number.parseInt(req.query.year);
		const season = req.query.season;
		if (!year || !season) {
			res.status(400).send("year, season query required");
			return;
		}
		try {
			const lectures = await LectureRepository.findLecturesWithTasksBySemester(
				year,
				season,
			);
			res.json(lectures);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async getLectureById(
		req: Request<{ id: string }>,
		res: Response,
	): Promise<void> {
		const lectureId = Number.parseInt(req.params.id);
		try {
			const lecture = await LectureRepository.findLectureById(lectureId);
			res.json(lecture);
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
	}

	public async createLecture(
		req: Request<EmptyObject, EmptyObject, LectureInput>,
		res: Response,
	): Promise<void> {
		try {
			const { year, season, ...lectureData } = req.body;
			const semester = await SemesterRepository.findSemesterBySeason({
				year: Number.parseInt(year),
				season: season,
			});

			if (!semester) {
				res.status(400).send("Semester not found");
				return;
			}

			const newLecture = await LectureRepository.createLecture(
				semester.id,
				lectureData,
			);

			const tasks = Array.from(
				{ length: lectureData.lectureNumber },
				(_, i) => ({
					lectureId: newLecture.id,
					round: i + 1,
					practiceId: DEFAULT_PRACTICE_ID,
					minSolveCount: DEFAULT_MIN_SOLVE_COUNT,
				}),
			);

			await TaskRepository.createTasks(tasks);

			res.status(201).json({
				message: "Lecture and tasks created successfully",
				lecture: newLecture,
			});
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async updateLecture(
		req: Request<{ lectureId: string }, EmptyObject, Prisma.LectureUpdateInput>,
		res: Response,
	): Promise<void> {
		try {
			const lectureId = Number.parseInt(req.params.lectureId);
			const lecture = req.body;
			await LectureRepository.updateLecture(lectureId, lecture);
			res.status(200).send("update success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async deleteLecture(
		req: Request<{ lectureId: string }>,
		res: Response,
	): Promise<void> {
		try {
			const lectureId = Number.parseInt(req.params.lectureId);
			await LectureRepository.deleteLecture(lectureId);
			res.status(200).send("lecture delete success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}
}

export default LectureController;
