import { useEffect, useState } from "react";
import useSchool from "../hooks/useSchool";
import useClass from "../hooks/useClass";
import useUsers from "../hooks/useUsers";
import { Theme } from "@/utils/Enums";
import DownloadTableOfQualityData from "./downloadFiles/DownloadTableOfQualityData";
import { DownloadDataTableOfQualityType } from "@/utils/Types";

type TableOfQualityDataPropsType = {
  shift: string;
};

function TableOfQualityData({ shift }: TableOfQualityDataPropsType) {
  //adquirir dados da escola para download
  const [schoolsDataOnTable, setSchoolsDataOnTable] = useState<DownloadDataTableOfQualityType[]>([]);

  //importar dados das escolas
  const { schools } = useSchool();

  //importar dados das classes
  const { classes } = useClass();

  //importar dados dos usuários
  const { users } = useUsers();

  useEffect(() => {
    if (!schools) return;

    const updatedData: DownloadDataTableOfQualityType[] = schools
      .filter((school) => school.shift.some((shi) => shi === shift))
      .map((school) => {
        let accomplishedThemes: string[] = [];
        let notAccomplishedThemes: string[] = [];
        const schoolName = school.name;
        const themeValues = Object.values(Theme);

        for (const theme of themeValues) {
          if (isNaN(Number(theme))) {
            const filteredClasses = classes?.some(
              (cla) =>
                cla.done &&
                cla.shift === shift &&
                cla.schoolName === schoolName &&
                cla.theme.toString() === theme
            );
            if (filteredClasses) {
              accomplishedThemes.push(theme.toString());
            }

            const filteredClassesNotDone = classes?.some(
              (cla) =>
                !cla.done &&
                cla.shift === shift &&
                cla.schoolName === schoolName &&
                cla.theme.toString() === theme
            );
            if (filteredClassesNotDone) {
              notAccomplishedThemes.push(theme.toString());
            }
          }
        }

        const allThemes = [...accomplishedThemes, ...notAccomplishedThemes];
        const themeCounts = allThemes.reduce((acc, theme) => {
          acc[theme] = (acc[theme] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const uniqueThemes = allThemes.filter((the) => themeCounts[the] === 1);

        const classesForSchool = classes?.filter(
          (c) => c.done && c.schoolName === schoolName && c.shift === shift
        );
        const totalStudents = classesForSchool?.reduce(
          (acc, val) => acc + val.students,
          0
        );

        const classesNotDoneForSchool = classes?.filter(
          (c) => !c.done && c.schoolName === schoolName && c.shift === shift
        );
        const totalStudentsNotDone = classesNotDoneForSchool?.reduce(
          (acc, val) => acc + val.students,
          0
        );

        const coordinator = users?.filter(
          (user) =>
            user.role === "COORDENADOR(A)" &&
            user.school.some((s) => s.schoolName == schoolName)
        )[0];

        return {
          name: schoolName,
          uniqueThemes: uniqueThemes.join(", "),
          totalStudents: totalStudents || 0,
          notAccomplishedThemes: notAccomplishedThemes.join(", "),
          totalStudentsNotDone: totalStudentsNotDone || 0,
          shift: shift,
          coordinatorName: coordinator ? coordinator.name : "",
        };
      });

    setSchoolsDataOnTable(updatedData);
  }, [schools, classes, users, shift]);

  return (
    <div className="w-[55rem] my-5">
      <table className="flex flex-col px-5 py-5 dark:bg-darkMode bg-primaryBlue rounded-md shadow-md border-collapse">
        <caption className="title pb-3 pl-2 text-left">
          Tabela de dados qualitativos
        </caption>
        <thead className="dark:bg-darkModeBgColor bg-secondaryBlue">
          <tr>
            <th className="min-w-[10rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
              Escola
            </th>
            <th className="max-w-[7rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
              Temas Concluídos
            </th>
            <th className="max-w-[6rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
              Alunos que Concluíram
            </th>
            <th className="max-w-[8rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
              Temas a Concluir
            </th>
            <th className="max-w-[6rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
              Alunos a Concluir
            </th>
            <th className="min-w-[8rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
              Turno
            </th>
            <th className="max-w-[8rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
              Coordenador de Equipe
            </th>
          </tr>
        </thead>

        <tbody>
          {schoolsDataOnTable.filter(school => school.coordinatorName.length > 0).map((school, schoolIndex) => (
            <tr key={schoolIndex}>
              <td className="max-w-[15rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
                {school.name}
              </td>
              <td className="min-w-[7rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
                {school.uniqueThemes}
              </td>
              <td className="min-w-[6rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
                {school.totalStudents}
              </td>
              <td className="max-w-[8rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
                {school.notAccomplishedThemes}
              </td>
              <td className="min-w-[6rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
                {school.totalStudentsNotDone}
              </td>
              <td className="min-w-[8rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
                {school.shift}
              </td>
              <td className="min-w-[8rem] text-center px-2 py-1 dark:border-b dark:border-darkBlue border-gray-300">
                {school.coordinatorName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DownloadTableOfQualityData schoolsDataOnTable={schoolsDataOnTable} />
    </div>
  );
}

export default TableOfQualityData;