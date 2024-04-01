'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, UseUsersContextType, UserType } from "@/utils/Types";

//import hooks
import useUser from "../hooks/useUser";

const initState: UserType[] = [];

const initContextState: UseUsersContextType = {
  users: null,
}

export const UsersContext = createContext<UseUsersContextType>(initContextState);

function UsersProvider({ children }: ChildrenPropsType) {
  //importar dados do usuário logado
  const { user } = useUser();

  //iniciar as funcionalidades para adiquirir dados dos usuários.
  const [users, setUsers] = useState<UserType[] | null>(initState);

  useEffect(() => {
    const getUsers = async (): Promise<UserType[]> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_DEV_API}/users`
        );

        if (response.ok) {
          const data = await response.json();

          //funcionalidades para adiquirir os usuários que participam das mesmas escolas e turnos que o usuário logado
          const userSchools = user?.school.map(({ schoolName, shifts }) => ({ schoolName, shifts }));

          const filteredData = data.filter((u: UserType) => 
            u.school.some(({ schoolName, shifts }) => 
              userSchools?.some(({schoolName: userSchoolName, shifts: userShifts }) => 
                schoolName === userSchoolName && 
                shifts.some((shift) => 
                  userShifts.some(userSchift => 
                    userSchift === shift
                  )
                )
              ) 
            )
          )
          
          setUsers(filteredData);
          return filteredData;
        }
      } catch (error) {
        console.error("Error:", error);
      }
      return [];
    };

    getUsers();
  }, [user]);

  return (
    <UsersContext.Provider value={{ users }}>{children}</UsersContext.Provider>
  );
}

export default UsersProvider;