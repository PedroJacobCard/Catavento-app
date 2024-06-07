import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//GET
export async function GET(req: Request, { params }: { params: { schoolName: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  const schoolName = params.schoolName;

  const url = new URL(req.url);
  const take = Number(url.searchParams.get('take')) || 5;
  const skip = Number(url.searchParams.get('skip')) || 0;

  try {
    const getReports = await prisma.report.findMany({
      where: {
        schoolName: schoolName
      },
      skip,
      take,
      orderBy: {
        createdAt: "asc"
      }
    });

    if (!getReports) {
      return NextResponse.json({ message: "Não foi possível criar Relatório." }, { status: 400 });
    }

    return NextResponse.json(getReports);
  } catch (error) {
    console.error("Error on creating report: ", error);
    return NextResponse.json({ message: "Não foi possível criar Relatório." }, { status: 500 });
  }
}