import { db } from '@db/config';
import { eventTeam, eventType, eventPlayer, ticket } from '@db/schema';
import type { FullEvent } from '@db/types';
import { eq } from 'drizzle-orm';

export async function GetEvent(id: string): Promise<FullEvent | undefined> {
  const type = await db.query.eventType.findFirst({ where: eq(eventType.eventid, id) });
  if (!type) return undefined;

  switch (type.type) {
    case 'Team':
      return await db.query.eventTeam.findFirst({
        where: eq(eventTeam.id, id),
        with: {
          awayTeam: true,
          homeTeam: true,
          championship: true,
          location: true,
          sport: true,
          tickets: {
            with: {
              ticketing: true,
            },
          },
        },
      });
    case 'Individual':
      return await db.query.eventPlayer.findFirst({
        where: eq(eventPlayer.id, id),
        with: {
          championship: true,
          location: true,
          sport: true,
          player1: {
            with: {
              country: true,
            }
          },
          player2: {
            with: {
              country: true,
            }
          },
          tickets: {
            with: {
              ticketing: true,
            },
          },
        },
      });
    case 'Event':
      return await db.query.eventGeneric.findFirst({
        where: eq(eventPlayer.id, id),
        with: {
          tickets: {
            with: {
              ticketing: true,
            },
          },
          location: true,
          sport: true,
        },
      });
    default:
      return undefined;
  }
}
