"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Marker from "@/public/Marker.svg";
import Plus from "@/public/Plus.svg";
import Form from "@/public/Form.svg";
import Popup from "@/public/Popup.svg";

//import components
import Navbar from "@/app/components/Navbar";
import RememberField from "@/app/components/RememberField";
import Footer from "@/app/components/Footer";
import ShowShadow from "@/app/components/ShowShadow";
import DownloadThemeFile from "@/app/components/downloadFiles/DownloadThemeFile";
import CreateClass from "@/app/components/forms/create-class/CreateClass";
import EditClass from "@/app/components/forms/edit-class/EditClass";
import CreateReport from "@/app/components/forms/create-report/CreateReport";
import TableOfQualityData from "@/app/components/TableOfQualityData";
import Loading from "@/app/components/Loading";

//import lib functions
import { themeArray } from "@/lib/EnumsToArray";

//import costume hooks
import useClass from "@/app/hooks/useClass";
import useSchool from "@/app/hooks/useSchool";
import useUser from "@/app/hooks/useUser";

//import enums
import { Theme } from "@/utils/Enums";

//session and redirection
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function Matutino() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //funcionalidades para mostrar o formulário de criação de classe
  const [showCreateClassForm, setShowCreateClassForm] =
    useState<boolean>(false);
  const [createClassIndex, setCreateClassIndex] = useState<number>(0);

  //funcionalidades para mostrar o formulário de edição de classe
  const [showEditClassForm, setShowEditClassForm] = useState<boolean>(false);
  const [editClassIndexes, setEditClassIndexes] = useState<number[]>([]);

  const handleEditClassClick = (
    schoolIndex: number,
    themeIndex: number,
    claIndex: number
  ) => {
    setShowEditClassForm(!showEditClassForm);
    setEditClassIndexes([schoolIndex, themeIndex, claIndex]);
  };

  //funcionalidades para mostrar o formulário de criação de relatórios
  const [showCreateReportForm, setShowCreateReportForm] =
    useState<boolean>(false);
  const [createReportIndexes, setCreateReportIndexes] = useState<number[]>([]);

  const handleCreateReportClick = (schoolIndex: number, themeIndex: number) => {
    setShowCreateReportForm(!showCreateReportForm);
    setCreateReportIndexes([schoolIndex, themeIndex]);
  };

  //session
  const { status, data: session } = useSession();

  //import classes data
  const { classes } = useClass();

  //import schools data
  const { userSchools } = useSchool();

  //import user data
  const { user } = useUser();

  //filtrar classes do matutino
  const filterMorningClasses = classes?.filter(
    (cla) => cla.shift === "MATUTINO"
  );

  //filtrar escolas das classes do período matutino
  const filteredSchools = userSchools.filter((sch) =>
    user?.school.some(
      (school) =>
        school.schoolName === sch.name &&
        sch.shift.some(
          (shi) =>
            shi.toString() === "MATUTINO" &&
            school.shifts.some((shif) => shif.toString() === "MATUTINO")
        )
    )
  );

  //clicar para mostrar os tmas da escola selecionada
  type ShowSchoolBlockTypes = {
    [index: number]: boolean;
  };

  const [showSchoolBlock, setShowSchoolBlock] = useState<ShowSchoolBlockTypes>({
    0: false,
  });

  const handleSchoolBlockClick = (index: number) => {
    setShowSchoolBlock((prev) => {
      return { ...prev, [index]: !prev[index] };
    });
  };

  //verifica o status da seção
  if (status === "loading") {
    return <Loading />;
  }
  
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar />
      <RememberField
        isRememberOpen={isRememberOpen}
        setIsRememberOpen={setIsRememberOpen}
      />
      <div className="max-w-full min-h-[100vh] pb-[16rem] md:pb-[12rem] md:mr-[12.5rem] lg:mr-[15.6rem] md:ml-[4.4rem] relative">
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
          <div
            key={schoolIndex}
            className={`${
              schoolIndex === 0 ? "mt-[8rem] md:mt-[5rem]" : "mt-5"
            } shadow-md mx-2 py-2 rounded-md`}
          >
            <div className="flex flex-col items-center justify-center mx-2 gap-3 lg:flex-row lg:justify-between lg:items-top">
              <h1 className="font-bold text-xl">{school.name}</h1>
            </div>
            {themeArray?.map((theme, themeIndex) => (
              <section
                key={themeIndex}
                className={`${themeIndex === 0 ? "mt-2" : "mt-5"} ${
                  showSchoolBlock[schoolIndex] ? "block" : "hidden"
                } dark:bg-darkMode bg-primaryBlue mx-2 md:mx-[2rem] rounded-md overflow-hidden py-5 shadow-md relative`}
              >
                <div className="flex items-start justify-between mx-5 mb-5 flex-row lg:items-top">
                  <h1 className="max-w-[300px] md:max-w-[350px] font-bold text-xl">
                    {theme}
                  </h1>
                  <DownloadThemeFile theme={theme} />
                </div>
                <div className="flex flex-wrap mt-9 items-center justify-start gap-3 mx-5 mb-3">
                  <div className="absolute top-[3.5rem] right-5">
                    <p>
                      <span className="font-bold">
                        {filterMorningClasses
                          ?.filter((c) => {
                            let transformedThemesOnClass: string[] = [];
                            switch (c.theme.toString()) {
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
                                transformedThemesOnClass.push(
                                  "Dominio Próprio"
                                );
                                break;
                              default:
                                transformedThemesOnClass.push(
                                  c.theme.toString().charAt(0).toUpperCase() +
                                    c.theme.toString().slice(1).toLowerCase()
                                );
                            }
                            return (
                              transformedThemesOnClass[0] === theme &&
                              c.done &&
                              c.schoolName === school.name
                            );
                          })
                          .map((cla) => cla.students)
                          .reduce((acc, current) => acc + current, 0)}
                      </span>{" "}
                      Alunos fizeram esta temática
                    </p>
                  </div>

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
                      return (
                        transformedThemesOnClass[0] === theme &&
                        cla.schoolName === school.name
                      );
                    })
                    .map((cla, claIndex) => (
                      <div key={claIndex} className="flex">
                        <div className="flex flex-col items-center justify-center min-w-[100px] my-2 p-1 dark:bg-darkModeBgColor bg-white rounded-md shadow-md">
                          <div className="flex items-center justify-between w-full">
                            <input
                              type="checkbox"
                              checked={cla.done}
                              unselectable="off"
                              readOnly
                            />

                            {user?.role?.toString() === "COORDENADOR_A" ||
                            user?.role?.toString() === "SECRETARIO_A" ? (
                              <Image
                                src={Marker}
                                alt="Alterar classe"
                                width={15}
                                height={15}
                                priority={true}
                                onClick={() =>
                                  handleEditClassClick(
                                    schoolIndex,
                                    themeIndex,
                                    claIndex
                                  )
                                }
                                className="cursor-pointer"
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

                        <EditClass
                          showEditClassForm={
                            editClassIndexes[0] === schoolIndex &&
                            editClassIndexes[1] === themeIndex &&
                            editClassIndexes[2] === claIndex &&
                            showEditClassForm
                          }
                          setShowEditClassForm={setShowEditClassForm}
                          cla={cla}
                        />
                      </div>
                    ))}
                  {user?.role?.toString() === "COORDENADOR_A" ||
                  user?.role?.toString() === "SECRETARIO_A" ? (
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
                        onClick={() => {
                          setShowCreateClassForm(!showCreateClassForm);
                          setCreateClassIndex(themeIndex);
                        }}
                      />
                    </button>
                  ) : (
                    ""
                  )}
                </div>

                {user?.role?.toString() === "COORDENADOR_A" ||
                user?.role?.toString() === "SECRETARIO_A" ? (
                  <button
                    type="button"
                    className="w-auto h-10 flex items-center justify-center gap-3 px-2 mx-5 dark:bg-darkModeBgColor bg-white rounded-md shadow-md dark:hover:bg-darkMode   hover:bg-slate-200 duration-300"
                    onClick={() =>
                      handleCreateReportClick(schoolIndex, themeIndex)
                    }
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
                <CreateClass
                  showCreateClassForm={
                    createClassIndex === themeIndex && showCreateClassForm
                  }
                  setShowCreateClassForm={setShowCreateClassForm}
                  schoolName={school.name}
                  theme={Theme[themeIndex]}
                  shift="MATUTINO"
                />

                <CreateReport
                  showCreateReportForm={
                    createReportIndexes[0] === schoolIndex &&
                    createReportIndexes[1] === themeIndex &&
                    showCreateReportForm
                  }
                  setShowCreateReportForm={setShowCreateReportForm}
                  theme={Theme[themeIndex]}
                  schoolName={school.name}
                  shift="MATUTINO"
                />
              </section>
            ))}
            <Image
              src={Popup}
              alt="Mostrar temas"
              width={20}
              height={20}
              className={`mx-auto my-3 cursor-pointer ${
                showSchoolBlock[schoolIndex] ? "rotate-180" : "rotate-0"
              }`}
              onClick={() => handleSchoolBlockClick(schoolIndex)}
            />
          </div>
        ))}

        <section className="overflow-x-scroll mt-7 mx-2 shadow-md px-5">
          <TableOfQualityData shift="MATUTINO" />
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Matutino;
