import type { Prisma, PrismaClient } from "@prisma/client";
import BaseRepository from "./base_repository";

export default class LectureRepository extends BaseRepository {
	static instance: PrismaClient;

	static async createLecture(
		semesterId: number,
		lectureData: Omit<Prisma.LectureCreateInput, "lectureSemester">,
	) {
		return LectureRepository.instance.lecture.create({
			data: {
				...lectureData,
				lectureSemester: {
					connect: { id: semesterId },
				},
			},
		});
	}

	static async updateLecture(id: number, props: Prisma.LectureUpdateInput) {
		return LectureRepository.instance.lecture.update({
			where: { id },
			data: props,
		});
	}

	static async deleteLecture(id: number) {
		return LectureRepository.instance.lecture.delete({
			where: { id },
		});
	}

	static async findLectureById(id: number) {
		return LectureRepository.instance.lecture.findUnique({ where: { id } });
	}

	// year, season으로 강의 찾기
	static async findLecturesBySemester(
		year: Prisma.SemesterWhereInput["year"],
		season: Prisma.SemesterWhereInput["season"],
	) {
		return await LectureRepository.instance.lecture.findMany({
			where: {
				lectureSemester: {
					year,
					season,
				},
			},
		});
	}

	// year, season, lectureLevel로 강의 찾기
	static async findLectureBySemesterAndLevel(
		year: Prisma.SemesterWhereInput["year"],
		season: Prisma.SemesterWhereInput["season"],
		lectureLevel: Prisma.LectureWhereInput["level"],
	) {
		return await LectureRepository.instance.lecture.findFirst({
			where: {
				lectureSemester: {
					year,
					season,
				},
				level: lectureLevel,
			},
		});
	}

	static async findLecturesWithTasksBySemester(
		year: Prisma.SemesterWhereInput["year"],
		season: Prisma.SemesterWhereInput["season"],
	) {
		return await LectureRepository.instance.lecture.findMany({
			where: {
				lectureSemester: {
					year,
					season,
				},
			},
			include: {
				task: {
					include: {
						problems: true,
					},
				},
			},
		});
	}

	static async allLectures() {
		return LectureRepository.instance.lecture.findMany();
	}

	static async reset() {
		return LectureRepository.instance.lecture.deleteMany();
	}
}
