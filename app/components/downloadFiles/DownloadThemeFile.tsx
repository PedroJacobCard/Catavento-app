import Image from "next/image";

//import icons
import Download from "@/public/Download.svg";

//props type
type DownloadThemeFilePropsType = {
  theme: string;
};

function DownloadThemeFile({ theme }: DownloadThemeFilePropsType) {
  
  const handleGeneratePDF = () => {
    const filePath = `/theme_files/Roda_de_${theme}.pdf`;
    var link = document.createElement("a") as HTMLAnchorElement;
    link.href = filePath;
    link.download = `Roda de ${theme}.pdf`;
    link.textContent = `Baixar roda de ${theme} PDF`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Image
      src={Download}
      alt="Baixar relatório"
      width={25}
      height={25}
      priority={true}
      className="cursor-pointer"
      onClick={handleGeneratePDF}
      title={`Baixar o documento ${theme}`}
    />
  );
}

export default DownloadThemeFile;
