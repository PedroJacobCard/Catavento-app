'use client'
import { createContext, useEffect, useState } from "react";

//import types
import { ChildrenPropsType, ReportType, UseReportContextType } from "@/utils/Types";

//import costume hooks
import useUser from "../hooks/useUser";

const initState: ReportType[] = [];

export const initContextState: UseReportContextType = {
  reports: [],
  setReports: () => {}
};

export const ReportContext = createContext<UseReportContextType>(initContextState);

function ReportProvider({ children }: ChildrenPropsType) {

  //funcionalidades para obter os dados de relatórios
  const  [reports, setReports] = useState<ReportType[] | null>(initState);

  return ( 
    <ReportContext.Provider value={{ reports, setReports }}>
      { children }
    </ReportContext.Provider>
   );
}

export default ReportProvider;