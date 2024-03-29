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

function Noturno() {
  //Funcionalidades para display do campo de lembretes
  const [isRememberOpen, setIsRememberOpen] = useState<boolean>(false);

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
          <h1 className="title mx-2 md:ml-[2rem] pb-3">Temas / Noturno</h1>
        </ShowShadow>
        <Footer />
      </div>
    </>
  );
}

export default Noturno;
