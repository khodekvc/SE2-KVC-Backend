module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests/client'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};