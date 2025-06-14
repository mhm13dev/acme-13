import { z } from "zod";
import { idSchema } from "../../common/common.schema.ts";

export const locationsBaseParamsSchema = z.object({
  orgId: idSchema,
  clientId: idSchema,
});

export const createLocationSchema = z.object({
  name: z.string().trim().min(1),
});
