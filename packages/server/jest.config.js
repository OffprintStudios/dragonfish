module.exports = {
    name: 'server',
    preset: '../../jest.config.js',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    coverageDirectory: '../../coverage/packages/server',
};
