import type { Request, Response } from "express";
import SemesterRepository from "repositories/semester_repository";
import type { Prisma } from "@prisma/client";
import type { EmptyObject } from "types";

class SemesterController {
	private static instance: SemesterController;

	private constructor() {}

	public static getInstance(): SemesterController {
		if (!SemesterController.instance) {
			SemesterController.instance = new SemesterController();
		}
		return SemesterController.instance;
	}

	public async getAllSemesters(_req: Request, res: Response): Promise<void> {
		try {
			const semesters = await SemesterRepository.allSemesters();
			res.json(semesters);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async getSemesterById(
		req: Request<{ id: string }>,
		res: Response,
	): Promise<void> {
		const semesterId = Number.parseInt(req.params.id);
		try {
			const semester = await SemesterRepository.findSemesterById(semesterId);
			res.json(semester);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async createSemester(
		req: Request<EmptyObject, EmptyObject, Prisma.SemesterCreateInput>,
		res: Response,
	): Promise<void> {
		try {
			const semester = req.body;
			await SemesterRepository.createSemester(semester);
			res.status(200).send("add success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}
}

export default SemesterController;
