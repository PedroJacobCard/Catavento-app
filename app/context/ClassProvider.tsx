'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, ClassType, UseClassContextTypes } from "@/utils/Types";

//import costume hooks
import useUser from "../hooks/useUser";

const initState: ClassType[] = [];

export const initContextState: UseClassContextTypes = {
  classes: null,
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_DEV_API}/class`
        );

        if (response.ok) {
          const data = await response.json();

          //funcionalidades para adiquirir apenas classes das escolas que o usuário logado participa
          const filteredData = data?.filter((cla: ClassType) => user?.school.some(s => s.schoolName === cla.schoolName));
          setClasses(filteredData);
          return filteredData;
        }
      } catch (error) {
        console.error("Error:", error)
      }
      return null;
    }
    getClasses();
  }, [user])

  return ( 
    <ClassContext.Provider value={{classes}}>
      { children }
    </ClassContext.Provider>
   );
}

export default ClassProvider;