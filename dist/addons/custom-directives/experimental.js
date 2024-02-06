"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.EXPERIMENTAL_PRE_POST_TAG = exports.EXPERIMENTAL_DIRECTIVE_NAME = void 0;exports.experimentalDirective = experimentalDirective;var _utils = require("@graphql-tools/utils");

const EXPERIMENTAL_PRE_POST_TAG = '#EXPERIMENTAL#';exports.EXPERIMENTAL_PRE_POST_TAG = EXPERIMENTAL_PRE_POST_TAG;
const EXPERIMENTAL_DIRECTIVE_NAME = 'experimental';exports.EXPERIMENTAL_DIRECTIVE_NAME = EXPERIMENTAL_DIRECTIVE_NAME;
function experimentalDirective() {



  const supportedMapperKind = {
    SCALAR: _utils.MapperKind.SCALAR_TYPE,
    OBJECT: _utils.MapperKind.OBJECT_TYPE,
    FIELD_DEFINITION: _utils.MapperKind.OBJECT_FIELD,
    ARGUMENT_DEFINITION: _utils.MapperKind.ARGUMENT,
    INTERFACE: _utils.MapperKind.INTERFACE_TYPE,
    UNION: _utils.MapperKind.UNION_TYPE,
    ENUM: _utils.MapperKind.ENUM_TYPE,
    ENUM_VALUE: _utils.MapperKind.ENUM_VALUE,
    INPUT_OBJECT: _utils.MapperKind.INPUT_OBJECT_TYPE,
    INPUT_FIELD_DEFINITION: _utils.MapperKind.INPUT_OBJECT_FIELD,
    SCHEMA: _utils.MapperKind.ROOT_OBJECT
  };

  return {
    experimentalDirectiveTypeDefs: `directive @${EXPERIMENTAL_DIRECTIVE_NAME}(reason: String = "") on ${Object.keys(
      supportedMapperKind
    ).join(' | ')}`,

    experimentalDirectiveTransformer: (schema) =>
    (0, _utils.mapSchema)(
      schema,
      Object.values(supportedMapperKind).reduce(
        (prev, next) => ({
          ...prev,
          [next]: (x) => {var _getDirective;
            const experimentalDirective = (_getDirective = (0, _utils.getDirective)(
              schema,
              x,
              EXPERIMENTAL_DIRECTIVE_NAME
            )) === null || _getDirective === void 0 ? void 0 : _getDirective[0];
            if (experimentalDirective) {
              x.deprecationReason = `${EXPERIMENTAL_PRE_POST_TAG}${experimentalDirective['reason']}${EXPERIMENTAL_PRE_POST_TAG}`;
              return x;
            }
          }
        }),
        {}
      )
    )
  };
}