'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, UseUserContextType, ProfileType } from "@/utils/Types";
import { useSession } from "next-auth/react";


const initState: ProfileType | null = null;

const initContextState: UseUserContextType = {
  user: null,
}

export const UserContext = createContext<UseUserContextType>(initContextState);


function UserProvider({ children }: ChildrenPropsType) {
  const [user, setUser] = useState<ProfileType | null>(initState);

  const {data: session} = useSession();
  
  useEffect(() => {
    //get user
    const getUser = async (): Promise<ProfileType | null> => {
      try {
        const response = await fetch(
          '/api/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
          
        if (response.ok) {
          const data: ProfileType = await response.json();
          const mergeUser: ProfileType = {
            id: data.id,
            userId: data.user.id,
            userName: session?.user?.name,
            connectedToCalender: data.connectedToCalender,
            role: data.role,
            schoolCreated: data.schoolCreated,
            school: data.school,
            user: data.user,
            remember: [],
            event: [],
            report: [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          }
          setUser(mergeUser);

          return data;
        }
      } catch (error) {
        console.log('error:', error)
      }
      return null;
    }
    getUser();
  }, [session?.user]);

  return ( 
    <UserContext.Provider value={{user}}>
      {
        children
      }
    </UserContext.Provider>
   );
}

export default UserProvider;