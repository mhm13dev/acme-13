import { eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import {
  organizationsTable,
  orgMembersTable,
  type User,
  type Organization,
} from "@repo/shared-lib/db";
import { db } from "../../db/index.js";
import { ApiError } from "../../utils/api-error.js";
import { createOrgMember } from "../org-member/org-member.service.js";

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
