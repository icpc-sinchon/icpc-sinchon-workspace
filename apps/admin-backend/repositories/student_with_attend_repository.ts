import type { StudentAttendance } from "types";
import BaseRepository from "./base_repository";
import type { Student, PrismaClient } from "@prisma/client";

export default class StudentWithAttendRepository extends BaseRepository {
	static instance: PrismaClient;

	// 학생의 BOJ 핸들을 이용해 해당 학생의 출석 로그까지 포함해서 가져온다
	static async findStudentWithAttendLogByBojHandle(
		bojHandle: Student["bojHandle"],
	) {
		return StudentWithAttendRepository.instance.student.findUnique({
			where: { bojHandle },
			include: { weeklyAttendLog: true },
		});
	}

	// student ID, lecture ID로 해당 학생의 출석 로그를 가져온다
	// 이때 해당 학생이 해당 강의를 듣는 경우에 한해서만 가져온다
	static async findStudentsWithAttendLogsInLecture(
		studentId: number,
		lectureId: number,
	) {
		return StudentWithAttendRepository.instance.student.findUnique({
			select: {
				id: true,
				name: true,
				bojHandle: true,
				studentLectureLog: {
					where: {
						isCancelled: false,
						lecture: {
							id: lectureId,
						},
					},
					select: {
						lecture: {
							select: {
								id: true,
								level: true,
							},
						},
					},
				},
				weeklyAttendLog: {
					where: {
						lecture: {
							id: lectureId,
						},
					},
					select: {
						round: true,
						lectureDone: true,
						taskDone: true,
					},
				},
			},
			// 해당 강의를 듣는 student만 가져온다
			where: {
				id: studentId,
				studentLectureLog: {
					some: {
						lecture: {
							id: lectureId,
						},
					},
				},
			},
		});
	}

	static async allStudentsWithAttendLogsInLecture(lectureId: number) {
		// 출석 내역이 없는 회차는 false가 되도록 하는 로직은 service에서
		return StudentWithAttendRepository.instance.student.findMany({
			select: {
				id: true,
				name: true,
				bojHandle: true,
				refundAccount: true,
				paymentStatus: true,
				studentLectureLog: {
					where: {
						isCancelled: false,
						lecture: {
							id: lectureId,
						},
					},
					select: {
						lecture: {
							select: {
								id: true,
								level: true,
								lectureNumber: true,
							},
						},
					},
				},
				weeklyAttendLog: {
					where: {
						lecture: {
							id: lectureId,
						},
					},
					select: {
						round: true,
						lectureDone: true,
						taskDone: true,
					},
				},
			},
			// 해당 강의를 듣는 student만 가져온다
			where: {
				studentLectureLog: {
					some: {
						lecture: {
							id: lectureId,
						},
					},
				},
			},
		});
	}

	// bojHandles에 있는 학생들을 찾아서 lectureId, round에 해당하는 출석 로그를 newLog로 일괄 업데이트한다
	static async upsertStudentWeeklyAttendLogsByBojHandlesAndLectureIdAndRound(
		studentBojHandles: string[],
		lectureId: number,
		round: number,
		newLog: { lectureDone?: boolean; taskDone?: boolean },
	) {
		return StudentWithAttendRepository.instance.$transaction(async (prisma) => {
			// 학생 명단에 있으며 해당 강의를 듣는 학생들만 가져온다
			const students = await prisma.student.findMany({
				where: {
					bojHandle: { in: studentBojHandles },
					studentLectureLog: {
						some: {
							lectureId,
						},
					},
				},
				select: {
					id: true,
					bojHandle: true,
				},
			});

			const upsertPromises = students.map((student) => {
				return prisma.weeklyAttendLog.upsert({
					where: {
						studentId_lectureId_round: {
							studentId: student.id,
							lectureId,
							round,
						},
					},
					update: newLog,
					create: {
						studentId: student.id,
						lectureId,
						round,
						...newLog,
					},
				});
			});

			return Promise.allSettled(upsertPromises);
		});
	}

	static async upsertStudentAttendLogs(
		studentId: number,
		lectureId: number,
		attendLog: StudentAttendance["attendLog"],
	) {
		const weeklyAttendLogUpsertPromises = attendLog.map((log) => {
			return StudentWithAttendRepository.instance.weeklyAttendLog.upsert({
				where: {
					studentId_lectureId_round: {
						studentId,
						lectureId,
						round: log.round,
					},
				},
				update: log,
				create: {
					studentId,
					round: log.round,
					lectureId,
					lectureDone: log.lectureDone,
					taskDone: log.taskDone,
				},
			});
		});
		return Promise.all(weeklyAttendLogUpsertPromises);
	}
}
