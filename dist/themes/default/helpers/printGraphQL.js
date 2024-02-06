"use strict";var _handlebars = _interopRequireDefault(require("handlebars"));
var _common = require("../../../lib/common");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = function (value, _options) {
  if (!value) {
    return '';
  }
  const html = (0, _common.printSchema)(value);
  return new _handlebars.default.SafeString(html);
};