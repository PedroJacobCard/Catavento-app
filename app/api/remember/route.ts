import { pusher } from "@/lib/Pusher";
import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if(!session) {
    return NextResponse.json({ message: "Você não está autenticado"}, { status: 401 });
  }

  const url = new URL(req.url);
  const schoolName = url.searchParams.get("schoolName");
  const shifts = url.searchParams.get("shifts");

  try {
    const getRemembers = await prisma.remember.findMany({
      where: {
        schoolName: schoolName,
        shift: {equals: shifts}
      }
    });

    if (!getRemembers) {
      return NextResponse.json({ message: "Não há lembretes."}, { status: 404 });
    }

    return NextResponse.json(getRemembers);
  } catch (error) {
    console.log("Error on getting remembers: ", error)
    return NextResponse.json({ message: "Error on getting remembers"}, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 });
  }

  const data = await req.json();

  try {
    const postRemember = await prisma.remember.create({
      data: {
        ...data,
      }
    });

    if (!postRemember) {
      return NextResponse.json({ message: "Erro ao criar lembrança" }, { status: 400 });
    }

          
      //set pusher
      await pusher.trigger('remember', 'content', postRemember);

    return NextResponse.json(postRemember);
  } catch (error) {
    console.error("Error on creating remember: ", error)
    return NextResponse.json({ message: "Error on creating remember."}, { status: 500 });
  }
}