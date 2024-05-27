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