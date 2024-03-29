import Image from "next/image";

//import logos
import CataventoLogo from '@/public/images/Catavento-logo-footer.png';

function Footer() {
  //Obter ano atual
  const year = new Date(Date.now()).getFullYear();

  return (
    <div className="dark:bg-darkMode bg-secondaryBlue py-5 mt-[62vh] md:mt-[71.5vh] mb-[3.7rem] md:mb-0">
      <div className="flex justify-center items-center">
        <Image
          src={CataventoLogo}
          alt="Logo Catavento"
          height={100}
          width={200}
        />
        <Image
          src={CataventoLogo}
          alt="Logo Catavento"
          height={100}
          width={200}
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