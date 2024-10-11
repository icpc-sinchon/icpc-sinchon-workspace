import type { StudentAttendance } from "types";
import BaseRepository from "./base_repository";
import type { Prisma, Semester, Student, PrismaClient } from "@prisma/client";
import LectureRepository from "./lecture_repository";

export default class StudentWithLectureRepository extends BaseRepository {
	static instance: PrismaClient;

	// lectureData로는 lecture를 유일하게 식별 가능한
	// lectureId 또는 semesterId + level을 받는다
	// 받은 데이터로 student와 lecture log를 생성한다
	static async createStudentWithLectureLog(
		studentData: Prisma.StudentCreateInput,
		lectureData: Prisma.LectureWhereUniqueInput,
	) {
		return StudentWithLectureRepository.instance.student.create({
			data: {
				...studentData,
				studentLectureLog: {
					create: {
						isCancelled: false,
						// 초대 여부는 기본 false로 설정
						// 언젠가 초대 기능도 만들어야...
						isInvited: false,
						lecture: {
							connect: lectureData,
						},
					},
				},
			},
		});
	}

	// 이번 학기에 강의를 듣는 학생들을 lecture log까지 다 가져온다
	// lecture isCancelled가 false인 것(강의 취소 X)만 가져온다
	static async findStudentsWithLectureLogBySemester(
		year: Semester["year"],
		season: Semester["season"],
	) {
		const studentsInSemester =
			await StudentWithLectureRepository.instance.student.findMany({
				where: {
					studentLectureLog: {
						some: {
							lecture: {
								lectureSemester: {
									year: year,
									season: season,
								},
							},
							isCancelled: false,
						},
					},
				},
				include: {
					studentLectureLog: {
						where: {
							isCancelled: false,
							lecture: {
								lectureSemester: {
									year: year,
									season: season,
								},
							},
						},
						include: {
							lecture: {
								include: {
									lectureSemester: true,
								},
							},
						},
					},
				},
			});

		return studentsInSemester;
	}

	static async findStudentsWithLectureLogBySemesterAndLectureLevel(
		year: Semester["year"],
		season: Semester["season"],
		lectureLevel: Prisma.LectureWhereInput["level"],
	) {
		const studentsInSemester =
			await StudentWithLectureRepository.instance.student.findMany({
				where: {
					studentLectureLog: {
						some: {
							lecture: {
								lectureSemester: {
									year: year,
									season: season,
								},
								level: lectureLevel,
							},
						},
					},
				},
				include: {
					studentLectureLog: {
						where: {
							lecture: {
								lectureSemester: {
									year: year,
									season: season,
								},
								level: lectureLevel,
							},
							isCancelled: false,
						},
						include: {
							lecture: {
								include: {
									lectureSemester: true,
								},
							},
						},
					},
				},
			});
		return studentsInSemester;
	}

	static async allStudentsWithLectureLogs() {
		return StudentWithLectureRepository.instance.student.findMany({
			include: {
				studentLectureLog: {
					include: {
						lecture: {
							include: {
								lectureSemester: true,
							},
						},
					},
				},
			},
		});
	}
}
