'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, RememberType, UseRemeberContextType } from "@/utils/Types";

//import hooks
import useUser from "../hooks/useUser";

const initState: RememberType[] = [];

export const initContextState: UseRemeberContextType = {
  remembers: null,
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
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_DEV_API}/remember`
        );

        if (response.ok) {
          const data = await response.json();

          //filtrar as escolas e turnos em que o usuário participa e obter os remembers referentes
          const userSchools = user?.school.map(({ schoolName, shifts }) => ({ schoolName, shifts }));
          
          const filteredData = data.filter((remember: RememberType) => 
            userSchools?.some(({ schoolName, shifts }) => 
              schoolName === remember.schoolName &&
              shifts.some(shift => shift === remember.shift)
            )
          );

          setRemembers(filteredData);
          return filteredData;
        }
      } catch (error) {
        console.error('Error:', error)
      }
      return [];
    }

    getRemembers();
  }, [user]);


  return (
    <RememberContext.Provider value={{remembers}}>
      {children}
    </RememberContext.Provider>
  );
}

export default RememberProvider;