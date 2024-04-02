'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";

//import icons
import Plane from '@/public/Plane.svg';
import Popup from '@/public/Popup.svg';
import Close from '@/public/Cancel.svg';
import Marker from '@/public/Marker.svg';

//import hooks
import useRemember from "../hooks/useRemember";
import useUser from "../hooks/useUser";

//import types
import { RememberType } from "@/utils/Types";

//import components
import EditRemember from "./forms/edit-remember/EditRemember";

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

  //import remembers data
  const { remembers } = useRemember();

  //importar dados do usuário logado
  const { user } = useUser();

  //funcionalidades para filtrar os remembers por escola ou turno
  const [filteredRemembers, setFilteredRemembers] = useState<RememberType[] | null>(null);

  useEffect(() => {
    if (remembers) {
      setFilteredRemembers(remembers.filter(rem => rem.shift === user?.school[0].shifts[0]));
    }
  }, [remembers, user]);

  const handleShiftClick = (schoolName: string, shift: string) => {
    setFilteredRemembers(remembers);
    setFilteredRemembers(prev => prev!.filter(item => item.shift === shift && item.schoolName === schoolName))
  }

  //funcionalidades para abrir o formulario de edição do remember
  const [editRememberIndex, setEditRememberIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <div
      className={`${
        isRememberOpen ? "w-[100vw] flex" : "lg:w-[250px] md:w-[200px] hidden"
      } h-[100vh] lg:left-[80.4vw] md:left-[74vw] md:flex flex-col overflow-hidden dark:bg-darkMode shadow-md hover:shadow-blueShadow dark:hover:shadow-xl bg-primaryBlue fixed top-0 duration-300 z-[999]`}
    >
      <div className="w-full flex justify-center items-center gap-2 py-4 shadow-md z-50 relative">
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
          className={`absolute w-[13rem] md:w-[11rem] p-2 top-[90%] z-30 rounded-md bg-secondaryBlue dark:bg-darkModeBgColor shadow-md overflow-y-scroll ${
            isPopupVisible ? "flex flex-col" : "hidden"
          }`}
        >
          {user &&
            user.school.map((school, schoolIndex) => (
              <div key={schoolIndex} className="flex flex-col mb-2">
                <p
                  className={`text-xs ${
                    filteredRemembers?.some(
                      (rem) => rem.schoolName === school.schoolName
                    )
                      ? "text-white"
                      : ""
                  }`}
                >
                  {school.schoolName}
                </p>
                {school.shifts.map((shift, shiftIndex) => (
                  <p
                    key={shiftIndex}
                    className={`hover:text-white duration-300 text-sm cursor-pointer ${
                      filteredRemembers?.some(rem => rem.shift === shift && rem.schoolName === school.schoolName)
                        ? "text-white"
                        : ""
                    }`}
                    onClick={() =>
                      handleShiftClick(school.schoolName, shift.toString())
                    }
                  >
                    {shift}
                  </p>
                ))}
              </div>
            ))}
        </div>
      </div>

      <section className="w-full overflow-y-scroll mb-[4rem]">
        {filteredRemembers &&
          filteredRemembers.map((rem, remIndex) => (
            <div
              key={remIndex}
              className="mx-2 my-2 px-3 py-2 dark:bg-darkModeBgColor bg-white rounded-md shadow-md"
            >
              <div className="flex justify-between mb-1">
                <p className="font-bold">{rem.authorName}</p>
                {user && user.name === rem.authorName ? (
                  <Image
                    src={Marker}
                    alt="Editor"
                    width={15}
                    height={15}
                    priority={true}
                    className="cursor-pointer"
                    onClick={() => {
                      setEditRememberIndex(remIndex);
                      setShowForm(prev => !prev)
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
              <p>{rem.content}</p>
              <EditRemember showForm={editRememberIndex === remIndex && showForm} setShowForm={setShowForm} rememberId={rem.id} content={rem.content} />
            </div>
          ))
        }
      </section>

      <div className="w-full flex justify-center items-center px-4 py-4 dark:bg-darkModeBgColor bg-secondaryBlue shadow-upShadow absolute top-[90vh]">
        <input
          type="text"
          name="remember"
          placeholder="escrever lembrete..."
          className="w-full md:w-[8rem] lg:w-[11rem] h-9 pl-4 dark:bg-darkMode rounded-l-full outline-none md:text-sm text-base"
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