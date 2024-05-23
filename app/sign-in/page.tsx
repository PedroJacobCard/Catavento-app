'use client'
import Image from "next/image";

//import icons
import LoginPicture from '@/public/images/sign-picture.png';
import Logo from "@/public/Logo-navabar-extended.svg";
import GoogleLogo from '@/public/Google.svg';

//import signIn functions
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

//import session functions

function SignIn() {
  //session
  const { data: session } = useSession();

  if (session) {
    redirect("/")
  }

  
  return (
    <div className="w-full h-[100vh] flex flex-col lg:flex-row justify-center items-center">
      <div className="w-full lg:w-[50vw] h-full flex justify-center items-center">
        <Image
          src={LoginPicture}
          alt="Login Picture"
          height={100}
          width={334}
          className="mx-auto"
        />
      </div>
      <div className="dark:bg-darkModeGlass bg-primaryBlueGlass w-[95vw] md:w-[65vw] lg:w-[50vw] lg:h-[100vh] p-[2rem] flex flex-col justify-center items-center fixed lg:relative rounded-md lg:rounded-none">
        <Image src={Logo} alt="logo" width={200} />
        <button
          onClick={() => signIn("google")}
          type="button"
          className="border dark:border-slate-700 border-black rounded-full w-[80%] md:w-[60%] flex py-2 px-2 mt-5 hover:dark:bg-slate-600 hover:bg-slate-400 duration-300"
        >
          <Image src={GoogleLogo} alt="google Logo" width={30} />
          <span className="mx-auto my-auto">Faça login com o Google</span>
        </button>
      </div>
    </div>
  );
}

export default SignIn;