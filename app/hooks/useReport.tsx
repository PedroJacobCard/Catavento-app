import { useContext } from "react";
import { ReportContext } from "../context/ReportProvider";
import { UseReportContextType } from "@/utils/Types";

function useReport(): UseReportContextType {
  return useContext(ReportContext);
}

export default useReport;