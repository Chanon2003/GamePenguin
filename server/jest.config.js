/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',          // บอก Jest ให้ใช้ ts-jest แปลง TS -> JS
  testEnvironment: 'node',     // ใช้ Node environment
  testMatch: ['**/tests/**/*.test.ts'], // บอกไฟล์ test
  moduleFileExtensions: ['ts','js','json','node'], 
};
