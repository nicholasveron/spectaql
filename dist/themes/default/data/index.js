"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _get = _interopRequireDefault(require("lodash/get"));
var _sortBy = _interopRequireDefault(require("lodash/sortBy"));
var _microfiber = require("microfiber");
var _experimental = require("../../../addons/custom-directives/experimental");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

({
  introspectionResponse,
  graphQLSchema: _graphQLSchema,
  allOptions: _allOptions,
  introspectionOptions
}) => {
  const introspectionManipulator = new _microfiber.Microfiber(
    introspectionResponse,
    introspectionOptions === null || introspectionOptions === void 0 ? void 0 : introspectionOptions.microfiberOptions
  );
  const queryType = introspectionManipulator.getQueryType();
  const mutationType = introspectionManipulator.getMutationType();
  const subscriptionType = introspectionManipulator.getSubscriptionType();
  const otherTypes = introspectionManipulator.getAllTypes({
    includeQuery: false,
    includeMutation: false,
    includeSubscription: false
  });

  const hasQueries = (0, _get.default)(queryType, 'fields.length');
  const hasMutations = (0, _get.default)(mutationType, 'fields.length');
  const hasQueriesOrMutations = hasQueries || hasMutations;
  const hasSubscriptions = (0, _get.default)(subscriptionType, 'fields.length');
  const hasOtherTypes = (0, _get.default)(otherTypes, 'length');

  return [
  hasQueriesOrMutations ?
  {
    name: 'Operations',
    hideInContent: true,
    items: [
    hasQueries ?
    {
      name: 'Queries',
      makeNavSection: true,
      makeContentSection: true,
      items: (0, _sortBy.default)(
        queryType.fields.map((query) => {
          let isExperimental = false;
          let isDeprecated = false;
          let deprecationReason = undefined;
          let experimentalReason = undefined;
          if (query !== null && query !== void 0 && query.deprecationReason) {
            isExperimental =
            query.deprecationReason.startsWith(
              _experimental.EXPERIMENTAL_PRE_POST_TAG
            ) &&
            query.deprecationReason.endsWith(
              _experimental.EXPERIMENTAL_PRE_POST_TAG
            );
            isDeprecated = query.isDeprecated && !isExperimental;
            deprecationReason = isDeprecated ?
            query.deprecationReason :
            undefined;
            experimentalReason = isExperimental ?
            query.deprecationReason.replaceAll(
              _experimental.EXPERIMENTAL_PRE_POST_TAG,
              ''
            ) :
            undefined;
          }
          return {
            ...query,
            isQuery: true,
            isExperimental,
            isDeprecated,
            deprecationReason,
            experimentalReason
          };
        }),
        'name'
      )
    } :
    null,
    hasMutations ?
    {
      name: 'Mutations',
      makeNavSection: true,
      makeContentSection: true,
      items: (0, _sortBy.default)(
        mutationType.fields.map((query) => {
          let isExperimental = false;
          let isDeprecated = false;
          let deprecationReason = undefined;
          let experimentalReason = undefined;
          if (query !== null && query !== void 0 && query.deprecationReason) {
            isExperimental =
            query.deprecationReason.startsWith(
              _experimental.EXPERIMENTAL_PRE_POST_TAG
            ) &&
            query.deprecationReason.endsWith(
              _experimental.EXPERIMENTAL_PRE_POST_TAG
            );
            isDeprecated = query.isDeprecated && !isExperimental;
            deprecationReason = isDeprecated ?
            query.deprecationReason :
            undefined;
            experimentalReason = isExperimental ?
            query.deprecationReason.replaceAll(
              _experimental.EXPERIMENTAL_PRE_POST_TAG,
              ''
            ) :
            undefined;
          }
          return {
            ...query,
            isMutation: true,
            isExperimental,
            isDeprecated,
            deprecationReason,
            experimentalReason
          };
        }),
        'name'
      )
    } :
    null,
    hasSubscriptions ?
    {
      name: 'Subscriptions',
      makeContentSection: true,
      items: (0, _sortBy.default)(
        subscriptionType.fields.map((type) => {
          let isExperimental = false;
          let isDeprecated = false;
          let deprecationReason = undefined;
          let experimentalReason = undefined;
          if (type !== null && type !== void 0 && type.deprecationReason) {
            isExperimental =
            type.deprecationReason.startsWith(
              _experimental.EXPERIMENTAL_PRE_POST_TAG
            ) &&
            type.deprecationReason.endsWith(
              _experimental.EXPERIMENTAL_PRE_POST_TAG
            );
            isDeprecated = type.isDeprecated && !isExperimental;
            deprecationReason = isDeprecated ?
            type.deprecationReason :
            undefined;
            experimentalReason = isExperimental ?
            type.deprecationReason :
            undefined;
          }
          return {
            ...type,
            isSubscription: true,
            isExperimental,
            isDeprecated,
            deprecationReason,
            experimentalReason
          };
        }),
        'name'
      )
    } :
    null]

  } :
  null,
  hasOtherTypes ?
  {
    name: 'Types',
    makeContentSection: true,
    items: (0, _sortBy.default)(
      otherTypes.map((type) => {
        let isExperimental = false;
        let isDeprecated = false;
        let deprecationReason = undefined;
        let experimentalReason = undefined;
        if (type !== null && type !== void 0 && type.deprecationReason) {
          isExperimental =
          type.deprecationReason.startsWith(
            _experimental.EXPERIMENTAL_PRE_POST_TAG
          ) &&
          type.deprecationReason.endsWith(_experimental.EXPERIMENTAL_PRE_POST_TAG);
          isDeprecated = type.isDeprecated && !isExperimental;
          deprecationReason = isDeprecated ?
          type.deprecationReason :
          undefined;
          experimentalReason = isExperimental ?
          type.deprecationReason :
          undefined;
        }
        return {
          ...type,
          isType: true,
          isExperimental,
          isDeprecated,
          deprecationReason,
          experimentalReason
        };
      }),
      'name'
    )
  } :
  null].
  filter(Boolean);
};exports.default = _default;