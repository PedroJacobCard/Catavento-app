import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter, AdapterUser } from "next-auth/adapters";
import { redirect } from "next/navigation";

//import toaster
import toast from "react-hot-toast";
import { FieldValuesRegister } from "@/app/sign-up/ValidationSchemaRegister";
import { UserType } from "./Types";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({user, account, credentials}) {
     const userExist = await prisma.user.findUnique({
       where: {
         email: user.email
       }
     });

     if (!userExist) {
       toast.error("Ops! Parece que você ainda não está registrado.")
       return redirect("/sign-up");
     }

     if (userExist) {
      return userExist;
     }
     
     const createUser = await prisma.user.create({
       data: {
         email: user.email,
         name: user.name,
         image: user.image,
         account: account,
         ...credentials
       }
     });

     return createUser;
    },
    async session({ session, user }) {
      if (session.user) {
        const userAdapter: UserType | null = await prisma.user.findUnique({
          where: {
            email: user.email
          }
        });
        if (userAdapter) {
          session.user = userAdapter;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in"
  },
  secret: process.env.NEXTAUTH_SECRET,
}