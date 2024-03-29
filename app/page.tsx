'use client'
import { useState } from "react";
import Image from "next/image";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Link from "next/link";
import Marker from "@/public/Marker.svg";

//import components
import Navbar from "./components/Navbar";
import RememberField from "./components/RememberField";
import Footer from "./components/Footer";

//import lib functions
import ShowShadow from "@/lib/ShowShadow";

//import hooks
import useSchool from "./hooks/useSchool";
import useUser from "./hooks/useUser";
import GoogleMaps from "@/lib/GoogleMaps";
import EditSchool from "./components/forms/edit-school/EditSchool";

export default function Home() {
  //import school data
  const { schools } = useSchool();

  //import user data
  const { user } = useUser();

  //funcionalidades para adiquirir apenas as escolas das quais o usuário trabalha
  const userSchools = user?.school.map((s) => s.schoolName);
  const filteredSchools = schools?.filter((s) => userSchools?.includes(s.name));

  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

  //funcionalidade para aparecer o formulário de edição da escola
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
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Escola</h1>
        </ShowShadow>

        {filteredSchools &&
          filteredSchools.map((school, index) => (
            <section
              key={index}
              className={`dark:bg-darkMode bg-primaryBlue ${
                index === 0 ? "mt-[9rem] md:mt-[5rem]" : "mt-5"
              } mx-2 md:mx-[2rem] rounded-md overflow-hidden pb-5 shadow-md`}
            >
              <div className="flex justify-center items-center gap-3 mx-5 py-5 relative">
                <h1 className="max-w-[300px] md:max-w-[350px]">
                  {school.name}
                </h1>
                {user?.role === "COORDENADOR(A)" ||
                user?.role === "SECRETARIO(A)" ? (
                  <Image
                    src={Marker}
                    alt="Icon para editar"
                    width={25}
                    height={25}
                    priority={true}
                    className="absolute left-[90%] lg:left-[95%] cursor-pointer"
                    onClick={() => setShowForm(prev => !prev)}
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="flex flex-col justify-start mx-5 mb-5">
                <p className="mb-1">
                  <span className="font-bold mr-3">Turnos de atuação:</span>
                  {school.shift.join('; ')}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Diretor(a):</span>
                  {school.principal}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Coordenador(a) dia:</span>
                  {school.coordinator_morning}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Coordenador(a) tarde:</span>
                  {school.coordinator_evening}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Coordenador(a) noite:</span>
                  {school.coordinator_night}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Telefone:</span>
                  {school.telephone}
                </p>
                <p className="mb-1 flex flex-wrap">
                  <span className="font-bold mr-3">Email:</span>
                  {school.email}
                </p>
                <p className="mb-1">
                  <span className="font-bold mr-3">Endereço:</span>
                  {school.address}
                </p>
              </div>

              <div className="mx-5">
                <GoogleMaps address={school.address} />
              </div>
            </section>
          ))}

        <EditSchool showForm={showForm} setShowForm={setShowForm} />

        <Footer />
      </div>
    </>
  );
}
