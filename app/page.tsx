'use client'
import { useEffect, useState } from "react";
import Image from "next/image";

//import icons
import Logo from "@/public/Logo-principal.svg";
import Plane from "@/public/Plane.svg";
import Link from "next/link";
import Marker from "@/public/Marker.svg";
import Plus from "@/public/Plus.svg";
import Logout from "@/public/Logout.svg";
import NoLocation from "@/public/No-location.svg";

//import components
import Navbar from "./components/Navbar";
import RememberField from "./components/RememberField";
import Footer from "./components/Footer";
import ShowShadow from "@/app/components/ShowShadow";
import EditSchool from "./components/forms/edit-school/EditSchool";
import CreateSchool from "./components/forms/create-school/CreateSchool";
import Loading from "./components/Loading";

//import lib functions
import GoogleMaps from "@/lib/GoogleMaps";

//import hooks
import useSchool from "./hooks/useSchool";
import useUser from "./hooks/useUser";

//import session
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ShowEditSchoolRemember from "./components/ShowEditSchoolRemember";

export default function Home() {
  //session
  const { status, data: session } = useSession();

  //import school data
  const { userSchools } = useSchool();
  
  //import user data
  const { user } = useUser();
  
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);
  
  //funcionalidade para aparecer o formulário de edição da escola
  const [editSchoolIndex, setEditSchoolIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const [showCreateSchoolForm, setShowCreateSchoolForm] =
  useState<boolean>(false);

  const router = useRouter();
  
  //verifica o status da seção
  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    router.replace('/sign-in');
    return null;
  }
  
  if (session && !user) {
    router.replace("/profile");
    return null;
  }

  return (
    <>
      <ShowEditSchoolRemember />
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
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Escola</h1>
          {status === "authenticated" && (
            <button
              onClick={() => signOut()}
              className="flex gap-3 absolute top-3 right-2 md:right-[19rem] lg:right-[22rem] py-2 px-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
            >
              <Image
                src={Logout}
                alt="Sair"
                width={25}
                height={25}
                priority={true}
              />
              Sair
            </button>
          )}
        </ShowShadow>

        {userSchools &&
          userSchools.map((school, index) => (
            <section
              key={index}
              className={`dark:bg-darkMode bg-primaryBlue ${
                index === 0 ? "mt-[9rem] md:mt-[5rem]" : "mt-5"
              } mx-2 md:mx-[2rem] rounded-md overflow-hidden pb-5 shadow-md`}
            >
              <div className="flex justify-center items-center gap-3 mx-5 py-5 relative">
                <h1 className="max-w-[230px] md:max-w-[310px] lg:max-w-full font-bold">
                  {school.name}
                </h1>
                {user?.role?.toString() === "COORDENADOR_A" ||
                user?.role?.toString() === "SECRETARIO_A" ? (
                  <Image
                    src={Marker}
                    alt="Icon para editar"
                    width={25}
                    height={25}
                    priority={true}
                    className="absolute left-[90%] lg:left-[95%] cursor-pointer"
                    onClick={() => {
                      setEditSchoolIndex(index);
                      setShowForm((prev) => !prev);
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-col justify-start mx-5 mb-5">
                <p className="mb-1">
                  <span className="font-bold mr-3">Turnos de atuação:</span>
                  {school.shift.join("; ")}
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
              {school.address ? (
              <div className="mx-5">
                <GoogleMaps address={school.address} />
              </div>
              ) : (
              <Image
                src={NoLocation}
                alt="Endereço não encontrado."
                height={100}
                width={100}
                className="m-auto"
              />
              )}
              <EditSchool
                showForm={editSchoolIndex === index && showForm}
                setShowForm={setShowForm}
                schoolName={school.name}
              />
            </section>
          ))}

        {user?.role?.toString() === "COORDENADOR_A" ? (
          <button
            type="button"
            className={`flex items-center w-[8rem] gap-3 m-auto py-1 px-2 mt-5 shadow-md dark:bg-darkMode bg-primaryBlue  rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300`}
            onClick={() => setShowCreateSchoolForm(!showCreateSchoolForm)}
          >
            <Image
              src={Plus}
              width={15}
              height={15}
              alt=""
              onClick={() => setShowCreateSchoolForm(!showCreateSchoolForm)}
            />
            Criar Escola
          </button>
        ) : (
          ""
        )}

        {user?.role?.toString() === "COORDENADOR_A" && showCreateSchoolForm ? (
          <CreateSchool
            showCreateSchoolForm={showCreateSchoolForm}
            setShowCreateSchoolForm={setShowCreateSchoolForm}
            creatorId={user.id}
          />
        ) : (
          ""
        )}

        <Footer />
      </div>
    </>
  );
}
