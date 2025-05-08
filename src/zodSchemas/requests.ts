import { z } from "zod";

export const RequestSchema = z.object({
  date_requested: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Ensures date format is YYYY-MM-DD
  requested_by: z.string(), // Text field for requested by
  warehouse: z.string(), // Text field for requested by
  shift: z.string(), // Text field for requested by
  items: z.array(
    z.object({
      item: z.string(), // Text field for item name
      quantity: z.number(), // Number field for quantity
    })
  ),
});
export const UpdateRequestSchema = z.object({
  id: z.string().uuid(),
  date_used: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(), // Ensures date format is YYYY-MM-DD
});

export type UpdateRequestType = z.infer<typeof UpdateRequestSchema>;
