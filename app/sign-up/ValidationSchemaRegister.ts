import * as z from 'zod';

export const schema = z.object({
  connectedToCalender: z.boolean().default(false),
  role: z.string().min(1, 'Selecionne um papel.'),
  schoolCreated: z.object({
    name: z.string().min(1, 'Escreva o nome da escola'),
    shift: z.array(z.string()).nonempty(),
  }).optional(),
  school: z.object({
    name: z.string().min(1, 'Selecione o nome da escola'),
    shift: z.array(z.string()).nonempty(),
  })
});

export type FieldValuesRegister = z.infer<typeof schema>;