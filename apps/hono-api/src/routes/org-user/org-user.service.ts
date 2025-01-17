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
import { ApiError } from "../../utils/api-error.js";
import { ApiResponseCode } from "../../utils/api-response.js";

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

/**
 * Get an OrgMember
 */
export async function getOrgMember(params: {
  userId: number;
  orgId: number;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<OrgUser | undefined> {
  const { userId, orgId, tx } = params;

  // Get OrgMember record from database
  const orgMember = await (tx ?? db).query.orgUsersTable
    .findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.userId, userId), eq(table.orgId, orgId)),
    })
    .execute();

  return orgMember;
}

/**
 * Ensure that the user is a member of the organization
 * @returns The OrgUser record
 * @throws If the user is not a member of the organization
 */
export async function shouldBeOrgMember(params: {
  userId: number;
  orgId: number;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<OrgUser> {
  const { userId, orgId, tx } = params;

  const orgMember = await getOrgMember({ userId, orgId, tx });

  if (!orgMember) {
    throw new ApiError(
      ApiResponseCode.forbidden,
      "User is not a member of the organization",
      403
    );
  }

  return orgMember;
}
