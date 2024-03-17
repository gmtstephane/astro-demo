import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema';
const { Client } = pkg;

const client = new Client({ connectionString: import.meta.env.DB_URL });
await client.connect();
export const db = drizzle(client, { schema: schema });
