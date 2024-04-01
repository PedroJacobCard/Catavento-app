import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { UseUserContextType } from '@/utils/Types';

function useUser(): UseUserContextType {
  return useContext(UserContext);
};

export default useUser;