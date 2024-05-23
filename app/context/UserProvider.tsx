'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, UseUserContextType, ProfileType } from "@/utils/Types";

//import session
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const initState: ProfileType | null = null;

const initContextState: UseUserContextType = {
  user: null,
  setFetchProfile: () => {},
}

export const UserContext = createContext<UseUserContextType>(initContextState);


function UserProvider({ children }: ChildrenPropsType) {
  const [fetchProfile, setFetchProfile] = useState<boolean>(false);
  const [user, setUser] = useState<ProfileType | null>(initState);

  //router
  const router = useRouter();

  const {data: session} = useSession();

  useEffect(() => {
    //get user
    const getUser = async (): Promise<ProfileType | null> => {
        try {
          const response = await fetch("/api/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

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
              updatedAt: data.updatedAt,
            };
            setUser(mergeUser);
            router.push('/')
          }
        } catch (error) {
          console.log("error:", error);
        }
      return null; 
    }

    if (session || fetchProfile) {
      getUser();
      setFetchProfile(false);
    }
  }, [session, fetchProfile, router]);

  return ( 
    <UserContext.Provider value={{ user, setFetchProfile }}>
      {
        children
      }
    </UserContext.Provider>
   );
}

export default UserProvider;