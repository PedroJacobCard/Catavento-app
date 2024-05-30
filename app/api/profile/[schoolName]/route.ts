import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params : { schoolName: string } }) {
  const session = getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autorizado." }, { status: 401 });
  }

  const schoolName = params.schoolName;

  try {
    const response = await prisma.profile.findMany({
      where: {
        school: {
          some: {
            schoolName: schoolName
          }
        }
      },
      include: {
        school: true,
        user: true
      }
    });

    if (!response) {
      return NextResponse.json({ message: "Escola não encontrada." }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error on getting users: ", error);
    return NextResponse.json({ message: "Error on getting the users"}, { status: 500 });
  }
}