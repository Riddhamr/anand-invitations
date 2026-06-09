import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { rsvpStalePin } from '../../data/engagement';

export const prerender = false;

// Dev-only in-memory toggles so the flow can be tested without a DB
const devStale = new Map<number, boolean>([[4, true]]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const pin  = (data.get('pin') as string | null)?.trim();
    const idRaw = (data.get('id') as string | null)?.trim();

    if (pin !== rsvpStalePin) {
      return json({ error: 'Incorrect PIN.' }, 401);
    }

    const id = parseInt(idRaw ?? '', 10);
    if (isNaN(id) || id < 1) {
      return json({ error: 'Please enter a valid RSVP ID.' }, 400);
    }

    const url = import.meta.env.POSTGRES_URL ?? process.env.POSTGRES_URL;
    if (!url) {
      if (import.meta.env.DEV) {
        const next = !(devStale.get(id) ?? false);
        devStale.set(id, next);
        return json({ id, name: `Sample #${id}`, stale: next }, 200);
      }
      throw new Error('POSTGRES_URL is not set');
    }

    const sql = neon(url);
    await sql`ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS stale BOOLEAN NOT NULL DEFAULT FALSE`;

    // Toggle and return the new state
    const rows = await sql`
      UPDATE rsvp SET stale = NOT stale
      WHERE id = ${id}
      RETURNING id, name, stale
    `;
    if (rows.length === 0) {
      return json({ error: `No RSVP found with ID ${id}.` }, 404);
    }

    return json(rows[0], 200);

  } catch (err) {
    console.error('[RSVP STALE API]', err);
    return json({ error: 'Failed to update RSVP.' }, 500);
  }
};

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
