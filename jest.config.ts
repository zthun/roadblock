import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from './tsconfig.json';

export default {
  rootDir: compilerOptions.baseUrl,
  testTimeout: 60000,
  testRegex: '.spec.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  coverageDirectory: '../reports/coverage'
};
