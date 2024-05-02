import Image from "next/image";

//import bibliotecas
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//import types
import { DownloadDataTableOfQualityType } from "@/utils/Types";

//importar icons
import Download from "@/public/Download.svg";

//import custom hooks
import useUsers from "@/app/hooks/useUsers";

//import toaster
import toast from "react-hot-toast";

type DownloadTableOfQualityDataPropsType = {
  schoolsDataOnTable: DownloadDataTableOfQualityType[];
};

function DownloadTableOfQualityData({
  schoolsDataOnTable
}: DownloadTableOfQualityDataPropsType) {

  //funcionalidades para baixar a tabela de usuários
  const generate = () => {
    if (schoolsDataOnTable.length === 0) {
        toast.error("Ops! Algo deu errado... Tente novamente.")
        return;
      }
    const doc = new jsPDF();

      autoTable(doc, {
        head: [
          [
            "Escola",
            "Temas concluídos",
            "Alunos que concluíram",
            "Temas a concluir",
            "Alunos a concluir",
            "Turno",
            "Coordenador de equipe"
          ],
        ],
        body: schoolsDataOnTable.map((schoolData) => {
          return [
            schoolData.name, 
            schoolData.uniqueThemes, 
            schoolData.totalStudents, 
            schoolData.notAccomplishedThemes,
            schoolData.totalStudentsNotDone,
            schoolData.shift,
            schoolData.coordinatorName
          ]
        }),
        styles: {
          fillColor: [255, 255, 255],
          textColor: "black",
          font: "helvetica",
        },
        headStyles: {
          fillColor: [227, 245, 255],
          textColor: [0, 0, 0],
        },
        bodyStyles: {
          fillColor: [243, 243, 243],
          textColor: [0, 0, 0],
        },
        theme: "plain",
        margin: { top: 20 },
      });

      const shiftOnData = schoolsDataOnTable.map(schoolData => schoolData.shift);
      const uniqueShift = Array.from(new Set(shiftOnData));

    doc.save(`Tabela de dados qualitativos - ${uniqueShift}.pdf`);
  };

  return (
    <button
      type="button"
      className="p-2 flex items-center justify-center w-[10rem] gap-3 py-1 px-2 mt-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
      onClick={generate}
    >
      <Image
        src={Download}
        alt="Baixar relatório"
        width={25}
        height={25}
        priority={true}
      />
      Baixar em PDF
    </button>
  );
}

export default DownloadTableOfQualityData;
