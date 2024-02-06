"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = loadYaml;var _fs = _interopRequireDefault(require("fs"));
var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _interpolation = require("./interpolation");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function loadYaml(path) {
  const fileContent = _fs.default.readFileSync(path, 'utf8');
  const loadedYaml = _jsYaml.default.load(fileContent);
  return (0, _interpolation.substituteEnvOnObject)(loadedYaml);
}