import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";


//obter todas as escolas
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está altenticado."}, { status: 401 });
  }

  const url = new URL(req.url);
  const take = Number(url.searchParams.get('take')) || 1;
  const skip = Number(url.searchParams.get('skip')) || 0;

    try {
      const response = await prisma.school.findMany({
        take,
        skip,
        orderBy: {
          createdAt: "asc"
        }
      });

      if (!response) {
        return NextResponse.json({ message: "Não existem escolas" }, { status: 404 });
      }

      return NextResponse.json(response);
    } catch (error) {
      console.log("Error ao adquirir escolas do banco de dados: ", error)
    }
}
