// BOJ의 특정 연습을 스크래핑한다
import type { Request, Response } from "express";
import puppeteer, { type Cookie } from "puppeteer";
import * as fs from "node:fs";
import axios from "axios";
import * as cheerio from "cheerio";
import BojService, { type BojAttendance } from "services/boj_service";
import type {
	EmptyObject,
	BojLoginCredentials as LoginCredentials,
} from "types";

type BojProblem = {
	problem_text: string;
	problem_num: number;
	problem_url: string;
};

type BojUser = {
	ranking: number;
	username: string;
	user_url: string;
	problems: BojUserProblem[];
};

type BojUserProblem = {
	problem_id: number;
	score: string;
	status: string;
};

class BojScrapController {
	private static instance: BojScrapController;
	private bojService: BojService;
	private cookies: Cookie[] = [];

	private constructor() {
		this.bojService = BojService.getInstance();
	}

	public static getInstance(): BojScrapController {
		if (!BojScrapController.instance) {
			BojScrapController.instance = new BojScrapController();
		}
		return BojScrapController.instance;
	}

	private getHeaders(): Record<string, string> {
		return {
			Cookie: this.cookies
				.map((cookie) => `${cookie.name}=${cookie.value}`)
				.join("; "),
			Accept: "application/json",
			"Accept-Encoding": "gzip, deflate, br",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
			Referer: "https://www.acmicpc.net/login",
			Connection: "keep-alive",
		};
	}

	private checkLoginStatus(): boolean {
		try {
			const cookiesFile = fs.readFileSync("cookies.json", "utf-8");
			const cookies: Cookie[] = JSON.parse(cookiesFile);

			const bojautologinCookie = cookies.find(
				(cookie) => cookie.name === "bojautologin",
			);
			if (!bojautologinCookie) return false;

			const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
			// 만료 시간이 현재 시간보다 크면 로그인 상태
			return bojautologinCookie.expires > currentTime;
		} catch (error) {
			console.error("Error checking login status:", error);
			return false;
		}
	}

