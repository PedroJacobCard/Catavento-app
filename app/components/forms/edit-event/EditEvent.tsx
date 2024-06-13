'use client'
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

//import schema de validação e react-hook-form
import { schema, FieldValuesEditEvent } from './ValidationSchemaEditEvent';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//import icons
import Close from "@/public/Cancel.svg";
import Bin from "@/public/Bin.svg";

//import toaster
import toast from "react-hot-toast";

//import costume hooks
import useUser from "@/app/hooks/useUser";
import useEvent from "@/app/hooks/useEvent";


//props type
type EditEventPropsType = {
  showForm: boolean,
  setShowForm: Dispatch<SetStateAction<boolean>>,
  eventId: string
}

function EditEvent({ showForm, setShowForm, eventId }: EditEventPropsType) {
  //import dados do usuário logado
  const { user } = useUser();

  //import dados do evento selecionado
  const { events } = useEvent();
  const selectedEvent = events?.filter(event => event.id === eventId);

  //funcionalidades para eviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<FieldValuesEditEvent>({
    resolver: zodResolver(schema),
    defaultValues: {
      organizerSchool: selectedEvent?.[0].organizerSchool || "",
      organizerId: selectedEvent?.[0].organizerId || user!.id!,
      title: selectedEvent?.[0].title || "",
      subject: selectedEvent?.[0].subject || "",
      location: selectedEvent?.[0].location || "",
      startTime: selectedEvent?.[0].startTime || "",
      endTime: selectedEvent?.[0].endTime || "",
      timeZone: selectedEvent?.[0].timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: selectedEvent?.[0].date || "",
    },
  });

  //se não for o evento selecionado para edição, a cópia do formulário não renderiza
  if (!showForm) return null;

  const onSubmit: SubmitHandler<FieldValuesEditEvent> = (data) => {
    console.log(data);
    reset();
    setShowForm(!showForm);
    toast.success("Evento editado com sucesso!")
  }
  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-50 ${
        showForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] h-[50vh] md:w-[55vw] lg:w-[35vw] mx-2 lg:mx-[20rem] rounded-md pt-5 pb-5 overflow-y-scroll fixed top-[20vh] left-[0vw] md:left-[13vw] lg:left-[0vw]">
        <div className="flex justify-between items-center px-5">
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          />
          <button
            type="button"
            className="w-[10rem] flex items-center gap-3 rounded-md p-2 shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(168,66,66)] hover:bg-red-200  hover:border-red-600 duration-300"
          >
            <Image
              src={Bin}
              alt="Fechar form"
              width={20}
              height={20}
              priority={true}
            />
            Deletar Evento
          </button>
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
            className="w-[50%] mx-auto my-1 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;