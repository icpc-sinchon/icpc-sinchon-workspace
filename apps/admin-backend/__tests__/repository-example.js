import util from "node:util";
import { exec } from "node:child_process";

import {
	expect,
	it,
	describe,
	beforeAll,
	afterAll,
	afterEach,
	vi,
} from "vitest";

import { MySqlContainer } from "@testcontainers/mysql";

import StudentRepository from "../repositories/student_repository.js";

const execAsync = util.promisify(exec);

describe("StudentRepository", () => {
	// TestContainer를 사용하는 경우, 테스트 실행 시간이 30초 이상 소요될 수 있습니다.
	// 따라서, 타임아웃 기본값을 충분히 늘리는 것을 권장합니다.
	vi.setConfig({ testTimeout: 600_000, hookTimeout: 600_000 });
	let mysqlContainer = null;

	beforeAll(async () => {
		mysqlContainer = await new MySqlContainer().start();
		const databaseUrl = `mysql://${mysqlContainer.getUsername()}:${mysqlContainer.getUserPassword()}@${mysqlContainer.getHost()}:${mysqlContainer.getPort()}/${mysqlContainer.getDatabase()}`;

		vi.stubEnv("DATABASE_URL", databaseUrl);

		await execAsync(
			`DATABASE_URL=${databaseUrl} npx prisma migrate reset --force && npx prisma db pull`,
		);
	});

	afterAll(async () => {
		mysqlContainer?.stop();
	});

	it("creates student", async () => {
		expect(
			await StudentRepository.createStudent({
				boj_handle: "JohnDoe",
				school: "240",
				email: "me@acme.org",
				phone: "01000001111",
			}),
		).toMatchObject({ boj_handle: "JohnDoe", email: "me@acme.org" });
	});

	it("finds student by id", async () => {
		const student = await StudentRepository.createStudent({
			boj_handle: "JohnDoe",
			school: "240",
			email: "me@acme.org",
			phone: "01000001111",
		});
		expect(await StudentRepository.findStudentById(student.id)).toMatchObject({
			boj_handle: "JohnDoe",
			email: "me@acme.org",
		});
	});

	it("finds all students", async () => {
		await StudentRepository.createStudent({
			boj_handle: "JohnDoe",
			school: "240",
			email: "me@acme.org",
			phone: "01000001111",
		});
		await StudentRepository.createStudent({
			boj_handle: "JaneDoe",
			school: "240",
			email: "me@acme.org",
			phone: "01000001111",
		});

		const students = await StudentRepository.allStudents();
		expect(students).toHaveLength(2);
	});

	afterEach(async () => {
		await StudentRepository.reset();
	});
});
