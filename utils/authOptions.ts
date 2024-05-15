import { AuthOptions, Awaitable, DefaultSession, Session } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import prisma from "@/lib/prismadb";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        const userAdapter = await prisma.user.findUnique({
          where: {
            email: session.user.email
          }
        });
        return session.user = userAdapter;
      }
    }
  },
  pages: {
    signIn: "/sign-in"
  },
  secret: process.env.NEXTAUTH_SECRET,
}
