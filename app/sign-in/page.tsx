'use client'
import Image from "next/image";

//import icons
import LoginPicture from '@/public/images/sign-picture.png';
import Logo from "@/public/Logo-navabar-extended.svg";
import GoogleLogo from '@/public/Google.svg';
import Link from "next/link";

//import signIn functions
import { signIn } from "next-auth/react";

//import session functions
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

function SignIn() {
  //session
    useEffect(() => {
      const getSession = async () => {
        try {
          const session = await getServerSession(authOptions);
          console.log(session);
          if (session) {
            return redirect("/");
          }
        } catch (error) {
          console.error("Error", error);
        }
      };
      getSession();
    }, []);
  
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
        <p className="mt-5">
          Ainda não tem conta? É so{" "}
          <Link href={"/sign-up"} className="dark:text-slate-500 text-cyan-600">
            registrar-se!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;