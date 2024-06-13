'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, EventType, UseEventContextType } from "@/utils/Types";

//import costume hooks
import useUser from "../hooks/useUser";

const initState: EventType[] = [];

export const initContextState: UseEventContextType = {
  events: null,
  setEvents: () => {}
}

export const EventContext = createContext<UseEventContextType>(initContextState);

function EventProvider({ children }: ChildrenPropsType) {
  //inicializar as funções para armazenar os eventos em array
  const [events, setEvents] = useState<EventType[] | null>(initState);

  //importar dados do usuário logado
  const { user } = useUser();

  useEffect(() => {
    const getEvents = async (): Promise<EventType[] | null> => {
      try {
        //filtrar eventos que sejam para a equipe que o usuário logado participa
        const userSchools = user?.school.map(({ schoolName }) => ({ schoolName }));

        if (userSchools && !!userSchools) {
          const eventsResponses = await Promise.all(userSchools.map(async (school) => {
            const response = await fetch(`/api/event/${school.schoolName}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            });
    
            if (!response.ok) {
              return null;
            }

            const data = await response.json();
            return data;
          }));

          if (!eventsResponses) {
            return null;
          }

          const validEvents = eventsResponses.flat().filter(event => event !== null);
          setEvents(validEvents)
          return validEvents;
        }

      } catch (error) {
        console.error("Error:", error);
      }

      return null;
    };
    getEvents();
  }, [user]);

  console.log(events)
  return (
    <EventContext.Provider value={{ events, setEvents }}>{children}</EventContext.Provider>
  );
}

export default EventProvider;