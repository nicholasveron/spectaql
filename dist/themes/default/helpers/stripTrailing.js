"use strict";var _get = _interopRequireDefault(require("lodash/get"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


module.exports = function (string, trailer, options) {
  if (!(string && trailer)) {
    return string;
  }

  if ((0, _get.default)(options, 'hash.isRegex')) {
    return string.replace(new RegExp(`${trailer}$`), '');
  } else if (string.endsWith(trailer)) {
    return string.slice(0, trailer.length * -1);
  }

  return string;
};