"use client";
import { useState } from "react";
import Image from "next/image";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Link from "next/link";

//import components
import Navbar from "@/app/components/Navbar";
import RememberField from "@/app/components/RememberField";
import Footer from "@/app/components/Footer";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";

//import costume hooks
import useClass from "@/app/hooks/useClass";
import useSchool from "@/app/hooks/useSchool";

//import enums
import { Theme } from "@/utils/Enums";
import DownloadThemeFile from "@/app/components/downloadFiles/DownloadThemeFile";

function Matutino() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //funcionalidades para transformar temas em array
  let themeArray: string[] = [];
  for (let key in Theme) {
    if (isNaN(Number(Theme[key]))) {
      switch (Theme[key]) {
        case "SUPERACAO": themeArray.push("Superação");
        break;
        case "ESPERANCA": themeArray.push("Esperança");
        break;
        case "GRATIDAO": themeArray.push("Gratidão");
        break;
        case "COMPAIXAO": themeArray.push("Compaixão");
        break;
        case "FE": themeArray.push("Fé");
        break;
        case "DOMINIO_PROPRIO": themeArray.push("Dominio Próprio");
        break;
        default: themeArray.push(Theme[key].charAt(0).toUpperCase() + Theme[key].slice(1).toLowerCase());
      }
    }
  }

  //import classes data
  const { classes } = useClass();

  //import schools data
  const { schools } = useSchool();

  //filtrar classes do matutino
  const filterMorningClasses = classes?.filter(cla => cla.shift === "MATUTINO")

  //filtrar escolas das classes do período matutino
  const filteredSchools = schools.filter(sch => filterMorningClasses?.some(cla => cla.schoolName === sch.name))

  //funcionalidades para somar o numero de alunos que fizeram o devido tema
  //const handleNumberOfStudentsChange = ()

  return (
    <>
      <Navbar />
      <RememberField
        isRememberOpen={isRememberOpen}
        setIsRememberOpen={setIsRememberOpen}
      />
      <div className="lg:max-w-[75vw] md:max-w-[65vw] max-w-full md:ml-[70px]">
        <header className="w-full h-[4rem] dark:bg-darkMode bg-primaryBlue flex md:hidden justify-center items-center fixed top-0 z-50">
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
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Temas / Matutino</h1>
        </ShowShadow>

        {filteredSchools.map((school, schoolIndex) => (
          <div key={schoolIndex}>
            <div
              className={`${
                schoolIndex === 0 ? "mt-[8rem] md:mt-[5rem]" : "mt-5"
              } flex flex-col items-start mx-2 md:ml-[2rem] gap-3 lg:flex-row lg:justify-between lg:items-top`}
            >
              <h1 className="font-bold text-xl">{school.name}</h1>
            </div>
            {themeArray?.map((theme, themeIndex) => (
              <section
                key={themeIndex}
                className={`${
                  themeIndex === 0 ? "mt-2" : "mt-5"
                } dark:bg-darkMode bg-primaryBlue mx-2 md:mx-[2rem] rounded-md overflow-hidden py-5 shadow-md relative`}
              >
                <div className="flex items-start justify-between mx-5 mb-5 flex-row lg:items-top">
                  <h1 className="max-w-[300px] md:max-w-[350px] font-bold text-xl">
                    {theme}
                  </h1>
                  <DownloadThemeFile theme={theme} />
                </div>
                <div className="flex flex-wrap mt-9">
                  {filterMorningClasses
                    ?.filter((cla) => {
                      let transformedThemesOnClass: string[] = [];
                      switch (cla.theme.toString()) {
                        case "SUPERACAO":
                          transformedThemesOnClass.push("Superação");
                          break;
                        case "ESPERANCA":
                          transformedThemesOnClass.push("Esperança");
                          break;
                        case "GRATIDAO":
                          transformedThemesOnClass.push("Gratidão");
                          break;
                        case "COMPAIXAO":
                          transformedThemesOnClass.push("Compaixão");
                          break;
                        case "FE":
                          transformedThemesOnClass.push("Fé");
                          break;
                        case "DOMINIO_PROPRIO":
                          transformedThemesOnClass.push("Dominio Próprio");
                          break;
                        default:
                          transformedThemesOnClass.push(
                            cla.theme.toString().charAt(0).toUpperCase() +
                              cla.theme.toString().slice(1).toLowerCase()
                          );
                      }
                      return transformedThemesOnClass[0] === theme;
                    })
                    .map((cla, claIndex) => (
                      <div key={claIndex} className="flex">
                        {claIndex === 0 ? (
                          <div className="absolute top-[3.5rem] right-5">
                            <p>
                              {cla.done
                                ? filterMorningClasses
                                    .filter(c => c.theme === cla.theme && c.done)
                                    .map((cla) => cla.students)
                                    .reduce((acc, current) => acc + current, 0)
                                : 0}{" "}
                              Alunos fizeram esta temática
                            </p>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="flex flex-col items-center justify-center ml-5 my-2 p-5 dark:bg-darkModeBgColor bg-white rounded-md shadow-md">
                          <p>{cla.name}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        ))}

        <Footer />
      </div>
    </>
  );
}

export default Matutino;
