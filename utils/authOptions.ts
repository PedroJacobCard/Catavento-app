import { Account, AuthOptions, User } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter, AdapterUser } from "next-auth/adapters";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

import { FieldValuesRegister } from "@/app/sign-up/ValidationSchemaRegister";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    //async signIn(user: User | AdapterUser, account: Account | null, formData: FieldValuesRegister) {
    // const userExist = await prisma.user.findUnique({
    //   where: {
    //     email: user.email
    //   }
    // });

    // if (!userExist) {
    //   toast.error("Ops! Parece que você ainda não está cadastrado.")
    //   redirect("/sign-up");
    // }

    // const { connectedToCalender, role, school, schoolCreated} = formData;
    // 
    // const createUser = await prisma.user.create({
    //   data: {
    //     email: user.email,
    //     name: user.name,
    //     image: user.image,
    //     account: account,
    //     connectedToCalender: connectedToCalender,
    //     role: role,
    //     school: school,
    //     schoolCreated: schoolCreated
    //   }
    // });

    // return createUser;
    //,
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
