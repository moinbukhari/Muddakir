import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Ensure environment variables are defined
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("The environment variable DATABASE_URL must be defined");
}

neonConfig.webSocketConstructor = ws;
const connectionString = databaseUrl;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
