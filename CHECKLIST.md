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

## Done (implementerat i kodbasen)

- [x] Bygg passerar (`npm run build`)
- [x] Checkout laddas inte i förväg (pricing/checkout UI lazy-loadas först när du klickar “Visa priser & köp”)

