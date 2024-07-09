'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, UseUserContextType, ProfileType } from "@/utils/Types";

//import session
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";


const initState: ProfileType | null = null;

const initContextState: UseUserContextType = {
  user: null,
  setFetchProfile: () => {},
  setUserUpdated: () => {},
  setUser: () => {},
  showPopup: true,
  setShowPopup: () => {}
};

export const UserContext = createContext<UseUserContextType>(initContextState);


function UserProvider({ children }: ChildrenPropsType) {
  const [fetchProfile, setFetchProfile] = useState<boolean>(false);
  const [userUpdated, setUserUpdated] = useState<ProfileType | null>(initState);
  const [user, setUser] = useState<ProfileType | null>(initState);

  //start profile
  const [showPopup, setShowPopup] = useState<boolean>(true);

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
          
        } catch (error) {
          console.log("error:", error);
        }
        return null; 
      }

    if (session || fetchProfile) {
      getUser();
      setFetchProfile(false);
    }
  }, [session, fetchProfile, userUpdated, routerPath, router]);

  
  return ( 
    <UserContext.Provider value={{ user, setUser, setFetchProfile, setUserUpdated, showPopup, setShowPopup }}>
      {
        children
      }
    </UserContext.Provider>
   );
}

export default UserProvider;