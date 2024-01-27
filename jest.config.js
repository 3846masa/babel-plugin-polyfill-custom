/** @type {import('jest').Config} */
const config = {
  extensionsToTreatAsEsm: ['.ts'],
  injectGlobals: false,
  roots: ['./src'],
  testMatch: ['**/__tests__/*.spec.ts'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
};

module.exports = config;
