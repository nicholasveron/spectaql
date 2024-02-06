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

  const parseExperimentalFromDeprecation = (type, args = {}) => {
    let isExperimental = false;
    let isDeprecated = false;
    let deprecationReason = undefined;
    let experimentalReason = undefined;
    if (type !== null && type !== void 0 && type.deprecationReason) {
      isExperimental =
      type.deprecationReason.startsWith(_experimental.EXPERIMENTAL_PRE_POST_TAG) &&
      type.deprecationReason.endsWith(_experimental.EXPERIMENTAL_PRE_POST_TAG);
      isDeprecated = type.isDeprecated && !isExperimental;
      deprecationReason = isDeprecated ? type.deprecationReason : undefined;
      experimentalReason = isExperimental ?
      type.deprecationReason.replaceAll(_experimental.EXPERIMENTAL_PRE_POST_TAG, '') :
      undefined;
    }
    return {
      ...type,
      ...args,
      isExperimental,
      isDeprecated,
      deprecationReason,
      experimentalReason
    };
  };

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
        queryType.fields.map((query) =>
        parseExperimentalFromDeprecation(query, {
          isQuery: true
        })
        ),
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
        mutationType.fields.map((query) =>
        parseExperimentalFromDeprecation(query, {
          isMutation: true
        })
        ),
        'name'
      )
    } :
    null,
    hasSubscriptions ?
    {
      name: 'Subscriptions',
      makeContentSection: true,
      items: (0, _sortBy.default)(
        subscriptionType.fields.map((type) =>
        parseExperimentalFromDeprecation(type, {
          isSubscription: true
        })
        ),
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
      otherTypes.map((type) => {var _type$fields, _type$inputFields;
        type.fields = (_type$fields = type.fields) === null || _type$fields === void 0 ? void 0 : _type$fields.map((field) =>
        parseExperimentalFromDeprecation(field)
        );
        type.inputFields = (_type$inputFields = type.inputFields) === null || _type$inputFields === void 0 ? void 0 : _type$inputFields.map((field) =>
        parseExperimentalFromDeprecation(field)
        );
        return parseExperimentalFromDeprecation(type, {
          isType: true
        });
      }),
      'name'
    )
  } :
  null].
  filter(Boolean);
};exports.default = _default;