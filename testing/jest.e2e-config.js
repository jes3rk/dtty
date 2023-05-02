/* eslint-disable */
const config = require('../jest.config')

module.exports = {
  ...config,
  rootDir: './',
  testRegex: "\\.*\\.e2e-spec\\.ts$",
  setupFilesAfterEnv: ["../jest.setup.js"],
};
