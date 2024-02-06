"use strict";var _htmlId = _interopRequireDefault(require("./htmlId"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

module.exports = function (reference, _options) {
  if (reference.startsWith('#definition-')) {
    return reference;
  }

  reference = reference.split('#/definitions/').pop();

  return `#definition-${(0, _htmlId.default)(reference)}`;
};