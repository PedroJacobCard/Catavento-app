'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";

//import icons
import Plane from '@/public/Plane.svg';
import Popup from '@/public/Popup.svg';
import Close from '@/public/Cancel.svg';

type RememberFieldPropsType = {
  isRememberOpen: boolean;
  setIsRememberOpen: Dispatch<SetStateAction<boolean>>;
};

function RememberField({ isRememberOpen, setIsRememberOpen }: RememberFieldPropsType) {
  //funcionalidades para o popup que mudará os lembretes entre as diversas escolas e turnos
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);

    if (!isPopupVisible) {
      document.removeEventListener("click", handleClickOutSide);
    }

    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, [isPopupVisible]);

  return (
    <div
      className={`${
        isRememberOpen ? "w-[100vw] flex" : "lg:w-[250px] md:w-[200px] hidden"
      } h-[100vh] lg:left-[80.4vw] md:left-[74vw] md:flex flex-col overflow-hidden dark:bg-darkMode shadow-md hover:shadow-blueShadow dark:hover:shadow-xl bg-primaryBlue fixed top-0 duration-300 z-[999]`}
    >
      <div className="w-full flex justify-center items-center gap-2 py-4 shadow-md">
        <Image
          src={Close}
          alt="Fechar lembretes"
          width={15}
          priority={true}
          className="absolute left-5 md:hidden cursor-pointer"
          onClick={() => setIsRememberOpen((prev) => !prev)}
        />

        <h1 className="title">Lembretes</h1>
        <Image
          src={Popup}
          alt="Arrow"
          width={20}
          priority={true}
          onClick={() => setIsPopupVisible((prev) => !prev)}
          className="cursor-pointer"
        />

        <div
          ref={popupRef}
          className={`absolute w-[13rem] px-2 py-1 mt-[5rem] z-30 rounded-md bg-secondaryBlue dark:bg-darkModeBgColor shadow-md ${
            isPopupVisible ? "flex" : "hidden"
          }`}
        >
          {/* Escolas e turnos */}
          <p className="hover:text-white dark:text-slate-400 duration-300">
            Hi
          </p>
        </div>
      </div>

      {/* Lembretes */}

      <div className="w-full flex justify-center items-center px-4 py-4 dark:bg-darkModeBgColor bg-secondaryBlue shadow-upShadow absolute top-[90vh]">
        <input
          type="text"
          name="remember"
          placeholder="escrever lembrete..."
          className="lg:w-[11rem] md:w-[8rem] h-9 pl-4 dark:bg-darkMode rounded-l-full outline-none md:text-sm text-base"
        />
        <button
          type="button"
          className="dark:bg-darkMode bg-white w-10 py-[.5rem] px-2 rounded-r-full hover:shadow-md dark:hover:shadow-black duration-300"
        >
          <Image src={Plane} alt="Enviar" width={20} priority={true} />
        </button>
      </div>
    </div>
  );
}

export default RememberField;