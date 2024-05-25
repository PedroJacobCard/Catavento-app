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
};

const initContextState: UseSchoolContextType = {
  schools: [],
  setSchools: () => {}
};

export const SchoolsContext = createContext<UseSchoolContextType>(initContextState);


function SchoolProvider({ children }: ChildrenPropsType ) {
  //salvar as escolas em um estado local
  const [schools, setSchools] = useState<SchoolType[]>(initState);

  //user data
  const { user } = useUser();
  const { data: session } = useSession();

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

    if (user || session) {
      getSchools();
    }
  }, [user, session]);

  return (
    <SchoolsContext.Provider value={{schools, setSchools}}>
      {
        children
      }
    </SchoolsContext.Provider>
  )
}

export default SchoolProvider;