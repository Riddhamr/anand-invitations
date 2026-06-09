import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { rsvpPin } from '../../data/engagement';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const pin = (data.get('pin') as string | null)?.trim();

    if (pin !== rsvpPin) {
      return json({ error: 'Incorrect PIN.' }, 401);
    }

    const url = import.meta.env.POSTGRES_URL ?? process.env.POSTGRES_URL;
    if (!url) {
      if (import.meta.env.DEV) {
        // Local dev without a DB — sample data so the page can be previewed
        return json({ rows: [
          { id: 1, name: 'Sample Guest A', guest_count: 2, status: 'declined',  side: 'groom', stale: false },
          { id: 2, name: 'Sample Guest B', guest_count: 2, status: 'confirmed', side: 'bride', stale: false },
          { id: 3, name: 'Sample Guest C', guest_count: 1, status: 'confirmed', side: null,    stale: false },
          { id: 4, name: 'Sample Guest D', guest_count: 4, status: 'not_sure',  side: 'bride', stale: true  },
        ]}, 200);
      }
      throw new Error('POSTGRES_URL is not set');
    }

    const sql = neon(url);
    await sql`ALTER TABLE rsvp ADD COLUMN IF NOT EXISTS stale BOOLEAN NOT NULL DEFAULT FALSE`;
    const rows = await sql`
      SELECT id, name, guest_count, status, side, stale, created_at
      FROM rsvp
      ORDER BY created_at DESC
    `;
    return json({ rows }, 200);

  } catch (err) {
    console.error('[RSVPS LIST API]', err);
    return json({ error: 'Failed to load RSVPs.' }, 500);
  }
};

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
