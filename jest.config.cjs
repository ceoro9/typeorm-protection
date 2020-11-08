const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/tests/**/*.{js,ts}",
    "<rootDir>/src/**/?(*.)+(spec|test).{js,ts}",
  ],
  setupFiles: ["./jest.setup.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>` }),
  // coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,js}",
  ],
  coverageDirectory: "coverage/",
};
