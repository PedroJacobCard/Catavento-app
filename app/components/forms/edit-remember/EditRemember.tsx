'use client'
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

//import icons
import Info from "@/public/Info.svg";
import Close from '@/public/Cancel.svg';

//import schema validação e react-hook-form
import { schema, FiledsValuesEditRemember } from "./ValidationSchemaEditRemember";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type EditRememberPropsType = {
  showForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  rememberId: string | undefined;
  content: string | undefined;
};

function EditRemember({ showForm, setShowForm, rememberId, content }: EditRememberPropsType) {
  
  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit
  } = useForm<FiledsValuesEditRemember>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: content
    }
  });
  
  //se não form o formulário do remember selecionado o componente não redenriza
  if(!showForm) return null;

  const onSubmit: SubmitHandler<FiledsValuesEditRemember> = (data) => {
    const formData = {
      ...data,
      id: rememberId
    }
    console.log(formData)
  }

  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-50 ${
        showForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[55vw] lg:w-[35vw] mx-2 lg:mx-[20rem] rounded-md pt-5 pb-5 overflow-y-scroll fixed top-[20vh] left-[0vw] md:left-[13vw] lg:left-[0vw]">
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
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9 overflow-y-scroll"
        >
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
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

export default EditRemember;