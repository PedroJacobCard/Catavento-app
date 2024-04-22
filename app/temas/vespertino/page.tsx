"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Marker from '@/public/Marker.svg';
import Plus from '@/public/Plus.svg';
import Form from "@/public/Form.svg";

//import components
import Navbar from "@/app/components/Navbar";
import RememberField from "@/app/components/RememberField";
import Footer from "@/app/components/Footer";
import DownloadThemeFile from "@/app/components/downloadFiles/DownloadThemeFile";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";
import { themeArray } from "@/lib/ThemeArray";

//import costume hooks
import useClass from "@/app/hooks/useClass";
import useSchool from "@/app/hooks/useSchool";
import useUser from "@/app/hooks/useUser";

function Vespertino() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //import classes data
  const { classes } = useClass();

  //import schools data
  const { schools } = useSchool();

  //import user data
  const { user } = useUser();

  //filtrar classes do vespertino
  const filterEveningClasses = classes?.filter(
    (cla) => cla.shift === "VESPERTINO"
  );

  //filtrar escolas das classes do período vespertino
  const filteredSchools = schools.filter((sch) =>
    filterEveningClasses?.some((cla) => cla.schoolName === sch.name)
  );

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
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Temas / Vespertino</h1>
        </ShowShadow>

        {filteredSchools.map((school, schoolIndex) => (
          <div key={schoolIndex}>
            <div
              className={`${
                schoolIndex === 0 ? "mt-[8rem] md:mt-[5rem]" : "mt-8"
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
                <div className="flex flex-wrap mt-9 items-center justify-start gap-3 mx-5 mb-3">
                  {filterEveningClasses
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
                      return (
                        transformedThemesOnClass[0] === theme &&
                        cla.schoolName === school.name
                      );
                    })
                    .map((cla, claIndex) => (
                      <div key={claIndex} className="flex">
                        
                          <div className="absolute top-[3.5rem] right-5">
                            <p>
                              {cla.done
                                ? filterEveningClasses
                                    .filter(
                                      (c) =>
                                        c.theme === cla.theme &&
                                        c.done &&
                                        c.schoolName === school.name
                                    )
                                    .map((cla) => cla.students)
                                    .reduce((acc, current) => acc + current, 0)
                                : 0}{" "}
                              Alunos fizeram esta temática
                            </p>
                          </div>

                        <div className="flex flex-col items-center justify-center min-w-[100px] my-2 p-1 dark:bg-darkModeBgColor bg-white rounded-md shadow-md">
                          <div className="flex items-center justify-between w-full">
                            <input
                              type="checkbox"
                              checked={cla.done}
                              unselectable="off"
                            />

                            {user?.role === "COORDENADOR(A)" ||
                            user?.role === "SECRETARIO(A)" ? (
                              <Image
                                src={Marker}
                                alt="Alterar classe"
                                width={15}
                                height={15}
                                priority={true}
                              />
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="flex flex-col items-center justify-center mt-2">
                            <p className="font-bold">{cla.name}</p>
                            <p>
                              <span>{cla.students}</span> Alunos
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {user?.role === "COORDENADOR(A)" ||
                  user?.role === "SECRETARIO(A)" ? (
                    <button
                      type="button"
                      className="w-10 h-10 dark:bg-darkModeBgColor bg-white rounded-md shadow-md dark:hover:bg-darkMode   hover:bg-slate-200 duration-300"
                    >
                      <Image
                        src={Plus}
                        alt="addicionar classe"
                        width={25}
                        height={25}
                        priority={true}
                        className="m-auto"
                        title="Adicionar Classe"
                      />
                    </button>
                  ) : (
                    ""
                  )}
                </div>

                {user?.role === "COORDENADOR(A)" ||
                user?.role === "SECRETARIO(A)" ? (
                  <button
                    type="button"
                    className="w-auto h-10 flex items-center justify-center gap-3 px-2 mx-5 dark:bg-darkModeBgColor bg-white rounded-md shadow-md dark:hover:bg-darkMode   hover:bg-slate-200 duration-300"
                  >
                    <Image
                      src={Form}
                      alt="Relatório"
                      width={25}
                      height={25}
                      priority={true}
                    />
                    Fazer relatório
                  </button>
                ) : (
                  ""
                )}
              </section>
            ))}
          </div>
        ))}

        <Footer />
      </div>
    </>
  );
}

export default Vespertino;
