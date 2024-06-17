'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, ClassType, UseClassContextTypes } from "@/utils/Types";

//import costume hooks
import useUser from "../hooks/useUser";

const initState: ClassType[] = [];

export const initContextState: UseClassContextTypes = {
  classes: null,
  setClasses: () => {}
}

export const ClassContext = createContext<UseClassContextTypes>(initContextState);

function ClassProvider({ children }: ChildrenPropsType) {
  //importar dados do usuário logado
  const { user } = useUser();
  
  //funcionalidades para salvar o request de classes em array
  const [classes, setClasses] = useState<ClassType[] | null>(initState);

  useEffect(() => {
    const getClasses = async (): Promise<ClassType[] | null> => {
      try {
        if (user && !!user) {
          //funcionalidades para adiquirir apenas classes das escolas que o usuário logado participa
          const userSchools = user.school.map(({schoolName, shifts}) => ({schoolName, shifts}));

          const classesResponse = await Promise.all(userSchools.map(async (school) => {
            const response = await fetch(`/api/class?schoolName=${school.schoolName}&shifts=${school.shifts}`, {
              method: "GET",
              headers: {
                'Content-Type': 'application/json'
              },
              cache: "no-store"
            });

            if (!response.ok) {
              return null;
            }

            const data = await response.json();
            return data;
          }))

          const validatedData = classesResponse.flat().filter(cla => cla !== null);
  
          setClasses(validatedData);
        }
      } catch (error) {
        console.error("Error:", error)
      }
      return null;
    }
    getClasses();
  }, [user])

  return ( 
    <ClassContext.Provider value={{classes, setClasses}}>
      { children }
    </ClassContext.Provider>
   );
}

export default ClassProvider;