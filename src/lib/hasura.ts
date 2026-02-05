import { GraphQLClient } from 'graphql-request';

const HASURA_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql';
const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'myadminsecret';

// Admin client for server-side operations
export const hasuraAdminClient = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
  },
});

// Create a user-scoped client with JWT claims
export function createHasuraUserClient(userId: string) {
  return new GraphQLClient(HASURA_ENDPOINT, {
    headers: {
      'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
      'x-hasura-role': 'user',
      'x-hasura-user-id': userId,
    },
  });
}

// Anonymous client for public data
export const hasuraAnonymousClient = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
    'x-hasura-role': 'anonymous',
  },
});
