import { useEffect, useState } from "react";

//import costume hooks
import useSchool from "../hooks/useSchool";
import useClass from "../hooks/useClass";
import useUsers from "../hooks/useUsers";

//import enums
import { Theme } from "@/utils/Enums";

//import types
import { DownloadDataTableOfQualityType } from "@/utils/Types";

//import libs
import DownloadTableOfQualityData from "./downloadFiles/DownloadTableOfQualityData";

//import Material UI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

type TableOfQualityDataPropsType = {
  shift: string;
};

function TableOfQualityData({ shift }: TableOfQualityDataPropsType) {
  //adquirir dados da escola para download
  const [schoolsDataOnTable, setSchoolsDataOnTable] = useState<DownloadDataTableOfQualityType[]>([]);

  //importar dados das escolas
  const { userSchools } = useSchool();

  //importar dados das classes
  const { classes } = useClass();

  //importar dados dos usuários
  const { users } = useUsers();

  useEffect(() => {
    if (!userSchools) return;

    const updatedData: DownloadDataTableOfQualityType[] = userSchools
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
            } else {
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
        }

        //const allThemes = [...accomplishedThemes, ...notAccomplishedThemes];
        //const themeCounts = allThemes.reduce((acc, theme) => {
        //  acc[theme] = (acc[theme] || 0) + 1;
        //  return acc;
        //}, {} as Record<string, number>);
        //const uniqueThemes = allThemes.filter((the) => themeCounts[the] === 1);

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
            user.role?.toString() === "COORDENADOR_A" &&
            user.school.some((s) => s.schoolName == schoolName)
        )[0];

        return {
          name: schoolName,
          accomplishedThemes: accomplishedThemes.join(", "),
          totalStudents: totalStudents || 0,
          notAccomplishedThemes: notAccomplishedThemes.join(", "),
          totalStudentsNotDone: totalStudentsNotDone || 0,
          shift: shift,
          coordinatorName: coordinator ? coordinator.user.name : "",
        };
      });

    setSchoolsDataOnTable(updatedData);
  }, [userSchools, classes, users, shift]);

  return (
    <>
      <h1 className="title pb-3 pl-2">Tabela de dados qualitativos</h1>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#fff",
          "@media(prefers-color-scheme: dark)": {
            backgroundColor: "#202020",
          },
          boxShadow: "none",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            border: 0
          }}
          aria-label="dense table"
        >
          <TableHead>
            <TableRow
              className="dark:bg-darkMode bg-primaryBlue"
              sx={{
                "& th": {
                  borderTop: 0,
                  borderRight: 0,
                  borderLeft: 1,
                  borderBottom: 1,
                },
                "& th:first-child": { borderLeft: 0 },
              }}
            >
              <TableCell sx={{ borderBottom: 1, fontWeight: 600 }}>
                Escola
              </TableCell>
              <TableCell
                sx={{ border: "none", fontWeight: 600 }}
                align="center"
              >
                Temas Concluídos
              </TableCell>
              <TableCell
                sx={{ border: "none", fontWeight: 600 }}
                align="center"
              >
                Alunos que Concluíram
              </TableCell>
              <TableCell
                sx={{ border: "none", fontWeight: 600 }}
                align="center"
              >
                Temas a Concluir
              </TableCell>
              <TableCell
                sx={{ border: "none", fontWeight: 600 }}
                align="center"
              >
                Alunos a Concluir
              </TableCell>
              <TableCell
                sx={{ border: "none", fontWeight: 600 }}
                align="center"
              >
                Turno
              </TableCell>
              <TableCell
                sx={{ border: "none", fontWeight: 600 }}
                align="center"
              >
                Coordenador de Equipe
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "& tr:nth-child(odd)": {
                backgroundColor: "#f3f3f3",
              },
              "@media (prefers-color-scheme: dark)": {
                "& tr:nth-child(odd)": {
                  backgroundColor: "#454545",
                },
              },
            }}
          >
            {schoolsDataOnTable
              .filter((school) => school.coordinatorName!.length > 0)
              .map((school, schoolIndex) => (
                <TableRow
                  key={schoolIndex}
                  className="dark:bg-darkMode bg-primaryBlue"
                  sx={{
                    "& td, th": {
                      borderTop: 0,
                      borderRight: 0,
                      borderLeft: 1,
                      borderBottom: 1,
                    },
                    "& th": { borderLeft: 0 },
                  }}
                >
                  <TableCell sx={{ border: 0 }} component="th" scope="row">
                    {school.name}
                  </TableCell>
                  <TableCell sx={{ border: 0 }} align="center">
                    {school.accomplishedThemes}
                  </TableCell>
                  <TableCell sx={{ border: 0 }} align="center">
                    {school.totalStudents}
                  </TableCell>
                  <TableCell sx={{ border: 0 }} align="center">
                    {school.notAccomplishedThemes}
                  </TableCell>
                  <TableCell sx={{ border: 0 }} align="center">
                    {school.totalStudentsNotDone}
                  </TableCell>
                  <TableCell sx={{ border: 0 }} align="center">
                    {school.shift}
                  </TableCell>
                  <TableCell sx={{ border: 0 }} align="center">
                    {school.coordinatorName}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <DownloadTableOfQualityData schoolsDataOnTable={schoolsDataOnTable} />
      </TableContainer>
    </>
  );
}

export default TableOfQualityData;