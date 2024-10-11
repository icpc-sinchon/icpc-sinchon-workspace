// const app = require("../../src/app");
import { expect, it, describe } from "vitest";
import { powersOfTwo } from "utils/samples";

describe("Sample Test", () => {
	it("1 + 1 = 2", () => {
		expect(1 + 1).toBe(2);
	});

	it("2 + 1 = 3", () => {
		expect(2 + 1).toBe(3);
	});
});

describe("Basic Tests", () => {
	it("Testing for fixed tests", () => {
		expect(powersOfTwo(0)).toEqual([1]);
		expect(powersOfTwo(1)).toEqual([1, 2]);
		expect(powersOfTwo(4)).toEqual([1, 2, 4, 8, 16]);
	});
});
