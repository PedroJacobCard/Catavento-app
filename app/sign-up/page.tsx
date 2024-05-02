'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//import icons
import LoginPicture from "@/public/images/login-picture.png";
import Logo from "@/public/Logo-navabar-extended.svg";
import GoogleLogo from "@/public/Google.svg";
import Alert from '@/public/Alert.svg';
import Info from "@/public/Info.svg";

//import react-form-hooks e schema para validação 
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FieldValuesRegister, schema } from "./ValidationSchemaRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { rolesArray } from "@/lib/EnumsToArray";

function SignUp() {
  //funcionalidades para conectar com o Google calendário
  const [connect, setConnect] = useState<boolean>(false);

  //funcionalidades para checar o valor de papel selecionado
  const [selectedRole, setSelectedRole] = useState<string>("");

  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValuesRegister>({
    resolver: zodResolver(schema),
    defaultValues: {
      connectedToCalender: connect,
      role: '',
      schoolCreated: { name: "", shift: [] },
      school: { name: "", shift: [] },
    },
  });

  const onSubmit: SubmitHandler<FieldValuesRegister> = (data) => {
    const formData = {
      ...data,
      connectedToCalender: connect
    };
    toast.success("Perfil criado com successo!")
    console.log(formData);
  }

  return (
    <div className="w-full h-[100vh] flex flex-col lg:flex-row justify-center items-center">
      <div className="w-full lg:w-[50vw] h-full flex justify-center items-center">
        <Image
          src={LoginPicture}
          alt="Login Picture"
          height={100}
          width={334}
          className="mx-auto"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="dark:bg-darkModeGlass bg-primaryBlueGlass w-[95vw] h-[80vh] md:w-[65vw] lg:w-[50vw] lg:h-[100vh] p-[2rem] flex flex-col justify-start items-start fixed lg:relative rounded-md lg:rounded-none overflow-y-scroll"
      >
        <Image src={Logo} alt="logo" width={200} className="mx-auto" />

        <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-infoBlue rounded-md shadow-md my-3 relative">
          <div className="h-[100%] w-[10px] bg-infoTrackBlue absolute rounded-l-md" />
          <Image
            src={Info}
            alt="informativo"
            width={24}
            height={24}
            className="ml-4"
          />
          <p className="text-sm flex flex-col">
            Ao conectar-se com o Google Agenda, serão salvos no teu calendário,
            os eventos criados neste App.
          </p>
        </div>

        <div className="flex gap-3 items-center mb-3">
          <input
            type="checkbox"
            checked={connect}
            onChange={(e) => setConnect(e.target.checked)}
          />
          <label htmlFor="Connectar com o Google Agenda">
            Conectar-se com o Google Agenda.
          </label>
        </div>

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <>
              <label className="font-bold text-lg mb-1 mx-auto">
                Selecionar papel
              </label>
              <select
                name="Papel"
                className="w-[100%] py-2 mx-auto mb-5 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark   dark:bg-darkModeBgColor bg-primaryBlue px-1 cursor-pointer"
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  field.onChange(e.target.value);
                }}
                value={field.value}
              >
                {rolesArray.map((role, roleIndex) => (
                  <option key={roleIndex}>{role}</option>
                ))}
              </select>
            </>
          )}
        />

        {
          selectedRole === "COORDENADOR(A)_GERAL" ||
          selectedRole === "SECRETARIO(A)" ||
          selectedRole === "VOLUNTARIO(A)" ? (
            <p>Hi</p>
          ) : (
            <p>Hallo</p>
          )
        }

        <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-cautionYellow rounded-md shadow-md my-3 relative">
          <div className="h-[100%] w-[10px] bg-cautionTrackYellow absolute rounded-l-md" />
          <Image
            src={Alert}
            alt="atenção"
            width={24}
            height={24}
            className="ml-4"
          />
          <p className="text-sm flex flex-col">
            Ao continuar, você concordará com o compartilhamento de teu endereço
            de email para um melhor contato com os coordenadores do Catavento.
          </p>
        </div>

        <button
          type="submit"
          className="border dark:border-slate-700 border-black rounded-full w-[80%] md:w-[60%] flex py-2 px-2 mx-auto mt-5 hover:dark:bg-slate-600 hover:bg-slate-400 duration-300"
        >
          <Image src={GoogleLogo} alt="google Logo" width={30} />
          <span className="mx-auto my-auto">Registrar com o Google</span>
        </button>
      </form>
    </div>
  );
}

export default SignUp;
