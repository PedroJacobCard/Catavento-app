import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { schoolName: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autorizado." }, { status: 401 });
  }

  const schoolName = params.schoolName;

  try {
    const getEvents = await prisma.event.findMany({
      where: {
        organizerSchool: schoolName
      }
    });

    if (!getEvents) {
      return NextResponse.json({ message: "Não há eventos." }, {
        status: 404
      });
    }

    return  NextResponse.json(getEvents);
  } catch (error) {
    console.error("Error on getting the events: ", error);
    return NextResponse.json({ message: "Error on getting the events." }, { status: 500 });
  }
}