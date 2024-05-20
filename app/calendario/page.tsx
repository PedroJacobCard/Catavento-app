'use client'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Marker from '@/public/Marker.svg';
import Plus from '@/public/Plus.svg';

//import components
import Navbar from "@/app/components/Navbar";
import RememberField from "@/app/components/RememberField";
import Footer from "../components/Footer";
import CreateEvent from "../components/forms/create-event/CreateEvent";
import EditEvent from "../components/forms/edit-event/EditEvent";
import Loading from "../components/Loading";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";

//import costume hooks
import useEvent from "../hooks/useEvent";
import useUser from "../hooks/useUser";

//import session and navigation
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function Calendario() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //importar event dados
  const { events } = useEvent();

  //importar dados do usuário logado
  const { user } = useUser();

  //funcionalidades para aparecer o formulário de edição de eventos
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editEventIndex, setEditEventIndex] = useState<number>(0);

  //funcionalidades para aparecer o formulário de criação de eventos
  const [showCreateEventForm, setShowCreateEventForm] =
    useState<boolean>(false);

  //session
  const { status, data: session } = useSession();

  //verifica o status da seção
  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar />
      <RememberField
        isRememberOpen={isRememberOpen}
        setIsRememberOpen={setIsRememberOpen}
      />
      <div className="max-w-full min-h-[100vh] pb-[16rem] md:pb-[12rem] md:mr-[12.5rem] lg:mr-[15.6rem] md:ml-[4.4rem] relative">
        <header className="w-full h-[4rem] dark:bg-darkMode bg-primaryBlue flex md:hidden justify-center items-center fixed top-0 z-50">
          <Link href={"/"}>
            <Image
              src={Logo}
              alt="Catavento logo"
              width={50}
              priority={true}
              className="rounded-full"
            />
          </Link>
          <Image
            src={Plane}
            alt="Lembretes"
            width={20}
            priority={true}
            className="fixed left-[90%] cursor-pointer"
            onClick={() => setIsRememberOpen((prev) => !prev)}
          />
        </header>

        <ShowShadow>
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Calendário</h1>
        </ShowShadow>

        {events &&
          events.map((event, eventIndex) => (
            <section
              key={eventIndex}
              className={`dark:bg-darkMode bg-primaryBlue ${
                eventIndex === 0 ? "mt-[9rem] md:mt-[5rem]" : "mt-5"
              } mx-2 md:mx-[2rem] rounded-md overflow-hidden py-5 shadow-md`}
            >
              <div className="flex items-center justify-start lg:justify-center gap-8 relative">
                <p className="absolute left-5 top-[80%] lg:top-0 text-xl font-bold">
                  {event.date}
                </p>
                <h1 className="max-w-[300px] lg:max-w-[350px] pb-5 pl-5 lg:pl-0 font-bold">
                  {event.organizerSchool}
                </h1>
                {user?.user.role?.toString() !== "VOLUNTARIO_A" &&
                user?.school.some(
                  (s) => s.schoolName === event.organizerSchool
                ) ? (
                  <Image
                    src={Marker}
                    alt="Icon para editar"
                    width={25}
                    height={25}
                    priority={true}
                    className="absolute left-[90%] lg:left-[95%] top-0 cursor-pointer"
                    onClick={() => {
                      setEditEventIndex(eventIndex);
                      setShowForm((prev) => !prev);
                    }}
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="flex flex-col items-start mx-2 mt-5 gap-3 p-3 lg:py-0">
                <p className="font-bold">
                  Título: <span className="font-normal">{event.title}</span>
                </p>
                <p className="font-bold">
                  Assunto: <span className="font-normal">{event.subject}</span>
                </p>
                <p className="font-bold">
                  Local: <span className="font-normal">{event.location}</span>
                </p>
                <p className="font-bold">
                  Horário:{" "}
                  <span className="font-normal">{`${event.startTime} - ${event.endTime}`}</span>
                </p>
              </div>
              <EditEvent
                showForm={editEventIndex === eventIndex && showForm}
                setShowForm={setShowForm}
                eventId={event.id}
              />
            </section>
          ))}

        {user?.user.role?.toString() !== "VOLUNTARIO_A" ? (
          <button
            type="button"
            className="flex items-center w-[8rem] gap-3 m-auto py-1 px-2 mt-5 shadow-md dark:bg-darkMode bg-primaryBlue     rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
            onClick={() => setShowCreateEventForm((prev) => !prev)}
          >
            <Image src={Plus} width={15} height={15} alt="Adicionar" />
            Criar Evento
          </button>
        ) : (
          ""
        )}

        <CreateEvent
          showCreateEventForm={showCreateEventForm}
          setShowCreateEventForm={setShowCreateEventForm}
        />

        <Footer />
      </div>
    </>
  );
}

export default Calendario;
