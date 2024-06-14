'use client'
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

//import icons
import Close from "@/public/Cancel.svg";

//import react-hook-form e schema de validação
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { schema, FieldValuesCreateReport } from './ValidationSchemaCreateReport';
import { zodResolver } from "@hookform/resolvers/zod";

//import costume hooks
import useUser from "@/app/hooks/useUser";
import useReport from "@/app/hooks/useReport";

//import toaster
import toast from "react-hot-toast";

//import lib functions
import { activitiesDoneArray, resourcesArray } from "@/lib/EnumsToArray";

//props type
type CreateReportPropsType = {
  showCreateReportForm: boolean;
  setShowCreateReportForm: Dispatch<SetStateAction<boolean>>;
  schoolName: string;
  theme: string;
  shift: string;
};

function CreateReport({ showCreateReportForm, setShowCreateReportForm, theme, schoolName, shift }: CreateReportPropsType) {
  //importar dados do usuário logado
  const { user } = useUser();

  //importar setter do array de relatórios
  const { setReports } = useReport();
  
  //funcionalidades para adquirir o valor de atividades realizadas
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [hasNoActivities, setHasNoActivities] = useState(false)

  const handleActivitiesCheck = (checked: boolean, activity: string) => {
    setSelectedActivities((prev) => {
      if (checked) {
        if (prev.includes(activity)) {
          return [
            ...prev
          ]
        } else {
          return [...prev, activity];
        }
      } else {
        return prev.filter(a => a !== activity)
      }
    })
  }

  const resetActivitieOnSubmit = () => {
    setSelectedActivities([])
  }

  //funcionalidades para adquirir o valor de recursos
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const handleResourcesCheck = (checked: boolean, resource: string) => {
    setSelectedResources((prev) => {
      if (checked) {
        if (prev.includes(resource)) {
          return [
            ...prev
          ]
        } else {
          return [...prev, resource];
        }
      } else {
        return prev.filter(r => r !== resource)
      }
    })
  }


  const resetResourcesOnSubmit = () => {
    setSelectedResources([]);
  };

  //funcionalidades para enviar os dados do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FieldValuesCreateReport>({
    resolver: zodResolver(schema),
    defaultValues: {
      authorName: user?.user.name || '',
      schoolName: schoolName || '',
      classAndShift: '',
      theme: theme || '',
      activitiesDone: [],
      resources: [],
      coworkers: 0,
      assistedInChaplaincy: 0,
      chaplaincyObservation: ''
    }
  })

  //não renderiza o componente se não for o relatório selecionado
  if(!showCreateReportForm) return null;

  const onSubmit: SubmitHandler<FieldValuesCreateReport> = async (data) => {
    if (hasNoActivities) return;
    setShowCreateReportForm(!showCreateReportForm)
    const { classAndShift } = data;
    const formData = {
      ...data,
      authorName: user?.user.name,
      schoolName: schoolName,
      theme: theme,
      activitiesDone: selectedActivities,
      resources: selectedResources,
      classAndShift: classAndShift?.concat(', ' + shift)
    }

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: "no-store",
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        toast.error("Hum... Algo deu errado...");
        return;
      }

      const data = await response.json();

      setReports(prev => {
        if (!!prev) {
          return [
            ...prev,
            data
          ];
        }
        return [];
      })

    toast.success("Relatório enviado com sucesso!");
    reset();
    resetActivitieOnSubmit();
    resetResourcesOnSubmit();
    } catch (error) {
      console.error("Erro ao criar relatório");
      toast.error("Ops! Não deu para criar o relatório...")
    }
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] fixed top-0 left-0 z-[999] ${
        showCreateReportForm ? "block" : "hidden"
      }`}
    >
      <div className="dark:bg-darkMode bg-primaryBlue w-[95vw] md:w-[50vw] h-[80vh] mx-2 rounded-md pt-5 pb-5 overflow-y-scroll">
        <div className="flex justify-between items-center px-5">
          <Image
            src={Close}
            alt="Fechar form"
            width={15}
            height={15}
            priority={true}
            className="cursor-pointer"
            onClick={() => setShowCreateReportForm(!showCreateReportForm)}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start px-5 mt-9 overflow-y-scroll"
        >
          <label htmlFor="activitiesDone" className="m-auto font-bold mb-1">
            Atividades realizadas nesta temática:
          </label>
          {activitiesDoneArray.map((activity, activityIndex) => (
            <div
              key={activityIndex}
              className={`flex items-center gap-3 ${
                activityIndex === activitiesDoneArray.length - 1 ? "mb-5" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedActivities.includes(activity)}
                onChange={(e) =>
                  handleActivitiesCheck(e.target.checked, activity)
                }
              />
              <p>{activity}</p>
            </div>
          ))}
          {selectedActivities.length === 0 && hasNoActivities && (
            <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
              Selecione as atividades realizadas
            </p>
          )}

          <label htmlFor="activitiesDone" className="m-auto font-bold mb-1">
            Materiais utilizados:
          </label>
          {resourcesArray.map((resource, resourceIndex) => (
            <div
              key={resourceIndex}
              className={`flex items-center gap-3 ${
                resourceIndex === resourcesArray.length - 1 ? "mb-5" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedResources.includes(resource)}
                onChange={(e) =>
                  handleResourcesCheck(e.target.checked, resource)
                }
              />
              <p>{resource}</p>
            </div>
          ))}

          <label htmlFor="Voluntários" className="m-auto font-bold mb-1">
            Quantidade de voluntários que participaram:
          </label>
          <Controller
            name="coworkers"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                min={0}
                value={field.value}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value);
                  field.onChange(parsedValue);
                }}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            )}
          />
          {errors.coworkers && (
            <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
              {errors.coworkers.message}
            </p>
          )}

          <label htmlFor="Classes" className="m-auto font-bold mb-1">
            Nome das classes:
          </label>
          <Controller
            name="classAndShift"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Ex.: 6° A"
                {...field}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            )}
          />
          {errors.classAndShift && (
            <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
              {errors.classAndShift.message}
            </p>
          )}

          <label
            htmlFor="Assistidos em capelania"
            className="m-auto font-bold mb-1"
          >
            Quantidade de assistidos em capelania individual:
          </label>
          <Controller
            name="assistedInChaplaincy"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                min={0}
                value={field.value}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value);
                  field.onChange(parsedValue);
                }}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            )}
          />
          {errors.assistedInChaplaincy && (
            <p className="text-red-600 text-sm font-medium mt-[-1rem] my-5">
              {errors.assistedInChaplaincy.message}
            </p>
          )}

          <label htmlFor="Observação" className="m-auto font-bold mb-1">
            Observações sobre a capelania individual:
          </label>
          <Controller
            name="chaplaincyObservation"
            control={control}
            render={({ field }) => (
              <textarea
                rows={4}
                placeholder="Opcional"
                {...field}
                className="px-2 py-1 rounded-md shadow-md outline-none focus:border focus:border-slate-400 mb-5 dark:bg-darkModeBgColor"
              />
            )}
          />

          <button
            type="submit"
            onClick={() => setHasNoActivities(selectedActivities.length === 0)}
            className="w-[50%] mx-auto mb-2 py-2 rounded-md shadow-buttonShadow dark:shadow-buttonShadowDark hover:dark:bg-[rgb(30,30,30)] hover:bg-secondaryBlue duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateReport;