"use strict";var _handlebars = _interopRequireDefault(require("handlebars"));
var _common = require("../../../lib/common");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}









module.exports = function (value, options) {
  value = value + '';
  const markdownOpts = {};
  if (options.hash) {
    markdownOpts.stripParagraph = options.hash.stripParagraph || false;
    markdownOpts.addClass = options.hash.addClass || false;
  }
  var html = (0, _common.markdown)(value, markdownOpts);
  return new _handlebars.default.SafeString(html);
};