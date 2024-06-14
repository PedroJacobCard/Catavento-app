'use client'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, SchoolType } from "@/utils/Types";

//import costume hooks
import useUser from "../hooks/useUser";
import { useSession } from "next-auth/react";

const initState: SchoolType[] = [];

export type UseSchoolContextType = {
  schools: SchoolType[];
  setSchools: Dispatch<SetStateAction<SchoolType[]>>;
  userSchools: SchoolType[];
  setUserSchools: Dispatch<SetStateAction<SchoolType[]>>;
  editSchoolRemember: boolean;
  setEditSchoolRemember: Dispatch<SetStateAction<boolean>>;
};

const initContextState: UseSchoolContextType = {
  schools: [],
  setSchools: () => {},
  userSchools: [],
  setUserSchools: () => {},
  editSchoolRemember: false,
  setEditSchoolRemember: () => {}
};

export const SchoolsContext = createContext<UseSchoolContextType>(initContextState);


function SchoolProvider({ children }: ChildrenPropsType ) {
  //salvar as escolas em um estado local
  const [schools, setSchools] = useState<SchoolType[]>(initState);

  //adiquirir apenas escolas do usuário logado
  const [userSchools, setUserSchools] = useState<SchoolType[]>(initState);
  
    //user data
    const { user } = useUser();

  //funcionalidades para avisar ao usuário que está faltando dados relevantes em alguma escola
  const [editSchoolRemember, setEditSchoolRemember] = useState<boolean>(false);

    //get schools from the user
    useEffect(() => {
      const getUserSchools = async (): Promise<SchoolType[]> => {
        try {
          //funcionalidades para adiquirir apenas as escolas das quais o usuário trabalha
          const userSchools = user?.school.map((s) => s.schoolName);

          if (!userSchools) {
            console.error("Error ao carregar as escolas do usuário.");
            return [];
          }

          const userSchoolsResponses = await Promise.all(
            userSchools.map(async (schoolName) => {
              const response = await fetch(`/api/school/${schoolName}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                cache: "no-store",
              });

              if (!response.ok) {
                console.error("Não foi possível adquirir escolas do usuário.");
                return null;
              }

              const data = await response.json();
              return data;
            })
          );

          const validResponses = userSchoolsResponses.filter(
            (response) => response !== null
          );
          setUserSchools(validResponses);
        } catch (error) {
          console.log("error:", error);
        }
        return [];
      };

      getUserSchools();
    }, [user]);

    if (userSchools.length > 0) {
      if (
    (user?.role?.toString() === "COORDENADOR_A" &&
      userSchools.every((school) => school.address === "")) ||
      (user?.role?.toString() === "SECRETARIO_A" &&
        userSchools.every((school) => school.address === ""))) {
          return setEditSchoolRemember(true);
        }
    }
  
  return (
    <SchoolsContext.Provider value={{
      schools, 
      setSchools, 
      userSchools, 
      setUserSchools,
      editSchoolRemember,
      setEditSchoolRemember
    }}>
      {
        children
      }
    </SchoolsContext.Provider>
  )
}

export default SchoolProvider;