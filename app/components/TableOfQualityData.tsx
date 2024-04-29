//import costume hooks
import useSchool from "../hooks/useSchool";
import useClass from "../hooks/useClass";
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
  
  //funcionalidades para adiquirir os temas que foram concluídos
  let accomplishedThemes: string[] = [];
  let notAccomplishedThemes: string[] = [];
  const themeValues = Object.values(Theme);

  for (const theme of themeValues) {
    if(isNaN(Number(theme))) {
      const filteredClasses = classes?.some(cla => cla.done && cla.shift === shift && cla.theme.toString() === theme);
      console.log(filteredClasses)
      if (filteredClasses) {
        accomplishedThemes.push(theme.toString());
      }

      const filteredClassesNotDone = classes?.some(cla => !cla.done && cla.shift === shift && cla.theme.toString() === theme);
      if (filteredClassesNotDone) {
        notAccomplishedThemes.push(theme.toString())
      }
    }
  }
    
  const allThemes = [...accomplishedThemes, ...notAccomplishedThemes];

  const themeCounts = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) +1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueThemes = allThemes.filter(the => themeCounts[the] === 1)
  
    console.log(uniqueThemes)


  return (
    <div className="overflow-x-scroll mt-7 mx-2 md:mx-[2rem]">
      <table className="w-[52rem] flex flex-col px-5 py-5 dark:bg-darkMode bg-primaryBlue rounded-md shadow-md">
        <div className="flex gap-3 items-center justify-center text-center">
          <thead>Escola</thead>
          <thead>Temas Concluídos</thead>
          <thead>Alunos que Concluíram</thead>
          <thead>Temas a Concluir</thead>
          <thead>Alunos a Concluir</thead>
          <thead>Turno</thead>
          <thead>Coordenador de Equipe</thead>
        </div>
      </table>
    </div>
  );
}

export default TableOfQualityData;