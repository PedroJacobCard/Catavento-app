//import bibliotecas
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

//import types
import { SchoolOnUserType } from "@/utils/Types";

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
      autoTable(doc, {
        head: [['Nome', 'Papel', 'E-mail', 'Turnos']],
        body: filteredUsers.map((user) => {
          const currentSchool = user.school.filter(s => s.schoolName === school.schoolName);
          const shift = currentSchool.map((sc) => sc.shifts).flat(1).join(", ");

          return [
            user.name, user.role, user.email, shift
          ]
        }),
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
    <div>
      <button type="button" onClick={generate}>Baixar tabela</button>
    </div>
   );
}

export default DownloadUsersTable;