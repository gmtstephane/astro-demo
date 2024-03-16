import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
const connectionString = process.env.DB_URL;
if (!connectionString) {
	throw new Error('DB_URL environment variable is required');
}
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);
await migrate(db, { migrationsFolder: './db/drizzle' });
await sql.end();
