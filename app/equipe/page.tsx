"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import User from "@/public/User.svg";

//import components
import Navbar from "@/app/components/Navbar";
import RememberField from "@/app/components/RememberField";
import Footer from "../components/Footer";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";

//import hooks
import useUsers from "../hooks/useUsers";
import useUser from "../hooks/useUser";
import DownloadUsersTable from "../components/downloadFiles/DownloadUsersTable";

function Equipe() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //importar dados dos usuários de equipe
  const { users } = useUsers();

  //importar dados do usuário logado
  const { user } = useUser();

  //funcionalidades para estrair apenas escolas e seus turnos do objeto usuário
  const schoolsAndShifts = user?.school.map(({ schoolName, shifts }) => ({ schoolName, shifts }));

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
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Equipe</h1>
        </ShowShadow>

        {user &&
          user.school.map((school, index) => (
            <div key={index}>
              <section
                key={index}
                className={`dark:bg-darkMode bg-primaryBlue ${
                  index === 0 ? "mt-[9rem] md:mt-[5rem]" : "mt-5"
                } mx-2 md:mx-[2rem] rounded-md overflow-hidden py-5 shadow-md`}
              >
                <div className="flex flex-col items-center justify-center">
                  <h1 className="max-w-[300px] md:max-w-[350px] font-bold">
                    {school.schoolName}
                  </h1>
                </div>
                {users &&
                  users
                    .filter((u) =>
                      u.school.some((s) => s.schoolName === school.schoolName)
                    )
                    .map((user, i) => (
                      <div key={i} className="flex flex-col lg:flex-row items-center mx-2 mt-5 gap-3 border lg:border-none   border-slate-300 dark:border-gray-600 rounded-md p-3 lg:py-0">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt="User foto"
                            width={100}
                            height={100}
                            className="h-[10vw] w-[7.2vh] md:h-[7vh] object-cover rounded-full"
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
                        <p>{user.name}</p>
                        <p className="font-bold">{user.role}</p>
                      {user.school
                        .filter((sch) => sch.schoolName === school.schoolName)
                        .map((school, schooIndex) => (
                          <p key={schooIndex} className="font-bold">
                              Turnos:
                              {school.shifts.map((sh, ind) => (
                              <span key={ind} className="ml-2 font-normal">{sh}</span>
                            ))}
                          </p>
                      ))}
                  </div>
                ))}
              </section>
              <DownloadUsersTable school={school} />
            </div>
          ))}

        <Footer />
      </div>
    </>
  );
}

export default Equipe;
