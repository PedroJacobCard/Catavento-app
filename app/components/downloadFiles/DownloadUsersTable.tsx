import Image from "next/image";

//import bibliotecas
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//import types
import { SchoolOnUserType } from "@/utils/Types";

//importar icons
import Download from '@/public/Download.svg';

//import custom hooks
import useUsers from "@/app/hooks/useUsers";

//import toaster
import toast from "react-hot-toast";

type DownloadUsersTablePropsType = {
  school: SchoolOnUserType
}

function DownloadUsersTable({ school }: DownloadUsersTablePropsType) {
  //import users data
  const { users } = useUsers();

  //funcionalidades para filtrar usuários da escola clicada
  const filteredUsers = users?.filter(user => user.school.some(s => s.schoolName === school.schoolName));

  //funcionalidades para baixar a tabela de usuários
  const generate = () => {
    const doc = new jsPDF();

    if (filteredUsers && filteredUsers.length > 0) {
      const bodyData = filteredUsers.map((user) => {
          const currentSchool = user.school.filter(s => s.schoolName === school.schoolName);
          const shift = currentSchool.map((sc) => sc.shifts).flat(1).join(", ");

          return {
            name: user.user.name || "",
            role: user.role || "",
            email: user.user.email || "",
            shift: shift || ""
          }
        }).flat();

      autoTable(doc, {
        head: [['Nome', 'Papel', 'E-mail', 'Turnos']],
        body: bodyData,
        styles: {
          fillColor: [255, 255, 255], 
          textColor: 'black', 
          font: "helvetica" 
        },
        headStyles: {
          fillColor: [227, 245,255],
          textColor: [0, 0, 0]
        },
        bodyStyles: {
          fillColor: [243, 243, 243],
          textColor: [0, 0, 0]
        },
        theme: 'plain',
        margin: { top: 20 }
      });
      doc.save(`Usuários - ${school.schoolName}.pdf`);
    } else {
      toast.error('Ops... Não deu pra achar os usuários...')
    }
  }
  return (
    <button
      type="button"
      className="mx-2 md:mx-8 p-2 flex items-center justify-center w-[10rem] gap-3 py-1 px-2 mt-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
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

export default DownloadUsersTable;