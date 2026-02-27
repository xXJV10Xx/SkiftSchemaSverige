# Errorlista – felsökning Skiftschema Sverige

Lista över vanliga fel, orsaker och åtgärder. Uppdatera när nya kända fel dyker upp.

---

## Auth & inloggning

| Symptom | Möjlig orsak | Åtgärd |
|---------|----------------|--------|
| "Supabase ej konfigurerat" | `NEXT_PUBLIC_SUPABASE_URL` eller `NEXT_PUBLIC_SUPABASE_ANON_KEY` saknas i `.env.local` | Sätt båda i `.env.local` från Supabase Dashboard → Settings → API |
| OAuth redirect till fel URL | Fel "Site URL" eller "Redirect URLs" i Supabase Auth | Supabase Dashboard → Auth → URL Configuration; lägg till t.ex. `http://localhost:3000` och produktion-URL |
| Session försvinner vid refresh | Persist inte aktiverad eller cookies blockade | Kontrollera att Supabase client använder `persistSession: true`; kolla att cookies tillåts |
| "User not found" efter inloggning | Profil skapas inte i `profiles` | Kör trigger `handle_new_user()` vid insert på `auth.users`; kontrollera RLS på `profiles` |

---

## Forum & poster

| Symptom | Möjlig orsak | Åtgärd |
|---------|----------------|--------|
| "Permission denied" vid post | RLS kräver `profiles.is_premium` eller användare finns inte i `profiles` | Säkerställ att användaren har rad i `profiles` och att `is_premium` är true om krävs |
| Poster laddas inte / tom lista | RLS för strikt eller fel tabellnamn | Kontrollera policy "Public read forum_posts"; verifiera tabell- och kolumnnamn |
| Kommentar sparas inte | Policy kräver `auth.uid() = user_id` | Skicka inloggad användares `id` som `user_id`; kontrollera att användaren är `authenticated` |

---

## Favoriter

| Symptom | Möjlig orsak | Åtgärd |
|---------|----------------|--------|
| Favoriter visas inte | Supabase inte konfigurerad eller användare ej inloggad | Kontrollera env; använd endast favoriter när `user` finns |
| "Failed to fetch" / nätverksfel | CORS, fel URL eller nätverk nere | Verifiera `NEXT_PUBLIC_SUPABASE_URL`; kolla Supabase project status; testa från annat nätverk |
| Duplicerade favoriter | Ingen unik constraint på (user_id, date, lag) | Lägg till UNIQUE(user_id, date, lag) på `user_favorites`; hantera conflict i UI |

---

## PWA & offline

| Symptom | Möjlig orsak | Åtgärd |
|---------|----------------|--------|
| "Installera app" visas inte | Manifest eller SW fel; inte HTTPS (utom localhost) | Kontrollera `manifest.json` och `sw.js`; deploya till HTTPS för produktion |
| Service worker uppdateras inte | Gammal SW cachar; version inte ökad | Byt cache-namn i `sw.js` (t.ex. v2); använd "Update on reload" i DevTools |
| Offline – sidor laddas inte | Cache-lista i SW innehåller inte rutter | Lägg till relevanta routes i SW `addAll` eller cache-first för app-shell |

---

## Stripe & betalning

| Symptom | Möjlig orsak | Åtgärd |
|---------|----------------|--------|
| Köp-knapp öppnar fel länk | Placeholder kvar i `lib/pricing.ts` eller fel env | Sätt riktiga Payment Link-URL:er i kod eller `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_*` |
| Premium-status uppdateras inte | Webhooks inte konfigurerade eller `profiles.is_premium` inte satt | Konfigurera Stripe webhook → API som sätter `profiles.is_premium` vid subscription |

---

## Build & dev

| Symptom | Möjlig orsak | Åtgärd |
|---------|----------------|--------|
| `npm run build` faller (TypeScript) | Typfel eller saknad import | Kör `npm run build` och åtgär rad som anges; kontrollera `@lib/*` paths i `tsconfig.json` |
| Tailwind-klasser syns inte | PostCSS eller content-paths fel | Verifiera `tailwind.config.ts` content: `./src/**/*.{js,ts,jsx,tsx,mdx}`; starta om dev-server |
| Blank sida / hydration error | Server/client mismatch eller fel i root layout | Kontrollera att "use client" endast används där nödvändigt; kolla konsol för exakt fel |

---

## Nätverk & prestanda

| Symptom | Möjlig orsak | Åtgärd |
|---------|----------------|--------|
| Långsam första laddning | Stora bundles eller många anrop | Använd dynamic import för tunga komponenter (t.ex. prissektion); memoize skiftberäkningar |
| Realtime uppdateras inte | Supabase Realtime inte subscribad eller fel channel | Kontrollera `supabase.channel().on('postgres_changes', ...)` och att Realtime är på för tabellen i Dashboard |

---

*Senast uppdaterad: lägg till datum vid ändring. Utöka med nya rader när nya fel kategoriserats.*
