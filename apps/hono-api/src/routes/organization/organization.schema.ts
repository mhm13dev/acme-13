import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
});

export const getOrganizationClientsParamsSchema = z.object({
  orgId: z.coerce.number().int().positive(),
});

export const getOrganizationClientsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});
