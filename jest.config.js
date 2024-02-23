const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest");
require("dotenv").config({ path: ".env.test" });
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  setupFilesAfterEnv: ["<rootDir>/src/shared/infra/jest/jest.setup.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src",
  }),
  testMatch: ["**/*.spec.ts"],
  preset: "ts-jest",
};
