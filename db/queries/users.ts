import { db } from '@db/config';
import { users } from '@db/schema';

type NewUser = typeof users.$inferInsert;

export const InsertUser = async (user: NewUser) => {
	return db.insert(users).values(user);
};
