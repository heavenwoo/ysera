import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:1001/graphql',
  config: {
    ngModule: './graphql.module#GraphQLModule',
    omitOperationSuffix: true,
    pureMagicComment: true,
    addExplicitOverride: true,
  },
  generates: {
    'libs/ngx-graphql/src/lib/gql.schema.ts': {
      plugins: ['typescript', 'typescript-resolvers', 'typescript-apollo-angular'],
    },
  },
};

export default config;
