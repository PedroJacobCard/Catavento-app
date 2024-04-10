'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, ReportType, UseReportContextType } from "@/utils/Types";

//import costume hooks
import useUser from "../hooks/useUser";

const initState: ReportType[] = [];

export const initContextState: UseReportContextType = {
  reports: [],
};

export const ReportContext = createContext<UseReportContextType>(initContextState);

function ReportProvider({ children }: ChildrenPropsType) {
  //importar dados do usuário logado
  const { user } = useUser();

  //funcionalidades para obter os dados de relatórios
  const  [reports, setReports] = useState<ReportType[] | null>(initState);

  useEffect(() => {
    const getReports = async (): Promise<ReportType[] | null> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_DEV_API}/report`
        );

        if (response.ok) {
          const data = await response.json();

          //funcionalidades para filtrar os relatórios que pertencem 
          //as escolas que o usuário logado participa
          const filteredData = data.filter((report: ReportType) => user?.school.some(s => s.schoolName === report.schoolName))
          setReports(filteredData);
          return  filteredData;
        }
      } catch (error) {
        console.error("Error:", error)
      }

      return [];
    }

    getReports();
  }, [user])

  return ( 
    <ReportContext.Provider value={{ reports }}>
      { children }
    </ReportContext.Provider>
   );
}

export default ReportProvider;