import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    const profile = await prisma.profile.findUnique({
      where: { userName: !!session.user?.name ? session.user.name : "" },
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

//Post
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Not authenticated"}, { status: 401 });
  }
  
  const {connectedToCalendar, role, school, schoolCreated } = await req.json();
  
  const user = await prisma.user.findUnique({
    where: { email: !!session.user!.email ? session.user?.email : "" },
  });
  
  try {
    if (user && role === "COORDENADOR_A" && school && schoolCreated) {
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
          connectedToCalendar,
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
    } else if (user && school) {
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
      
      const userProfile = await prisma.profile.create({
        data: {
          userId: user.id,
          userName: user.name as string,
          connectedToCalendar,
          role,
          school: {
            connect: createSchoolOnUser.map(school => ({ id: school.id }))
          },
          schoolCreated: {
            connect: []
          }
        }
      });

      return NextResponse.json(userProfile);
    }
  } catch (error) {

    console.error("Error on creating profile:", error)
    return NextResponse.json({ message: error}, { status: 500})
  }
}

//Update
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  try {
    const { school, ...body } = await req.json();
  
    const user = await prisma.profile.findUnique({
      where: { userName: !!session.user?.name ? session.user.name : "" },
    });
  
    if (user) {
      //deletar escolas no usuário que não fazem parte das escolas recebidas pelo formulário de edição de perfil.
      //Como a coleção "SchoolOnUser" é um objeto referente aos dados da escola que o usuário participa,
      //é necessário deletar as escolas de "SchoolOnUser" que não estão sendo enviadas pelo formulário, pois
      //elas são marcadas altomaticamente, mas não são retornadas se o usuário desmarcar.
      await prisma.schoolOnUser.deleteMany({
        where: {
          userId: user.id
        }
      });

      //deletar todos os lembretes das escolas que o usuário não participará mais
      await prisma.remember.deleteMany({
        where: {
          NOT:{
            OR: school.map((school: { schoolName: string, shifts: string[] }) => ({
              AND: [
                { schoolName: school.schoolName },
                { shift: { in: school.shifts } }
              ]
            }))
          }
        }
      })

      //edita a escola no usuário e a escola criada
      const updateSchoolOnUserPromises = school.map(async (school: {id: string, schoolName: string, shifts: string[]}) => {
        try {
          const updateSchoolOnUser = await prisma.schoolOnUser.update({
            where: {
              id: school.id
            },
            data: {
              schoolName: school.schoolName,
              shifts: { set: school.shifts }
            }
          });
          
          return updateSchoolOnUser;
        } catch (error) {

          //verifica se não existe e então cria uma nova
          const createSchoolOnUser = await prisma.schoolOnUser.create({
            data: {
              schoolName: school.schoolName,
              shifts: { set: school.shifts },
              userId: user?.id,
            }
          });

          return createSchoolOnUser;
        }
      });

      const updateSchoolCreatedPromises = school.map(async (school: {schoolName: string, shifts: string[]}) => {
        try {
          const schoolIsNotUptodate = await prisma.school.findFirst({
            where: {
              name: school.schoolName,
              creatorId: user.id
            }
          });

          if (schoolIsNotUptodate?.name ===  school.schoolName && schoolIsNotUptodate.shift.every(sh => school.shifts.includes(sh))) {
            return schoolIsNotUptodate;
          } else {
            const updateSchool = user.role === "COORDENADOR_A" && await prisma.school.update({
              where: {
                name: school.schoolName,
                creatorId: user.id
              },
              data: {
                shift: { set: school.shifts }
              }
            });
  
            return updateSchool;
          }
          
        } catch (error) {
          console.log("Não há escolas para alterar.")
          return NextResponse.json({ message: "Não há o que alterar." }, { status: 200 })
        }
      });

      //Promisse all nas arrays
      const updateSchoolOnUser = await Promise.all(updateSchoolOnUserPromises);
      const updateSchoolCreated = await Promise.all(updateSchoolCreatedPromises);

      //objeto com os dados que serão enviados para alterar o perfil
      const profileUpdateData = {
        ...body,
        school: {
          connect: updateSchoolOnUser.map(school => ({ id: school.id }))
        }
      };

      //se vier dados de escola e se o usuário for coordenador, será alterado o perfil e as escolas correspondentes
      if (user?.role?.toString() === 'COORDENADOR_A') {
        profileUpdateData["schoolCreated"] = {
          connect: updateSchoolCreated.filter(school => school.id !== undefined).map(school => ({ id: school.id}))
        }
      }

      const updateProfile = await prisma.profile.update({
        where: {
          id: user.id
        },
        data: profileUpdateData,
        include: {
          user: true,
          school: true
        }
      });

      return NextResponse.json(updateProfile);
    }
  } catch (error) {
    console.log("Error on updating the user profile: ", error);
    return NextResponse.json({ message: "Error on updating the user profile" })
  }
}

//delete 
export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Você não está autenticado." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { name: !!session.user?.name ? session.user.name : "" },
    });

    const userProfile = await prisma.profile.findUnique({
      where: { userName: user?.name },
      include: {
        schoolCreated: {
          select: {
            name: true
          }
        }
      }
    });
  
    if (user && userProfile) {
      const schoolsCreated = await prisma.school.findMany({
        where: {
          creatorId: userProfile.id
        }
      });

      if (schoolsCreated) {
        schoolsCreated.map(async (school) => {
          await prisma.class.deleteMany({
            where: {
              schoolName: school.name
            }
          });

          await prisma.school.delete({
            where: {
              name: school.name
            }
          })
        })
      }

      //deleta as escolas nos usuários que têem relação com as escolas criadas pelo usuário deletado
      userProfile.schoolCreated.map(async (school) => {
        await prisma.schoolOnUser.deleteMany({ where: { schoolName: school.name } });
      });

      await prisma.remember.deleteMany({ where: { authorId: userProfile.id } });
      await prisma.event.deleteMany({ where: { organizerId: userProfile.id } });
      await prisma.report.deleteMany({ where: { authorName: userProfile.userName } });

      const deleteProfile = await prisma.profile.delete({ where: { userName: user.name } });

      if (deleteProfile) {
        await prisma.user.delete({
          where: { id: user.id }
        });

        return NextResponse.json({ message: "Perfile deletado com sucesso"}, { status: 200 })
      }
    }
  } catch (error) {
    console.log("Error on deleting the user profile: ", error);
    return NextResponse.json({ message: "Error ao deletar o perfil." }, { status: 400 })
  }
}