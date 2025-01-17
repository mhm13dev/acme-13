import { db } from "../../db/index.js";
import { shouldBeOrgMember } from "../org-user/org-user.service.js";
import { clientsTable, type Client } from "../../db/tables/clients.table.js";

/**
 * Create a new Client
 */
export async function createClient(params: {
  name: string;
  orgId: number;
  userId: number;
}): Promise<Client> {
  const { name, orgId, userId } = params;

  // Start a transaction
  const client = await db.transaction(async (tx) => {
    // User must be a member of the organization
    await shouldBeOrgMember({
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

  return client;
}
