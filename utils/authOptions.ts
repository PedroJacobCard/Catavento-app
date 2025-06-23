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
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          sponse_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/calendar',
          include_granted_scopes= 'true'
        }
      }
    })
  ],
  pages: {
    signIn: "/",
    signOut: "/sign-in"
  },
  secret: process.env.NEXTAUTH_SECRET,
}
