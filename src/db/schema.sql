-- Run this once in your Vercel Postgres console (or it auto-runs on first RSVP).
-- Keeping it here as the source-of-truth reference.

CREATE TABLE IF NOT EXISTS rsvp (
  id          SERIAL PRIMARY KEY,
  name        TEXT    NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  status      TEXT    NOT NULL CHECK (status IN ('confirmed', 'not_sure', 'declined')),
  side        TEXT    CHECK (side IN ('bride', 'groom')),  -- which side's link (?v=) — NULL if none
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Useful queries for the couple:

-- See all RSVPs
SELECT * FROM rsvp ORDER BY created_at DESC;

-- Summary counts
SELECT
  status,
  COUNT(*)          AS responses,
  SUM(guest_count)  AS total_guests
FROM rsvp
GROUP BY status;

-- Split by side (bride / groom / NULL = link without ?v=)
SELECT side, status, COUNT(*) AS responses, SUM(guest_count) AS total_guests
FROM rsvp
GROUP BY side, status
ORDER BY side, status;
