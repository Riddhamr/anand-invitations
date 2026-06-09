// ─────────────────────────────────────────────────────────────
// ENGAGEMENT DATA  — update this file whenever details change.
// All components import from here; nothing is hardcoded elsewhere.
//
// Vishva & Anand — Engagement
// ─────────────────────────────────────────────────────────────

// ── Site URL ────────────────────────────────────────────────
// Absolute base URL of the deployed site. Used for og:image / og:url
// (link previews on WhatsApp etc. need absolute URLs). No trailing slash.
export const siteUrl = 'https://anand-invitation.vercel.app';

// ── Couple-name font ────────────────────────────────────────
// Any Google Font family name (e.g. 'Ephesis', 'Tangerine', 'Parisienne').
// Applied ONLY to the couple names. If the font fails to
// load or the name is wrong, it falls back to "Great Vibes", cursive.
export const nameFont = {
  family: 'Ephesis',
};

export const groom = {
  firstName:  'Anand',
  nickname:   'Anand',
  fullName:   'Anand Nadpara',
  familyName: 'Nadpara',
  relation:   'S/O',
  dad:        'Rajnibhai Govindbhai Nadpara',
  mom:        'Rinaben Rajnibhai Nadpara',
};

export const bride = {
  firstName:  'Vishva',
  nickname:   'Vishva',
  fullName:   'Vishva Bhalodia',
  familyName: 'Bhalodia',
  relation:   'D/O',
  dad:        'Kishorbhai Bhagvanjibhai Bhalodia',
  mom:        'Lataben Kishorbhai Bhalodia',
};

// ── Whose side is sending this invitation? ──────────────────
// Default side when the URL has no ?v= param.
// Guests can be sent  /?v=groom  or  /?v=bride  — names, families,
// title, link preview and seal initials all follow the param.
export const invitedBy: 'bride' | 'groom' = 'groom';

export type Side = 'bride' | 'groom';

// Resolve name ordering from the ?v= variant.
//   groom → groom first,  bride → bride first,  anything else → invitedBy default
export function getVariant(v?: string | null) {
  const side: Side = (v === 'groom' || v === 'bride') ? v : invitedBy;
  const first  = side === 'groom' ? groom : bride;
  const second = side === 'groom' ? bride : groom;
  return {
    side,
    first,
    second,
    title:    `${first.firstName} & ${second.firstName}`,
    initials: `${first.firstName[0]} & ${second.firstName[0]}`,
  };
}

// Default-order helpers (used as prop fallbacks)
export const firstPerson  = invitedBy === 'groom' ? groom : bride;
export const secondPerson = invitedBy === 'groom' ? bride : groom;

export const eventDate = {
  display:    '21st June 2026',
  short:      'June 21, 2026',
  dayLabel:   'Sunday',
  iso:        '2026-06-21T09:00:00+05:30', // ceremony start — 9:00 AM IST
  isoUTC:     '2026-06-21T03:30:00Z',      // 9:00 AM IST in UTC — drives countdown
};

// Hero invitation line — use \n wherever you want a line break.
export const inviteText =
  'We cordially invite you to witness the beginning of our forever and celebrate the engagement ceremony of';

// Phrase inside inviteText to render extra bold (must match exactly)
export const inviteHighlight = 'engagement ceremony';

export const couple = {
  // Derived from invitedBy order
  initials:   `${firstPerson.firstName[0]} & ${secondPerson.firstName[0]}`,
  hashtag:    '#VishvaAnand',
  title:      `${firstPerson.firstName} & ${secondPerson.firstName}`,
};

export const venue = {
  name:        'Detroja Patel Samaj',
  time:        '9:00 AM',
  line1:       'Sanosara, Manavadar',
  line2:       'Junagadh, Gujarat',
  fullAddress: 'Detroja Patel Samaj, Sanosara, Manavadar, Junagadh, Gujarat',
  mapEmbed:    'https://maps.google.com/maps?q=Detroja+Patel+Samaj+Sanosara+Manavadar+Junagadh&z=14&output=embed',
  mapDirections: 'https://maps.app.goo.gl/sBgoaKekBLn4oajL8?g_st=ic',
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
    title:       'Engagement Ceremony',
    description: 'The sacred exchange of rings and eternal promises',
    day:         'SUN',
    date:        eventDate.short,
    time:        '09:00 AM',
    // \n renders as a line break in the event card
    venue:       'Detroja Patel Samaj,\nSanosara, Manavadar,\nJunagadh, Gujarat',
    // Kept in config but not rendered in the UI (no dress code for now)
    dressCode:   '',
    icon:        '💍',
    bg:          '/assets/bg-sangeet-new-CNNXHaSd.jpg',
    couple:      '/assets/couple-sangeet-D3VSf4cb.png',
  },
];
