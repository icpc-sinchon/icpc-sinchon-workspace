import LectureRepository from "repositories/lecture_repository";
import RefundPolicyService from "services/refund_policy_service";

import { type Lecture, Prisma, type Semester } from "@prisma/client";
import StudentRepository from "repositories/student_repository";
import type { StudentAttendance } from "types";
import StudentWithAttendRepository from "repositories/student_with_attend_repository";

const studentWithWeeklyAttendLog =
	Prisma.validator<Prisma.StudentDefaultArgs>()({
		select: {
			id: true,
			name: true,
			bojHandle: true,
			refundAccount: true,
			paymentStatus: true,
			weeklyAttendLog: {
				select: { round: true, lectureDone: true, taskDone: true },
			},
			studentLectureLog: {
				select: {
					lecture: { select: { id: true, level: true, lectureNumber: true } },
				},
			},
		},
	});

type StudentWithWeeklyAttendLog = Prisma.StudentGetPayload<
	typeof studentWithWeeklyAttendLog
>;

export default class StudentAttendService {
	private static instance: StudentAttendService;
	private lectureRepository: typeof LectureRepository;
	private studentWithAttendRepository: typeof StudentWithAttendRepository;
	private refundPolicyService: RefundPolicyService;

	private constructor() {
		this.lectureRepository = LectureRepository;
		this.studentWithAttendRepository = StudentWithAttendRepository;
		this.refundPolicyService = RefundPolicyService.getInstance();
	}

	public static getInstance(): StudentAttendService {
		if (!StudentAttendService.instance) {
			StudentAttendService.instance = new StudentAttendService();
		}
		return StudentAttendService.instance;
	}

	private mapAttendanceData(
		studentData: StudentWithWeeklyAttendLog,
		lectureNumber: number,
	): StudentAttendance {
		return {
			studentId: studentData.id,
			lectureId: studentData.studentLectureLog[0].lecture.id,
			name: studentData.name,
			bojHandle: studentData.bojHandle,
			refundAccount: studentData.refundAccount,
			paymentStatus: studentData.paymentStatus,
			attendLog: Array.from({ length: lectureNumber }, (_, index) => {
				const log = studentData.weeklyAttendLog.find(
					(log) => log.round === index + 1,
				);
				return log
					? {
							lectureDone: log.lectureDone,
							taskDone: log.taskDone,
							round: log.round,
						}
					: { lectureDone: false, taskDone: false, round: index + 1 };
			}),
		};
	}

	async findAllStudentsAttendLogs(
		year: Semester["year"],
		season: Semester["season"],
		lectureLevel: Lecture["level"],
	) {
		const lecture = await this.lectureRepository.findLectureBySemesterAndLevel(
			year,
			season,
			lectureLevel,
		);

		if (!lecture) {
			throw new Error(
				`Lecture not found for ${year} ${season} ${lectureLevel}`,
			);
		}

		const studentsWithLogs =
			await StudentWithAttendRepository.allStudentsWithAttendLogsInLecture(
				lecture.id,
			);

		const studentsAttendLogs = studentsWithLogs.map((student) =>
			this.mapAttendanceData(student, lecture.lectureNumber),
		);

		const refundPolicies =
			await this.refundPolicyService.findRefundPoliciesBySemesterId(
				lecture.semesterId,
			);
		const lectureRefundPolicies = refundPolicies.filter(
			(policy) => policy.type === "LECTURE",
		);
		const taskRefundPolicies = refundPolicies.filter(
			(policy) => policy.type === "TASK",
		);

		for (const studentsAttendLog of studentsAttendLogs) {
			studentsAttendLog.refundAmount =
				studentsAttendLog.paymentStatus === "PAID_30000"
					? 0
					: await this.refundPolicyService.calculateTotalRefundAmount(
							studentsAttendLog.attendLog,
							lectureRefundPolicies,
							taskRefundPolicies,
						);
		}

		return studentsAttendLogs;
	}

	async updateStudentAttendLogs(
		studentId: number,
		year: Semester["year"],
		season: Semester["season"],
		lectureLevel: Lecture["level"],
		attendLog: StudentAttendance["attendLog"],
	) {
		const student = await StudentRepository.findStudentById(studentId);
		if (!student) {
			throw new Error(`Student not found for studentId ${studentId}`);
		}

		const lecture = await this.lectureRepository.findLectureBySemesterAndLevel(
			year,
			season,
			lectureLevel,
		);
		if (!lecture) {
			throw new Error(
				`Lecture not found for ${year}-${season} ${lectureLevel}`,
			);
		}

		if (lecture.lectureNumber !== attendLog.length) {
			throw new Error("lectureNumber and attendLog length are different");
		}

		await StudentWithAttendRepository.upsertStudentAttendLogs(
			studentId,
			lecture.id,
			attendLog,
		);
	}

	// async findStudentAttendLogs(
	// 	studentId: number,
	// 	year: Semester["year"],
	// 	season: Semester["season"],
	// 	lectureLevel: Lecture["level"],
	// ) {
	// 	const lecture = await this.lectureRepository.findLectureBySemesterAndLevel(
	// 		year,
	// 		season,
	// 		lectureLevel,
	// 	);

	// 	if (!lecture) {
	// 		throw new Error(
	// 			`Lecture not found for ${year} ${season} ${lectureLevel}`,
	// 		);
	// 	}

	// 	const studentWithLogs =
	// 		await this.stu.findStudentWithWeeklyAttendLogs(
	// 			studentId,
	// 			year,
	// 			season,
	// 			lectureLevel,
	// 		);

	// 	if (!studentWithLogs) {
	// 		throw new Error(`Student logs not found for student ${studentId}`);
	// 	}

	// 	const studentsAttendLog = this.mapAttendanceData(
	// 		studentWithLogs,
	// 		lecture.lectureNumber,
	// 	);

	// 	const refundPolicies =
	// 		await this.refundPolicyService.findRefundPoliciesBySemesterId(
	// 			lecture.semesterId,
	// 		);
	// 	const lectureRefundPolicies = refundPolicies.filter(
	// 		(policy) => policy.type === "LECTURE",
	// 	);
	// 	const taskRefundPolicies = refundPolicies.filter(
	// 		(policy) => policy.type === "TASK",
	// 	);

	// 	studentsAttendLog.refundAmount =
	// 		await this.refundPolicyService.calculateTotalRefundAmount(
	// 			studentsAttendLog.attendLog,
	// 			lectureRefundPolicies,
	// 			taskRefundPolicies,
	// 		);

	// 	return studentsAttendLog;
	// }
}
