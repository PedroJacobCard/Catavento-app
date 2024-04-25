import * as z from 'zod';

export const schema = z.object({
  organizerSchool: z
    .string()
    .min(1, "Por favor, selecione uma escola")
    .optional(),
  organizerId: z.string().optional(),
  title: z.string().min(1, "Insira um título para o evento").optional(),
  subject: z.string().min(4, "Insira um assunto para o evento").optional(),
  location: z.string().min(4, "Insira um local para o evento").optional(),
  startTime: z.string().min(5, "Insira o horário inicial do evento").optional(),
  endTime: z
    .string()
    .min(5, "Insira o horário de término do evento")
    .optional(),
  timeZone: z.string().default("America/Sao_Paulo").optional(),
  date: z.string().min(10, "Insira uma data para o evento").optional(),
});

export type FieldValuesEditEvent = z.infer<typeof schema>;