'use client'
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

//import icons
import Close from "@/public/Cancel.svg";

//import react-hook-form e schema de validação
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { schema, FieldValuesCreateClass } from './ValidationSchemaCreateClass';
import { zodResolver } from "@hookform/resolvers/zod";

//import toaster
import toast from "react-hot-toast";

//import costume hooks
import useClass from "@/app/hooks/useClass";

//props type
type CreateClassPropsType = {
  showCreateClassForm: boolean,
  setShowCreateClassForm: Dispatch<SetStateAction<boolean>>,
  schoolName: string,
  theme: string,
  shift: string
};

function CreateClass({ showCreateClassForm, setShowCreateClassForm, schoolName, theme, shift }: CreateClassPropsType) {
  //funcionalidades para enviar se a classe já fez a temática ou não
  const [classDone, setClassDone] = useState<boolean>(false);

  //import setter classes state
  const { setClasses } = useClass();

  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValuesCreateClass>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      students: 0,
      done: classDone,
      schoolName: schoolName,
      theme: theme,
      shift: shift,
    },
  });

  const onSubmit: SubmitHandler<FieldValuesCreateClass> = async (data) => {
    const formData = {
      ...data,
      done: classDone,
    };

    try {
      const response = await fetch('/api/class', {
        method: 'POST',
        headers: {
          'Content-Type': 'apllication/json'
        },
        cache: 'no-store',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setClasses(prev => {
        if (prev !== null && data !== null) {
          return [...prev, data]
        }
        return [data]
      })

      setShowCreateClassForm(!setShowCreateClassForm);
      reset();
      toast.success("Classe criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar classe");
      toast.error("Hum... Algo deu errado...")
    }
  };

  return (
    <div
      className={`flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] ${
        showCreateClassForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[50vw] h-[65vh] mx-2 rounded-md pt-5 pb-5 overflow-y-scroll">
        <div className="flex justify-between items-center px-5">
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
            onClick={() => setShowCreateClassForm(!showCreateClassForm)}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9 overflow-y-scroll"
        >
          <label htmlFor="Nome" className="m-auto font-bold mb-1">
            Nome da classe:
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Ex.: 6° A"
                {...field}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            )}
          />
          {errors.name && (
            <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
              {errors.name.message}
            </p>
          )}

          <label htmlFor="Alunos" className="m-auto font-bold mb-1">
            Número de alunos da classe:
          </label>
          <Controller
            name="students"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                min="0"
                placeholder="Ex.: 6° A"
                value={field.value} // Ensure field value is a number
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value, 10); // Parse input value to a number
                  field.onChange(parsedValue); // Pass the parsed value to the field's onChange function
                }}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            )}
          />
          {errors.students && (
            <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
              {errors.students.message}
            </p>
          )}

          <div className="flex flex-col justify-start">
            <label htmlFor="Completou" className="m-auto font-bold mb-1">
              Esta classe já completou a temática {theme}?
            </label>
            <input
              type="checkbox"
              checked={classDone}
              onChange={(e) => setClassDone(e.target.checked)}
              className="mb-5"
            />
          </div>

          <button
            type="submit"
            className="w-[50%] mx-auto mb-2 py-2 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateClass;