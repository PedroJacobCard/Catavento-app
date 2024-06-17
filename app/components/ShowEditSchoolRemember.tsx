'use client'
import Image from "next/image";

//import icons
import Close from '@/public/Cancel.svg';

//import costume hooks
import useSchool from "../hooks/useSchool";

function ShowEditSchoolRemember() {
  //importar variável e setter para a lógica de lembrete de edição
  const { editSchoolRemember, setEditSchoolRemember } = useSchool();

  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] flex justify-center items-top ${
        editSchoolRemember ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[55vw] lg:w-[35vw] h-[20vh] md:h-[27vh] mx-2 lg:mx-[20rem] rounded-md mt-5 p-5 relative">
        <p className="text-lg">
          Parece que alguma escola não contém alguns dados relevantes, como o
          endereço. Considere a edição desta.
        </p>

        <button
          type="button"
          className="absolute bottom-5 right-5 flex justify-between items-center px-5 py-2 gap-3 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          onClick={() => setEditSchoolRemember(!editSchoolRemember)}
        >
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
          />
          <span>Okay</span>
        </button>
      </div>
    </div>
  );
}

export default ShowEditSchoolRemember;