module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/integration/setup.cjs'],
    testMatch: ['**/src/tests/**/*.test.js'],
    moduleFileExtensions: ['js', 'json', 'node'],
};