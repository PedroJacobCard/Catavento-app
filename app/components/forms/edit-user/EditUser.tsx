'use client'
import { useState } from "react";
import Image from 'next/image';

//import icons
import Close from '@/public/Cancel.svg';
import Bin from '@/public/Bin.svg';

//import enum
import { Role, Shift } from "@/utils/Enums";

//import props types
import { EditPropType } from "@/utils/Types";

//import hooks
import useUser from "@/app/hooks/useUser";
import useSchool from "@/app/hooks/useSchool";

//import schema validação e react-hook-form
import { schema, FieldValuesEditUser } from "./ValidationSchemaEditUser";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//funcionalidade para transformar Role em array
let roleArray: string[] = [];
for (const key in Role) {
  if (isNaN(Number(Role[key]))) {
    roleArray.push(Role[key]);
  }
}

function EditUser({ showForm, setShowForm }: EditPropType) {
  //import user data
  const { user } = useUser();

  //import school data
  const { schools } = useSchool();

  //funcionalidade para checar se o usuário está conectado com o calendário e mudar o valor
  const [isConnected, setIsConnected] = useState<boolean | undefined>(user?.connectedToCalender);

  
  //funcionalidade para selecionar novos turnos e escolas de atuação
  type NewSchoolType = {
    schoolName: string,
    shifts: (string | Shift)[]
  }

  //essa função servirá como estado inicial das escolas selecionadas as quais seram as que o usuário já participa
  const initSelectedState: NewSchoolType[] = (() => {
    if (user && user.school) {
      return user.school.map((s) => ({
        schoolName: s.schoolName,
        shifts: s.shifts,
      }));
    } else {
      return [];
    }
  })();

  const [selectedShiftAndSchool, setSelectedShiftAndSchool] =  useState<NewSchoolType[]>(initSelectedState);
  
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
      connectedToCalender: user?.connectedToCalender || false,
      school: userSchools?.map(s => {
        return {
          schoolName: s.schoolName,
          shifts: s.shifts.map(sh => sh.toString())
        }
      }),
      role: user?.role.toString() || "VOLUNTARIO",
    }
  })

  const onSubmit: SubmitHandler<FieldValuesEditUser> = (data) => {
    const formData = {
      ...data,
      school: selectedShiftAndSchool.length > 0 ? selectedShiftAndSchool : userSchools?.map(s => {
        return {
          schoolName: s.schoolName,
          shifts: s.shifts
        }
      }),
    }
    console.log(formData);
  }
  
  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-50 ${
        showForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue h-[50vh] mx-2 lg:mx-[20rem] rounded-md pt-5 pb-5 overflow-y-scroll fixed top-[20vh] left-[0vw] md:left-[13vw] lg:left-[0vw]">
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
                  className="w-[70%] mx-auto mb-5 rounded-sm shadow-buttonShadow dark:shadow-buttonShadowDark dark:bg-darkModeBgColor bg-primaryBlue px-1 cursor-pointer"
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  {roleArray &&
                    roleArray.map((role) =>
                      user && user?.role === role ? (
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
            name="connectedToCalender"
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

export default EditUser;