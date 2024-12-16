/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.spec.ts"],
  coverageReporters: ["text", "lcov"],
};
