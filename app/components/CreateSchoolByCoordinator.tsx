import { Dispatch, SetStateAction } from "react";

//import types
import { InitSchoolOnUserType } from "@/utils/Types";

//import lib functions
import { shiftsArray } from "@/lib/EnumsToArray";
import { Control, Controller } from "react-hook-form";
import { Shift } from "@/utils/Enums";

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
  schoolData: InitSchoolOnUserType;
  setCoordinatorSchool: Dispatch<SetStateAction<InitSchoolOnUserType[]>>;
};

function CreateSchoolByCoordinator({
  control,
  hasNoSchoolsAndShifts,
  handleCheckShift,
  selectedSchoolAndShifts,
  schoolData,
  setCoordinatorSchool
 }: CreateSchoolByCoordinatorPropsType) {

  return (
    <div className="w-full mb-5 flex flex-col items-start justify-start">
      <div className="w-full">
        <Controller
          name="school.schoolName"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              placeholder="Ex. Escola Municipal Alpes, Goiânia - GO"
              {...field}
              className="w-full px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              value={schoolData.schoolName}
              onChange={(e) => setCoordinatorSchool([
                ...selectedSchoolAndShifts,
                { schoolName: e.target.value, shifts: schoolData.shifts}
              ])}
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
                schoolData.schoolName,
                shift.toString()
              )
            }
            checked={selectedSchoolAndShifts.some(
              (item) =>
                item.schoolName === schoolData.schoolName &&
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