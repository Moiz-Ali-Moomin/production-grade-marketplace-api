module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    clearMocks: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.types.ts', '!src/**/*.schema.ts'],
    coverageDirectory: 'coverage',
};
