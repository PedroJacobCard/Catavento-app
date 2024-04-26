import * as z from 'zod';

//os campos optional seram obrigatórios mas receberão os dados por props.
//optional serve para não dar erro ao enviar os dados

export const schema = z.object({
  authorName: z.string().optional(),
  schoolName: z.string().optional(),
  classAndShift: z.string({
    required_error: 'Escreva o nome das classes nas quais foram realizadas a temática.'
  }).min(3, 'Escreva o nome das classes nas quais foram realizadas a temática.'),
  theme: z.string().optional(),
  activitiesDone: z.array(z.string({
    required_error: "Selecione as atividades realizadas"
  })),
  resources: z.array(z.string()).optional(),
  coworkers: z.number({
    required_error: 'Insira a quantidade de voluntários que coparticiparam.'
  }).int().default(0).refine(c => c > 0, 'Insira a quantidade de voluntários que coparticiparam.'),
  assistedInChaplaincy: z.number().int().default(0).optional(),
  chaplaincyObservation: z.string().optional() //Este campo pode ser opcional
});

export type FieldValuesCreateReport = z.infer<typeof schema>;