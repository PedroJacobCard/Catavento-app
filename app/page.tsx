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
import CreateSchool from "./components/forms/create-school/CreateSchool";

//import session
import { useSession, signOut, getSession } from "next-auth/react";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default function Home() {
  //session
  const { status } = useSession();

  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await getServerSession(authOptions);
        console.log(session)
        if (!session) {
          return redirect("/sign-in")
        }
      } catch (error) {
        console.error("Error", error);
      }
    }
    getSession();
  }, []);
  

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
  const [editSchoolIndex, setEditSchoolIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [showCreateSchoolForm, setShowCreateSchoolForm] = useState<boolean>(false);

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
          {status === "authenticated" && (
            <button onClick={() => signOut()} className="flex gap-3 absolute left-[77vw] md:left-[50vw] lg:left-[66vw] py-1 px-2 shadow-md dark:bg-darkMode bg-primaryBlue rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300">
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

        {filteredSchools &&
          filteredSchools.map((school, index) => (
            <section
              key={index}
              className={`dark:bg-darkMode bg-primaryBlue ${
                index === 0 ? "mt-[9rem] md:mt-[5rem]" : "mt-5"
              } mx-2 md:mx-[2rem] rounded-md overflow-hidden pb-5 shadow-md`}
            >
              <div className="flex justify-center items-center gap-3 mx-5 py-5 relative">
                <h1 className="max-w-[300px] md:max-w-[310px] lg:max-w-full font-bold">
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

              <div className="mx-5">
                <GoogleMaps address={school.address} />
              </div>
              <EditSchool
                showForm={editSchoolIndex === index && showForm}
                setShowForm={setShowForm}
                schoolName={school.name}
              />
            </section>
          ))}

        {user?.role === "COORDENADOR(A)" || user?.role === "SECRETARIO(A)" ? (
          <button
            type="button"
            className="flex items-center w-[8rem] gap-3 m-auto py-1 px-2 mt-5 shadow-md dark:bg-darkMode bg-primaryBlue     rounded-md dark:hover:bg-darkModeBgColor hover:bg-secondaryBlue duration-300"
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

        {user?.role === "COORDENADOR(A)" ||
        (user?.role === "SECRETARIO(A)" && showCreateSchoolForm) ? (
          <CreateSchool
            showCreateSchoolForm={showCreateSchoolForm}
            setShowCreateSchoolForm={setShowCreateSchoolForm}
          />
        ) : (
          ""
        )}

        <Footer />
      </div>
    </>
  );
}
