import * as z from 'zod';

export const schema = z.object({
  connectedToCalender: z.boolean().optional(),
  role: z.string().optional(),
  school: z.array(
    z.object({
      schoolName: z.string(),
      shifts: z.array(z.string()),
    })
  )
  .optional(),
});

export type FieldValuesEditUser = z.infer<typeof schema>;