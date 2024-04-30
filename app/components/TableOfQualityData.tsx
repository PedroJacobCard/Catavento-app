//import costume hooks
import useSchool from "../hooks/useSchool";
import useClass from "../hooks/useClass";
import useUsers from "../hooks/useUsers";

//import enums
import { Theme } from "@/utils/Enums";

//props type
type TableOfQualityDataPropsType = {
  shift: string
}

function TableOfQualityData({ shift }: TableOfQualityDataPropsType) {
  //import school data
  const { schools } = useSchool();
  
  //import classes data
  const { classes } = useClass();
  
  //import users data
  const { users } = useUsers();


  return (
    <table className="w-[49rem] lg:w-full flex flex-col px-5 py-5 dark:bg-darkMode bg-primaryBlue rounded-md shadow-md">
      <div className="flex gap-3 items-center justify-center text-center">
        <thead>Escola</thead>
        <thead>Temas Concluídos</thead>
        <thead>Alunos que Concluíram</thead>
        <thead>Temas a Concluir</thead>
        <thead>Alunos a Concluir</thead>
        <thead>Turno</thead>
        <thead>Coordenador de Equipe</thead>
      </div>
      {schools && schools
        .filter((school) => school.shift.some((shi) => shi === shift))
        .map((school, schoolIndex) => {
          //funcionalidades para adiquirir os temas que foram concluídos
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
                  cla.schoolName === schoolName  &&
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

          const uniqueThemes = allThemes.filter(
            (the) => themeCounts[the] === 1
          );

          //funcionalidades para encontrar os alunos da devida escola que fizeram o tema
          const classesForSchool = classes?.filter(
            (c) => c.done && c.schoolName === schoolName && c.shift === shift
          );
          const totalStudents = classesForSchool?.reduce(
            (acc, val) => acc + val.students,
            0
          );

          //funcionalidades para encontrar os alunos da devida escola que não fizeram o tema
          const classesNotDoneForSchool = classes?.filter(
            (c) => !c.done && c.schoolName === schoolName && c.shift === shift
          );
          const totalStudentsNotDone = classesNotDoneForSchool?.reduce(
            (acc, val) => acc + val.students,
            0
          );

          //adquirir coordenador da devida escola
          const coordinator = users?.filter(user => user.role === "COORDENADOR(A)" &&  user.school.some(s => s.schoolName == schoolName))[0];

          return (
            <div
              key={schoolIndex}
              className="flex gap-3 items-center justify-center text-center"
            >
              <tbody>{school.name}</tbody>
              <tbody>{uniqueThemes}</tbody>
              <tbody>
                {totalStudents}
              </tbody>
              <tbody>
                {notAccomplishedThemes.join(', ')}
              </tbody>
              <tbody>
                {totalStudentsNotDone}
              </tbody>
              <tbody>
                {shift}
              </tbody>
              <tbody>
                {coordinator?.name}
              </tbody>
            </div>
          );
        })}
    </table>
  );
}

export default TableOfQualityData;