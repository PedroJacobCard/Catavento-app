import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";


//obter todas as escolas
export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    try {
      const response = await prisma.school.findMany({
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
  } else {
    return NextResponse.json({ message: "Você não está altenticado."}, { status: 401 });
  }
}
