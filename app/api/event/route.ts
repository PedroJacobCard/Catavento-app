import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { createEvent } from "@/utils/googleCalender";
import { EventType, GoogleEventData } from "@/utils/Types";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 });
  }

  const body: EventType = await req.json();
  
  try {
    const usersAccessToken = await prisma.profile.findMany({
      where: {
        connectedToCalender: true,
        school: {
          some: {
            schoolName: body.organizerSchool
          }
        },
      },
      include: {
        user: {
          include: {
            accounts: {
              select: {
                access_token: true
              }
            }
          }
        }
      }
    });
                    
    if (usersAccessToken) {
      console.log(usersAccessToken.map(user => user.userName))

      await Promise.all(
      usersAccessToken.map(async (user) => {

        if (user && !!user) {
          const eventOnCalender = await Promise.all(user.user.accounts.map(async (acc) => {

            if (acc && !!acc.access_token) {
              const googleEventData: GoogleEventData = {
                summary: body.title || '',
                location: body.location|| '',
                description: body.subject|| '',
                start: {
                  dateTime: body.startTime || '',
                  timeZone: body.timeZone || ''
                },
                end: {
                  dateTime: body.endTime || '',
                  timeZone: body.timeZone || ''
                },
                recurrence: [
                  "RRULE:FREQ=DAILY;COUNT=2"
                ],
                attendees: [
                  {
                    email: user.user.email || ''
                  }
                ],
                reminders: {
                  useDefault: false,
                  overrides: [
                    { method: "email", minutes: 24 * 60},
                    { method: "popup", minutes: 10 }
                  ]
                }
              };

              await createEvent(acc.access_token, googleEventData);
            }
          }));

          console.log(eventOnCalender);
          return eventOnCalender;
        }
      }));
      
      const createEventOnDatabase = await prisma.event.create({
        data: {
          title: body.title,
          subject: body.subject,
          location: body.location,
          date: body.date,
          timeZone: body.timeZone,
          startTime: body.startTime,
          endTime: body.endTime,
          organizer: {
            connect: {
              id: body.organizerId
            }
          },
          organizerSchool: body.organizerSchool
        },
      });

      if (!createEventOnDatabase) {
        return NextResponse.json({ message: "Erro ao criar evento." }, { status: 400 });
      }

      return NextResponse.json(createEventOnDatabase);
    }
  } catch (error) {
    console.error("Error on creating event: ", error);
    return NextResponse.json({ message: "Não foi possível criar evento." }, { status: 500 });
  }
}