
//import icons
import Close from '@/public/Cancel.svg';

//import props types
import { EditPropType } from "@/utils/Types";
import Image from 'next/image';

//import enums
import { Shift } from '@/utils/Enums';

//import schema validação e react-hook-form
import { schema, FieldValuesEditSchool } from "./ValidationSchemaEditSchool";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//funcionalidade para transformar Shift em array
let shiftArray: string[] = [];
for (const key in Shift) {
  if (isNaN(Number(Shift[key]))) {
    shiftArray.push(Shift[key]);
  }
}

function EditSchool({ showForm, setShowForm }: EditPropType) {
  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValuesEditSchool>({
    resolver: zodResolver(schema),
    defaultValues: {

    }
  })

  const onSubmit: SubmitHandler<FieldValuesEditSchool> = (data) => {
    console.log(data);
  }

  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-50 ${
        showForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue h-[50vh] mx-2 lg:mx-[20rem] rounded-md pt-5 pb-5 overflow-y-scroll fixed top-[20vh] left-[0vw] md:left-[13vw] lg:left-[0vw]">
        <div className="flex justify-between items-center px-5">
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9"
        >
          
          
          <button
            type="submit"
            className="w-[50%] mx-auto rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditSchool;