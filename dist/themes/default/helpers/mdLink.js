"use strict";var _get = _interopRequireDefault(require("lodash/get"));
var _codify = _interopRequireDefault(require("./codify"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


module.exports = function (text, url, options) {
  if ((0, _get.default)(options, 'hash.codify') === true) {
    text = (0, _codify.default)(text);
  }

  return `[${text}](${url})`;
};