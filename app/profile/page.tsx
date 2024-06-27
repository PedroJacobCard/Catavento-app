'use client'

import { useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

//import icons
import LoginPicture from "@/public/images/sign-picture.png";
import Alert from '@/public/Alert.svg';
import Info from "@/public/Info.svg";
import Plus from "@/public/Plus.svg";

//import components
import CoordinatorAddSchool from "../components/CoordinatorAddSchool";
import ShowMoreSchools from "../components/ShowMoreSchools";

//import react-form-hooks e schema para validação 
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FieldValuesRegister, schema } from "./ValidationSchemaRegister";
import { zodResolver } from "@hookform/resolvers/zod";

//import toaster
import toast from "react-hot-toast";

//import lib functions
import { rolesArray } from "@/lib/EnumsToArray";

//import costume hooks
import useSchool from "../hooks/useSchool";

//import types
import { InitSchoolDataByCoordinatorType } from "@/utils/Types";

//import enums
import { Shift } from "@/utils/Enums";

//import user custom hook
import useUser from "../hooks/useUser";

function Profile() {
  //session
  const {data: session } = useSession();

  if (!session) {
    redirect('/sign-in');
  }

  //import user hook
  const { user, setFetchProfile } = useUser();

  if (user) {
    location.assign('/')
  }

  //funcionalidades para conectar com o Google calendário
  const [connect, setConnect] = useState<boolean>(false);

  //funcionalidades para checar o valor de papel selecionado
  const [selectedRole, setSelectedRole] = useState<string>("");

  //importar dados das escolas
  const { schools } = useSchool();

  //funcionalidades para checar se há escolas e turnos selecionados
  const [hasNoSchoolsAndShifts, setHasNoSchoolsAndShifts] = useState<boolean>(false);

  //funcionalidades para criar escola no usuário
  const [selectedSchoolAndShifts, setSelectedSchoolAndShifts] = useState<InitSchoolDataByCoordinatorType[]>([])

  const handleCheckShift = (checked: boolean, schoolName: string, shift: string) => {
    if (schoolName.length < 1) {
      toast.error("Ops! Precisa preencher o nome da escola")
      return;
    }

    setSelectedSchoolAndShifts(prev => {
      const existingSchoolIndex = prev.findIndex(item => item.schoolName === schoolName);

      if (checked) {
        if (existingSchoolIndex !== -1) {
          const updatedSchoolShifts = [...prev[existingSchoolIndex].shifts, shift];

          return [
            ...prev.slice(0, existingSchoolIndex),
            {...prev[existingSchoolIndex], shifts: updatedSchoolShifts},
            ...prev.slice(existingSchoolIndex + 1)
          ];
        } else {
          return [...prev, { schoolName, shifts: [shift] }];
        }
      } else {
        const updatedShifts = prev[existingSchoolIndex].shifts.filter((shi) => shi !== shift)

        if (updatedShifts.length === 0) {
          return [
            ...prev.slice(0, existingSchoolIndex),
            ...prev.slice(existingSchoolIndex + 1)
          ]
        }

        return [
          ...prev.slice(0, existingSchoolIndex),
          { ...prev[existingSchoolIndex], shifts: updatedShifts },
          ...prev.slice(existingSchoolIndex + 1)
        ]
      }
    })
  }

  const handleCheckGeneralCoordinatorSchools = (checked: boolean, schoolName: string, shifts: string[] | Shift[]) => {
    setSelectedSchoolAndShifts(prev => {
      const existingSchoolIndex = prev.findIndex(item => item.schoolName === schoolName);

      if (checked) {
        return [...prev, { schoolName, shifts }];
      } else {
        return [
          ...prev.slice(0, existingSchoolIndex),
          ...prev.slice(existingSchoolIndex + 1)
        ]
      }
    })
  }

  //estado inicial para a criação de escola pelo coordenador
  const [coordinatorSchool, setCoordinatorSchool] = useState<InitSchoolDataByCoordinatorType[]>([
    {
      schoolName: '',
      shifts: []
    }
  ]);

  const addSchool = () => {
    setCoordinatorSchool([
      ...coordinatorSchool,
      {
        schoolName: "",
        shifts: [],
      },
    ]);
  };

  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FieldValuesRegister>({
    resolver: zodResolver(schema),
    defaultValues: {
      connectedToCalender: connect,
      role: "",
      schoolCreated: {
        schoolName: "",
        shifts: []
      },
      school: { schoolName: "", shifts: [] },
    },
  });

  const onSubmit: SubmitHandler<FieldValuesRegister> = async (data) => {
    if (
      (selectedSchoolAndShifts.every(item => item.schoolName === '' || item.shifts.length < 1)) ||
      selectedRole === "Papel"
    ) {
      toast.error("Ops! Você se esqueceu de algo...");
      setSelectedSchoolAndShifts([]);
      return;
    } 

    const formData = {
      ...data,
      connectedToCalender: connect,
      school: selectedSchoolAndShifts,
      schoolCreated: selectedRole === "COORDENADOR_A" ? selectedSchoolAndShifts : {}
    };
    
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Perfil criado com successo!");
        setFetchProfile(true);
      } else {
        toast.error(
          "hum... Parece que os dados enviados já existem... Tente uma escola diferente."
        );

      }
    } catch (error) {
      console.error("Error on creating the user:", error)
      toast.error("Ops! Algo deu errado...");
    }

    reset();
    setSelectedRole('');
    setSelectedSchoolAndShifts([]);
    setConnect(false);
    setCoordinatorSchool([
        {
          schoolName: "",
          shifts: [],
        },
      ])
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
        className="dark:bg-darkModeGlass bg-primaryBlueGlass w-[95vw] h-[80vh] md:w-[65vw] lg:w-[50vw] lg:h-[100vh] p-[2rem] flex flex-col justify-center items-center fixed lg:relative rounded-md lg:rounded-none overflow-hidden"
      >
        <h1 className="title text-center mb-5">
          Vamos concluir a criação de teu perfil!
        </h1>

        <section className="px-3 flex flex-col items-start justify-start overflow-y-scroll">
          <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-infoBlue rounded-md shadow-md my-3   relative">
            <div className="h-[100%] w-[10px] bg-infoTrackBlue absolute rounded-l-md" />
            <Image
              src={Info}
              alt="informativo"
              width={24}
              height={24}
              className="ml-4"
            />
            <p className="text-sm flex flex-col">
              Ao conectar-se com o Google Agenda, serão salvos no teu
              calendário, os eventos criados neste App.
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
                  className="w-[100%] flex items-center justify-center py-2 mx-auto mb-5 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark dark:bg-darkModeBgColor bg-primaryBlue px-2 cursor-pointer"
                  onChange={(e) => {
                    setSelectedSchoolAndShifts([]);
                    setSelectedRole(e.target.value);
                    field.onChange(e.target.value);
                  }}
                  value={field.value}
                >
                  <option>Papel</option>
                  {rolesArray.map((role, roleIndex) => (
                    <option key={roleIndex}>{role}</option>
                  ))}
                </select>
                {errors?.role && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] mb-5">
                    {errors?.role.message}
                  </p>
                )}
                {selectedRole === "Papel" && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] mb-5">
                    Selecione um papel de atuação
                  </p>
                )}
              </>
            )}
          />

          {(selectedRole.length !== 0 && selectedRole === "SECRETARIO_A") ||
          (selectedRole.length !== 0 && selectedRole === "VOLUNTARIO_A") ? (
            <>
              <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-infoBlue rounded-md shadow-md my-3   relative">
                <div className="h-[100%] w-[10px] bg-infoTrackBlue absolute rounded-l-md" />
                <Image
                  src={Info}
                  alt="informativo"
                  width={24}
                  height={24}
                  className="ml-4"
                />
                <p className="text-sm flex flex-col">
                  Não encontrou uma escola específica? Contate o coordenador que
                  trabalha nessa escola para registrar-se.
                </p>
              </div>
              <p className="font-bold text-lg mt-3 mx-auto">
                Escolas e turnos de Atuação
              </p>
              {schools &&
                schools.map((school, index) => (
                  <div key={index}>
                    <label>{school.name}</label>
                    <div className="flex flex-col lg:flex-row gap-3 mb-5 flex-wrap">
                      {school.shift.map((shift, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="inputcheckbox"
                            value={shift}
                            onChange={(e) =>
                              handleCheckShift(
                                e.target.checked,
                                school.name,
                                shift.toString()
                              )
                            }
                            checked={selectedSchoolAndShifts.some(
                              (item) =>
                                item.schoolName === school.name &&
                                item.shifts.includes(shift.toString())
                            )}
                          />
                          <label>{shift}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              {selectedSchoolAndShifts.length < 1 && hasNoSchoolsAndShifts && (
                <p className="text-red-600 text-sm font-medium mt-[-1rem] mb-5">
                  Selecione uma escola e turno
                </p>
              )}

              <ShowMoreSchools />
            </>
          ) : (
            selectedRole.length !== 0 &&
            selectedRole === "COORDENADOR_A_GERAL" && (
              <div className="w-full mb-5 flex flex-col items-start justify-start">
                <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-infoBlue rounded-md shadow-md my-3   relative">
                  <div className="h-[100%] w-[10px] bg-infoTrackBlue absolute rounded-l-md" />
                  <Image
                    src={Info}
                    alt="informativo"
                    width={24}
                    height={24}
                    className="ml-4"
                  />
                  <p className="text-sm flex flex-col">
                    Não encontrou uma escola específica? Contate o coordenador
                    que trabalha nessa escola para registrar-se.
                  </p>
                </div>
                <p className="font-bold text-lg mt-3 mx-auto">
                  Escolas de coordenação
                </p>
                {schools &&
                  schools.map((school, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center my-1 flex-wrap"
                    >
                      <input
                        type="checkbox"
                        value={school.shift.join(", ").split("")}
                        onChange={(e) =>
                          handleCheckGeneralCoordinatorSchools(
                            e.target.checked,
                            school.name,
                            school.shift
                          )
                        }
                        checked={selectedSchoolAndShifts.some(
                          (item) =>
                            item.schoolName === school.name &&
                            item.shifts === school.shift
                        )}
                      />
                      <label>{school.name}</label>
                    </div>
                  ))}
                {selectedSchoolAndShifts.length < 1 &&
                  hasNoSchoolsAndShifts && (
                    <p className="text-red-600 text-sm font-medium mt-2 mb-5">
                      Selecione uma escola de atuação
                    </p>
                  )}

                <ShowMoreSchools />
              </div>
            )
          )}

          {selectedRole.length !== 0 && selectedRole === "COORDENADOR_A" && (
            <div className="w-full">
              <p className="font-bold text-lg mt-3 mx-auto">
                Escolas de coordenação
              </p>
              <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-infoBlue rounded-md shadow-md mt-2 mb-3 relative">
                <div className="h-[100%] w-[10px] bg-infoTrackBlue absolute rounded-l-md" />
                <Image
                  src={Info}
                  alt="informativo"
                  width={24}
                  height={24}
                  className="ml-4"
                />
                <p className="text-sm flex flex-col">
                  Escreva abaixo o nome da escola de atuação e à frente, o nome
                  da cidade em que ela se localiza.
                  <span className="text-infoTrackBlue">
                    Ex.: Escola Municipal Alpes, Goiânia - GO.
                  </span>
                </p>
              </div>
              <CoordinatorAddSchool
                control={control}
                hasNoSchoolsAndShifts={hasNoSchoolsAndShifts}
                handleCheckShift={handleCheckShift}
                selectedSchoolAndShifts={selectedSchoolAndShifts}
                coordinatorSchool={coordinatorSchool}
                setCoordinatorSchool={setCoordinatorSchool}
              />
              <button
                onClick={addSchool}
                type="button"
                className="flex items-center justify-center w-full gap-3 m-auto py-2 px-2 mt-5 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
              >
                <Image
                  src={Plus}
                  alt="Adicionar"
                  width={25}
                  height={25}
                  priority={true}
                />
                Adicionar outra escola
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-cautionYellow rounded-md shadow-md my-3  relative">
            <div className="h-[100%] w-[10px] bg-cautionTrackYellow absolute rounded-l-md" />
            <Image
              src={Alert}
              alt="atenção"
              width={24}
              height={24}
              className="ml-4"
            />
            <p className="text-sm flex flex-col">
              Ao continuar, você concordará com o compartilhamento de teu
              endereço de email para melhorar o contato com os coordenadores do
              Catavento. Nenhum cookie de navegação será armazenado.
            </p>
          </div>

          <button
            type="submit"
            onClick={() =>
              setHasNoSchoolsAndShifts(
                selectedSchoolAndShifts.every(
                  (item) => item.schoolName === "" || item.shifts.length < 1
                )
              )
            }
            className="border dark:border-slate-700 border-black rounded-full w-[80%] md:w-[60%] flex py-2 px-2 mx-auto mt-5  hover:dark:bg-slate-600 hover:bg-slate-400 duration-300"
          >
            <span className="mx-auto my-auto">Adicionar Dados ao Perfil</span>
          </button>
        </section>
      </form>
    </div>
  );
}

export default Profile;
