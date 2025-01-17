import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import {
  db,
  type DbSchema,
  type DbTablesWithRelations,
} from "../../db/index.js";
import type { User } from "../../db/tables/users.table.js";
import type { Organization } from "../../db/tables/organizations.table.js";
import {
  orgUsersTable,
  type OrgUser,
} from "../../db/tables/org-users.table.js";

/**
 * Create an OrgUser record
 */
export async function createOrgUser(params: {
  user: Pick<User, "id">;
  organization: Pick<Organization, "id">;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<OrgUser> {
  const { user, organization, tx } = params;

  // Insert OrgUser record into database
  const [orgUser] = await (tx ?? db)
    .insert(orgUsersTable)
    .values({
      userId: user.id,
      orgId: organization.id,
    })
    .returning()
    .execute();

  return orgUser;
}
