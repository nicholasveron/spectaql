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
                    queryType.fields.map((query) => {
                      let isExperimental = false
                      let isDeprecated = false
                      let deprecationReason = undefined
                      let experimentalReason = undefined
                      if (query?.deprecationReason) {
                        isExperimental =
                          query.deprecationReason.startsWith(
                            EXPERIMENTAL_PRE_POST_TAG
                          ) &&
                          query.deprecationReason.endsWith(
                            EXPERIMENTAL_PRE_POST_TAG
                          )
                        isDeprecated = query.isDeprecated && !isExperimental
                        deprecationReason = isDeprecated
                          ? query.deprecationReason
                          : undefined
                        experimentalReason = isExperimental
                          ? query.deprecationReason.replaceAll(
                              EXPERIMENTAL_PRE_POST_TAG,
                              ''
                            )
                          : undefined
                      }
                      return {
                        ...query,
                        isQuery: true,
                        isExperimental,
                        isDeprecated,
                        deprecationReason,
                        experimentalReason,
                      }
                    }),
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
                    mutationType.fields.map((query) => {
                      let isExperimental = false
                      let isDeprecated = false
                      let deprecationReason = undefined
                      let experimentalReason = undefined
                      if (query?.deprecationReason) {
                        isExperimental =
                          query.deprecationReason.startsWith(
                            EXPERIMENTAL_PRE_POST_TAG
                          ) &&
                          query.deprecationReason.endsWith(
                            EXPERIMENTAL_PRE_POST_TAG
                          )
                        isDeprecated = query.isDeprecated && !isExperimental
                        deprecationReason = isDeprecated
                          ? query.deprecationReason
                          : undefined
                        experimentalReason = isExperimental
                          ? query.deprecationReason.replaceAll(
                              EXPERIMENTAL_PRE_POST_TAG,
                              ''
                            )
                          : undefined
                      }
                      return {
                        ...query,
                        isMutation: true,
                        isExperimental,
                        isDeprecated,
                        deprecationReason,
                        experimentalReason,
                      }
                    }),
                    'name'
                  ),
                }
              : null,
            hasSubscriptions
              ? {
                  name: 'Subscriptions',
                  makeContentSection: true,
                  items: sortBy(
                    subscriptionType.fields.map((type) => {
                      let isExperimental = false
                      let isDeprecated = false
                      let deprecationReason = undefined
                      let experimentalReason = undefined
                      if (type?.deprecationReason) {
                        isExperimental =
                          type.deprecationReason.startsWith(
                            EXPERIMENTAL_PRE_POST_TAG
                          ) &&
                          type.deprecationReason.endsWith(
                            EXPERIMENTAL_PRE_POST_TAG
                          )
                        isDeprecated = type.isDeprecated && !isExperimental
                        deprecationReason = isDeprecated
                          ? type.deprecationReason
                          : undefined
                        experimentalReason = isExperimental
                          ? type.deprecationReason
                          : undefined
                      }
                      return {
                        ...type,
                        isSubscription: true,
                        isExperimental,
                        isDeprecated,
                        deprecationReason,
                        experimentalReason,
                      }
                    }),
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
              let isExperimental = false
              let isDeprecated = false
              let deprecationReason = undefined
              let experimentalReason = undefined
              if (type?.deprecationReason) {
                isExperimental =
                  type.deprecationReason.startsWith(
                    EXPERIMENTAL_PRE_POST_TAG
                  ) &&
                  type.deprecationReason.endsWith(EXPERIMENTAL_PRE_POST_TAG)
                isDeprecated = type.isDeprecated && !isExperimental
                deprecationReason = isDeprecated
                  ? type.deprecationReason
                  : undefined
                experimentalReason = isExperimental
                  ? type.deprecationReason
                  : undefined
              }
              return {
                ...type,
                isType: true,
                isExperimental,
                isDeprecated,
                deprecationReason,
                experimentalReason,
              }
            }),
            'name'
          ),
        }
      : null,
  ].filter(Boolean)
}
