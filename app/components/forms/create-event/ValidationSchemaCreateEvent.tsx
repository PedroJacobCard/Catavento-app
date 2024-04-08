import * as z from 'zod';

export const schema = z.object({
  organizerSchool: z.string().min(1, 'Por favor, selecione uma escola'), //organizador escola será passado com função customizada. Opcional serve apenas para não dar erro
  organizerId: z.string().optional(), //organizador id será passado como default. Opcional serve apenas para não dar erro
  title: z.string().min(1, "Insira um título para o evento"),
  subject: z.string().min(4, "Insira um assunto para o evento"),
  location: z.string().min(4, "Insira um local para o evento"),
  startTime: z.string().min(5, "Insira o horário inicial do evento"),
  endTime: z.string().min(5, "Insira o horário de término do evento"),
  timeZone: z.string().default("America/Sao_Paulo").optional(), //timeZone será passado como default. Opcional serve apenas para não dar erro
  date: z.string().min(10, "Insira uma data para o evento"),
});

export type FieldValidationCreateEvent = z.infer<typeof schema>;