import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  restoreMocks: true,
  resetMocks: true,
  clearMocks: true,
  rootDir: '.',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/src',
  }),
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testMatch: ['**/*.e2e.spec.ts', '**/*.controller.spec.ts'],
};
