import { useContext } from "react";
import { UseClassContextTypes } from "@/utils/Types";
import { ClassContext } from "../context/ClassProvider";

function useClass(): UseClassContextTypes {
  return useContext(ClassContext);
}

export default useClass;