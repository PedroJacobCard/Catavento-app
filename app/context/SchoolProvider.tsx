'use client'

//import types
import { ChildrenPropsType, SchoolType } from "@/utils/Types";
import { createContext, useEffect, useState } from "react";

const initState: SchoolType[] = [];

export type UseSchoolContextType = {
  schools: SchoolType[],
};

const initContextState: UseSchoolContextType = {
  schools: [],
};

export const SchoolsContext = createContext<UseSchoolContextType>(initContextState);


function SchoolProvider({ children }: ChildrenPropsType ) {
  //salvar as escolas em um estado local
  const [schools, setSchools] = useState<SchoolType[]>(initState);

  //get schools
  useEffect(() => {
    const getSchools = async (): Promise<SchoolType[]> => {
      try {
        const response = await fetch('/api/school');
        if (response.ok) {
          const data = await response.json();
          setSchools(data)
          return data;
        }
      } catch (error) {
        console.log('error:', error)
      }
      return [];
    }
    getSchools();
  }, []);

  return (
    <SchoolsContext.Provider value={{schools}}>
      {
        children
      }
    </SchoolsContext.Provider>
  )
}

export default SchoolProvider;