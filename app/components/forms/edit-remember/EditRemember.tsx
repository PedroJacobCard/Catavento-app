'use client'
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

//import icons
import Bin from "@/public/Bin.svg";
import Close from '@/public/Cancel.svg';

//import schema validação e react-hook-form
import { schema, FiledsValuesEditRemember } from "./ValidationSchemaEditRemember";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import useRemember from "@/app/hooks/useRemember";

type EditRememberPropsType = {
  showForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  rememberId: string | undefined;
  content: string | undefined;
};

function EditRemember({ showForm, setShowForm, rememberId, content }: EditRememberPropsType) {

  //importar o setter para alterar ou deletar do array
  const { setRemembers } = useRemember();
  
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

  const onSubmit: SubmitHandler<FiledsValuesEditRemember> = async (data) => {
    try {
      const response = await fetch(`/api/remember/${rememberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify(data)
      });

      if (!response) {
        return;
      }

      setShowForm(!showForm);
    } catch (error) {
      console.error("Erro ao alterar o conteúdo do lembrete: ", error);
      toast.error("Hum... Algo deu errado...")
    }
  }

  //funcionalidades para deletar lembretes
  const handleDelelteRemember = async () => {
    const confirm = window.confirm(`Tem certeza que deseja deletar este lembrete?`);

    if (confirm) {
      try {
        const response = await fetch(`/api/remember/${rememberId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          cache: "no-store"
        });
  
        if (!response) {
          toast.error('Hum... Erro ao deletar lembrete...')
        }
  
        const data = await response.json();
  
        setRemembers(prev => {
          if (prev !== null) {
            const filteredData = prev?.filter(re => re.id !== data.id);
            return [...filteredData]
          }
          return []
        })
  
        toast.success("Lembrete deletado!");
        setShowForm(!showForm);
      } catch (error) {
        console.log("Error ao deletar lembrete: ", error)
      }
    }
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] ${
        showForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[50vw] h-[60vh] mx-2 rounded-md pt-5 pb-5 overflow-y-scroll">
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
            className="w-[11rem] flex items-center gap-3 rounded-md p-2 shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(168,66,66)] hover:bg-red-200  hover:border-red-600 duration-300"
            onClick={handleDelelteRemember}
          >
            <Image
              src={Bin}
              alt="Fechar form"
              width={20}
              height={20}
              priority={true}
            />
            Deletar Lembrete
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center px-5 mt-5 h-full my-auto overflow-y-scroll"
        >
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <textarea
                rows={7}
                {...field}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            )}
          />

          <button
            type="submit"
            className="w-[50%] mx-auto my-1 py-2 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRemember;