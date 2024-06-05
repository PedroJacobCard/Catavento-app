'use client'
import { createContext, useEffect, useState } from "react";

//import pusher client
import Pusher from "pusher-js";

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
    //initiate pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    //obter realtime mensagens
    pusher.subscribe("remember").bind("content", (incoming: {verb: string, data: RememberType}) => {
      if (incoming.verb === "POST") {
        setRemembers((prev) => {
          if (prev !== null) {
            const filterData = prev.filter((re) => re.id !== incoming.data.id);

            return [...filterData, incoming.data];
          }

          return [];
        });

        //enviar notificação do navegador
        if (Notification.permission === 'granted') {
          new Notification(`${incoming.data.authorName} enviou um lembrete: ${incoming.data.content}`);
        } else if (Notification.permission === 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(
                `${incoming.data.authorName} enviou um lembrete: ${incoming.data.content}`
              );
            }
          })
        }
      } else if (incoming.verb === "PUT") {
        setRemembers((prev) => {
          if (prev !== null) {
            const uptodatedIndex = prev.findIndex((re) => re.id === incoming.data.id);

            return [
              ...prev.slice(0, uptodatedIndex), 
              incoming.data, 
              ...prev.slice(uptodatedIndex + 1)
            ];
          }

          return [];
        });
      } else {
        setRemembers((prev) => {
          if (prev !== null) {
            const filterData = prev.filter((re) => re.id !== incoming.data.id);

            return [...filterData];
          }

          return [];
        });
      }
    });
  }, []);
  
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