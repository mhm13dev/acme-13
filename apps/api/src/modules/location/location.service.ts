import { db, locationsTable, type Location } from "@repo/db";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import { mustBeOrgMember } from "../org-member/org-member.service.js";
import { clientMustExist } from "../client/client.service.js";
import { ApiError } from "../../utils/api-error.js";

/**
 * Create a new Location
 */
export async function createLocation(params: {
  name: string;
  clientId: number;
  orgId: number;
  userId: number;
}): Promise<Location> {
  const { name, clientId, orgId, userId } = params;

  // Start a transaction
  const location = await db.transaction(async (tx) => {
    // User must be a member of the organization
    await mustBeOrgMember({
      userId,
      orgId,
      tx,
    });

    // Client must exist in Organization
    await clientMustExist({
      clientId,
      orgId,
      tx,
    });

    // Insert location into database
    const [location] = await tx
      .insert(locationsTable)
      .values({
        name,
        clientId,
      })
      .returning()
      .execute();

    return location;
  });

  if (!location) {
    throw new ApiError(ApiResponseCode.internal_server_error, "Failed to create location", 500);
  }

  return location;
}

/**
 * Get Locations of a Client
 */
export async function getClientLocations(params: {
  clientId: number;
  orgId: number;
  userId: number;
  limit: number;
  offset: number;
}): Promise<Location[]> {
  const { clientId, orgId, userId, limit, offset } = params;

  // User must be a member of the organization
  await mustBeOrgMember({
    userId,
    orgId,
  });

  // Client must exist in Organization
  await clientMustExist({
    clientId,
    orgId,
  });

  // Get locations
  const locations = await db.query.locationsTable.findMany({
    where: (table, { eq }) => eq(table.clientId, clientId),
    limit,
    offset,
  });

  return locations;
}
