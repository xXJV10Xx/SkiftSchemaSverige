## Checklist (Lovable / nästa uppdatering)

- [x] `lib/shifts.ts` på plats och används av UI
- [x] Responsiv kalender med F/E/N + röd/grön
- [x] Supabase auth (Google/Apple) + session state
- [x] Favoriter sparas per användare (RLS) + UI ★/☆
- [x] PWA: `manifest.json`, service worker, ikoner, mobil footer-nav
- [x] Stripe Payment Links UI (lazy-load)
- [ ] Stripe Payment Links: fyll i riktiga länkar i `.env.local` (premium + swipe)
- [ ] Verifiera checkout på mobil (iOS Safari + Android Chrome)
- [ ] Verifiera favoriter med riktig Supabase (insert/delete + RLS)

## Done (implementerat i kodbasen)

- [x] Bygg passerar (`npm run build`)
- [x] Checkout laddas inte i förväg (pricing/checkout UI lazy-loadas först när du klickar “Visa priser & köp”)

