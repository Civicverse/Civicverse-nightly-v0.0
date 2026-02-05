{
  "preset": "ts-jest",
  "testEnvironment": "jsdom",
  "roots": ["<rootDir>/src"],
  "testMatch": ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json"],
  "collectCoverageFrom": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/*.d.ts",
    "!src/__tests__/**"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 50,
      "functions": 50,
      "lines": 50,
      "statements": 50
    }
  },
  "setupFilesAfterEnv": ["<rootDir>/src/__tests__/setup.ts"],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  }
}
