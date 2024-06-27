'use client'
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

//import icons
import Logo from "@/public/Logo-principal.svg";
import LogoExtended from "@/public/Logo-navabar-extended.svg";
import School from "@/public/School.svg";
import Calendar from "@/public/Calendar.svg";
import Group from "@/public/Groups.svg";
import Form from "@/public/Form.svg";
import Themes from "@/public/Cube.svg";
import Sun from "@/public/Sun.svg";
import Sunrise from "@/public/Sunrise.svg";
import Moon from "@/public/Moon.svg";
import User from "@/public/User.svg";

//import hook
import useUser from "../hooks/useUser";

function Navbar() {
  //funcionalidades para alterar a cor de background dos links de navegação
  const router = usePathname();

  const defineRoute = useRouter();

  const handlePageChange = (link: string) => {
    return defineRoute.replace(link, { scroll: true })
  };

  //import user data
  const { user } = useUser();

  //transformar turno case
  const shiftToSimpleArray = user?.school.map(s => s.shifts).flat();
  const uniqueShifts = Array.from(new Set(shiftToSimpleArray));
  const shiftToLowerCase: string[] | undefined = uniqueShifts.map(item => item.toString().toLowerCase())

  //funcionalidades para usar o devido icon nos respectivos turnos
  const renderShiftIcon = (shift: string) => {
    switch (shift) {
      case "matutino": 
        return <Image src={Sun} alt="Matutino" width={35} priority={true} className="pl-1 pb-4 md:pl-3 md:pb-0" />;
      case "vespertino":
        return <Image src={Sunrise} alt="Vespertino" width={35} priority={true} className="pl-1 pb-4 md:pl-3 md:pb-0" />;
      case "noturno":
        return <Image src={Moon} alt="Noturno" width={35} priority={true} className="pl-1 pb-4 md:pl-3 md:pb-0" />;
    }
  }

  //definir a ordem em que os turnos serão mostrados
  const shiftsOrder = ["MATUTINO", "VESPERTINO", 'NOTURNO'];
  
  return (
    <div className="w-full left-0 bottom-0 h-[4rem] md:w-[70px] md:hover:w-[250px] md:top-0 md:left-0 md:h-[100vh] flex md:flex-col overflow-hidden dark:bg-darkMode shadow-md hover:shadow-blueShadow dark:hover:shadow-xl bg-primaryBlue fixed z-[599] duration-500 opacity-effect">
      <div className="hidden md:flex justify-center items-center px-2 py-2 shadow-md"
        onClick={() => handlePageChange("/")}
      >
        <Image
          src={Logo}
          alt="Catavento logo"
          width={50}
          priority={true}
          className="first-logo"
        />
        <Image
          src={LogoExtended}
          alt="Logo completo"
          width={120}
          height={20}
          priority={true}
          className="hidden second-logo"
        />
      </div>

      <div className="flex md:flex-col overflow-y-hidden overflow-x-scroll md:overflow-y-scroll md:overflow-x-hidden md:mb-[3.7rem] pl-[4rem] pr-[12rem] md:pl-0 md:pr-0"
        onClick={() => handlePageChange("/")}
      >
        <div
          className={`w-[4rem] md:min-w-[250px] flex items-center px-4 py-4 dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300  ${
              router === "/"
                ? "dark:bg-darkModeBgColor bg-secondaryBlue"
                : "transparent"
            }`}
        >
          <Image src={School} alt="Escola" width={35} priority={true} />
          <h2 className="hidden sm:block font-bold text-xl my-auto mx-auto">
            Escola
          </h2>
        </div>

        <div
          className={`w-[4rem] md:min-w-[250px] flex items-center px-4 py-4 dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue  duration-300  ${
              router === "/calendario"
                ? "dark:bg-darkModeBgColor bg-secondaryBlue"
                : "transparent"
            }`}
          onClick={() => handlePageChange("/calendario")}
          >
          <Image src={Calendar} alt="Calendário" width={35} priority={true} />
          <h2 className="hidden sm:block font-bold text-xl my-auto mx-auto">
            Calendário
          </h2>
        </div>

        <div
          className={`w-[4rem] md:min-w-[250px] flex items-center px-4 py-4 dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue  duration-300  ${
              router === "/equipe"
                ? "dark:bg-darkModeBgColor bg-secondaryBlue"
                : "transparent"
            }`}
            onClick={() => handlePageChange("/equipe")}
          >
          <Image src={Group} alt="Equipe" width={35} priority={true} />
          <h2 className="hidden sm:block font-bold text-xl my-auto mx-auto">
            Equipe
          </h2>
        </div>

        {user?.role!.toString() === "COORDENADOR_A_GERAL" && (
          <div
            className={`w-[4rem] md:min-w-[250px] flex items-center px-4 py-4 dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300  ${
              router === "/relatorios"
                ? "dark:bg-darkModeBgColor bg-secondaryBlue"
                : "transparent"
            }`}
            onClick={() => handlePageChange("/relatorios")}
          >
            <Image src={Form} alt="Relatórios" width={35} priority={true} />
            <h2 className="hidden sm:block font-bold text-xl my-auto mx-auto">
              Relatórios
            </h2>
          </div>
        )}

        <div className="w-[4rem] md:min-w-[250px] flex flex-col relative">
          {shiftToLowerCase && (
            <div className="group flex md:flex-col">
              <div
                className={`w-[4rem] md:min-w-[250px] flex items-center px-4 py-4 dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300  ${
                  router === "/temas/matutino" ||
                  router === "/temas/vespertino" ||
                  router === "/temas/noturno"
                    ? "dark:bg-darkModeBgColor bg-secondaryBlue"
                    : "transparent"
                }`}
                onClick={() => handlePageChange(`/temas/${shiftToLowerCase[0]}`)}
              >
                <Image src={Themes} alt="Temas" width={35} priority={true} />
                <h2 className="hidden sm:block font-bold text-xl m-auto">
                  Temas
                </h2>
              </div>

              {
                shiftsOrder.map(shift => {
                  const shiftIndex = shiftToLowerCase.indexOf(shift.toLowerCase());

                  if (shiftIndex <= -1) {
                    return null;
                  }

                  return (
                    <>
                      <div
                        className={`w-[4rem] h-[4rem] md:min-w-[250px] flex items-center px-4 py-4    dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300  ${
                          router === `/temas/${shiftToLowerCase[shiftIndex]}`
                            ? "dark:bg-darkModeBgColor bg-secondaryBlue opacity-100"
                            : "transparent"
                        }`}
                        onClick={() =>
                          handlePageChange(
                            `/temas/${shiftToLowerCase[shiftIndex]}`
                          )
                        }
                      >
                        {renderShiftIcon(shiftToLowerCase[shiftIndex])}

                        <h2 className="hidden sm:block font-bold text-xl my-auto mx-auto">
                          {shiftToLowerCase[shiftIndex] &&
                            shiftToLowerCase[shiftIndex]
                            .charAt(0)
                            .toLocaleUpperCase() +
                            shiftToLowerCase[shiftIndex].slice(1)}
                        </h2>
                      </div>
                    </>
                  );
                })
              }
            </div>
          )}
        </div>
      </div>

      <div
        className={`w-[4rem] md:min-w-[250px] h-[4rem] absolute flex items-center gap-3 px-4 md:px-3 shadow-upShadow left-0 md:bottom-0 ${
          router === "/user-area"
            ? "dark:bg-gray-600 bg-gray-400"
            : "dark:bg-darkModeBgColor bg-secondaryBlue"
        }`}
        onClick={() => handlePageChange("/user-area")}
      >
        {user?.user?.image ? (
          <Image
            src={user.user.image}
            alt="Usuário"
            width={45}
            height={45}
            priority={true}
            className="m-auto md:mx-0 object-cover rounded-full"
          />
        ) : (
          <Image
            src={User}
            alt="Usuário"
            width={35}
            height={100}
            priority={true}
          />
        )}
        <h2 className="hidden md:block font-bold text-xl my-auto mx-auto">
          {user?.user.name}
        </h2>
      </div>
    </div>
  );
}

export default Navbar;