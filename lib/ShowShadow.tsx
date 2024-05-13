import { ChildrenPropsType } from "@/utils/Types";
import { useEffect, useState } from "react";

function ShowShadow({ children }: ChildrenPropsType) {
  //funcionalidades para aparecer box-shadow se o usuário rolar a pagina para baixo
  const [showShadow, setShowShadow] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setShowShadow(isScrolled);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll" ,handleScroll)
    };
  }, [])
  
  return (
    <div
      className={`flex bg-white dark:bg-darkModeBgColor w-full pt-5 page-title fixed top-0 z-50 ${
        showShadow ? " shadow-md dark:shadow-xl" : "shadow-none"
      } duration-300`}
    >
      {children}
    </div>
  );
}

export default ShowShadow;