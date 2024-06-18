"use client";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

//import icons
import Close from "@/public/Cancel.svg";
import Bin from "@/public/Bin.svg";

//import react-hook-form e schema de validação
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { schema, FieldValuesEditClass } from "./ValidationSchemaEditClass";
import { zodResolver } from "@hookform/resolvers/zod";

//import toaster
import toast from "react-hot-toast";

//import types
import { ClassType } from "@/utils/Types";

//import costume hooks
import useClass from "@/app/hooks/useClass";

//props type
type EditClassPropsType = {
  showEditClassForm: boolean;
  setShowEditClassForm: Dispatch<SetStateAction<boolean>>;
  cla: ClassType;
};

function EditClass({
  showEditClassForm,
  setShowEditClassForm,
  cla
}: EditClassPropsType) {
  //funcionalidades para enviar se a classe já fez a temática ou não
  const [classDone, setClassDone] = useState<boolean>(cla.done);

  //importar setter do array de dados de classes
  const { setClasses } = useClass();

  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValuesEditClass>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: cla.name || "",
      students: cla.students || 0,
      done: cla.done || false,
      schoolName: cla.schoolName || "",
      theme: cla.theme.toString() || "",
      shift: cla.shift.toString() || "",
    },
  });

  //não renderiza o component se não for a classe chamada
  if (!showEditClassForm) return null;

  const onSubmit: SubmitHandler<FieldValuesEditClass> = async (data) => {
    const formData = {
      ...data,
      done: classDone,
    };

    try {
      const response = await fetch(`/api/class/${cla.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json'
        },
        cache: "no-store",
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        toast.error('Hum... Algo deu errado...')
        return;
      }

      const data = await response.json();

      setClasses(prev => {
        if (prev !== null) {
          const classIndex = prev.findIndex(cla => cla.id === data.id);
          return [
            ...prev.slice(0, classIndex),
            data,
            ...prev.slice(classIndex + 1)
          ];
        }
        return null;
      })

      setShowEditClassForm(!setShowEditClassForm);
      reset();
      toast.success("Classe editada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar classe.")
      toast.error('Hum... Não foi possível alter classe...')
    }
  };

  //funcionalidades para deletar classes
  const handleDeleteClass = async () => {
    const confirm = window.confirm("Tem certeza de que deseja deletar esta classe?");

    if (confirm) {
      try {
        const response = await fetch(`/api/class/${cla.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store"
        });
  
        if (!response.ok) {
          toast.error("Hum... Algo deu errado...");
          return;
        }
  
        const data = await response.json();
  
        setClasses((prev) => {
          if (prev !== null) {
            const filterClasses = prev.filter((cla) => cla.id !== data.id);
            return [...filterClasses];
          }
          return null;
        });
  
        setShowEditClassForm(!setShowEditClassForm);
        reset();
        toast.success("Classe deletada com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar classe.");
        toast.error("Hum... Não foi possível deletar classe...");
      }
    }
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] ${
        showEditClassForm ? "block" : "hidden"
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
            onClick={() => setShowEditClassForm(!showEditClassForm)}
          />

          <button
            type="button"
            className="w-[10rem] flex items-center gap-3 rounded-md p-2 shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(168,66,66)] hover:bg-red-200  hover:border-red-600 duration-300"
            onClick={handleDeleteClass}
          >
            <Image
              src={Bin}
              alt="Fechar form"
              width={20}
              height={20}
              priority={true}
            />
            Deletar classe
          </button>
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
              Esta classe já completou a temática {cla.theme}?
            </label>
            <input
              type="checkbox"
              checked={classDone}
              onChange={(e) => setClassDone(e.target.checked)}
              className="mb-5 cursor-pointer"
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

export default EditClass;
