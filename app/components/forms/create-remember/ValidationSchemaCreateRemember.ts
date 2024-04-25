import * as z from 'zod';

export const schema = z.object({
  authorId: z.string().min(4).optional(),
  authorName: z.string().min(4).optional(),
  content: z
    .string()
    .min(1, "Escreva no mínimo um caractere"),
});

export type FieldValuesCreateRemember = z.infer<typeof schema>;