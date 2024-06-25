import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { createEvent, deleteEvent, updateEvent } from "@/utils/googleCalender";
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
        userName: !!session.user?.name ? session.user?.name : '',
        AND: {
          connectedToCalendar: true
        }
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

    let googleEventId: string = '';
                    
    if (userAccessToken) {
      if (userAccessToken && !!userAccessToken) {
        await Promise.all(userAccessToken.user.accounts.map(async (acc) => {
          const participants = await prisma.profile.findMany({
            where: {
              connectedToCalendar: true,
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

            if (googleCalendarEvent && googleCalendarEvent.id) {
              googleEventId = googleCalendarEvent.id;
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
        organizerSchool: body.organizerSchool,
        googleEventId
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

//PUT
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 })
  }

  const body = await req.json();
  const url = new URL(req.url);
  const eventId = url.searchParams.get('eventId');
  const googleEventId = url.searchParams.get('googleEventId');

  try {
    const userAccessToken = await prisma.profile.findUnique({
      where: {
        userName: !!session.user?.name ? session.user?.name : '',
        AND: {
          connectedToCalendar: true
        }
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
        await Promise.all(userAccessToken.user.accounts.map(async (acc) => {
          const participants = await prisma.profile.findMany({
            where: {
              connectedToCalendar: true,
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
          
            const googleCalendarEvent = await updateEvent(acc.refresh_token, googleEventData, googleEventId && !!googleEventId ? googleEventId : '');

            if (googleCalendarEvent && googleCalendarEvent.id) {
              console.log("Event updated on Google Calendar");
              return googleCalendarEvent; // Return the event data
            } else {
              throw new Error("Error creating event on Google Calendar.");
            } 
          }
        }));
      }
    }

    const updateEventOnDatabase = await prisma.event.update({
      where: {
        id: !!eventId ? eventId : ""
      },
      data: {
        title: body.title as string,
        subject: body.subject as string,
        location: body.location as string,
        date: body.date as string | Date,
        timeZone: body.timeZone as string,
        startTime: body.startTime as string | Date,
        endTime: body.endTime as string | Date,
        organizer: {
          connect: {
            id: body.organizerId as string
          }
        },
        organizerSchool: body.organizerSchool as string,
        googleEventId
      }
    });

    if (!updateEventOnDatabase) {
      throw new Error("Error updating event on database.");
    }

    return NextResponse.json(updateEventOnDatabase);
  } catch (error) {
    console.error("Error on updating event: ", error);
    return NextResponse.json({ message: "Não foi possível alterar evento." }, { status: 500 });
  }
}

//Delete
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado" }, { status: 401 })
  }

  const url = new URL(req.url);
  const eventId = url.searchParams.get('eventId');
  const googleEventId = url.searchParams.get('googleEventId');

  try {
    const userAccessToken = await prisma.profile.findUnique({
      where: {
        userName: !!session.user?.name ? session.user?.name : '',
        AND: {
          connectedToCalendar: true
        }
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
        await Promise.all(userAccessToken.user.accounts.map(async (acc) => {
          if (acc && !!acc.refresh_token) {
            await deleteEvent(acc.refresh_token, googleEventId && !!googleEventId ? googleEventId : '');
          } else {
            console.error("No refresh token or participants found");
          }
        }));
      }
    }

    const deleteEventOnDatabase = await prisma.event.delete({
      where: {
        id: eventId
      }
    });

    if (!deleteEventOnDatabase) {
      throw new Error("Error updating event on database.");
    }

    return NextResponse.json(deleteEventOnDatabase);
  } catch (error) {
    console.error("Error on updating event: ", error);
    return NextResponse.json({ message: "Não foi possível alterar evento." }, { status: 500 });
  }
}