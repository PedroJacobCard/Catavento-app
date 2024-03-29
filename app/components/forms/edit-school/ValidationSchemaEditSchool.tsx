import * as z from 'zod';

export const schema = z.object({
  
})

export type FieldValuesEditSchool = z.infer<typeof schema>;