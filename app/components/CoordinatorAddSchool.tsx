import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

//import components
import CreateSchoolByCoordinator from "./CreateSchoolByCoordinator";

//import react hook form
import { Control } from "react-hook-form";

//import types
import { InitSchoolDataByCoordinatorType } from "@/utils/Types";

//props type
type CoordinatorAddSchoolPropsType = {
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
  selectedSchoolAndShifts: InitSchoolDataByCoordinatorType[];
  coordinatorSchool: InitSchoolDataByCoordinatorType[];
  setCoordinatorSchool: Dispatch<SetStateAction<InitSchoolDataByCoordinatorType[]>>;
};

function CoordinatorAddSchool({
  control,
  hasNoSchoolsAndShifts,
  handleCheckShift,
  selectedSchoolAndShifts,
  coordinatorSchool,
  setCoordinatorSchool,
}: CoordinatorAddSchoolPropsType) {
  
  return (
    <>
      {coordinatorSchool &&
        coordinatorSchool.map((schoolShift, schoolShiftIndex) => (
          <div key={schoolShiftIndex}>
            <CreateSchoolByCoordinator
              control={control}
              hasNoSchoolsAndShifts={hasNoSchoolsAndShifts}
              handleCheckShift={handleCheckShift}
              selectedSchoolAndShifts={selectedSchoolAndShifts}
              schoolData={schoolShift}
              setCoordinatorSchool={setCoordinatorSchool}
            />
          </div>
        ))}
    </>
  );
}

export default CoordinatorAddSchool;
