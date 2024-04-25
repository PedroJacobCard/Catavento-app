'use client'
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

//import icons
import Close from "@/public/Cancel.svg";

//import react-hook-form e schema de validação
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { schema, FieldValuesCreateReport } from './ValidationSchemaCreateReport';
import { zodResolver } from "@hookform/resolvers/zod";

//import toaster
import toast from "react-hot-toast";
import { activitiesDoneArray, resourcesArray } from "@/lib/EnumsToArray";

//props type
type CreateReportPropsType = {
  showCreateReportForm: boolean;
  setShowCreateReportForm: Dispatch<SetStateAction<boolean>>;
  schoolName: string;
  theme: string;
  shift: string;
};

function CreateReport({ showCreateReportForm, setShowCreateReportForm, theme, schoolName, shift }: CreateReportPropsType) {
  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FieldValuesCreateReport>({
    resolver: zodResolver(schema),
    defaultValues: {}
  })

  //não renderiza o componente se não for o relatório selecionado
  if(!showCreateReportForm) return null;

  const onSubmit: SubmitHandler<FieldValuesCreateReport> = (data) => {
    toast.success("Relatório enviado com sucesso!");
    reset();
    setShowCreateReportForm(!showCreateReportForm)
    console.log(data);
  }

  return (
    <div
      className={`${
        showCreateReportForm ? "block" : "hidden"
      } w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-50`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[55vw] lg:w-[35vw] h-[50vh] mx-2 lg:mx-[20rem] rounded-md pt-5 pb-3 overflow-y-scroll fixed top-[20vh] left-[0vw] md:left-[13vw] lg:left-[0vw]">
        <div className="flex justify-between items-center px-5">
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
            onClick={() => setShowCreateReportForm(!showCreateReportForm)}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9 overflow-y-scroll"
        >
          <label htmlFor="activitiesDone" className="m-auto font-bold mb-1">
            Atividades realizadas nesta temática:
          </label>
          {activitiesDoneArray.map((activity, activityIndex) => (
            <div key={activityIndex} className={`flex gap-3 ${activityIndex === activitiesDoneArray.length - 1 ? 'mb-5' : ''}`}>
              <input type="checkbox" className="mb-2" />
              <p>{activity}</p>
            </div>
          ))}

          <label htmlFor="activitiesDone" className="m-auto font-bold mb-1">
            Materiais utilizados:
          </label>
          {resourcesArray.map((resource, resourceIndex) => (
            <div key={resourceIndex} className={`flex gap-3 ${resourceIndex === resourcesArray.length - 1 ? 'mb-5' : ''}`}>
              <input type="checkbox" className="mb-2" />
              <p>{resource}</p>
            </div>
          ))}

          <button
            type="submit"
            className="w-[50%] mx-auto mb-2 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateReport;