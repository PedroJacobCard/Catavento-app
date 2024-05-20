import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        const userAdapter = await prisma.user.findUnique({
          where: {
            email: session.user.email
          },
        });
        if (userAdapter) {
          session.user = userAdapter;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/",
    signOut: "/sign-in"
  },
  secret: process.env.NEXTAUTH_SECRET,
}