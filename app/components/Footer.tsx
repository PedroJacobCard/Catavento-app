import Image from "next/image";

//import logos
import CataventoLogo from '@/public/images/Catavento-logo-footer.png';
import MpcLogo from "@/public/images/logo-mpc.png";

function Footer() {
  //Obter ano atual
  const year = new Date(Date.now()).getFullYear();

  return (
    <div className="w-full dark:bg-darkMode bg-secondaryBlue py-5 bottom-[4rem] md:bottom-0 absolute">
      <div className="flex justify-center items-center">
        <Image
          src={CataventoLogo}
          alt="Logo Catavento"
          height={100}
          width={200}
        />
        <Image
          src={MpcLogo}
          alt="Logo Catavento"
          height={80}
          width={100}
        />
      </div>
      <p className="text-sm mt-4 font-light flex justify-center">
        &copy; Catavento, valores que te movem | {year}
      </p>
      <p className="text-sm font-light flex justify-center">
        Todos os direitos reservados
      </p>
    </div>
  );
}

export default Footer;