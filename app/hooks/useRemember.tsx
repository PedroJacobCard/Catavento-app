import { useContext } from "react";
import { RememberContext } from "../context/RememberProvider";
import { UseRemeberContextType } from "@/utils/Types";

function useRemember(): UseRemeberContextType {
  return useContext(RememberContext);
}

export default useRemember;