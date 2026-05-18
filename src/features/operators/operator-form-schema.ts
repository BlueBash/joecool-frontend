import { z } from "zod";
import { booleanField, optionalEmail, requiredString } from "@/lib/form";

const operatorRoleSchema = z.enum(["Admin", "Manager", "Staff", "Viewer"]);

export const OperatorFormSchema = z.object({
  id: z.string(),
  code: requiredString("Code is required"),
  name: requiredString("Name is required"),
  email: optionalEmail,
  role: operatorRoleSchema,
  active: booleanField,
  lastSeen: z.string(),
  password: z.string().optional(),
  permissions: z.array(z.string()),
});

export type OperatorFormValues = z.infer<typeof OperatorFormSchema>;

export function createOperatorFormSchema(isNew: boolean) {
  return OperatorFormSchema.superRefine((data, ctx) => {
    if (isNew && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must be at least 6 characters",
        path: ["password"],
      });
    }
  });
}
