import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import {
  db,
  orgMembersTable,
  type User,
  type Organization,
  type OrgMember,
  type DbSchema,
  type DbTablesWithRelations,
} from "@repo/db";
import { ApiError } from "../../utils/api-error.js";

/**
 * Create an OrgMember record
 */
export async function createOrgMember(params: {
  user: Pick<User, "id">;
  organization: Pick<Organization, "id">;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<OrgMember> {
  const { user, organization, tx } = params;

  // Insert OrgMember record into database
  const [orgMember] = await (tx ?? db)
    .insert(orgMembersTable)
    .values({
      userId: user.id,
      orgId: organization.id,
    })
    .returning()
    .execute();

  if (!orgMember) {
    throw new ApiError(ApiResponseCode.internal_server_error, "Failed to create org member", 500);
  }

  return orgMember;
}

/**
 * Find an OrgMember
 */
export async function findOrgMember(params: {
  userId: number;
  orgId: number;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<OrgMember | undefined> {
  const { userId, orgId, tx } = params;

  // Find OrgMember record from database
  const orgMember = await (tx ?? db).query.orgMembersTable
    .findFirst({
      where: (table, { and, eq }) => and(eq(table.userId, userId), eq(table.orgId, orgId)),
    })
    .execute();

  return orgMember;
}

/**
 * Ensure that the user is a member of the organization
 * @returns The OrgMember record
 * @throws If the user is not a member of the organization
 */
export async function mustBeOrgMember(params: {
  userId: number;
  orgId: number;
  tx?: PgTransaction<NodePgQueryResultHKT, DbSchema, DbTablesWithRelations>;
}): Promise<OrgMember> {
  const { userId, orgId, tx } = params;

  const orgMember = await findOrgMember({ userId, orgId, tx });

  if (!orgMember) {
    throw new ApiError(ApiResponseCode.forbidden, "User is not a member of the organization", 403);
  }

  return orgMember;
}
