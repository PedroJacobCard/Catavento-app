import * as z from 'zod';

export const schema = z.object({
  name: z.string().optional(),
  shift: z.array(z.string()).optional(),
  principal: z.string().optional(),
  coordinator_morning: z.string().optional(),
  coordinator_evening: z.string().optional(),
  coordinator_night: z.string().optional(),
  email: z.string({
    required_error: "Escreva um email válido"
  }).optional(),
  telephone: z.string({
    required_error: "Escreva um número de telefone válido"
  }).optional(),
  address: z.string().optional(),
});

export type FieldValuesEditSchool = z.infer<typeof schema>;