import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

const scopes: string[] = [
  'http://localhost:3000/api/auth/callback/google',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  pages: {
    signIn: "/",
    signOut: "/sign-in"
  },
  secret: process.env.NEXTAUTH_SECRET,
}