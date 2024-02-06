import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { Microfiber as IntrospectionManipulator } from 'microfiber'
import { EXPERIMENTAL_PRE_POST_TAG } from '../../../addons/custom-directives/experimental'

export default ({
  introspectionResponse,
  graphQLSchema: _graphQLSchema,
  allOptions: _allOptions,
  introspectionOptions,
}) => {
  const introspectionManipulator = new IntrospectionManipulator(
    introspectionResponse,
    introspectionOptions?.microfiberOptions
  )
  const queryType = introspectionManipulator.getQueryType()
  const mutationType = introspectionManipulator.getMutationType()
  const subscriptionType = introspectionManipulator.getSubscriptionType()
  const otherTypes = introspectionManipulator.getAllTypes({
    includeQuery: false,
    includeMutation: false,
    includeSubscription: false,
  })

  const hasQueries = get(queryType, 'fields.length')
  const hasMutations = get(mutationType, 'fields.length')
  const hasQueriesOrMutations = hasQueries || hasMutations
  const hasSubscriptions = get(subscriptionType, 'fields.length')
  const hasOtherTypes = get(otherTypes, 'length')

  const parseExperimentalFromDeprecation = (type, args = {}) => {
    let isExperimental = false
    let isDeprecated = false
    let deprecationReason = undefined
    let experimentalReason = undefined
    if (type?.deprecationReason) {
      isExperimental =
        type.deprecationReason.startsWith(EXPERIMENTAL_PRE_POST_TAG) &&
        type.deprecationReason.endsWith(EXPERIMENTAL_PRE_POST_TAG)
      isDeprecated = type.isDeprecated && !isExperimental
      deprecationReason = isDeprecated ? type.deprecationReason : undefined
      experimentalReason = isExperimental
        ? type.deprecationReason.replaceAll(EXPERIMENTAL_PRE_POST_TAG, '')
        : undefined
    }
    return {
      ...type,
      ...args,
      isExperimental,
      isDeprecated,
      deprecationReason,
      experimentalReason,
    }
  }

  return [
    hasQueriesOrMutations
      ? {
          name: 'Operations',
          hideInContent: true,
          items: [
            hasQueries
              ? {
                  name: 'Queries',
                  makeNavSection: true,
                  makeContentSection: true,
                  items: sortBy(
                    queryType.fields.map((query) =>
                      parseExperimentalFromDeprecation(query, {
                        isQuery: true,
                      })
                    ),
                    'name'
                  ),
                }
              : null,
            hasMutations
              ? {
                  name: 'Mutations',
                  makeNavSection: true,
                  makeContentSection: true,
                  items: sortBy(
                    mutationType.fields.map((query) =>
                      parseExperimentalFromDeprecation(query, {
                        isMutation: true,
                      })
                    ),
                    'name'
                  ),
                }
              : null,
            hasSubscriptions
              ? {
                  name: 'Subscriptions',
                  makeContentSection: true,
                  items: sortBy(
                    subscriptionType.fields.map((type) =>
                      parseExperimentalFromDeprecation(type, {
                        isSubscription: true,
                      })
                    ),
                    'name'
                  ),
                }
              : null,
          ],
        }
      : null,
    hasOtherTypes
      ? {
          name: 'Types',
          makeContentSection: true,
          items: sortBy(
            otherTypes.map((type) => {
              type.fields = type.fields?.map((field) =>
                parseExperimentalFromDeprecation(field)
              )
              type.inputFields = type.inputFields?.map((field) =>
                parseExperimentalFromDeprecation(field)
              )
              return parseExperimentalFromDeprecation(type, {
                isType: true,
              })
            }),
            'name'
          ),
        }
      : null,
  ].filter(Boolean)
}
