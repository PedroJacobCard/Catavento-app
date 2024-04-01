import { useContext } from "react";
import { UseUsersContextType } from "@/utils/Types";
import { UsersContext } from "../context/UsersProvider";

function useUsers(): UseUsersContextType {
  return useContext(UsersContext);
}

export default useUsers;