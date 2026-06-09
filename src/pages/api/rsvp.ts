import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { getVariant } from '../../data/engagement';

export const prerender = false;

function getDb() {
  const url = import.meta.env.POSTGRES_URL ?? process.env.POSTGRES_URL;
  if (!url) throw new Error('POSTGRES_URL environment variable is not set.');
  return neon(url);
}

async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS rsvp (
      id          SERIAL PRIMARY KEY,
      name        TEXT    NOT NULL,
      guest_count INTEGER NOT NULL DEFAULT 1,
      status      TEXT    NOT NULL CHECK (status IN ('confirmed', 'not_sure', 'declined')),
      side        TEXT    CHECK (side IN ('bride', 'groom')),
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Existing deployments: add the column if the table predates it
  await sql`ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS side TEXT CHECK (side IN ('bride', 'groom'))`;
  await sql`ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS stale BOOLEAN NOT NULL DEFAULT FALSE`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const name     = (data.get('name') as string | null)?.trim();
    const guestStr = data.get('guest_count') as string | null;
    const status   = data.get('status') as string | null;
    const variantRaw = data.get('variant') as string | null;
    const v = getVariant(variantRaw);

    // Reject RSVPs from links without a valid variant (?v=)
    if (!v.rsvpEnabled) {
      return json({ error: 'RSVP is not available for this link. Please contact us to confirm.' }, 403);
    }
    const side = v.side;

    if (!name || name.length < 2) {
      return json({ error: 'Please enter your name.', field: 'name' }, 400);
    }

    const guestCount = parseInt(guestStr ?? '1', 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > v.maxGuests) {
      return json({ error: `Guest count must be between 1 and ${v.maxGuests}.`, field: 'guest_count' }, 400);
    }

    const validStatuses = ['confirmed', 'not_sure', 'declined'];
    if (!status || !validStatuses.includes(status)) {
      return json({ error: 'Please select your response.', field: 'status' }, 400);
    }

    await ensureTable();

    const sql = getDb();
    await sql`
      INSERT INTO rsvp (name, guest_count, status, side)
      VALUES (${name}, ${guestCount}, ${status}, ${side})
    `;

    return json({ success: true }, 200);

  } catch (err) {
    console.error('[RSVP API]', err);
    return json({ error: 'Failed to save your RSVP. Please try again.' }, 500);
  }
};

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
