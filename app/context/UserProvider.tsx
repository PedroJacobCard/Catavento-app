'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { UserType, ChildrenPropsType } from "@/utils/Types";


const initState: UserType | null = null;

export type UseUserContextType = {
  user: UserType | null
}

const initContextState: UseUserContextType = {
  user: null,
}

export const UserContext = createContext<UseUserContextType>(initContextState);


function UserProvider({ children }: ChildrenPropsType) {
  const [user, setUser] = useState<UserType | null>(initState);
  
  useEffect(() => {
    //get user
    const getUser = async (): Promise<UserType | null> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_DEV_API}/users?id=67ngfwo90vjqw6nf824jbhnfowe`
        );
          
        if (response.ok) {
          const data = await response.json();
          setUser(data[0]);
          return data;
        }
      } catch (error) {
        console.log('error:', error)
      }
      return null;
    }
    getUser();
  }, []);

  return ( 
    <UserContext.Provider value={{user}}>
      {
        children
      }
    </UserContext.Provider>
   );
}

export default UserProvider;