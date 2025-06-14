import { seed } from "drizzle-seed";
import { usersTable } from "@repo/db";
import { db } from "../conn.ts";

/**
 * Seed Dummy Data.
 */
async function main() {
  await seed(db, { usersTable }, { count: 1000, seed: 1 });
}

main();
