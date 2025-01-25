import { seed } from "drizzle-seed";
import { usersTable } from "@repo/shared-lib/db";
import { db } from "../index.js";

/**
 * Seed Dummy Data.
 */
async function main() {
  await seed(db, { usersTable }, { count: 1000, seed: 1 });
}

main();
