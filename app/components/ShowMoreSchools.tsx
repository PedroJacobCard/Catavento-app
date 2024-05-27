'use client'
import { useEffect, useState } from "react";

//import types
import { SchoolType } from "@/utils/Types";

//import toaster
import toast from "react-hot-toast";

//import costume hooks
import useSchool from "../hooks/useSchool";

function ShowMoreSchools() {
  const [increment, setIncrement] = useState<number>(0);

  //import school costume hook
  const { setSchools } = useSchool();

  useEffect(() => {
    const getMoreSchools = async (): Promise<SchoolType[] | null> => {
      try {
        const response = await fetch(`/api/school?skip=${increment}&take=1`);
        const data = await response.json();

        if (response.ok) {
          setSchools((prev) => [...prev, ...data]);
        }
        return data;
      } catch (error) {
        console.log("Erro ao adquirir mais escolas.");
        toast.error("hum... parece que algo deu errado...")
        return null;
      }
    }

    if (increment >= 0) {
      getMoreSchools();
    }
  }, [increment, setSchools])

  return (
    <button type="button" className="w-[50%] py-2 mb-5 underline hover:text-slate-500 duration-300" onClick={() => setIncrement(prev => prev + 5)}>
      Carregar mais escolas
    </button>
  );
}

export default ShowMoreSchools;