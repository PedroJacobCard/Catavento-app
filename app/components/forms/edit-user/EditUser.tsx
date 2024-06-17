'use client'
import { useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

//import icons
import Close from '@/public/Cancel.svg';
import Bin from '@/public/Bin.svg';

//import enum
import { Role } from "@/utils/Enums";

//import props types
import { EditPropType, InitSchoolOnUserType } from "@/utils/Types";

//import hooks
import useUser from "@/app/hooks/useUser";
import useSchool from "@/app/hooks/useSchool";

//import schema validação e react-hook-form
import { schema, FieldValuesEditUser } from "./ValidationSchemaEditUser";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//import components
import ShowMoreSchools from "../../ShowMoreSchools";

//import toaster
import toast from "react-hot-toast";

//funcionalidade para transformar Role em array
let roleArray: string[] = [];
for (const key in Role) {
  if (isNaN(Number(Role[key]))) {
    roleArray.push(Role[key]);
  }
}

function EditUser({ showForm, setShowForm }: EditPropType) {
  //import user data
  const { user, setUser, setUserUpdated } = useUser();

  //import school data
  const { schools } = useSchool();

  //router
  const router = useRouter();

  //funcionalidade para checar se o usuário está conectado com o calendário e mudar o valor
  const [isConnected, setIsConnected] = useState<boolean | undefined>(user?.connectedToCalendar ? true : false);

  //essa função servirá como estado inicial das escolas selecionadas as quais seram as que o usuário já participa
  const initSelectedState: InitSchoolOnUserType[] = (() => {
    if (user && user.school) {
      return user.school.map((s) => ({
        schoolName: s.schoolName,
        shifts: s.shifts,
      }));
    } else {
      return [];
    }
  })();

  const [selectedShiftAndSchool, setSelectedShiftAndSchool] =  useState<InitSchoolOnUserType[]>(initSelectedState);
  
  const handleCheckboxChange = (checked: boolean, schoolName: string, shift: string) => {
    setSelectedShiftAndSchool(prev => {
      const existingSchoolIndex = prev.findIndex(item => item.schoolName == schoolName);

      if (checked) {
        if (existingSchoolIndex !== -1) {
          const updateShifts = [...prev[existingSchoolIndex].shifts, shift];
          return [
            ...prev.slice(0, existingSchoolIndex),
            { ...prev[existingSchoolIndex], shifts: updateShifts },
            ...prev.slice(existingSchoolIndex + 1)
          ];
        } else {
          return [...prev, { schoolName, shifts: [shift] }];
        }
      } else {
        const updatedShifts = prev[existingSchoolIndex].shifts.filter(
          (s) => s !== shift
        );

        if (updatedShifts.length === 0) {
          return [
            ...prev.slice(0, existingSchoolIndex),
            ...prev.slice(existingSchoolIndex + 1)
          ]
        }
        return [
          ...prev.slice(0, existingSchoolIndex),
          { ...prev[existingSchoolIndex], shifts: updatedShifts },
          ...prev.slice(existingSchoolIndex + 1),
        ];
      }
    });
  }

  //funcionalidades para enviar os dados do formulário
  const userSchools = user?.school.map(s => s);

  const {
    control,
    handleSubmit,
  } = useForm<FieldValuesEditUser>({
    resolver: zodResolver(schema),
    defaultValues: {
      connectedToCalendar: user?.connectedToCalendar || false,
      school: userSchools?.map(s => {
        return {
          schoolName: s.schoolName,
          shifts: s.shifts.map(sh => sh.toString())
        }
      }),
      role: user?.role?.toString() || "VOLUNTARIO",
    }
  })

  const onSubmit: SubmitHandler<FieldValuesEditUser> = async (data) => {
    const formData = {
      ...data,
      school: selectedShiftAndSchool.length > 0 ? selectedShiftAndSchool : userSchools?.map(s => {
        return {
          schoolName: s.schoolName,
          shifts: s.shifts
        }
      }),
    }
    console.log(formData)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: "no-store",
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setUserUpdated(await response.json());
        setShowForm(!showForm);
        toast.success("Perfil editado com sucesso!")
      }
    } catch (error) {
      toast.error("Uhm... Algo deu errado...");
      console.log(error);
    }
  }
  
  //funcionalidades para deletar conta
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUser(null);
        toast.success("Conta deletada com sucesso!");
        router.push("/");
        setShowForm(!showForm)
      }
    } catch (error) {
      console.error("Erro ao deletar perfil");
      toast.error("Uhm... Algo deu errado...");
    }
  }
  
  return (
    <div
      className={`flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] ${
        showForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[50vw] h-[80vh] mx-2 rounded-md pt-5 pb-5 overflow-y-scroll">
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
            onClick={handleDeleteAccount}
          >
            <Image
              src={Bin}
              alt="Fechar form"
              width={20}
              height={20}
              priority={true}
            />{" "}
            Deletar conta
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9"
        >
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <>
                <label className="font-bold text-lg mb-1 mx-auto">
                  Mudar papel?
                </label>
                <select
                  name="Papel"
                  className="w-[70%] mx-auto mb-5 py-2 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark dark:bg-darkModeBgColor bg-primaryBlue px-1 cursor-pointer"
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  {roleArray &&
                    roleArray.map((role) =>
                      user && user?.role?.toString() === role ? (
                        <option
                          key={role}
                          className="dark:bg-darkMode bg-secondaryBlue"
                        >
                          {role}
                        </option>
                      ) : (
                        <option key={role}>{role}</option>
                      )
                    )}
                </select>
              </>
            )}
          />

          <Controller
            name="connectedToCalendar"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  className="inputcheckbox"
                  checked={isConnected}
                  onChange={(e) => {
                    setIsConnected(e.target.checked);
                    field.onChange(e.target.checked);
                  }}
                />
                <label>Conexão com Google Agenda</label>
              </div>
            )}
          />

          <p className="font-bold text-lg mt-3 mx-auto">
            Escolas e turnos de Atuação
          </p>
          {schools &&
            schools.map((school, index) => (
              <div key={index} className="flex flex-col mb-5">
                <label>{school.name}</label>
                {school.shift.map((shift, i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      type="checkbox"
                      className="inputcheckbox"
                      value={shift}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e.target.checked,
                          school.name,
                          shift.toString()
                        )
                      }
                      checked={selectedShiftAndSchool.some(
                        (item) =>
                          item.schoolName === school.name &&
                          item.shifts.includes(shift.toString())
                      )}
                    />
                    <label>{shift}</label>
                  </div>
                ))}
              </div>
            ))}

          <ShowMoreSchools />

          <button
            type="submit"
            className="w-[50%] py-2 mx-auto rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;