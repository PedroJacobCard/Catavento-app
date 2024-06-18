'use client'
import Image from "next/image";
import { Dispatch, SetStateAction, useState} from "react";

//import icons
import Close from '@/public/Cancel.svg';
import Logo from '@/public/Logo-principal.svg';

//import react-hook-form e schema de validação
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { schema, FieldValidationCreateEvent } from './ValidationSchemaCreateEvent';
import { zodResolver } from "@hookform/resolvers/zod";

//import costume hooks
import useUser from "@/app/hooks/useUser";
import useEvent from "@/app/hooks/useEvent";

//import toaster
import toast from "react-hot-toast";

//props type
type CreateEventPropsType = {
  showCreateEventForm: boolean,
  setShowCreateEventForm: Dispatch<SetStateAction<boolean>>
}

function CreateEvent({ showCreateEventForm, setShowCreateEventForm }: CreateEventPropsType) {
  //criar lógica de loading para criação do evento
  const [loading, setLoading] = useState<boolean>(false);

  //importar dados do usuário logado
  const { user } = useUser();

  //importar setter do array de eventos
  const { setEvents } = useEvent();

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  //funcionalidades para enviar os dados do formulário
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    register,
    } = useForm<FieldValidationCreateEvent>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: "",
        subject: "",
        location: "",
        startTime: Intl.DateTimeFormat().resolvedOptions().hour,
        endTime: Intl.DateTimeFormat().resolvedOptions().hour,
        timeZone: timeZone,
      date: "",
      organizerId: user?.id,
      organizerSchool: "",
      },
      });
      
  const onSubmit: SubmitHandler<FieldValidationCreateEvent> = async (data) => {
    const startTime = new Date(`${data.date}T${data.startTime}`);
    const endTime = new Date(`${data.date}T${data.endTime}`);
    const date = new Date(`${data.date}T${data.startTime}`);

    const formData = {
      title: data.title,
      subject: data.subject,
      location: data.location,
      date,
      organizerId: user?.id,
      organizerSchool: data.organizerSchool,
      timeZone: timeZone,
      startTime,
      endTime,
    }

    setLoading(true);

    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        cache: "no-store",
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        toast.error("Hum... Algo deu errado...");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setEvents(prev => {
        if (!!prev) {
          return [...prev, data];
        }
        return [data];
      })
        
      reset();
      setShowCreateEventForm(!showCreateEventForm);
      setLoading(false);
      toast.success("Evento criado com sucesso!")
    } catch (error) {
      console.error("Erro ao criar evento: ", error);
      toast.error("Hum... Algo deu errado...");
    }
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] ${
        showCreateEventForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[50vw] h-[80vh] mx-2 rounded-md pt-5 pb-5 overflow-y-scroll">
        <div className="flex justify-between items-center px-5">
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
            onClick={() => setShowCreateEventForm(!showCreateEventForm)}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9 overflow-y-scroll"
        >
          <label htmlFor="Escola" className="m-auto font-bold mb-1">
            Com a equipe de qual escola deseja criar o evento?
          </label>
          <select
            className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
            {...register("organizerSchool")}
          >
            {user &&
              user.school.map((school, schoolIndex) => (
                <option key={schoolIndex} value={school.schoolName}>
                  {school.schoolName}
                </option>
              ))}
          </select>
          {errors.organizerSchool && (
            <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
              {errors.organizerSchool.message}
            </p>
          )}

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="Data" className="m-auto font-bold mb-1">
                  Data:
                </label>
                <input
                  type="date"
                  id="eventDate"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
                {errors.date && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
                    {errors.date.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="Título" className="m-auto font-bold mb-1">
                  Título:
                </label>
                <input
                  type="text"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
                    {errors.title.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="Assunto" className="m-auto font-bold mb-1">
                  Assunto:
                </label>
                <textarea
                  rows={3}
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
                    {errors.subject.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="Local" className="m-auto font-bold mb-1">
                  Local:
                </label>
                <input
                  type="text"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
                {errors.location && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
                    {errors.location.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="Horário inicial"
                  className="m-auto font-bold mb-1"
                >
                  Horário Inicial:
                </label>
                <input
                  type="time"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
                {errors.startTime && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
                    {errors.startTime.message}
                  </p>
                )}
              </>
            )}
          />

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="Horário de término"
                  className="m-auto font-bold mb-1"
                >
                  Horário de Término:
                </label>
                <input
                  type="time"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
                {errors.endTime && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
                    {errors.endTime.message}
                  </p>
                )}
              </>
            )}
          />

          <button
            type="submit"
            className="w-[50%] mx-auto mb-2 py-2 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            {loading ? (
              <Image
                src={Logo}
                alt="Catavento loading"
                width={30}
                height={30}
                priority={true}
                className="animate-spin m-auto"
              />
            ) : (
              "Enviar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;