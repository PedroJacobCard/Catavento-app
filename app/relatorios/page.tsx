"use client";
import { useState, useRef, useEffect, createRef, RefObject } from "react";
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
import DownloadReport from "../components/downloadFiles/DownloadReport";

//importar bibliotecas para download de relatórios
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Report() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //importar relatórios
  const { reports } = useReport();

  //funcionalidades para baixar os relatórios
  const downloadLinks = useRef<RefObject<HTMLDivElement>[]>([]);
  const [, setForceUpdate] = useState(Date.now());

  const handleDownload = async (reportIndex: number) => {
    const inputData = downloadLinks.current[reportIndex].current;
    
    try {
      if (!inputData) throw new Error("Não foi possível acessar o link");

      const canvas = await html2canvas(inputData);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const width = pdfWidth - 150;
      const height = (canvas.height * width) / canvas.width;

      const xPosition = (pdfWidth - width) / 2;
      const yPosition = (pdfHeight - height) / 2;

      pdf.addImage(imgData, "PNG", xPosition, yPosition, width, height);
      pdf.save("Relatório.pdf");
    } catch (error) {
      console.error('Falha ao fazer o download', error)
    }
  }

  useEffect(() => {
    // Ensure downloadLinks.current is an array before //assigning new refs
    if (Array.isArray(downloadLinks.current)) {
      downloadLinks.current = reports!.map(() => createRef<HTMLDivElement>());
    }
    setForceUpdate(Date.now())
  }, [reports]);

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
            <div key={reportIndex}>
              <div ref={downloadLinks.current[reportIndex]}>
                <DownloadReport report={report} reportIndex={reportIndex} />
              </div>

              <button
                type="button"
                className="mx-2 md:mx-8 p-2 flex items-center w-[20vw] gap-3 m-auto py-1 px-2 mt-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
                onClick={() => handleDownload(reportIndex)}
              >
                Baixar como documento Word
              </button>
            </div>
          ))}

        <Footer />
      </div>
    </>
  );
}

export default Report;