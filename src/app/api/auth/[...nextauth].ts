// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post('http://localhost:3000/api/auth/signin', {
            email: credentials?.email,
            password: credentials?.password,
          }, { withCredentials: true });

          const { jwt, updated_at } = response.data;

          if (response.status === 200 && jwt) {
            // Return user object as required by NextAuth
            return {
              id: credentials?.email,
              jwt,
              updated_at,
              email: credentials?.email,
            };
          }
          // Return null if login fails
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (if you have one)
  },
  callbacks: {
    async jwt({ token, user }) {
      // Store the JWT in the token object after successful login
      if (user?.jwt) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      // Make JWT available in the session, so it can be used in the frontend
      if (token?.jwt) {
        session.jwt = token.jwt;
      }
      return session;
    },
  },
});
