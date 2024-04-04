'use client'
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

//import icons
import Close from "@/public/Cancel.svg";
import Info from "@/public/Info.svg";
import Alert from  "@/public/Alert.svg";

//import react-form-hooks e schema para validação 
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FieldValuesCreateSchool, schema } from "./ValidationSchemaCreateSchool";
import { zodResolver } from "@hookform/resolvers/zod";

//import masks
import { IMaskInput } from "react-imask";

//import enums
import { Shift } from "@/utils/Enums";

//funcionalidade para transformar Shift em array
let shiftArray: string[] = [];
for (const key in Shift) {
  if (isNaN(Number(Shift[key]))) {
    shiftArray.push(Shift[key]);
  }
}

type CreateSchoolPropsType = {
  showCreateSchoolForm: boolean,
  setShowCreateSchoolForm: Dispatch<SetStateAction<boolean>>
}

function CreateSchool({ showCreateSchoolForm, setShowCreateSchoolForm }: CreateSchoolPropsType) {

  const [selectedShifts, setSelectedShifts] =
    useState<string[]>([]);

  const handleCheckShiftChange = (checked: boolean, shift: string) => {
    setSelectedShifts((prev) => {
      if (checked) {
        if (prev.includes(shift)) {
          return [...prev];
        } else {
          return [...prev, shift];
        }
      } else {
        return prev.filter((sh) => sh !== shift);
      }
    });
  };

  //funcionalidades para obter os valores do endereço e concatená-los
  const [streetValue, setStreetValue] = useState<string>("");
  const [numberValue, setNumberValue] = useState<number>(0);
  const [districtValue, setDistrictValue] = useState<string>("");
  const [cityValue, setCityValue] = useState<string>("");
  const [countryValue, setCountryValue] = useState<string>("");

  const addressToSimpleString = streetValue
    .concat(
      ", ",
      numberValue <= 0 ? "" : numberValue.toString(),
      ", ",
      districtValue,
      ", ",
      cityValue,
      ", ",
      countryValue
    )
    .trim();

  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FieldValuesCreateSchool>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      shift: [],
    },
  });

  const onSubmit: SubmitHandler<FieldValuesCreateSchool> = (data) => {
    const form = {
      ...data,
      shift: selectedShifts,
      address: addressToSimpleString,
    };
    console.log(form);
    reset();
  };

  return (
    <div
      className={`w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-50`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[55vw] lg:w-[35vw] h-[50vh] mx-2 lg:mx-[20rem] rounded-md pt-5 pb-5 overflow-y-scroll fixed top-[20vh] left-[0vw] md:left-[13vw] lg:left-[0vw]">
        <div className="flex justify-between items-center px-5">
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
            onClick={() => setShowCreateSchoolForm(!showCreateSchoolForm)}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9 overflow-y-scroll"
        >
          <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-infoBlue rounded-md shadow-md mb-3 relative">
            <div className="h-[100%] w-[10px] bg-infoTrackBlue absolute rounded-l-md" />
            <Image
              src={Info}
              alt="informativo"
              width={24}
              height={24}
              className="ml-4"
            />
            <p className="text-sm flex flex-col">
              Escreva abaixo o nome da escola de atuação e a frente, o nome da
              cidade em que ela se localiza.
              <span className="text-infoTrackBlue">
                Ex.: Escola Municipal Alpes, Goiânia - GO.
              </span>
            </p>
          </div>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="escola" className="font-bold mx-auto">
                  Nome da Escola:
                </label>
                <input
                  type="text"
                  placeholder="Ex. Escola Municipal Alpes, Goiânia - GO"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
                {errors?.name && (
                  <p className="text-red-600 text-sm font-medium mt-[-1rem] mb-5">
                    {errors.name.message}
                  </p>
                )}
              </>
            )}
          />

          <div className="flex items-center gap-3 py-1 pr-2 dark:bg-darkModeBgColor bg-cautionYellow rounded-md shadow-md mb-3 relative">
            <div className="h-[100%] w-[10px] bg-cautionTrackYellow absolute rounded-l-md" />
            <Image
              src={Alert}
              alt="atenção"
              width={24}
              height={24}
              className="ml-4"
            />
            <p className="text-sm flex flex-col">
              Por favor, selecione pelo menos um turno.
            </p>
          </div>

          <div className="flex flex-col mb-5">
            <p className="font-bold mx-auto">Quais são os turnos de atuação?</p>
            {shiftArray.map((shift, index) => (
              <div className="flex items-center gap-3" key={index}>
                <input
                  type="checkbox"
                  value={shift}
                  checked={selectedShifts.includes(shift)}
                  onChange={(e) => {
                    handleCheckShiftChange(e.target.checked, shift);
                  }}
                />
                <label htmlFor="Turno">{shift}</label>
              </div>
            ))}
          </div>

          <Controller
            name="principal"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="Diretor" className="font-bold mx-auto mb-1">
                  Nome do Diretor(a):
                </label>
                <input
                  type="text"
                  placeholder="Opcional"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
              </>
            )}
          />

          <Controller
            name="coordinator_morning"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="Coordenador(a) da Manhã"
                  className="font-bold mx-auto mb-1"
                >
                  Nome do Coordenador(a) da Manhã:
                </label>
                <input
                  type="text"
                  placeholder="Opcional"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
              </>
            )}
          />

          <Controller
            name="coordinator_evening"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="Coordenador(a) da Tarde"
                  className="font-bold mx-auto mb-1"
                >
                  Nome do Coordenador(a) da Tarde:
                </label>
                <input
                  type="text"
                  placeholder="Opcional"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
              </>
            )}
          />

          <Controller
            name="coordinator_night"
            control={control}
            render={({ field }) => (
              <>
                <label
                  htmlFor="Coordenador(a) da Noite"
                  className="font-bold mx-auto mb-1"
                >
                  Nome do Coordenador(a) da Noite:
                </label>
                <input
                  type="text"
                  placeholder="Opcional"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
              </>
            )}
          />

          <div className="w-full flex flex-col">
            <label htmlFor="telephone" className="font-bold mx-auto">
              Telefone da Escola:
            </label>
            <Controller
              name="telephone"
              control={control}
              render={({ field }) => (
                focus(),
                (
                  <IMaskInput
                    type="tel"
                    id="telephone"
                    placeholder="(99) 99999-9999"
                    {...field}
                    mask={"(00) 90000-0000"}
                    className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                  />
                )
              )}
            />
            {errors.telephone && (
              <p className="text-sm dark:text-[rgb(168,66,66)] text-red-600">
                {errors.telephone.message}
              </p>
            )}
          </div>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="Email" className="font-bold mx-auto mb-1">
                  Email da Escola:
                </label>
                <input
                  type="text"
                  placeholder="exemple@exmple.com"
                  {...field}
                  className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
                />
              </>
            )}
          />

          <div className="flex flex-col">
            <label htmlFor="Endereço" className="font-bold mx-auto">
              Endereço da Escola:
            </label>
            <div className="flex flex-col">
              <label htmlFor="Endereço">Nome da Rua:</label>
              <input
                type="text"
                placeholder="Nome da Rua"
                value={streetValue}
                onChange={(e) => setStreetValue(e.target.value)}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />

              <label htmlFor="Endereço">Número do Prédio:</label>
              <input
                type="number"
                name="número"
                value={numberValue}
                onChange={(e) => setNumberValue(Number(e.target.value))}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />

              <label htmlFor="Endereço">Nome do Setor:</label>
              <input
                type="text"
                placeholder="Nome do Setor"
                value={districtValue}
                onChange={(e) => setDistrictValue(e.target.value)}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />

              <label htmlFor="Endereço">Nome da cidade com o Estado:</label>
              <input
                type="text"
                placeholder="Ex.: Goiânia - Goiás"
                value={cityValue}
                onChange={(e) => setCityValue(e.target.value)}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />

              <label htmlFor="Endereço">Nome do País:</label>
              <input
                type="text"
                placeholder="Ex.: Brasil"
                value={countryValue}
                onChange={(e) => setCountryValue(e.target.value)}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            </div>
          </div>

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

export default CreateSchool;