import { z } from 'zod';

export const ticketSchema = z.object({
	id: z.number().optional(),
	ticketingId: z.number(),
	price: z.number(),
	url: z.string(),
});

export const createEventTeamSchema = z.object({
	sport: z.number(),
	championship: z.number(),
	location: z.number(),
	homeTeam: z.number(),
	awayTeam: z.number(),
	date: z.date(),
	// tickets: z.array(ticketSchema),
});

export const createEventPlayerSchema = z.object({
	sport: z.number(),
	championship: z.number(),
	location: z.number(),
	player1: z.number(),
	player2: z.number(),
	date: z.date(),
	// tickets: z.array(ticketSchema),
});

export const createEventGenericSchema = z.object({
	sport: z.number(),
	location: z.number(),
	name: z.string(),
	image: z.string(),
	date: z.date(),
	// tickets: z.array(ticketSchema),
});