	private async reLogin(): Promise<void> {
		const boj_id = process.env.SINCHON_BOJ_ID;
		const boj_pw = process.env.SINCHON_BOJ_PW;

		if (!boj_id || !boj_pw) {
			throw new Error("BOJ 계정이 서버에 등록되어 있지 않습니다.");
		}

		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox"],
		});
		try {
			const page = await browser.newPage();

			await page.setUserAgent(
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			);

			await page.goto("https://www.acmicpc.net/login");

			// Log the page content for debugging
			// console.log("Page content:", await page.content());

			await page.type('input[name="login_user_id"]', boj_id);
			await page.type('input[name="login_password"]', boj_pw);
			await page.click('input[name="auto_login"]');
			await Promise.all([
				page.click("#submit_button"),
				page.waitForNavigation({ waitUntil: "networkidle0" }),
			]);

			const cookies = await page.cookies();
			fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));

			console.log("Re-login success.");
		} catch (err) {
			console.error("Re-login error:", err);
			throw new Error("Re-login failed");
		} finally {
			await browser.close();
		}
	}

	public async login(
		req: Request<EmptyObject, EmptyObject>,
		res: Response,
	): Promise<void> {
		// BOJ 계정으로 로그인할 때 body를 받지 말고 그냥 백엔드에서 직접
		// 계정 정보를 넣어 줘도 될 듯?
		const boj_id = process.env.SINCHON_BOJ_ID;
		const boj_pw = process.env.SINCHON_BOJ_PW;

		if (!boj_id || !boj_pw) {
			res.status(500).send("BOJ 계정이 서버에 등록되어 있지 않습니다.");
			return;
		}

		// const browser = await puppeteer.launch({ headless: false });
		try {
			await this.reLogin();

			console.log("Login success.");
			res.send("Logged in and cookies saved.");
		} catch (err) {
			console.error("Login error:", err);
			res
				.status(500)
				.send(
					`Login failed: ${err instanceof Error ? err.message : "Unknown error"}`,
				);
		}
	}

	private async fetchPageContent(url: string): Promise<cheerio.CheerioAPI> {
		if (this.cookies.length === 0) {
			const cookiesFile = fs.readFileSync("cookies.json", "utf-8");
			this.cookies = JSON.parse(cookiesFile);
		}

		const response = await axios.get(url, { headers: this.getHeaders() });
		return cheerio.load(response.data);
	}

	public async getProblem(
		req: Request<{ taskId: string }>,
		res: Response,
	): Promise<void> {
		try {
			const taskId = Number.parseInt(req.params.taskId);
			const { groupId, practiceId } =
				await this.bojService.findGroupIdAndPracticeIdByTaskId(taskId);

			const $ = await this.fetchPageContent(
				`https://www.acmicpc.net/group/practice/view/${groupId}/${practiceId}`,
			);

			const problems: BojProblem[] = $("table > thead > tr > th > a")
				.map((_, element) => ({
					problem_text: $(element).text(),
					problem_num: Number.parseInt(element.attribs.href.split("/")[2], 10),
					problem_url: `https://acmicpc.net${element.attribs.href}`,
				}))
				.get();

			res.json(problems);
		} catch (err) {
			console.error("Scrap error:", err);
			res.status(500).send("Scrap failed.");
		}
	}

	public async getUser(
		req: Request<{ taskId: string }>,
		res: Response,
	): Promise<void> {
		const taskId = Number.parseInt(req.params.taskId);
		const { groupId, practiceId } =
			await this.bojService.findGroupIdAndPracticeIdByTaskId(taskId);

		try {
			const cookies: Cookie[] = JSON.parse(
				fs.readFileSync("cookies.json", "utf-8"),
			);

			const response = await axios.get(
				`https://www.acmicpc.net/group/practice/view/${groupId}/${practiceId}`,
				{
					headers: this.getHeaders(),
				},
			);

			const $ = cheerio.load(response.data);

			const users: BojUser[] = [];
			$("table > tbody > tr").each((_, tr) => {
				const user: BojUser = {
					ranking: 0,
					username: "",
					user_url: "",
					problems: [],
				};
				$(tr)
					.find("th")
					.each((index, th) => {
						if (index === 0) {
							user.ranking = Number.parseInt($(th).text());
						} else if (index === 1) {
							user.username = $(th).text();
							user.user_url = `https://acmicpc.net${$(th).find("a")[0].attribs.href}`;
						}
					});
				const problemCount = $(tr).find("td").length;
				$(tr)
					.find("td")
					.each((index, td) => {
						if (index < problemCount - 1) {
							const problem: BojUserProblem = {
								problem_id: index,
								score: $(td).text(),
								status: $(td).attr("class") || "notsubmitted",
							};
							user.problems.push(problem);
						}
					});
				users.push(user);
			});

			console.log(users);
			res.json(users);
		} catch (err) {
			console.error("Scrap error:", err);
			res.status(500).send("Scrap failed.");
		}
	}

	public async getAttendance(
		req: Request<EmptyObject, EmptyObject, { taskId: number }>,
		res: Response,
	): Promise<void> {
		try {
			const isBOJLoggedIn = this.checkLoginStatus();
			if (!isBOJLoggedIn) {
				console.log("BOJ login status is false. Re-login.");
				await this.reLogin();
			}

			const { taskId } = req.body;

			const { groupId, practiceId } =
				await this.bojService.findGroupIdAndPracticeIdByTaskId(taskId);

			const $ = await this.fetchPageContent(
				`https://www.acmicpc.net/group/practice/view/${groupId}/${practiceId}`,
			);

			const problems = $("table > thead > tr > th > a")
				.map((_, element) =>
					Number.parseInt(element.attribs.href.split("/")[2], 10),
				)
				.get();

			console.log("문제들: ", problems);

			const attendances: BojAttendance[] = $("table > tbody > tr")
				.map((_, tr) => {
					const $tr = $(tr);

					return {
						bojHandle: $tr.find("th").eq(1).text(),
						problems: $tr
							.find("td")
							.slice(0, -1)
							.map((index, td) =>
								$(td).attr("class") === "accepted" ? problems[index] : null,
							)
							.get()
							// type predicates
							.filter((id): id is number => id !== null),
					};
				})
				.get();

			const updateResult =
				await this.bojService.updateWeeklyAttendLogsByBojScrap(
					taskId,
					attendances,
				);
			console.log(updateResult);
			res.send(updateResult);
		} catch (err) {
			console.error("Scrap error:", err);
			res.status(500).send("Scrap failed.");
		}
	}
}

export default BojScrapController;
