import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";




export async function GET(req: Request, { params }: { params: { schoolName: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está altenticado."}, { status: 401 });
  }
    //obter todas as escolas do usuário logado
  const schoolName = params.schoolName;
  
  try {
    const userSchool = await prisma.school.findUnique({
      where: {
        name: schoolName
      }
    });

    if (!userSchool) {
      return NextResponse.json({ message: "Não existem escolas" }, { status: 404 });
    }

    return NextResponse.json(userSchool);
  } catch (error) {
    console.log("Error on getting the user schools: ", error)
    return NextResponse.json({ message: "Error on getting user schools."}, { status: 500 });
  }
}

//update
export async function PUT(req: Request, { params }: { params: { schoolName: string }}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return  NextResponse.json({ message: "Você não está autenticado."});
  }

  const schoolName = params.schoolName;
  const { ...updateDate } = await req.json();

  try {
    const response = await prisma.school.update({
      where: {
        name: schoolName
      },
      data: {
        ...updateDate
      }
    });

    if (!response) {
      return NextResponse.json({ message: "Não foi possível atualizar a escola."}, { status: 400 });
    }

    await prisma.schoolOnUser.updateMany({
      where: {
        schoolName: schoolName
      },
      data: {
        schoolName: response.name,
        shifts: { set: response.shift}
      }
    })

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error on updating the school: ", error);
    return NextResponse.json({ message: "Error on updating the school."}, { status: 500 });
  }
}

//delete
export async function DELETE(req: Request, { params }: { params: { schoolName: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  const schoolName = params.schoolName;

  try {
    const response = await prisma.school.delete({
      where: {
        name: schoolName
      }
    });

    if (!response) {
      return NextResponse.json({ message: "Não foi possível deletar a escola."}, {
        status: 400
      });
    }

    await prisma.schoolOnUser.deleteMany({
      where: {
        schoolName: schoolName
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error on deleting the school: ", error);
    return NextResponse.json({ message: "Error on deleting the school."}, { status: 500 });
  }
}