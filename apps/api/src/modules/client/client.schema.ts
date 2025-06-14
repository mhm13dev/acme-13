import { z } from "zod";
import { idSchema } from "../../common/common.schema.ts";

export const clientsBaseParamsSchema = z.object({
  orgId: idSchema,
});

export const createClientSchema = z.object({
  name: z.string().trim().min(1),
});
