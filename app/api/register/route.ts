import { getSession } from "next-auth/react";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { FieldValuesRegister } from "@/app/sign-up/ValidationSchemaRegister";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const reqData: FieldValuesRegister = req.body as unknown as {
  connectedToCalender: boolean;
  role: string;
  schoolCreated?: {
    schoolName: string;
    shifts: string[];
  };
  school?: {
    schoolName: string;
    shifts: string[];
  };
};;

    try {
      
      const session = await getSession();
  
      if (session?.user) {
        const userProfile = await prisma.profile.create({
          data: {
            connectedToCalender: reqData.connectedToCalender,
            role: reqData.role,
            school: reqData.school,
            schoolCreated: reqData.schoolCreated
          }
        });
  
        return NextResponse.json(userProfile);
      } else {
        return NextResponse.json({ message: "You are not logged in" });
      }
    } catch (error) {
      console.error("Error on creating profile:", error)
      return NextResponse.json({ message: error}, { status: 500})
    }
  } else {
    return NextResponse.json({ message: "Method not allowed" }, { status: 401});
  }
}