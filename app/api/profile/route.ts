import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    const profile = await prisma.profile.findUnique({
      where: { userName: session.user?.name },
      include: {
        school: true,
        schoolCreated: true,
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
    
    if (!profile) {
      return NextResponse.json({ message: "Conclua seu perfil!"})
    }
    
    return NextResponse.json(profile);
  } else {
    return NextResponse.json({message: "Você não está autorizado"});
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Not authenticated"}, { status: 401 });
  }
  
  const {connectedToCalender, role, school, schoolCreated } = await req.json();
  
  const user = await prisma.user.findUnique({
    where: { email: session.user!.email },
  });
  
  try {
    if (user && school && schoolCreated) {
      const createSchoolOnUser = await Promise.all(
        school.map( async (schoolData: {schoolName: string, shifts: string[]}) => {
          const data = await prisma.schoolOnUser.create({
            data: {
              schoolName: schoolData.schoolName,
              shifts: { set: schoolData.shifts},
              userId: user.id
            }
          })
          return data;
        })
      );
      
      const createSchoolCreated = Promise.all(
        schoolCreated.map( async (schoolData: {schoolName: string, shifts: string[]}) => {
          const data = await prisma.school.create({
            data: {
              name: schoolData.schoolName,
              shift: { set: schoolData.shifts },
              creatorId: user.id
            }
          });
          return data;
        })
      )
      
      const userProfile = await prisma.profile.create({
        data: {
          userId: user.id,
          userName: user.name as string,
          connectedToCalender,
          role,
          school: {
            connect: createSchoolOnUser.map(school => ({ id: school.id }))
          },
          schoolCreated: {
            connect: (await createSchoolCreated).map(school => ({ id: school.id }))
          }
        }
      });
      
      
      return NextResponse.json(userProfile);
    } else {

      return NextResponse.json({ message: "You are not logged in" });
    }
  } catch (error) {

    console.error("Error on creating profile:", error)
    return NextResponse.json({ message: error}, { status: 500})
  }
}