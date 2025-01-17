import { eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import type { User } from "../../db/tables/users.table.js";
import {
  organizationsTable,
  type Organization,
} from "../../db/tables/organizations.table.js";
import { orgMembersTable } from "../../db/tables/org-members.table.js";
import { ApiResponseCode } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import { createOrgMember } from "../org-user/org-user.service.js";

/**
 * Create a new Organization
 */
export async function createOrganization(params: {
  name: string;
  slug: string;
  owner: Pick<User, "id">;
}): Promise<Organization> {
  const { name, slug, owner } = params;

  // Start a transaction
  const organization = await db.transaction(async (tx) => {
    // Check if organization with the same slug already exists
    const existingOrganization = await tx.query.organizationsTable
      .findFirst({
        where: (table) => eq(table.slug, slug),
        columns: { id: true, slug: true },
      })
      .execute();

    if (existingOrganization) {
      throw new ApiError(
        ApiResponseCode.conflict,
        "Organization with the same slug already exists",
        409
      );
    }

    // Insert organization into database
    const [organization] = await tx
      .insert(organizationsTable)
      .values({
        name,
        slug,
        ownerId: owner.id,
      })
      .returning()
      .execute();

    // Create an OrgMember record for the owner
    await createOrgMember({
      user: owner,
      organization,
      tx,
    });

    return organization;
  });

  return organization;
}

/**
 * Get Organizations in which the User is a member
 */
export async function getOrganizationsForMember(params: {
  userId: number;
}): Promise<Organization[]> {
  const { userId } = params;

  const organizations = await db
    .select(getTableColumns(organizationsTable))
    .from(organizationsTable)
    .leftJoin(orgMembersTable, eq(organizationsTable.id, orgMembersTable.orgId))
    .where(eq(orgMembersTable.userId, userId))
    .execute();

  return organizations;
}
