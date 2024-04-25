import * as z from 'zod';

//os campos optional seram obrigatórios mas receberão os dados por props.
//optional serve para não dar erro ao enviar os dados

export const schema = z.object({
  authorName: z.string().optional(),
  schoolName: z.string().optional(),
  classAndShift: z.string().optional(),
  theme: z.string().optional(),
  activitiesDone: z.array(z.string()).nonempty(), //pode ter pelo menos uma atividade realizada
  coworkers: z.number().int().default(0),
  resources: z.array(z.string()).nonempty(), //pode ter pelo menos um recurso utilizado
  assistedInChaplaincy: z.number().int().default(0),
  chaplaincyObservation: z.string().optional() //Este campo pode ser opcional
});

export type FieldValuesCreateReport = z.infer<typeof schema>;