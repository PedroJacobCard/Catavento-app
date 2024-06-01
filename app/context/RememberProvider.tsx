'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, RememberType, UseRemeberContextType } from "@/utils/Types";

//import hooks
import useUser from "../hooks/useUser";

const initState: RememberType[] = [];

export const initContextState: UseRemeberContextType = {
  remembers: null,
  setRemembers: () => {}
}

export const RememberContext = createContext<UseRemeberContextType>(initContextState);

function RememberProvider({ children }: ChildrenPropsType) {
  //importar dados do usuário logado
  const { user } = useUser();

  //funcionalidades para adiquirir os dados dos lembretes de 
  //acordo com a escola e turno que o usuário logado participa
  const [remembers, setRemembers] = useState<RememberType[] | null>(initState);
  
  useEffect(() => {
    const getRemembers = async (): Promise<RememberType[]> => {
    //filtrar as escolas e turnos em que o usuário participa e obter os remembers referentes
    const userSchools = user?.school.map(({ schoolName, shifts }) => ({ schoolName, shifts }));

      try {
        if (userSchools) {
          const remembersResponse = Promise.all(userSchools.map(async school => {
            const response = await fetch(
              `/api/remember?schoolName=${school.schoolName}&shifts=${school.shifts}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                cache: "no-store"
              }
            );

            if (!response.ok) {
              return null;
            }

              const data = await response.json();
              //const filteredData = data.filter((remember: RememberType) => 
              //  userSchools?.some(({ schoolName, shifts }) => 
              //    schoolName === remember.schoolName &&
              //    shifts.some(shift => shift === remember.shift)
              //  )
              //);
              return data;
          }))
          const validData = (await remembersResponse).flat().filter(re => re !== null);
          setRemembers(validData);
        }
      } catch (error) {
        console.error('Error:', error)
      }
      return [];
    }

    getRemembers();
  }, [user]);


  return (
    <RememberContext.Provider value={{remembers, setRemembers}}>
      {children}
    </RememberContext.Provider>
  );
}

export default RememberProvider;