'use client'
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

//import types
import { SchoolType } from "@/utils/Types";

//import toaster
import toast from "react-hot-toast";

//import costume hooks
import useSchool from "../hooks/useSchool";
import useUser from "../hooks/useUser";

function ShowMoreSchools() {
  const [increment, setIncrement] = useState<number>(0);

  //import school costume hook
  const { setSchools } = useSchool();

  //import user data and session
  const { user } = useUser();
  const { data: session } = useSession();

  useEffect(() => {
    const getMoreSchools = async (): Promise<SchoolType[] | null> => {
      try {
        const response = await fetch(`/api/school?skip=${increment}&take=5`);
        
        if (!response.ok) {
          return null;
        }
        
        const data = await response.json();
        setSchools((prev) => {
          const diferentSchools = data.filter((newSchool: SchoolType) => !prev.some(oldSchool => oldSchool.name === newSchool.name));
          return [...prev, ...diferentSchools]
        });
        return data;
      } catch (error) {
        console.log("Erro ao adquirir mais escolas.");
        toast.error("hum... parece que algo deu errado...")
        return null;
      }
    }

    if (user || session) {
      getMoreSchools();
    }
  }, [increment, setSchools, user, session])

  return (
    <button type="button" className="w-[50%] py-2 mb-5 underline hover:text-slate-500 duration-300" onClick={() => setIncrement(prev => prev + 5)}>
      Carregar mais escolas
    </button>
  );
}

export default ShowMoreSchools;