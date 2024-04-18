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

//import enums
import { Theme } from "@/utils/Enums";
import useSchool from "@/app/hooks/useSchool";

function Matutino() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //funcionalidades para transformar temas em array
  let themeArray = [];
  for (let key in Theme) {
    if (isNaN(Number(Theme[key]))) {
      themeArray.push(Theme[key]);
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

  return (
    <>
      <Navbar />
      <RememberField
        isRememberOpen={isRememberOpen}
        setIsRememberOpen={setIsRememberOpen}
      />
      <div className="lg:max-w-[75vw] md:max-w-[65vw] max-w-full md:ml-[70px]">
        <header className="w-full h-[4rem] dark:bg-darkMode bg-primaryBlue flex md:hidden justify-center items-center fixed top-0">
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
            <div className={`${
              schoolIndex === 0 ? "mt-[8rem] md:mt-[5rem]" : "mt-5"
              } flex flex-col items-start mx-2 md:ml-[2rem] gap-3 lg:flex-row lg:justify-between lg:items-top`}
            >
              <h1 className="font-bold text-xl">{school.name}</h1>
            </div>
            {themeArray?.map((theme, themeIndex) => (
                <section key={themeIndex} className="dark:bg-darkMode bg-primaryBlue mt-5 mx-2 md:mx-[2rem] rounded-md  overflow-hidden py-5  shadow-md">
                  <div className="flex flex-col items-start mx-5 gap-3 lg:flex-row lg:justify-between lg:items-top">
                    <h1 className="max-w-[300px] md:max-w-[350px] font-bold text-xl">
                      {theme}
                    </h1>
                  </div>

                  <div className="flex flex-col items-start mx-2 mt-5 gap-3 p-3 lg:py-0"></div>
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
