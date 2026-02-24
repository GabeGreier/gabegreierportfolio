insert into public.admin_emails (email)
values ('gabegreier@gmail.com')
on conflict (email) do nothing;
