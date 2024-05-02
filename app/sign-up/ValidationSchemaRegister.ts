import * as z from 'zod';

export const schema = z.object({
  connectedToCalender: z.boolean().default(false),
  role: z.string().min(1, 'Selecionne um papel.'),
  schoolCreated: z.object({
    schoolName: z.string(),
    shifts: z.array(z.string()),
  }).optional(),
  school: z.object({
    schoolName: z.string(),
    shifts: z.array(z.string()),
  }).optional()
});

export type FieldValuesRegister = z.infer<typeof schema>;