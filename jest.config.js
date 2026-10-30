/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  setupFiles: ['./src/setup.ts'],
  testTimeout: 15000,
  verbose: true,
}
