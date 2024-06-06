import { pusher } from "@/lib/Pusher";
import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//UPDATE
export async function PUT(req: Request, { params }: { params : { rememberId: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 });
  }

  const rememberId = params.rememberId;
  const { ...body } = await req.json();

  try {
    const updateRemember = await prisma.remember.update({
      where: {
        id: rememberId
      },
      data: {
        ...body
      }
    });

    if (!updateRemember) {
      return NextResponse.json({ message: "Não foi possível alterar lembrete." }, { status: 400 });
    }

    const pusherData = {
      verb: 'PUT',
      data: updateRemember
    }

    //set pusher
    await pusher.trigger('remember', 'content', pusherData);

    return NextResponse.json(updateRemember);
  } catch (error) {
    console.error("Error on updating remember content: ", error);
    return NextResponse.json({ message: "Error on updating remember content." }, { status: 500 });
  }
}

//DELETE
export async function DELETE(req: Request, { params }: { params : { rememberId: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado. "}, { status: 401 });
  }

  const rememberId = params.rememberId;
  console.log(rememberId)

  try {
    const deleteRemember = await prisma.remember.delete({
      where: {
        id: rememberId
      }
    });

    if (!deleteRemember) {
      return NextResponse.json({ message: "Não foi possível deletar lembrete "}, { status: 400 });
    }

    const pusherData = {
      verb: 'DELETE',
      data: deleteRemember
    }

    //set pusher
    await pusher.trigger('remember', 'content', pusherData);

    return NextResponse.json(deleteRemember);
  } catch (error) {
    console.error("Error on deleting remember: ", error);
    return NextResponse.json({ message: "Error on deleting remember." }, { status: 500 });
  }
}