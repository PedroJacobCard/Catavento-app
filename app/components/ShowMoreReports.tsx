"use client";
import { useEffect, useState } from "react";

//import types
import { ReportType } from "@/utils/Types";

//import toaster
import toast from "react-hot-toast";

//import costume hooks
import useReport from "../hooks/useReport";
import useUser from "../hooks/useUser";

function ShowMoreReports() {
  const [increment, setIncrement] = useState<number>(0);

  //import school costume hook
  const { reports, setReports } = useReport();

  //import user data and session
  const { user } = useUser();

  useEffect(() => {
    const getMoreReports = async (): Promise<ReportType[] | null> => {
      try {
        if (user && !!user) {
          const userSchools = user.school.map((school) => school.schoolName);

          const reportResponses = await Promise.all(userSchools.map(async (schoolName) => {
            const response = await fetch(`/api/report/${schoolName}?skip=${increment}&take=5`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
              cache: "no-store"
            });
    
            if (!response.ok) {
              toast.error("Hum... Algo deu errado...")
              return;
            }
            
            const data = await response.json();
            console.log(data)
            return data;
            }));
            
            setReports((prev) => {
              if (!!prev) {
                const diferentReports = reportResponses
                  .filter((re) => !prev.some((pre) => pre.id !== re.id))
                  .flat();
                return [...prev, ...diferentReports];
              }
              return null;
            });
          return reportResponses;
        }
      } catch (error) {
        console.log("Erro ao adquirir mais relatórios.");
        toast.error("hum... parece que algo deu errado...");
        return null;
      }
      return null
    };

     if (user) {
       getMoreReports()
     }
  }, [increment, setReports, user]);

  console.log(reports)

  return (
    <button
      type="button"
      className={`w-[50%] py-2 mb-5 ${reports && reports?.length < 1 ? 'mt-10' : 'mt-0'} underline hover:text-slate-500 duration-300`}
      onClick={() => setIncrement((prev) => prev + 5)}
    >
      Carregar mais relatórios
    </button>
  );
}

export default ShowMoreReports;
