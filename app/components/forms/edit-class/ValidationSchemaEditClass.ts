import * as z from 'zod';

export const schema = z.object({
  name: z.string().min(3, 'Nome da classe deve conter no mínimo 3 caracteres.').optional(),
  students: z.number().refine(s => s > 0, 'Tem que ser maior que zero').optional(),
  done: z.boolean().optional(),
  shift: z.string().optional(),
  schoolName: z.string().optional(),
  theme: z.string().optional()
})

export type FieldValuesEditClass = z.infer<typeof schema>;