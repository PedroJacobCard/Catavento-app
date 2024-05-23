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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  try {
    const { school, ...body } = await req.json();
  
    const user = await prisma.profile.findUnique({
      where: { userName: session.user?.name },
    });
  
    if (user) {
      //edita a escola no usuário e a escola criada
      const updateSchoolOnUser = Promise.all(
        school.map(async (school: {schoolName: string, shifts: string[]}) => {
          const updateSchoolOnUser = await prisma.schoolOnUser.update({
            where: {
              schoolName: school.schoolName,
            },
            data: {
              schoolName: school.schoolName,
              shifts: { set: school.shifts }
            }
          });

          //verifica se não existe e então cria uma nova
          if (!updateSchoolOnUser) {
            const createSchoolOnUser = await prisma.schoolOnUser.create({
              data: {
                schoolName: school.schoolName,
                shifts: { set: school.shifts },
                userId: user?.id,
              }
            });
            return createSchoolOnUser;
          }
        })
      );

      const updateSchoolCreated = Promise.all(
        school.map(async (school: {schoolName: string, shifts: string[]}) => {
          const updateSchool = await prisma.school.update({
            where: {
              name: school.schoolName,
            },
            data: {
              name: school.schoolName,
              shift: { set: school.shifts }
            }
          });

          //verifica se não existe e então cria uma nova
          if (!updateSchool) {
            const createSchool = await prisma.school.create({
              data: {
                name: school.schoolName,
                shift: { set: school.shifts },
                creatorId: user?.id
              }
            })
            return createSchool;
          }
        })
      );

      //se vier dados de escola e se o usuário for coordenador, será alterado o perfil e as escolas correspondentes
      if (user && user?.role?.toString() === 'COORDENADOR_A') {
        const updateProfile = await prisma.profile.update({
          where: {
            id: user?.id
          },
          data: {
            ...body,
            schoolOnUser: {
              connect: (await updateSchoolOnUser).map(school => ({ id: school.id })),
            },
            school: { 
              connect: (await updateSchoolCreated).map(school => ({ id: school.id })),
             }
          }
        })

        return NextResponse.json(updateProfile);
      } else {
        const updateProfile = await prisma.profile.update({
          where: {
            id: user?.id
          },
          data: {
            ...body,
            schoolOnUser: {
              connect: (await updateSchoolOnUser).map(school => ({ id: school.id })),
            }
          }
        })

        return NextResponse.json(updateProfile);
      }
    }

  } catch (error) {
    console.log("Error on updating the user profile: ", error);
    return NextResponse.json({ message: "Error on updating the user profile" })
  }
}