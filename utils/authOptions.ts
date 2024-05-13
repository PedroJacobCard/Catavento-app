import SignUp from "@/app/sign-up/page";
import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { signIn } from "next-auth/react";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  pages: {
    signIn: "/sign-in"
  },
  secret: process.env.NEXTAUTH_SECRET,
}
