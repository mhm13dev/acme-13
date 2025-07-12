import type { PgTransaction } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import { db, clientsTable, type Client, type DbSchema, type DbTablesWithRelations } from "@repo/db";
import { ApiError } from "../../utils/api-error.js";
import { mustBeOrgMember } from "../org-member/org-member.service.js";

/**
 * Create a new Client
 */
export async function createClient(params: { name: string; orgId: number; userId: number }): Promise<Client> {
  const { name, orgId, userId } = params;

  // Start a transaction
  const client = await db.transaction(async (tx) => {
    // User must be a member of the organization
    await mustBeOrgMember({
      userId,
      orgId,
      tx,
    });

    // Insert client into database
    const [client] = await tx
      .insert(clientsTable)
      .values({
        name,
        orgId,
      })
      .returning()
      .execute();

    return client;
  });

  if (!client) {
    throw new ApiError(ApiResponseCode.internal_server_error, "Failed to create client", 500);
  }

  return client;
}

/**
 * Get Clients of an Organization
 */
export async function getOrganizationClients(params: {
  orgId: number;
  userId: number;
  limit: number;
  offset: number;
}): Promise<Client[]> {
  const { orgId, userId, limit, offset } = params;

  // User must be a member of the organization
  await mustBeOrgMember({
    userId,
    orgId,
  });

  // Get clients
  const clients = await db.query.clientsTable.findMany({
    where: (table, { eq }) => eq(table.orgId, orgId),
    limit,
    offset,
  });

  return clients;
}

/**
 * Find a Client
 */
export async function findClient(params: {
  id: number;
  orgId: number;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<Client | undefined> {
  const { id, orgId, tx } = params;

  // Find Client record from database
  const client = await (tx ?? db).query.clientsTable.findFirst({
    where: (table, { and, eq }) => and(eq(table.id, id), eq(table.orgId, orgId)),
  });

  return client;
}

/**
 * Ensure that the client exists
 * @throws If the client does not exist
 */
export async function clientMustExist(params: {
  clientId: number;
  orgId: number;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<Client> {
  const { clientId, orgId, tx } = params;

  const client = await findClient({ id: clientId, orgId, tx });

  if (!client) {
    throw new ApiError(ApiResponseCode.resource_not_found, "Client not found", 404);
  }

  return client;
}
