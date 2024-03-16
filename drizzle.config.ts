import type { Config } from 'drizzle-kit';
const connectionString = process.env.DB_URL;
import * as dotenv from 'dotenv';
dotenv.config();

if (!connectionString) {
	throw new Error('DB_URL environment variable is required');
}

export default {
	schema: './db/schema.ts',
	out: './db/drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: connectionString,
	},
} satisfies Config;
