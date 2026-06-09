// ─────────────────────────────────────────────────────────────
// ENGAGEMENT DATA  — update this file whenever details change.
// All components import from here; nothing is hardcoded elsewhere.
//
// ⚠️  ANAND INVITATION — fill in the real details below.
//     Every value marked TODO is placeholder content copied from the
//     original template and must be replaced before going live.
// ─────────────────────────────────────────────────────────────

// ── Site URL ────────────────────────────────────────────────
// Absolute base URL of the deployed site. Used for og:image / og:url
// (link previews on WhatsApp etc. need absolute URLs). No trailing slash.
// TODO: set to the real Vercel domain once deployed.
export const siteUrl = 'https://anand-invitation.vercel.app';

// ── Couple-name font ────────────────────────────────────────
// Any Google Font family name (e.g. 'Ephesis', 'Tangerine', 'Parisienne').
// Applied ONLY to the couple names. If the font fails to
// load or the name is wrong, it falls back to "Great Vibes", cursive.
export const nameFont = {
  family: 'Ephesis',
};

export const groom = {
  firstName:  'Anand',          // TODO
  nickname:   'Anand',          // TODO
  fullName:   'Anand',          // TODO
  familyName: '',               // TODO
  relation:   'S/O',
  dad:        '',               // TODO
  mom:        '',               // TODO
};

export const bride = {
  firstName:  'Partner',        // TODO
  nickname:   'Partner',        // TODO
  fullName:   'Partner',        // TODO
  familyName: '',               // TODO
  relation:   'D/O',
  dad:        '',               // TODO
  mom:        '',               // TODO
};

// ── Whose side is sending this invitation? ──────────────────
// Default side when the URL has no ?v= param.
// Guests can be sent  /?v=groom  or  /?v=bride  — names, families,
// title, link preview and seal initials all follow the param.
export const invitedBy: 'bride' | 'groom' = 'groom';

export type Side = 'bride' | 'groom';

// Phone to contact if a guest opens a link without a valid ?v= variant
export const rsvpContactPhone = '';   // TODO

// Resolve everything that depends on the ?v= variant.
//   groom / bride        → that side first, full RSVP (up to rsvpMaxGuests)
//   groom-2 / bride-2     → that side first, RSVP capped at 2 (input prefilled 2)
//   anything else / none  → card still shows (default side) but RSVP disabled
export function getVariant(v?: string | null) {
  // Accepts  groom | bride        → full RSVP (up to rsvpMaxGuests)
  //          groom-N | bride-N     → RSVP capped at N guests (input prefilled N)
  //          anything else / none  → card shows, RSVP disabled
  const match = (v ?? '').match(/^(groom|bride)(?:-(\d+))?$/);
  const recognized = match !== null;
  const side: Side = (match ? match[1] : invitedBy) as Side;
  const cap = match && match[2] ? Math.max(1, parseInt(match[2], 10)) : null;
  const def = {
    side,
    maxGuests:     cap ?? rsvpMaxGuests,
    defaultGuests: cap ?? 0,
  };
  const first  = side === 'groom' ? groom : bride;
  const second = side === 'groom' ? bride : groom;
  return {
    recognized,
    rsvpEnabled:   recognized,
    side,
    first,
    second,
    title:    `${first.firstName} & ${second.firstName}`,
    initials: `${first.firstName[0]} & ${second.firstName[0]}`,
    maxGuests:     def.maxGuests,
    defaultGuests: def.defaultGuests,
  };
}

// Default-order helpers (used as prop fallbacks)
export const firstPerson  = invitedBy === 'groom' ? groom : bride;
export const secondPerson = invitedBy === 'groom' ? bride : groom;

export const eventDate = {
  display:    'TODO Date',                    // TODO
  short:      'TODO Date',                     // TODO
  dayLabel:   'Sunday',                        // TODO
  iso:        '2026-12-31T09:00:00-05:00',     // TODO — ceremony start (local)
  isoUTC:     '2026-12-31T14:00:00Z',          // TODO — same instant in UTC (drives countdown)
};

// Maximum guests one RSVP can bring (including the guest themself)
export const rsvpMaxGuests = 10;

// PIN required to view the RSVP responses dashboard (/rsvps)
export const rsvpPin = '0000';        // TODO — choose a private PIN

// Separate PIN required to mark an RSVP as stale / active again
export const rsvpStalePin = '0000';   // TODO — choose a private PIN

// Hero invitation line — use \n wherever you want a line break.
export const inviteText =
  'We cordially invite you to witness the beginning of our forever and celebrate the engagement ceremony of';

// Phrase inside inviteText to render extra bold (must match exactly)
export const inviteHighlight = 'engagement ceremony';

export const couple = {
  // Derived from invitedBy order
  initials:   `${firstPerson.firstName[0]} & ${secondPerson.firstName[0]}`,
  hashtag:    '#TODOHashtag',   // TODO
  title:      `${firstPerson.firstName} & ${secondPerson.firstName}`,
};

export const venue = {
  name:        '',              // TODO
  time:        '',              // TODO
  line1:       '',              // TODO
  line2:       '',              // TODO
  fullAddress: '',              // TODO
  mapEmbed:    '',              // TODO — Google Maps embed URL
  mapDirections: '',            // TODO — Google Maps directions URL
};

// ── Events ─────────────────────────────────────────────────
// Add / remove / reorder events here.  Each entry maps 1-to-1
// to an EventCard rendered in EventsSection.
export interface CeremonyEvent {
  title:       string;
  description: string;
  day:         string;
  date:        string;
  time:        string;
  venue:       string;
  dressCode:   string;
  icon:        string;
  bg:          string;
  couple:      string;
}

export const events: CeremonyEvent[] = [
  {
    title:       'Ring Ceremony',                                       // TODO
    description: 'The sacred exchange of rings and eternal promises',   // TODO
    day:         'SUN',                                                 // TODO
    date:        eventDate.short,
    time:        '09:00 AM',                                            // TODO
    // \n renders as a line break in the event card
    venue:       '',                                                    // TODO
    // Kept in config but not rendered in the UI (no dress code for now)
    dressCode:   '',
    icon:        '💍',
    bg:          '/assets/bg-sangeet-new-CNNXHaSd.jpg',
    couple:      '/assets/couple-sangeet-D3VSf4cb.png',
  },
];
