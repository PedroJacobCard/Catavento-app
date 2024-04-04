import * as z from "zod";

export const schema = z
  .object({
    name: z.string().min(4, "Escreva um nome válido" ),
    shift: z
      .array(z.string().min(1)),
    principal: z.string().optional(),
    coordinator_morning: z.string().optional(),
    coordinator_evening: z.string().optional(),
    coordinator_night: z.string().optional(),
    email: z.string().optional(),
    telephone: z.string().optional(),
    address: z.string().optional(),
  })
  .nonstrict();

export type FieldValuesCreateSchool = z.infer<typeof schema>;
