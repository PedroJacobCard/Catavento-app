"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Marker from "@/public/Marker.svg";
import User from '@/public/User.svg';

//import components
import Navbar from "@/app/components/Navbar";
import RememberField from "@/app/components/RememberField";
import Footer from "@/app/components/Footer";

//import hooks
import useUser from "../hooks/useUser";
import EditUser from "../components/forms/edit-user/EditUser";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";

function UserArea() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //obter dados do usuário
  const { user } = useUser();

  //funcionalidade para aparecer o formulário de edição do usuário
  const [showForm, setShowForm] = useState<boolean>(false);

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
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Área do Usuário</h1>
        </ShowShadow>

        <div className="dark:bg-darkMode bg-primaryBlue mt-[9rem] md:mt-[5rem] mx-2 md:mx-[2rem] rounded-md overflow-hidden pb-5 shadow-md">
          {user && (
            <>
              <div className="flex justify-center items-center gap-3  mx-5 py-5 relative">
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

                {user?.name}
                <Image
                  src={Marker}
                  alt="Icon para editar"
                  width={25}
                  height={25}
                  priority={true}
                  className="absolute left-[90%] lg:left-[95%] cursor-pointer"
                  onClick={() => setShowForm((prev) => !prev)}
                />
              </div>

              <div className="flex flex-col justify-start mx-5">
                <p className="mb-1">
                  <span className="font-bold mr-3">Papel:</span>
                  {user.role}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Email:</span>
                  {user.email}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">
                    Conexão com Google Agenda:
                  </span>
                  {user.connectedToCalender ? "Sim" : "Não"}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Escolas de atuação:</span>
                  {user.school.map((schooll) => schooll.schoolName + "; ")}
                </p>
              </div>
            </>
          )}
        </div>

        <EditUser showForm={showForm} setShowForm={setShowForm} />
        <Footer />
      </div>
    </>
  );
}

export default UserArea;