import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  restoreMocks: true,
  resetMocks: true,
  clearMocks: true,
  rootDir: '.',
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '\\.(module|spec|test|mock)\\.ts$',
    '/node_modules/',
    '/src/settings/',
    '/src/app.module.ts$',
    '/src/app.ts$',
    '/src/main.ts$',
  ],
  coverageReporters: ['json', 'lcov', 'text'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 65,
      functions: 60,
      branches: 60,
      lines: 70,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/src',
  }),
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testMatch: ['**/*.spec.ts', '!**/*.e2e.spec.ts', '!**/*.controller.spec.ts'],
};
