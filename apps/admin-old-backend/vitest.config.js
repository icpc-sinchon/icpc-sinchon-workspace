import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["__tests__/**/*.test.(ts)"],
		globalSetup: ["prisma/seed-test.ts"],
		fileParallelism: false,
	},
});
