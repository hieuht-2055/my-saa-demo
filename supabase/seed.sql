-- Seed data for the Sun* Kudos board. Runs on `supabase db reset`.
--
-- Every name, message, hashtag and image path below is the design's own content,
-- lifted from app/_kudos/kudos-data.ts + kudos-sunners.ts (which took it verbatim
-- from Figma). Nothing here is invented.
--
-- Idempotent: safe to re-run against a live database, not just a fresh reset.

-- ---------------------------------------------------------------------------
-- People. The four Sunners the cards render, then the seven names the design
-- writes on the Spotlight cloud, promoted so they can receive a kudos.
-- ---------------------------------------------------------------------------
insert into public.sunners (id, name, department, avatar, badge, stars) values
  ('s1', 'Huỳnh Dương Xuân Nhật', 'CEVC10', '/kudos/avatar-sender.png',   'new-hero',    1),
  ('s2', 'Huỳnh Dương Xuân Nhật', 'CEVC10', '/kudos/avatar-sender.png',   'rising-hero', 2),
  ('s3', 'Huỳnh Dương Xuân Nhật', 'CEVC10', '/kudos/avatar-sender.png',   'super-hero',  3),
  ('r1', 'Huỳnh Dương Xuân',      'CEVC10', '/kudos/avatar-receiver.png', 'legend-hero', 3),
  ('dir-1', 'Đỗ hoàng Hiệp',     'CEVC10',    '/kudos/avatar-sunner.png', 'new-hero',    1),
  ('dir-2', 'Dương thùy An',     'CECV11',    '/kudos/avatar-sunner.png', 'rising-hero', 2),
  ('dir-3', 'Mai phượng Thùy',   'Marketing', '/kudos/avatar-sunner.png', 'super-hero',  3),
  ('dir-4', 'Nguyễn Văn Quy',    'HR',        '/kudos/avatar-sunner.png', 'legend-hero', 1),
  ('dir-5', 'Lê Kiều Trang',     'BSD',       '/kudos/avatar-sunner.png', 'new-hero',    2),
  ('dir-6', 'Nguyễn Bá Chúc',    'CEVC10',    '/kudos/avatar-sunner.png', 'rising-hero', 3),
  ('dir-7', 'Nguyễn Hoàng Linh', 'CECV11',    '/kudos/avatar-sunner.png', 'super-hero',  1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- The board's sample kudos. Seeded so hearts persist on every card, not just on
-- ones composed this session — a heart needs a row to point at.
--
-- `sender_user_id` stays null: these have no real author, which also means no
-- account is ever blocked from hearting them by the "not your own" rule.
--
-- The design repeats "Dedicated"/"Inspring" six times on a card; deduplicated to
-- two here because spec E caps a kudos at five hashtags.
-- ---------------------------------------------------------------------------
insert into public.kudos (
  sender_sunner_id, receiver_sunner_id, title, content, hashtags, images, created_at
)
select
  (array['s1', 's2', 's3'])[1 + (i % 3)],
  'r1',
  (array['IDOL GIỚI TRẺ', 'CHIẾN THẦN DEADLINE', 'NGƯỜI TRUYỀN LỬA'])[1 + (i % 3)],
  'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cẩn mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống',
  array['Dedicated', 'Inspring'],
  array_fill('/kudos/sample-photo.png'::text, array[5]),
  -- Descending, so the seeded feed keeps the design's order and anything composed
  -- now sorts above all of it.
  now() - ((i + 1) || ' hours')::interval
from generate_series(0, 11) as g (i)
where not exists (select 1 from public.kudos);
