import { UseEventContextType } from "@/utils/Types";
import { useContext } from "react";
import { EventContext } from "../context/EventProvider";

function useEvent(): UseEventContextType {
  return useContext(EventContext);
}

export default useEvent;