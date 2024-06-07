import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


//POST
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  const data = await req.json();

  try {
    const createReport = await prisma.report.create({
      data: {
        ...data
      }
    });

    if (!createReport) {
      return NextResponse.json({ message: "Não foi possível criar Relatório." }, { status: 400 });
    }

    return NextResponse.json(createReport);
  } catch (error) {
    console.error("Error on creating report: ", error);
    return NextResponse.json({ message: "Não foi possível criar Relatório." }, { status: 500 });
  }
}