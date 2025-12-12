import { createDefaultPreset } from 'ts-jest'; 

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  testEnvironment: 'node',

  ...createDefaultPreset(), 
  
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true, 
      },
    ],
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;