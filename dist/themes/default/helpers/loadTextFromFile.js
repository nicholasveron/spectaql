"use strict";var _utils = require("../../../spectaql/utils");
var _interpolateReferences = _interopRequireDefault(require("./interpolateReferences"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = function (path, options) {var _options$hash;
  const text = (0, _utils.readTextFile)(path);
  if (options !== null && options !== void 0 && (_options$hash = options.hash) !== null && _options$hash !== void 0 && _options$hash.interpolateReferences) {
    return (0, _interpolateReferences.default)(text, options);
  }
  return text;
};