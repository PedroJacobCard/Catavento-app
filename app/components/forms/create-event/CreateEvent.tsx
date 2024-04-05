'use client'
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

//import icons
import Close from '@/public/Cancel.svg';

//import react-hhok-form e schema de validação
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { schema, FieldValidationCreateEvent } from './ValidationSchemaCreateEvent';
import { zodResolver } from "@hookform/resolvers/zod";

//import costume hooks
import useUser from "@/app/hooks/useUser";

type CreateEventPropsType = {
  showCreateEventForm: boolean,
  setShowCreateEventForm: Dispatch<SetStateAction<boolean>>
}

function CreateEvent({ showCreateEventForm, setShowCreateEventForm }: CreateEventPropsType) {
  //importar dados do usuário logado
  const { user } = useUser();

  //funcionalidades para enviar os dados do formulário
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FieldValidationCreateEvent>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      subject: "",
      location: "",
      startTime: "",
      endTime: "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date: "",
      organizerId: user?.id,
      organizerSchool: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValidationCreateEvent> = (data) => {
    console.log(data)
  }

  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-50`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[55vw] lg:w-[35vw] h-[50vh] mx-2 lg:mx-[20rem] rounded-md pt-5 pb-5 overflow-y-scroll fixed top-[20vh] left-[0vw] md:left-[13vw] lg:left-[0vw]">
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
          <label htmlFor="Organizer School">Com a equipe de qual escola deseja criar o evento?</label>
          <Controller
            name="organizerSchool"
            control={control}
            render={({ field }) => (
              <select {...field}>
                {
                  user && user?.school.map((school, schoolIndex) => (
                    <option key={schoolIndex}>{school.schoolName}</option>
                  ))
                }
              </select>
            )}  
          />

          <button
            type="submit"
            className="w-[50%] mx-auto rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;