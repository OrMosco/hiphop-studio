-- Seed: the next 8 Sunday classes at 20:00 Israel time.
insert into public.sessions (starts_at)
select ((date_trunc('week', now() at time zone 'Asia/Jerusalem')::date + 6 + 7 * g) + time '20:00')
         at time zone 'Asia/Jerusalem'
from generate_series(0, 7) g
where ((date_trunc('week', now() at time zone 'Asia/Jerusalem')::date + 6 + 7 * g) + time '20:00')
         at time zone 'Asia/Jerusalem' > now();
