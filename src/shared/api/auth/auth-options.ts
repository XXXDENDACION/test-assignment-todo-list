import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { gql } from 'graphql-request';
import bcrypt from 'bcrypt';
import { hasuraAdminClient } from '@/shared/api/hasura/client';

interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
}

interface GetUserResponse {
  users: User[];
}

const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      email
      name
      password_hash
    }
  }
`;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const data = await hasuraAdminClient.request<GetUserResponse>(GET_USER_BY_EMAIL, {
            email: credentials.email,
          });

          const user = data.users[0];

          if (!user) {
            return null;
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Refresh token every 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // JWT expires in 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
