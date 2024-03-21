import { db } from '@db/config';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';

const sqlQuery = readFileSync('./db/queries/sql/EventList.sql', 'utf8');

export async function GetEventUnion() {
	try {
		return await db.execute(sql.raw(sqlQuery));
	} catch (err) {
		console.log(err);
		throw err;
	}
}
