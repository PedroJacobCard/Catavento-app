import { useState } from "react";
import Image from "next/image";

//import icons
import Info from '@/public/Info.svg';

//import types
import { InitSchoolOnUserType } from "@/utils/Types";

//import lib functions
import { shiftsArray } from "@/lib/EnumsToArray";
import { Control, Controller } from "react-hook-form";

//props type
type CreateSchoolByCoordinatorPropsType = {
  control: Control<
    {
      role: string;
      connectedToCalender: boolean;
      schoolCreated?:
        | {
            schoolName: string;
            shifts: string[];
          }
        | undefined;
      school?:
        | {
            schoolName: string;
            shifts: string[];
          }
        | undefined;
    },
    any
  >;
  hasNoSchoolsAndShifts: boolean;
  handleCheckShift: (
    checked: boolean,
    schoolName: string,
    shift: string
  ) => void;
  selectedSchoolAndShifts: InitSchoolOnUserType[];
};

function CreateSchoolByCoordinator({
  control,
  hasNoSchoolsAndShifts,
  handleCheckShift,
  selectedSchoolAndShifts }: CreateSchoolByCoordinatorPropsType) {

  const [schoolNameByCoordinator, setSchoolNameByCoordinator] =
    useState<string>("");

  return (
    <div className="w-full mb-5 flex flex-col items-start justify-start">
      <p className="font-bold text-lg mt-3 mx-auto">Escolas de coordenação</p>

      <div>
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
            Escreva abaixo o nome da escola de atuação e à frente, o nome da
            cidade em que ela se localiza.
            <span className="text-infoTrackBlue">
              Ex.: Escola Municipal Alpes, Goiânia - GO.
            </span>
          </p>
        </div>
        <Controller
          name="school.schoolName"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              placeholder="Ex. Escola Municipal Alpes, Goiânia - GO"
              {...field}
              className="w-full px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              value={schoolNameByCoordinator}
              onChange={(e) => setSchoolNameByCoordinator(e.target.value)}
            />
          )}
        />
      </div>

      <p className="font-bold text-lg mt-3 mx-auto">Turnos de atuação</p>
      {shiftsArray.map((shift, i) => (
        <div key={i} className="flex items-center gap-3 my-1">
          <input
            type="checkbox"
            value={shift}
            onChange={(e) =>
              handleCheckShift(
                e.target.checked,
                schoolNameByCoordinator,
                shift.toString()
              )
            }
            checked={selectedSchoolAndShifts.some(
              (item) =>
                item.schoolName === schoolNameByCoordinator &&
                item.shifts.includes(shift.toString())
            )}
          />
          <label>{shift}</label>
        </div>
      ))}

      {selectedSchoolAndShifts.every(
        (item) => item.schoolName === "" || item.shifts.length < 1
      ) &&
        hasNoSchoolsAndShifts && (
          <p className="text-red-600 text-sm font-medium mt-2 mb-5">
            Escreva o nome da escola de atuação
          </p>
        )}
    </div>
  );
}

export default CreateSchoolByCoordinator;