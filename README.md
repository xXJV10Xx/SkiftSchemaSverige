# Skiftschema Sverige (PWA)

Skiftschema för **SSAB Oxelösund 3‑skift** med **röd/grön-dagar**, **Supabase‑inloggning** och **personliga favoriter**. Byggd som en **mobil‑först PWA** som funkar i både mobil och webbläsare.

## ✅ Klar (i repo)

- [x] **Skiftlogik**: `lib/shifts.ts` (F/E/N + röd/grön‑dagar)
- [x] **Kalender UI**: `src/components/MonthCalendar.tsx` + `src/app/page.tsx`
- [x] **Supabase Auth** (OAuth): `src/components/AuthProvider.tsx`
- [x] **Favoriter per användare** (RLS): `lib/favorites.ts` + `supabase/migrations/0001_user_favorites.sql`
- [x] **PWA**: `public/manifest.json`, `public/sw.js`
- [x] **Stripe Payment Links** (Premium/Swipe/Bundle): `lib/pricing.ts` + lazy‑load köp‑UI `src/components/PricingLauncher.tsx`

Mer status finns i `CHECKLIST.md` och `DONE.md`.

## 🚀 Kom igång lokalt

1. Installera dependencies

```bash
npm install
```

2. Skapa `.env.local` från `.env.example` och fyll i värden

```bash
cp .env.example .env.local
```

3. Starta

```bash
npm run dev
```

## 🔐 Miljövariabler

Se `.env.example`.

- **Supabase**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Stripe Payment Links**
  - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PREMIUM`
  - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SWIPE`
  - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BUNDLE`

## 🎯 Nästa features (prioritering)

### PRIO 0 — `/register` (offentlig)

**Mål:** Email/lösenord‑registrering + skapa/uppdatera profil i `public.profiles` och redirect till `/dashboard`.

**Formfält (obligatoriska):**
- Namn (fullt namn)
- Email (unik)
- Företag (dropdown, t.ex. SSAB/LKAB/Outokumpu…)
- Skift (dropdown: 3‑skift, 2‑skift, röd, grön)
- Plats (GPS + manuell input)
- Lösenord (min 8 tecken)
- Villkor (checkbox)

**UX‑flöde:**
- Geolocation används för att föreslå plats/företag (fallback till manuell input).
- Skiftval kan färgkodas enligt röd/grön‑logik i `lib/shifts.ts` (visuellt).
- Success → redirect `/dashboard`.

### PRIO 1 — `/dashboard` (auth‑skyddad)

**Dashboard‑layout:**
- Profil (foto, företag, skift, plats)
- Skiftschema (spara/ladda personligt)
- Gruppchatt (skift‑kollegor)
- Mina Swipes (inkorg + likes)
- Prenumeration (status + uppgradera)
- Inställningar (notiser, språk)

**Mobil‑först komponenter (förslag):**
- UserCard (avatar + profil)
- ShiftCalendar (drag/drop)
- ChatList (realtime Supabase)
- SwipeInbox (likes + meddelanden)
- UpgradeCard (Stripe Payment Links)

### `/swipe` (paywall – Premium+)

**Core loop:**
1. Swipe LEFT/RIGHT på kollegor (kön, företag, distans)
2. Match → inbox + chatt
3. Likes/matcher i realtime

### Ads system (Free vs Premium)

**Free‑users ser annonser**, premium = annonsfritt. (Implementation kan ligga i en hook som läser `profiles.is_premium`.)

## 🧱 Supabase schema (nästa steg)

> Nuvarande tabell: `public.user_favorites` finns redan (se `supabase/migrations/0001_user_favorites.sql`).

### `public.profiles` (rekommenderat mönster)

Skapa en separat profil‑tabell kopplad till `auth.users`:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  shift_type text,
  location point,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_upsert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
```

Auto‑skapa profilrad vid signup (OAuth eller email/password):

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

### `public.swipes`

```sql
create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references public.profiles(id) on delete cascade,
  to_user uuid not null references public.profiles(id) on delete cascade,
  liked boolean not null default false,
  message text,
  created_at timestamptz not null default now()
);

alter table public.swipes enable row level security;
```

### `public.group_messages`

```sql
create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  shift_group uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.group_messages enable row level security;
```

## 💳 Stripe / Premium status

Just nu används **Stripe Payment Links** (redirect). Nästa steg är att sätta `profiles.is_premium` via **Stripe webhooks** (subscription status), så att:

- premium får annonsfritt
- `/swipe` kan skyddas av paywall

## ✅ Deploy checklist (snabb)

- [ ] Supabase: `profiles`, `swipes`, `group_messages` + RLS
- [ ] Stripe: webhooks → uppdatera `profiles.is_premium`
- [ ] Vercel: sätt env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Stripe links)
- [ ] PWA: testa “Installera app” på mobil

## Lovable prompt (kopiera)

```txt
Lovable: bygg nästa steg i skiftschemasverige-repot:

PRIO 0:
1) /register (email + lösenord) + profil i public.profiles (RLS)
2) redirect till /dashboard efter lyckad registrering

PRIO 1:
3) /dashboard skyddad route (Supabase auth)
4) Profile editor (avatar, företag, skift, plats)
5) Förbered /swipe som paywall-skyddad (premium)

Stack:
- Next.js App Router + TypeScript + Tailwind
- Supabase auth (Google/Apple + email/password)
- Använd befintlig lib/shifts.ts för skiftlogik
```

