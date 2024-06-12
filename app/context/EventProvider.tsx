'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, EventType, UseEventContextType } from "@/utils/Types";

//import costume hooks
import useUser from "../hooks/useUser";

const initState: EventType[] = [];

export const initContextState: UseEventContextType = {
  events: null,
}

export const EventContext = createContext<UseEventContextType>(initContextState);

function EventProvider({ children }: ChildrenPropsType) {
  //inicializar as funções para armazenar os eventos em array
  const [events, setEvents] = useState<EventType[] | null>(initState);

  //importar dados do usuário logado
  const { user } = useUser();

  //useEffect(() => {
  //  const getEvents = async (): Promise<EventType[] | //null> => {
  //    try {
  //      const response = await fetch(
  //        `${process.env.NEXT_PUBLIC_BASE_URL_DEV_API}///event`
  //      );
//
  //      if (response.ok) {
  //        const data = await response.json();
//
  //        //filtrar eventos que sejam para a equipe //que o usuário logado participa
  //        const userSchools = user?.school.map(({ //schoolName }) => ({ schoolName }))
  //        const filteredData = data.filter((event: //EventType) => userSchools?.some(s => s.//schoolName === event.organizerSchool));
  //        setEvents(filteredData);
  //        return filteredData;
  //      }
  //    } catch (error) {
  //      console.error("Error:", error);
  //    }
//
  //    return null;
  //  };
  //  getEvents();
  //}, [user]);

  return (
    <EventContext.Provider value={{ events }}>{children}</EventContext.Provider>
  );
}

export default EventProvider;