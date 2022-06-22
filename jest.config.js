module.exports = {
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(js|jsx)$',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.svg$': 'jest-svg-transformer',
        '^.+\\.scss$': 'jest-scss-transform',
    },
    setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
};
