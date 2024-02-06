import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

export const EXPERIMENTAL_PRE_POST_TAG = '#EXPERIMENTAL#'
export const EXPERIMENTAL_DIRECTIVE_NAME = 'experimental'
export function experimentalDirective() {
  // https://www.apollographql.com/docs/apollo-server/v3/schema/creating-directives/
  // https://the-guild.dev/graphql/tools/docs/schema-directives#implementing-schema-directives

  const supportedMapperKind = {
    SCALAR: MapperKind.SCALAR_TYPE,
    OBJECT: MapperKind.OBJECT_TYPE,
    FIELD_DEFINITION: MapperKind.OBJECT_FIELD,
    ARGUMENT_DEFINITION: MapperKind.ARGUMENT,
    INTERFACE: MapperKind.INTERFACE_TYPE,
    UNION: MapperKind.UNION_TYPE,
    ENUM: MapperKind.ENUM_TYPE,
    ENUM_VALUE: MapperKind.ENUM_VALUE,
    INPUT_OBJECT: MapperKind.INPUT_OBJECT_TYPE,
    INPUT_FIELD_DEFINITION: MapperKind.INPUT_OBJECT_FIELD,
    SCHEMA: MapperKind.ROOT_OBJECT,
  }

  return {
    experimentalDirectiveTypeDefs: `directive @${EXPERIMENTAL_DIRECTIVE_NAME}(reason: String = "") on ${Object.keys(
      supportedMapperKind
    ).join(' | ')}`,

    experimentalDirectiveTransformer: (schema) =>
      mapSchema(
        schema,
        Object.values(supportedMapperKind).reduce(
          (prev, next) => ({
            ...prev,
            [next]: (x) => {
              const experimentalDirective = getDirective(
                schema,
                x,
                EXPERIMENTAL_DIRECTIVE_NAME
              )?.[0]
              if (experimentalDirective) {
                x.deprecationReason = `${EXPERIMENTAL_PRE_POST_TAG}${experimentalDirective['reason']}${EXPERIMENTAL_PRE_POST_TAG}`
                return x
              }
            },
          }),
          {}
        )
      ),
  }
}
