-- Sun* Kudos — persistence for kudos posts and their hearts.
--
-- Until now the board ran entirely on the mock layer in app/_kudos/kudos-data.ts,
-- so a sent kudos and a given heart both died on reload. This migration makes
-- those two things real. Everything else on the screen (Spotlight cloud, sidebar
-- statistics, prize recipients) stays mock and is untouched here.
--
-- Two identities are deliberately kept apart:
--   * `sender_user_id` — the real authenticated account. Authorization anchors on
--     this: who may insert, and who is barred from hearting their own kudos.
--   * `sender_sunner_id` / `receiver_sunner_id` — rows in the people directory,
--     which is what the cards actually render. There are no auth-linked profiles
--     yet, so display and authorization cannot be the same column. `sunners.user_id`
--     is the seam that collapses them once real profiles exist.

-- ---------------------------------------------------------------------------
-- People directory. Ids and content are the design's own (the four board
-- Sunners plus the seven names written on the Spotlight cloud) — see seed.sql.
-- Text ids, not uuids, so the seeded rows match the ids the client already uses.
-- ---------------------------------------------------------------------------
create table public.sunners (
  id text primary key,
  name text not null,
  department text not null,
  avatar text not null,
  badge text not null check (badge in ('new-hero', 'rising-hero', 'super-hero', 'legend-hero')),
  -- The "hoa thị" tier: 1/2/3 map to the 10/20/50-kudos thresholds (spec B.3.2).
  stars smallint not null check (stars between 1 and 3),
  -- Null until this person signs in; unique so one account cannot claim two rows.
  user_id uuid unique references auth.users (id) on delete set null
);

-- ---------------------------------------------------------------------------
-- Kudos posts. `title` is the "Danh hiệu" chosen in the compose modal, which the
-- design states becomes the Kudos heading — the card's centred group-tag strip.
-- ---------------------------------------------------------------------------
create table public.kudos (
  id uuid primary key default gen_random_uuid(),
  -- Nullable: the seeded sample posts from the design have no real author. A
  -- null author can never match auth.uid(), so those stay heartable by everyone.
  sender_user_id uuid references auth.users (id) on delete set null,
  sender_sunner_id text not null references public.sunners (id),
  receiver_sunner_id text not null references public.sunners (id),
  title text not null,
  content text not null,
  hashtags text[] not null default '{}',
  images text[] not null default '{}',
  anonymous boolean not null default false,
  -- Only meaningful while `anonymous`; empty means "fall back to a translated
  -- label", so no UI copy is ever stored in the database.
  anonymous_name text,
  created_at timestamptz not null default now(),

  -- A kudos is for a teammate, never for yourself.
  constraint kudos_not_self check (sender_sunner_id <> receiver_sunner_id),
  constraint kudos_title_len check (char_length(title) between 1 and 200),
  -- Content arrives as rich-text HTML, so the ceiling is generous compared with
  -- the 1000-character limit the editor counts in plain text.
  constraint kudos_content_len check (char_length(content) between 1 and 8000),
  -- Spec E: at least one hashtag, at most five.
  constraint kudos_hashtags_len check (cardinality(hashtags) between 1 and 5),
  -- Spec F: images optional, at most five.
  constraint kudos_images_len check (cardinality(images) <= 5),
  constraint kudos_anonymous_name_only_when_anonymous
    check (anonymous or anonymous_name is null)
);

create index kudos_created_at_idx on public.kudos (created_at desc);
create index kudos_receiver_idx on public.kudos (receiver_sunner_id);

-- ---------------------------------------------------------------------------
-- Hearts. Spec C.4.1: one heart per user per kudos — enforced by the primary
-- key rather than by application code, so a double-click cannot double-count.
-- ---------------------------------------------------------------------------
create table public.kudos_likes (
  kudos_id uuid not null references public.kudos (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (kudos_id, user_id)
);

create index kudos_likes_kudos_idx on public.kudos_likes (kudos_id);

-- ---------------------------------------------------------------------------
-- Row level security. The board is visible to any signed-in Sunner; writes are
-- restricted to the acting account.
-- ---------------------------------------------------------------------------
alter table public.sunners enable row level security;
alter table public.kudos enable row level security;
alter table public.kudos_likes enable row level security;

create policy sunners_select_authenticated on public.sunners
  for select to authenticated using (true);

create policy kudos_select_authenticated on public.kudos
  for select to authenticated using (true);

-- You may only post as yourself. No update/delete policy exists: a kudos is a
-- record of thanks, not an editable document.
create policy kudos_insert_own on public.kudos
  for insert to authenticated with check (sender_user_id = auth.uid());

create policy kudos_likes_select_authenticated on public.kudos_likes
  for select to authenticated using (true);

-- Spec C.4.1: a sender may never heart their own kudos. Enforced here rather
-- than in the client, where it would be one disabled button away from bypass.
create policy kudos_likes_insert_own on public.kudos_likes
  for insert to authenticated with check (
    user_id = auth.uid()
    and not exists (
      select 1 from public.kudos k
      where k.id = kudos_id and k.sender_user_id = auth.uid()
    )
  );

create policy kudos_likes_delete_own on public.kudos_likes
  for delete to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Table privileges. These are NOT optional and NOT implied by the policies above:
-- a policy narrows access that a GRANT has already allowed, so without these the
-- API rejects every request with "permission denied for table kudos" no matter
-- how permissive the policy is.
--
-- `anon` is granted nothing on purpose — the board requires a signed-in Sunner,
-- and `/kudos` is already behind the auth proxy.
-- ---------------------------------------------------------------------------
grant select on public.sunners to authenticated;
-- No update/delete: a kudos is a record of thanks, not an editable document.
grant select, insert on public.kudos to authenticated;
-- Delete is what un-hearting is.
grant select, insert, delete on public.kudos_likes to authenticated;
