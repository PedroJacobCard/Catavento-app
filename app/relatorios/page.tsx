"use client";
import { useState } from "react";
import Image from "next/image";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Link from "next/link";

//import components
import Navbar from "@/app/components/Navbar";
import RememberField from "@/app/components/RememberField";
import Footer from "../components/Footer";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";

//import costume hooks
import useReport from "../hooks/useReport";

//import types
import { ReportType } from "@/utils/Types";

function Report() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //importar relatórios
  const { reports } = useReport();

  //funcionalidades para baixar os relatórios
  const handleDownload = async (report: ReportType) => {
    try {
      const response = await fetch(`/api/downloadReport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(report),
      })

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "relatório.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log(response)
        throw new Error('Não foi possível realizar o download');
      }
    } catch (error) {
      console.error('Falha ao fazer o download', error)
    }
  }

  return (
    <>
      <Navbar />
      <RememberField
        isRememberOpen={isRememberOpen}
        setIsRememberOpen={setIsRememberOpen}
      />
      <div className="lg:max-w-[75vw] md:max-w-[65vw] max-w-full md:ml-[70px]">
        <header className="w-full h-[4rem] dark:bg-darkMode bg-primaryBlue flex md:hidden justify-center items-center fixed top-0">
          <Link href={"/"}>
            <Image
              src={Logo}
              alt="Catavento logo"
              width={50}
              priority={true}
              className="rounded-full"
            />
          </Link>
          <Image
            src={Plane}
            alt="Lembretes"
            width={20}
            priority={true}
            className="fixed left-[90%] cursor-pointer"
            onClick={() => setIsRememberOpen((prev) => !prev)}
          />
        </header>

        <ShowShadow>
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Relatórios</h1>
        </ShowShadow>

        {reports &&
          reports.map((report, reportIndex) => (
            <>
              <section
                key={reportIndex}
                className={`dark:bg-darkMode bg-primaryBlue ${
                  reportIndex === 0 ? "mt-[9rem] md:mt-[5rem]" : "mt-5"
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
                    <span className="font-normal ml-3">
                      {report.authorName}
                    </span>
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

              <button
                type="button"
                className="mx-2 md:mx-8 p-2 flex items-center w-[20vw] gap-3 m-auto py-1 px-2 mt-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
                onClick={() => handleDownload(report)}
              >
                Baixar como documento Word
              </button>
            </>
          ))}

        <Footer />
      </div>
    </>
  );
}

export default Report;