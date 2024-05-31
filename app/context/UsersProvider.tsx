'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, UseUsersContextType, ProfileType } from "@/utils/Types";

//import hooks
import useUser from "../hooks/useUser";

const initState: ProfileType[] = [];

const initContextState: UseUsersContextType = {
  users: null,
}

export const UsersContext = createContext<UseUsersContextType>(initContextState);

function UsersProvider({ children }: ChildrenPropsType) {
  //importar dados do usuário logado
  const { user } = useUser();

  //iniciar as funcionalidades para adiquirir dados dos usuários.
  const [users, setUsers] = useState<ProfileType[] | null>(initState);

  useEffect(() => {
    const getUsers = async (): Promise<ProfileType[]> => {
      try {
        //funcionalidades para adiquirir os usuários que participam das mesmas escolas e turnos que o usuário logado
        const userSchools = user?.school.map((school) => school.schoolName);
        
        if (userSchools) {
          const usersResponses = await Promise.all(userSchools.map(async (schoolName) => {
            const response = await fetch(`/api/profile/${schoolName}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              cache: "no-store"
            });
            
            if (!response.ok) {
              return null;
            }
            
            const data = await response.json();
            return data;
          }));
          
          const validResponses: ProfileType[] = usersResponses.flat().filter(res => res !== null)
          const uniqueValues: ProfileType[] = [];
          const userIds: Set<string> = new Set();
          console.log(userIds)

          validResponses.forEach(value => {
            if (!userIds.has(value.id)) {
              uniqueValues.push(value);
              userIds.add(value.id);
            }
          })
          setUsers(uniqueValues);
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