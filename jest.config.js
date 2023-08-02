module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
