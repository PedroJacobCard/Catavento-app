//import types
import { ReportType } from "@/utils/Types";

//props type
type DownloadReportPropsType = {
  report: ReportType,
  reportIndex: number
}


function DownloadReport({ report, reportIndex }: DownloadReportPropsType) {
  return (
    <section
      className={`dark:bg-darkMode bg-primaryBlue ${reportIndex === 0 ? "mt-[5rem]" : "mt-5"
      } mx-2 md:mx-[2rem] rounded-md overflow-hidden py-5 shadow-md`}
    >
      <div className="flex flex-col items-start mx-5 gap-3 lg:flex-row lg:justify-between lg:items-top">
        <h1 className="max-w-[300px] md:max-w-[350px] font-bold text-xl">
          {report.schoolName}
        </h1>
        <p className="font-bold">{report.createdAt}</p>
      </div>

      <div className="flex flex-col items-start mx-2 mt-5 gap-3 p-3 lg:py-0">
        <p className="font-bold">
          Remetente:
          <span className="font-normal ml-3">{report.authorName}</span>
        </p>
        <p className="font-bold">
          Tema:
          <span className="font-normal ml-3">{report.theme}</span>
        </p>
        <p className="font-bold">
          Classe e turno:
          <span className="font-normal ml-3">{report.classAndShift}</span>
        </p>
        <p className="font-bold flex flex-wrap">
          Etapas realizadas nesta temática:
          {report.activitiesDone.map((activity, activityIndex) => (
            <span key={activityIndex} className="font-normal ml-3">
              {activityIndex === report.activitiesDone.length - 1
                ? `${activity}`
                : `${activity};`}
            </span>
          ))}
        </p>
        <p className="font-bold">
          N° de voluntários que participaram:
          <span className="font-normal ml-3">{report.coworkers}</span>
        </p>
        <p className="font-bold flex flex-wrap">
          Materiais utilizados:
          {report.resources.map((resource, resourceIndex) => (
            <span key={resourceIndex} className="font-normal ml-3">
              {resourceIndex === report.resources.length - 1
                ? `${resource}`
                : `${resource};`}
            </span>
          ))}
        </p>
        <p className="font-bold">
          N° de atendidos em capelania individual:
          <span className="font-normal ml-3">
            {report.assistedInChaplaincy}
          </span>
        </p>
        <p className="font-bold">
          Observação da capelania individual:
          <span className="font-normal ml-3">
            {report.chaplaincyObservation}
          </span>
        </p>
      </div>
    </section>
  );
}

export default DownloadReport;