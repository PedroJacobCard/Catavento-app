'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, UseUserContextType, ProfileType } from "@/utils/Types";

//import session
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";


const initState: ProfileType | null = null;

const initContextState: UseUserContextType = {
  user: null,
  setFetchProfile: () => {},
  setUserUpdated: () => {},
  setUser: () => {}
};

export const UserContext = createContext<UseUserContextType>(initContextState);


function UserProvider({ children }: ChildrenPropsType) {
  const [fetchProfile, setFetchProfile] = useState<boolean>(false);
  const [userUpdated, setUserUpdated] = useState<ProfileType | null>(initState);
  const [user, setUser] = useState<ProfileType | null>(initState);

  //router
  const router = useRouter();
  const routerPath = usePathname();

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
              connectedToCalendar: data.connectedToCalendar,
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
          }
          
          if (userUpdated !== null) {
            const data: ProfileType = userUpdated;
            const mergeUser: ProfileType = {
              id: data.id,
              userId: data.user.id,
              userName: session?.user?.name,
              connectedToCalendar: data.connectedToCalendar,
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
          }
          
          if (routerPath === '/profile') {
            router.replace("/", undefined, { shallow: true });
          } else {
            router.replace(`${routerPath}`, undefined, { shallow: true });
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
  }, [session, fetchProfile, router, userUpdated, routerPath]);

  return ( 
    <UserContext.Provider value={{ user, setUser, setFetchProfile, setUserUpdated }}>
      {
        children
      }
    </UserContext.Provider>
   );
}

export default UserProvider;