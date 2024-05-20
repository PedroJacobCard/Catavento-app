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
import EditUser from "../components/forms/edit-user/EditUser";
import Loading from "../components/Loading";

//import hooks
import useUser from "../hooks/useUser";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";

//session and redirection
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function UserArea() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //session
  const { status, data: session } = useSession();

  //obter dados do usuário
  const { user } = useUser();
  console.log(user);

  //funcionalidade para aparecer o formulário de edição do usuário
  const [showForm, setShowForm] = useState<boolean>(false);

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
      <div className="max-w-full min-h-[100vh] pb-0 md:pb-[12rem] md:mr-[12.5rem] lg:mr-[15.6rem] md:ml-[4.4rem] relative">
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
                {user.user.image ? (
                  <Image
                    src={user.user.image}
                    alt="User foto"
                    width={40}
                    height={40}
                    className="object-cover rounded-full"
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
                {user?.user.name}
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
                  {user.user.email}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">
                    Conexão com Google Agenda:
                  </span>
                  {user.connectedToCalender ? "Sim" : "Não"}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Escolas de atuação:</span>
                  {user.school.map((school, schoolIndex) =>
                    schoolIndex !== user.school.length - 1
                      ? school.schoolName + "; "
                      : school.schoolName + "."
                  )}
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