import Image from "next/image";

//import logo
import Logo from "@/public/Logo-principal.svg";

function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-[100vh] dark:bg-darkModeBgColor bg-primaryBlue">
      <Image
        src={Logo}
        alt="Catavento loading"
        width={60}
        height={60}
        priority={true}
        className="animate-spin"
      />
    </div>
  );
}

export default Loading;