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
    const userAccessToken = await prisma.profile.findUnique({
      where: {
        userName: session.user?.name,
        connectedToCalender: true
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
                    
    if (userAccessToken) {
      if (userAccessToken && !!userAccessToken) {
        const eventOnCalendar = await Promise.all(userAccessToken.user.accounts.map(async (acc) => {
          const participants = await prisma.profile.findMany({
            where: {
              connectedToCalender: true,
              school: {
                some: {
                  schoolName: body.organizerSchool
                }
              }
            },
            include: {
              user: {
                select: {
                  email: true
                }
              }
            }
          });
        
          if (acc && !!acc.refresh_token && participants.length > 0) {
            const googleEventData: GoogleEventData = {
              summary: body.title || '',
              location: body.location || '',
              description: body.subject || '',
              start: {
                dateTime: body.startTime || '',
                timeZone: body.timeZone || ''
              },
              end: {
                dateTime: body.endTime || '',
                timeZone: body.timeZone || ''
              },
              recurrence: [
                "RRULE:FREQ=DAILY;COUNT=1"
              ],
              attendees: participants.map(par => ({
                 email: par.user.email
              })),
              reminders: {
                useDefault: false,
                overrides: [
                  { method: "email", minutes: 24 * 60 },
                  { method: "popup", minutes: 10 }
                ]
              }
            };
          
            const googleCalendarEvent = await createEvent(acc.refresh_token, googleEventData);

            if (googleCalendarEvent) {
              console.log("Event created on Google Calendar");
              return googleCalendarEvent; // Return the event data
            } else {
              throw new Error("Error creating event on Google Calendar.");
            } 
          }
        }));
      }
    }

    // Create event in the database
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
      return NextResponse.json({ message: "Erro ao criar evento no banco de dados." }, { status: 500 });
    }

    return NextResponse.json(createEventOnDatabase, { status: 201 });
  } catch (error) {
    console.error("Error on creating event: ", error);
    return NextResponse.json({ message: "Não foi possível criar evento." }, { status: 500 });
  }
}