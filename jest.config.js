module.exports = {
  "testEnvironment": "jsdom",
    "roots": [
      "<rootDir>",
      "<rootDir>/src"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "modulePaths": ["node_modules","<rootDir>"],
  }