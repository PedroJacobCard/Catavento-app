import * as z from 'zod';

export const schema = z.object({
  content: z.string().optional(),
})

export type FiledsValuesEditRemember = z.infer<typeof schema>;