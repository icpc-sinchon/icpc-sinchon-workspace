import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import StudentLectureLogRepository from "repositories/student_lecture_log_repository";
import StudentRepository from "repositories/student_repository";
import SemesterRepository from "repositories/semester_repository";
import LectureRepository from "repositories/lecture_repository";
import { LECTURE, SEMESTER, STUDENT } from "../mock";
import StudentWithAttendRepository from "repositories/student_with_attend_repository";
import WeeklyAttendLogRepository from "repositories/weekly_attend_log_repository";
import StudentWithLectureRepository from "repositories/student_with_lecture_repository";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("StudentWithLectureRepository", () => {
	beforeEach(async () => {
		await StudentRepository.reset();
		await SemesterRepository.reset();
		await LectureRepository.reset();
	});

	const { id, semesterId, ...lectureData } = LECTURE[0];
	const { id: id2, semesterId: semesterId2, ...lectureData2 } = LECTURE[1];

	it("creates student with lecture log", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		const student =
			await StudentWithLectureRepository.createStudentWithLectureLog(
				STUDENT[0],
				{ id: lecture.id },
			);

		expect(student).toMatchObject(STUDENT[0]);
	});

	it("finds students with lecture log by semester", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const lecture = await LectureRepository.createLecture(
			semester.id,
			lectureData,
		);

		await StudentWithLectureRepository.createStudentWithLectureLog(STUDENT[0], {
			id: lecture.id,
		});
		await StudentWithLectureRepository.createStudentWithLectureLog(STUDENT[1], {
			id: lecture.id,
		});

		const students =
			await StudentWithLectureRepository.findStudentsWithLectureLogBySemester(
				semester.year,
				semester.season,
			);

		expect(students).toHaveLength(2);
		expect(students[0].studentLectureLog).toHaveLength(1);
		expect(students[1].studentLectureLog).toHaveLength(1);
		expect(
			students[0].studentLectureLog[0].lecture.lectureSemester,
		).toMatchObject(semester);
		expect(
			students[1].studentLectureLog[0].lecture.lectureSemester,
		).toMatchObject(semester);
	});

	it("finds students with lecture log by semester and lecture level", async () => {
		const semester = await SemesterRepository.createSemester(SEMESTER[0]);
		const noviceLecture = await LectureRepository.createLecture(semester.id, {
			...lectureData,
			level: "Novice",
		});
		const intermediateLecture = await LectureRepository.createLecture(
			semester.id,
			{ ...lectureData, level: "Intermediate" },
		);

		await StudentWithLectureRepository.createStudentWithLectureLog(STUDENT[0], {
			id: noviceLecture.id,
		});
		await StudentWithLectureRepository.createStudentWithLectureLog(STUDENT[1], {
			id: intermediateLecture.id,
		});

		const noviceStudents =
			await StudentWithLectureRepository.findStudentsWithLectureLogBySemesterAndLectureLevel(
				semester.year,
				semester.season,
				"Novice",
			);

		expect(noviceStudents).toHaveLength(1);
		expect(noviceStudents[0].studentLectureLog[0].lecture.level).toBe("Novice");

		const intermediateStudents =
			await StudentWithLectureRepository.findStudentsWithLectureLogBySemesterAndLectureLevel(
				semester.year,
				semester.season,
				"Intermediate",
			);

		expect(intermediateStudents).toHaveLength(1);
		expect(intermediateStudents[0].studentLectureLog[0].lecture.level).toBe(
			"Intermediate",
		);
	});

	it("retrieves all students with lecture logs", async () => {
		const semester1 = await SemesterRepository.createSemester(SEMESTER[0]);
		const semester2 = await SemesterRepository.createSemester(SEMESTER[1]);
		const lecture1 = await LectureRepository.createLecture(
			semester1.id,
			lectureData,
		);
		const lecture2 = await LectureRepository.createLecture(
			semester2.id,
			lectureData2,
		);

		await StudentWithLectureRepository.createStudentWithLectureLog(STUDENT[0], {
			id: lecture1.id,
		});
		await StudentWithLectureRepository.createStudentWithLectureLog(STUDENT[1], {
			id: lecture2.id,
		});

		const allStudents =
			await StudentWithLectureRepository.allStudentsWithLectureLogs();

		expect(allStudents).toHaveLength(2);
		expect(allStudents[0].studentLectureLog).toHaveLength(1);
		expect(allStudents[1].studentLectureLog).toHaveLength(1);
		expect(
			allStudents[0].studentLectureLog[0].lecture.lectureSemester,
		).toMatchObject(semester1);
		expect(
			allStudents[1].studentLectureLog[0].lecture.lectureSemester,
		).toMatchObject(semester2);
	});
});
