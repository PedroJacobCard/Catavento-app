import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//UPDATE
export async function PUT(req: Request, { params }: { params: { classId: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  const classId = params.classId;
  const data = await req.json();

  try {
    const updateClass = await prisma.class.update({
      where: {
        id: classId
      },
      data: {
        ...data
      }
    });

    if (!updateClass) {
      return NextResponse.json({ message: "Não foi possível alterar classe." }, { status: 400 });
    }

    return NextResponse.json(updateClass);
  } catch (error) {
    console.error("Error on updating class: ", error);
    return NextResponse.json({ message: "Error on updating class." }, { status: 500 })
  }
}

//DELETE
export async function DELETE(req: Request, { params }: { params: { classId: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  const classId = params.classId;

  try {
    const deleteClass = await prisma.class.delete({
      where: {
        id: classId
      }
    });

    if (!deleteClass) {
      return NextResponse.json({ message: "Não foi possível deletar classe." }, { status: 400 });
    }

    return NextResponse.json(deleteClass);
  } catch (error) {
    console.error("Error on deleting class: ", error);
    return NextResponse.json({ message: "Error on deleting class." }, { status: 500 })
  }
}