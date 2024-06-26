import Image from "next/image";

//import bibliotecas
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

//import types
import { DownloadDataTableOfQualityType } from "@/utils/Types";

//importar icons
import Download from "@/public/Download.svg";

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

    if (schoolsDataOnTable.length > 0 && !!schoolsDataOnTable && schoolsDataOnTable !== undefined) {
      const bodyData = schoolsDataOnTable.map(
        ({
          name,
          accomplishedThemes,
          totalStudents,
          notAccomplishedThemes,
          totalStudentsNotDone,
          shift,
          coordinatorName,
        }) => ({
          name: name || '',
          accomplishedThemes:     accomplishedThemes || '-',
          totalStudents: totalStudents || 0,
          notAccomplishedThemes:    notAccomplishedThemes || '-',
          totalStudentsNotDone:     totalStudentsNotDone || 0,
          shift: shift || '',
          coordinatorName: coordinatorName || '',
        })
      );

      const values = bodyData.map(data => Object.values(data));
  
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
          body: values,
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
    }

      const shiftOnData = schoolsDataOnTable.map(schoolData => schoolData.shift);
      const uniqueShift = Array.from(new Set(shiftOnData));

    doc.save(`Tabela de dados qualitativos - ${uniqueShift}.pdf`);
  };

  return (
    <button
      type="button"
      className="p-2 flex items-center justify-center w-[10rem] gap-3 py-1 px-2 my-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
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
