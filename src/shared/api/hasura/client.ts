import { GraphQLClient } from 'graphql-request';
import jwt from 'jsonwebtoken';

const HASURA_ENDPOINT =
  process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql';

if (!process.env.HASURA_ADMIN_SECRET) {
  throw new Error('HASURA_ADMIN_SECRET env variable is required');
}
if (!process.env.HASURA_JWT_SECRET) {
  throw new Error('HASURA_JWT_SECRET env variable is required');
}

const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;
const HASURA_JWT_SECRET = process.env.HASURA_JWT_SECRET;

// Admin client for server-side operations (user lookup, etc.)
export const hasuraAdminClient = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
  },
});

// Generate a Hasura JWT for a specific user
function generateHasuraJWT(userId: string): string {
  const payload = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-user-id': userId,
    },
  };

  return jwt.sign(payload, HASURA_JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

// Create a user-scoped client with JWT (secure - no admin secret)
export function createHasuraUserClient(userId: string) {
  const token = generateHasuraJWT(userId);

  return new GraphQLClient(HASURA_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Anonymous client for public data
export const hasuraAnonymousClient = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    'x-hasura-role': 'anonymous',
  },
});
