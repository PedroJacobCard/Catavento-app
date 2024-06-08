import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { createEvent } from "@/utils/googleCalender";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const usersAccessToken = await prisma.profile.findMany({
      where: {
        connectedToCalender: true,
        school: {
          some: {
            schoolName: body.schoolName
          }
        },
      },
      include: {
        user: {
          include: {
            accounts: {
              select: {
                refresh_token: true
              }
            }
          }
        }
      }
    });

    if (usersAccessToken) {
      usersAccessToken.map(async (user) => {
        if (user && !!user) {
          const eventOnCalender = await Promise.all(user.user.accounts.map(async (acc) => {
            if (acc && !!acc.refresh_token) {
              await createEvent(acc.refresh_token, body);
            }
          }))
          console.log(eventOnCalender);
          return eventOnCalender;
        }
      });
      
      const createEventOnDatabase = await prisma.event.create({
        data: {
          ...body
        }
      });

      if (!createEventOnDatabase) {
        return NextResponse.json({ message: "Erro ao criar evento." }, { status: 400 });
      }

      return NextResponse.json(createEventOnDatabase);
    }
  } catch (error) {
    console.error("Error on creating class: ", error);
    return NextResponse.json({ message: "Não foi possível criar evento." }, { status: 500 });
  }
}