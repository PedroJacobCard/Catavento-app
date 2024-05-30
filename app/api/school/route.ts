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
  const take = Number(url.searchParams.get('take')) || 5;
  const skip = Number(url.searchParams.get('skip')) || 0;

    try {
      const response = await prisma.school.findMany({
        take,
        skip,
        orderBy: {
          name: "asc"
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

//create
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 });
  }

  const { ...data } = await req.json();

  try {
    const response = await prisma.school.create({
      data: {
        ...data,
      }
    });

    if (!response) {
      return NextResponse.json({ message: "Não foi possível criar a escola" }, { status: 401 });
    }

    await prisma.schoolOnUser.create({
      data: {
        userId: data.creatorId,
        schoolName: response.name,
        shifts: { set: response.shift }
      }
    })

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error on creating the school: ", error);
    return NextResponse.json({ message: "Não foi possível criar a escola." }, { status: 500 });
  }
}