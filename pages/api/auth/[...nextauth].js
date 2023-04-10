import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGE_WEB_CLIENT_ID,
      clientSecret: process.env.GOOGE_WEB_CLIENT_SECRET,
      secret: process.env.NEXTAUTH_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.uid = token.sub;
      return session;
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default NextAuth(authOptions);
