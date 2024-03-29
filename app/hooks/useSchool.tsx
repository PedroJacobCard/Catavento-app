import { useContext } from "react";

//import types e contexto
import { UseSchoolContextType, SchoolsContext } from "../context/SchoolProvider";

function useSchool(): UseSchoolContextType {
  return useContext(SchoolsContext)
}

export default useSchool;