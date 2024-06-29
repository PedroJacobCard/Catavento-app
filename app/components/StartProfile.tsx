"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function StartProfile() {
  const [showPopup, setShowPopup] = useState<boolean>(true);

  const router = useRouter();

  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] flex justify-center items-top ${
        showPopup ? "block" : "hidden"
      }`}
    >
      <div className="flex-col justify-center items-center dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[75vw] lg:w-[55vw] h-[20vh] md:h-[27vh] mx-2 lg:mx-[20rem] rounded-md mt-5 p-5 relative">
        <p className="text-lg">
          Oi voluntário! Você já concluiu o cadastro de perfil?
        </p>

<div className="absolute bottom-5 w-full p-2 flex justify-between items-center">

</div>
        <button
          type="button"
          className="flex justify-between items-center px-5 py-2 gap-3 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          onClick={() => setShowPopup(!showPopup)}
        >
          <span>Não, sou novo por aqui.</span>
        </button>
        <button
          type="button"
          className="flex justify-between items-center px-5 py-2 gap-3 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          onClick={() => router.replace('/')}
        >
          <span>sim, já concluí.</span>
        </button>
      </div>
    </div>
  );
}

export default StartProfile;
