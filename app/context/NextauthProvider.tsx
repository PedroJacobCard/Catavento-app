'use client'

//import session provider
import { SessionProvider } from "next-auth/react";

//import types
import { ChildrenPropsType } from "@/utils/Types";

function NextauthProvider({ children }: ChildrenPropsType) {
  return ( 
    <SessionProvider>
      { children }
    </SessionProvider>
   );
}

export default NextauthProvider;