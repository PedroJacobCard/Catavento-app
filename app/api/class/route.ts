import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const schoolName = url.searchParams.get('schoolName');
  const shifts = url.searchParams.get('shifts');

  try {
    const getClasses = await prisma.class.findMany({
      where: {
        schoolName: schoolName && schoolName !== null ? schoolName : '',
        shift: { equals:  shifts }
      }
    });

    if (!getClasses) {
      return NextResponse.json({ message: "Não foi possível encontrar classes" }, { status: 404 });
    }

    return NextResponse.json(getClasses);
  } catch (error) {
    console.error("Error on finding classes: ", error);
    return NextResponse.json({ message: "Não foi possível encontrar classes." }, { status: 500 });
  }
}

//POST
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const createClass = await prisma.class.create({
      data: {
        ...body
      }
    });

    if (!createClass) {
      return NextResponse.json({ message: "Erro ao criar classe." }, { status: 400 });
    }

    return NextResponse.json(createClass);
  } catch (error) {
    console.error("Error on creating class: ", error);
    return NextResponse.json({ message: "Não foi possível criar classes." }, { status: 500 });
  }
}