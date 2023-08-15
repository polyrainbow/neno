/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  "preset": "ts-jest/presets/default-esm",
  "moduleFileExtensions": ["ts", "tsx", "js"],
  "transform": { "\\.[jt]sx?$": ["ts-jest", { useESM: true }] },
  "moduleNameMapper": {
    "^(.+)\\.js$": "$1",
    "^(.+)\\.js\\?(.+)$": "$1",
  },
  "extensionsToTreatAsEsm": [".ts"],
  "modulePathIgnorePatterns": ["<rootDir>/dist/", "<rootDir>/tests/"],
};
