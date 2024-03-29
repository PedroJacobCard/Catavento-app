import { useContext } from "react";
import { UseUserContextType, UserContext } from "../context/UserProvider";

function useUser(): UseUserContextType {
  return useContext(UserContext);
};

export default useUser;