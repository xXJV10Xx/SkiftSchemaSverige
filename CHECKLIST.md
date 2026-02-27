## Checklist (Lovable / nästa uppdatering)

- [x] `lib/shifts.ts` på plats och används av UI
- [x] Responsiv kalender med F/E/N + röd/grön
- [x] Supabase auth (Google/Apple) + session state
- [x] Favoriter sparas per användare (RLS) + UI ★/☆
- [x] PWA: `manifest.json`, service worker, ikoner, mobil footer-nav
- [x] Stripe Payment Links UI (lazy-load)
- [x] Stripe Payment Links: riktiga länkar (premium + swipe + bundle)
- [ ] Verifiera checkout på mobil (iOS Safari + Android Chrome)
- [ ] Verifiera favoriter med riktig Supabase (insert/delete + RLS)

## Forum (PRIO 2 – Lovable / Supabase)

- [ ] Supabase: `forum_posts` + `forum_comments` + RLS (publik läs, auth kommentera, premium posta)
- [ ] `/forum`-sida: timeline, filter (företag, datum, typ, avdelning)
- [ ] CreatePostModal (premium-låst), ForumCard, CommentThread (Supabase Realtime)
- [ ] useForumAccess: canRead, canComment, canPost; CTA för gäst/free

## Saknas – v2.0 (persistent, chatt, sök, inkorg)

- [ ] Persistent inställningar: localStorage + Supabase (företag, schema/lag, distans, filter)
- [ ] Chatt & grupper: `chat_groups` + `group_members` (admin, join-godkännande, kick, lämna)
- [ ] `/search`: live sök grupper + användare (2+ tecken), online-status (Supabase Presence)
- [ ] Inkorg: likes, grupp-inbjudningar, forum-svar, ny medlem, radera meddelanden

## v3.0 – Error-prevention & anti-crash

- [ ] Zod: alla formulär (register, forum-post, swipe)
- [ ] Optimistic updates + rollback vid fel; toast-fel på svenska
- [ ] Offline-kö: IndexedDB eller localStorage, Background Sync; nätverksstatus-toast
- [ ] Rate limit forum (t.ex. 5 poster/timme)
- [ ] PWA: cache forum/scheman i SW; offline-indikator
- [ ] Safety: rapportera/blockera; double-opt-in för matcher
- [ ] Kalender: iCal-export; skiftbyte-förslag
- [ ] Global error boundary (`app/error.tsx`); `lib/error.ts` central hantering
- [ ] Auth: e-postbekräftelse + lösenordsåterställning (anti-fake)
- [ ] Prestanda: infinite scroll + React Query/SWR
- [ ] Säkerhet: CSRF + CAPTCHA på register (anti-spam)
- [ ] Mobil: haptic feedback + keyboard avoid där relevant

**Felsökning:** Se `ERRORLIST.md` för vanliga fel och lösningar.

## Done (implementerat i kodbasen)

- [x] Bygg passerar (`npm run build`)
- [x] Checkout laddas inte i förväg (pricing/checkout UI lazy-loadas först när du klickar “Visa priser & köp”)

