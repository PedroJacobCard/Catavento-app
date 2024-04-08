'use client'

import { useEffect, useRef, useState } from "react";

//import icons
import Plane from "@/public/Plane.svg";
import Image from "next/image";

//import schema de validação e react-hook-form
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FieldValuesCreateRemember, schema } from "./ValidationSchemaCreateRemember";
import { zodResolver } from "@hookform/resolvers/zod";

//import costume hooks
import useUser from "@/app/hooks/useUser";
import toast from "react-hot-toast";

function CreateRemember() {
  //importar dados do usuário logado
  const { user } = useUser();

  //funcionalidades para aumentar a caixa de texto
  const [grow, setGrow] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        setGrow(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    if (!grow) {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [grow])

  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FieldValuesCreateRemember>({
    resolver: zodResolver(schema),
    defaultValues: {
      authorId: user?.id,
      authorName: user?.name,
      content: ''
    },
  })

  const onSubmit: SubmitHandler<FieldValuesCreateRemember> = (data) => {
    const formData = {
      ...data,
      authorId: user?.id,
      authorName: user?.name
    }
    console.log(formData)
    setGrow(prev => !prev);
    reset()
  }

  useEffect(() => {
    if (errors.content) { 
      toast.error(`Ops! ${errors.content.message}`);
    }
  }, [errors])

  return (
    <div
      ref={divRef}
      className={`${
        grow ? "top-[73vh] h-[10rem]" : "h-auto top-[89vh]"
      } w-full flex justify-center items-center px-4 py-4 dark:bg-darkModeBgColor bg-secondaryBlue shadow-upShadow absolute overflow-y-scroll duration-300`}
      >
        
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${
          grow ? "block" : "hidden"
        } flex justify-center items-center overflow-hidden w-full`}
      >
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={1}
              placeholder="escrever lembrete..."
              className="w-full md:w-[8rem] lg:w-[11rem] h-[7rem] pl-4 py-3 dark:bg-darkMode rounded-l-[.5rem] outline-none md:text-sm text-base"
            />
          )}
        />

        <button
          type="submit"
          className="dark:bg-darkMode bg-white w-10 h-[7rem] py-[.5rem] px-2 rounded-r-[.5rem] hover:dark:shadow-darkModeBgColor hover:shadow-lg"
          >
          <Image
            src={Plane}
            alt="Enviar"
            width={20}
            height={20}
            priority={true}
            />
        </button>
      </form>

      <input
        type="text"
        name="remember"
        placeholder="escrever lembrete..."
        className={`${
          grow ? "hidden" : "block"
        } w-full md:w-[8rem] lg:w-[11rem] h-9 pl-4 dark:bg-darkMode rounded-l-full outline-none md:text-sm text-base`}
        onClick={() => setGrow((prev) => !prev)}
        />
      <button
        type="button"
        className={`${
          grow ? "hidden" : "block"
        } dark:bg-darkMode bg-white w-10 py-[.5rem] px-2 rounded-r-full`}
        >
        <Image
          src={Plane}
          alt="Enviar"
          width={20}
          height={20}
          priority={true}
        />
      </button>
    </div>
  );
}

export default CreateRemember;