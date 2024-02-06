"use strict";var _equal = _interopRequireDefault(require("./equal"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = function (value1, value2) {
  return !(0, _equal.default)(value1, value2);
};