import { serial, text, timestamp, pgTable } from 'drizzle-orm/pg-core';
// import { db } from './config';

export const users = pgTable('users', {
	id: serial('id'),
	name: text('name'),
	role: text('role').$type<'admin' | 'customer'>(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
});
