alter table site_settings add column if not exists rates_live boolean not null default false;
alter table site_settings add column if not exists about_review_ack boolean not null default false;
alter table site_settings add column if not exists reply_sla_ar text not null default '';
alter table site_settings add column if not exists reply_sla_en text not null default '';
alter table site_settings add column if not exists secure_channel_ar text not null default '';
alter table site_settings add column if not exists secure_channel_en text not null default '';
alter table site_settings add column if not exists license_image text not null default '';
alter table site_settings add column if not exists founded_on text not null default '';

alter table managed_pages add column if not exists legal_approved boolean not null default false;

alter table branches add column if not exists slug text not null default '';
alter table partners add column if not exists slug text not null default '';
alter table partners add column if not exists logo_url text not null default '';
alter table partners add column if not exists country text not null default '';
alter table rates add column if not exists updated_by text not null default '';
alter table faqs add column if not exists topic text not null default 'general';

create table if not exists rate_history (
  id bigserial primary key,
  rate_id bigint not null,
  code text not null,
  region text not null default '',
  buy numeric(18,4) not null,
  sell numeric(18,4) not null,
  recorded_at timestamptz not null default now()
);

create table if not exists service_requests (
  id bigserial primary key,
  reference text not null unique,
  pin_hash text not null,
  kind text not null,
  org_name text not null,
  delegate_name text not null,
  phone text not null,
  city text not null,
  need text not null,
  created_at timestamptz not null default now()
);

update branches set slug = 'head-office' where name_ar = 'المركز الرئيسي' and slug = '';
update branches set slug = 'hareeb' where name_ar like '%حريب%' and slug = '';
update branches set slug = 'sanaa' where name_ar = 'صنعاء' and slug = '';
update branches set slug = 'station' where name_ar like '%المحطة%' and slug = '';
update branches set slug = 'safer' where name_ar like '%صافر%' and slug = '';
update branches set slug = 'shabwa' where name_ar = 'شبوة' and slug = '';
update branches set slug = 'dam-junction' where name_ar like '%مفرق%' and slug = '';
update branches set slug = 'branch-' || id::text where slug = '';

update partners
set slug = trim(both '-' from regexp_replace(lower(name_en), '[^a-z0-9]+', '-', 'g'))
where slug = '';
update partners set slug = 'partner-' || id::text
where slug = '' or slug in (
  select slug from partners where slug <> '' group by slug having count(*) > 1
);

update faqs set answer_ar = replace(answer_ar, 'للمتابعه', 'للمتابعة');
update faqs set topic = 'rates' where question_ar like '%سعر%' or question_ar like '%صرف%';
update faqs set topic = 'transfers' where topic = 'general' and question_ar like '%حوال%';
update faqs set topic = 'branches' where topic = 'general' and (question_ar like '%فرع%' or question_ar like '%نقط%');
update faqs set topic = 'aid' where service_slug like 'aid%' or service_slug = 'humanitarian';

update site_settings
set strategy_ar = replace(strategy_ar, 'ضاربة في السوق', 'راسخة في السوق')
where id = 1;
