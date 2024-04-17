//import types
import { ReportType } from "@/utils/Types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//props type
type DownloadReportPropsType = {
  report: ReportType,
}


function DownloadReport({ report }: DownloadReportPropsType) {

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const margin = 10;
    const columnWidth = 100;
    const rowHeight = 13;
    const startX = margin;
    const startY = margin;

    const questions = [
      "Escola:",
      "Data de envio:",
      "Remetente:",
      "Tema:",
      "Classe e turno:",
      "Etapas realizadas:",
      "N° de voluntários que participaram:",
      "Materiais utilizados:",
      "N° de atendidos em capelania individual:",
      "Observação da capelania individual:",
    ];

    const answers = [
      report.schoolName,
      report.createdAt,
      report.authorName,
      report.theme.toString(),
      report.classAndShift,
      report.activitiesDone.join(", "),
      report.coworkers.toString(),
      report.resources.join(", "),
      report.assistedInChaplaincy.toString(),
      report.chaplaincyObservation,
    ];

    questions.forEach((question, index) => {
      doc.setFont('helvetica');
      doc.text(question, startX, startY + (index + 1) * rowHeight);
      doc.setFontSize(12);
      doc.setFillColor(2, 2, 2);
    });

    answers.forEach((answer, index) => {
      const splitAnswers = doc.splitTextToSize(answer, columnWidth);
      let y = startX + (index + 1);

      if (index === answers.length - 1) {
        splitAnswers.forEach((line: string) => {
          doc.text(line, startX + 5, (y + doc.internal.pageSize.getHeight() - 160));
          y += 6;
        })
      } else {
        doc.text(answer, startX + 5, startY + index * rowHeight + 19);
      }

    });

    doc.save(`Relatório - ${report.schoolName}.pdf`);
  }

  return (
    <button
      type="button"
      className="mx-2 md:mx-8 p-2 flex items-center w-[20vw] gap-3 m-auto py-1 px-2 mt-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
      onClick={handleGeneratePDF}
    >
      Baixar como PDF
    </button>
  );
}

export default DownloadReport;