import * as z from 'zod';

//campos opcionais serviram apenas para não dar error ao criar classe. Os valores viram dos props

export const schema = z.object({
  name: z.string().min(3, 'Nome da classe deve conter no mínimo 3 caracteres.'),
  students: z.number().min(1, 'Escreva a quantidade de alunos.').default(0),
  done: z.boolean().default(false),
  shift: z.string().optional(),
  schoolName: z.string().optional(),
  theme: z.string().optional()
})

export type FieldValuesCreateClass = z.infer<typeof schema>;