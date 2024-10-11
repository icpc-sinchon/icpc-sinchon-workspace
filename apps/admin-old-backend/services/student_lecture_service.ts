import LectureRepository from "repositories/lecture_repository";
import StudentLectureLogRepository from "repositories/student_lecture_log_repository";
import StudentWithLectureRepository from "repositories/student_with_lecture_repository";
import type { Lecture, Prisma, Semester } from "@prisma/client";
import StudentService from "./student_service";
import type { LectureIdentifier, LectureQuery } from "types";

export default class StudentLectureService {
	private static instance: StudentLectureService;

	private studentService: StudentService;
	private lectureRepository: typeof LectureRepository;
	private studentLectureLogRepository: typeof StudentLectureLogRepository;
	private studentWithLectureRepository: typeof StudentWithLectureRepository;

	private constructor() {
		this.studentService = StudentService.getInstance();
		this.lectureRepository = LectureRepository;
		this.studentLectureLogRepository = StudentLectureLogRepository;
		this.studentWithLectureRepository = StudentWithLectureRepository;
	}

	public static getInstance(): StudentLectureService {
		if (!StudentLectureService.instance) {
			StudentLectureService.instance = new StudentLectureService();
		}
		return StudentLectureService.instance;
	}

	async createStudentWithLectureLog(
		studentData: Prisma.StudentCreateInput,
		lectureInfo: LectureIdentifier,
	) {
		// 학생이 이미 존재하는지 확인
		const existingStudent = await this.studentService.findStudentByBojHandle(
			studentData.bojHandle,
		);
		if (existingStudent) {
			throw new Error(
				`Student with boj handle ${studentData.bojHandle} already exists`,
			);
		}

		const { year, season, level } = lectureInfo;

		const lecture = await this.lectureRepository.findLectureBySemesterAndLevel(
			year,
			season,
			level,
		);

		if (!lecture) {
			throw new Error(`Lecture not found for ${year} ${season} ${level}`);
		}

		return this.studentWithLectureRepository.createStudentWithLectureLog(
			studentData,
			{ id: lecture.id },
		);
	}

	async createStudentsWithLectureLog(
		studentsData: Array<{
			student: Prisma.StudentCreateInput;
			lectureInfo: LectureIdentifier;
		}>,
	) {
		const studentsQuery = studentsData.map(({ student, lectureInfo }) => {
			return this.createStudentWithLectureLog(student, lectureInfo);
		});

		return Promise.all(studentsQuery);
	}

	// 현재 학기에 수강하고 있는 강의의 난이도를 배열로 가지는 학생 목록을 반환
	async findStudentsWithLectureLevelsBySemester(
		year: Semester["year"],
		season: Semester["season"],
	) {
		const studentsWithLectureLogs =
			await this.studentWithLectureRepository.findStudentsWithLectureLogBySemester(
				year,
				season,
			);

		const students = studentsWithLectureLogs.map((student) => {
			return {
				id: student.id,
				name: student.name,
				school: student.school,
				bojHandle: student.bojHandle,
				email: student.email,
				phone: student.phone,
				studentNumber: student.studentNumber,
				paymentStatus: student.paymentStatus,
				refundAccount: student.refundAccount,
				lectureLevels: student.studentLectureLog.map(
					(log) => log.lecture.level,
				),
			};
		});

		return students;
	}

	// studentID의 학생의 강의 로그를 업데이트
	// content에는 isInvited, isCancelled 등 log 데이터가 들어갈 수 있음
	async updateStudentLectureLogByStudentId(
		studentId: number,
		lectureData: LectureIdentifier,
		updateContent: Prisma.StudentLectureLogUpdateInput,
	) {
		const { year, season, level: lectureLevel } = lectureData;
		const lecture = await this.lectureRepository.findLectureBySemesterAndLevel(
			year,
			season,
			lectureLevel,
		);

		if (!lecture) {
			throw new Error("Lecture not found");
		}

		const studentLectureLog =
			await this.studentLectureLogRepository.findStudentLectureLogByLectureId(
				studentId,
				lecture.id,
			);

		if (!studentLectureLog) {
			throw new Error(
				`Student lecture log not found for student ${studentId} and lecture ${lecture.id}`,
			);
		}

		return this.studentLectureLogRepository.updateStudentLectureLog(
			studentLectureLog.id,
			updateContent,
		);
	}

	async updateLectureOfStudent(
		studentId: number,
		props: {
			year: number;
			season: Semester["season"];
			from: Lecture["level"];
			to: Lecture["level"];
			content?: Prisma.StudentLectureLogCreateInput;
		},
	) {
		const { year, season, from, to, content } = props;

		const [lectureFrom, lectureTo] = await Promise.all([
			this.lectureRepository.findLectureBySemesterAndLevel(year, season, from),
			this.lectureRepository.findLectureBySemesterAndLevel(year, season, to),
		]);

		if (!lectureFrom || !lectureTo) {
			throw new Error("Lecture not found");
		}

		const oldStudentLectureLog =
			await this.studentLectureLogRepository.findStudentLectureLogByLectureId(
				studentId,
				lectureFrom.id,
			);

		if (!oldStudentLectureLog) {
			throw new Error(
				`Student lecture log not found for student ${studentId} and lecture ${lectureFrom.id}`,
			);
		}

		await this.studentLectureLogRepository.updateStudentLectureLog(
			oldStudentLectureLog.id,
			{ isCancelled: true },
		);

		return this.studentLectureLogRepository.createStudentLectureLog(
			studentId,
			lectureTo.id,
			content || {},
		);
	}

	/**
	 * Deletes a student lecture log by student id
	 *
	 * @param {number} studentId
	 * @param {Object} props
	 * @returns {Promise<WeeklyAttendLog>}
	 */
	// 학생 강의를 취소하는 거고 로그를 삭제하는 건 아니니까 이름을 바꿔주는 게 좋을지도?
	async deleteStudentLectureLogByStudentId(
		studentId: number,
		props: LectureIdentifier,
	) {
		const { year, season, level: lectureLevel } = props;
		const lecture = await this.lectureRepository.findLectureBySemesterAndLevel(
			year,
			season,
			lectureLevel,
		);

		if (!lecture) {
			throw new Error("Lecture not found");
		}

		const studentLectureLog =
			await this.studentLectureLogRepository.findStudentLectureLogByLectureId(
				studentId,
				lecture.id,
			);

		if (!studentLectureLog) {
			throw new Error(
				`Student lecture log not found for student ${studentId} and lecture ${lecture.id}`,
			);
		}

		return this.studentLectureLogRepository.updateStudentLectureLog(
			studentLectureLog.id,
			{ isCancelled: true },
		);
	}

	/**
	 * Finds a student lecture log by student id
	 *
	 * @param {number} studentId
	 * @returns {Promise<studentLectureLog>}
	 */
	async findStudentLectureLogByStudentId(
		studentId: number,
		query: LectureIdentifier,
	) {
		const { year, season, level: lectureLevel } = query;
		const lecture = await this.lectureRepository.findLectureBySemesterAndLevel(
			year,
			season,
			lectureLevel,
		);

		if (!lecture) {
			throw new Error("Lecture not found");
		}

		return this.studentLectureLogRepository.findStudentLectureLogByLectureId(
			studentId,
			lecture.id,
		);
	}
}
