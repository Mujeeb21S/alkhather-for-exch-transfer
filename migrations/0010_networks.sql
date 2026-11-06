create table if not exists transfer_networks (
  id serial primary key,
  code text not null unique,
  name_ar text not null,
  name_en text not null default '',
  logo_url text not null default '',
  kind text not null check (kind in ('local_ye', 'international', 'regional', 'banking', 'ewallet')),
  country text not null default '',
  owner_name text not null default '',
  operator_name text not null default '',
  website text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  coverage text not null default '',
  currencies text not null default '',
  transfer_types text not null default '',
  fee_note text not null default '',
  commission_note text not null default '',
  started_on date,
  agreement_ends_on date,
  status text not null default 'pending' check (status in ('active', 'inactive', 'pending', 'suspended', 'stopped', 'expired')),
  notes text not null default '',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists finance_partners (
  id serial primary key,
  code text not null unique,
  trade_name text not null,
  legal_name text not null default '',
  logo_url text not null default '',
  kind text not null check (kind in ('exchange', 'bank_local', 'bank_intl', 'mto', 'ewallet', 'agent', 'correspondent', 'intermediary')),
  country text not null default '',
  city text not null default '',
  address text not null default '',
  phones text not null default '',
  email text not null default '',
  website text not null default '',
  contact_name text not null default '',
  contact_info text not null default '',
  license_no text not null default '',
  regulator text not null default '',
  relation_started_on date,
  agreement_on date,
  agreement_ends_on date,
  status text not null default 'pending' check (status in ('active', 'inactive', 'pending', 'suspended', 'stopped', 'expired')),
  documents text not null default '',
  notes text not null default '',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists network_links (
  id serial primary key,
  network_id int not null references transfer_networks (id),
  partner_id int not null references finance_partners (id),
  services text not null default '',
  currencies text not null default '',
  min_amount numeric(18, 4),
  max_amount numeric(18, 4),
  agreement_ref text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive', 'pending', 'suspended')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists link_branches (
  link_id int not null references network_links (id) on delete cascade,
  branch_id int not null references branches (id),
  primary key (link_id, branch_id)
);

create table if not exists corridors (
  id serial primary key,
  send_country text not null,
  recv_country text not null,
  network_id int not null references transfer_networks (id),
  send_partner_id int references finance_partners (id),
  recv_partner_id int references finance_partners (id),
  currencies text not null default '',
  min_amount numeric(18, 4),
  max_amount numeric(18, 4),
  fee_note text not null default '',
  eta_note text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists commission_plans (
  id serial primary key,
  network_id int not null references transfer_networks (id),
  partner_id int references finance_partners (id),
  service_code text not null default 'send',
  currency text not null default '',
  country text not null default '',
  side text not null default 'send' check (side in ('send', 'receive')),
  kind text not null check (kind in ('fixed', 'percent', 'tiered')),
  min_amount numeric(18, 4) not null default 0,
  max_amount numeric(18, 4),
  percent numeric(9, 4) not null default 0,
  fixed_amount numeric(18, 4) not null default 0,
  company_share numeric(9, 4) not null default 100,
  starts_on date not null,
  ends_on date,
  active boolean not null default true,
  superseded_by int,
  created_at timestamptz not null default now()
);

create table if not exists commission_tiers (
  id serial primary key,
  plan_id int not null references commission_plans (id),
  min_amount numeric(18, 4) not null,
  max_amount numeric(18, 4),
  percent numeric(9, 4) not null default 0,
  fixed_amount numeric(18, 4) not null default 0
);

create table if not exists commission_revisions (
  id serial primary key,
  plan_id int not null,
  snapshot jsonb not null,
  actor_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists gl_accounts (
  code text primary key,
  name_ar text not null,
  name_en text not null default '',
  kind text not null check (kind in ('asset', 'liability', 'income', 'expense', 'equity')),
  currency text not null,
  network_id int,
  partner_id int
);

create table if not exists gl_entries (
  id serial primary key,
  idempotency_key text not null unique,
  kind text not null,
  memo text not null default '',
  source text not null default '',
  actor_id text not null,
  reverses_id int references gl_entries (id),
  created_at timestamptz not null default now()
);

create table if not exists gl_lines (
  id serial primary key,
  entry_id int not null references gl_entries (id),
  account_code text not null,
  account_name text not null,
  currency text not null,
  debit numeric(18, 4) not null default 0,
  credit numeric(18, 4) not null default 0,
  network_id int,
  partner_id int,
  is_demo boolean not null default false,
  cost_center text not null default '',
  check (debit >= 0 and credit >= 0)
);

create table if not exists network_transfers (
  id serial primary key,
  reference text not null unique,
  network_id int not null references transfer_networks (id),
  corridor_id int references corridors (id),
  send_partner_id int references finance_partners (id),
  recv_partner_id int references finance_partners (id),
  direction text not null check (direction in ('out', 'in')),
  currency text not null,
  amount numeric(18, 4) not null,
  fee numeric(18, 4) not null default 0,
  company_share numeric(18, 4) not null default 0,
  partner_share numeric(18, 4) not null default 0,
  plan_id int,
  status text not null default 'posted' check (status in ('posted', 'failed', 'rejected', 'void')),
  note text not null default '',
  cost_center text not null default '',
  is_demo boolean not null default false,
  gl_entry_id int references gl_entries (id),
  actor_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists balance_holds (
  id serial primary key,
  network_id int not null references transfer_networks (id),
  partner_id int references finance_partners (id),
  currency text not null,
  amount numeric(18, 4) not null check (amount > 0),
  note text not null default '',
  status text not null default 'active' check (status in ('active', 'released')),
  is_demo boolean not null default false,
  actor_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists settlements (
  id serial primary key,
  code text not null unique,
  network_id int not null references transfer_networks (id),
  partner_id int references finance_partners (id),
  currency text not null,
  period_start date not null,
  period_end date not null,
  system_amount numeric(18, 4) not null,
  statement_amount numeric(18, 4) not null,
  difference numeric(18, 4) not null,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved')),
  note text not null default '',
  documents text not null default '',
  cost_center text not null default '',
  is_demo boolean not null default false,
  created_by text not null,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists settlement_diffs (
  id serial primary key,
  settlement_id int not null references settlements (id),
  note text not null,
  amount numeric(18, 4) not null,
  created_at timestamptz not null default now()
);

create table if not exists network_agreements (
  id serial primary key,
  code text not null unique,
  network_id int references transfer_networks (id),
  partner_id int references finance_partners (id),
  kind text not null default 'تعامل',
  signed_on date,
  starts_on date,
  ends_on date,
  terms text not null default '',
  commission_note text not null default '',
  limits_note text not null default '',
  obligations text not null default '',
  documents text not null default '',
  status text not null default 'draft' check (status in ('draft', 'active', 'expired', 'terminated')),
  alert_days int not null default 30,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists network_integrations (
  id serial primary key,
  network_id int not null unique references transfer_networks (id),
  provider text not null default '',
  mode text not null default 'manual' check (mode in ('rest', 'webhook', 'file', 'direct', 'manual')),
  api_base text not null default '',
  sandbox_base text not null default '',
  secret_enc text not null default '',
  secret_hint text not null default '',
  status text not null default 'untested' check (status in ('untested', 'manual', 'down')),
  last_ok_at timestamptz,
  last_sync_at timestamptz,
  last_error text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists integration_logs (
  id serial primary key,
  integration_id int not null references network_integrations (id),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists network_services (
  network_id int not null references transfer_networks (id),
  service_code text not null,
  enabled boolean not null default false,
  approved boolean not null default false,
  primary key (network_id, service_code)
);

create index if not exists network_transfers_network_idx on network_transfers (network_id, created_at desc);
create index if not exists gl_lines_account_idx on gl_lines (account_code);

insert into transfer_networks (
  code, name_ar, name_en, kind, country, status, notes, is_demo, fee_note, commission_note
)
select
  'DEMO-NET',
  'شبكة تجريبية',
  'Sample network',
  'local_ye',
  'اليمن',
  'active',
  'سجل للتجربة فقط. ليس شبكة عاملة ولا يمثل شركة حقيقية، ولا يدخل في مؤشرات التشغيل.',
  true,
  'لا رسوم حقيقية',
  'لا عمولة تشغيلية'
where not exists (select 1 from transfer_networks where code = 'DEMO-NET');

insert into finance_partners (
  code, trade_name, legal_name, kind, country, city, status, notes, is_demo, license_no, regulator
)
select
  'DEMO-PTR',
  'شريك تجريبي',
  'سجل تجريبي غير تشغيلي',
  'exchange',
  'اليمن',
  'مأرب',
  'active',
  'ليس شريكاً حقيقياً. أرقام الترخيص تُترك فارغة حتى تُسلَّم.',
  true,
  '',
  ''
where not exists (select 1 from finance_partners where code = 'DEMO-PTR');

insert into network_links (network_id, partner_id, services, currencies, notes, status)
select n.id, p.id, 'send,receive', 'YER,SAR', 'علاقة تجريبية لتجربة الربط.', 'active'
from transfer_networks n
join finance_partners p on p.code = 'DEMO-PTR'
where n.code = 'DEMO-NET'
  and not exists (
    select 1 from network_links l where l.network_id = n.id and l.partner_id = p.id
  );

insert into corridors (
  send_country, recv_country, network_id, send_partner_id, recv_partner_id,
  currencies, fee_note, eta_note, status, is_demo
)
select 'السعودية', 'اليمن', n.id, p.id, p.id, 'SAR,YER', 'تجريبي — لا رسوم منشورة', 'غير محدد', 'inactive', true
from transfer_networks n
join finance_partners p on p.code = 'DEMO-PTR'
where n.code = 'DEMO-NET'
  and not exists (select 1 from corridors c where c.network_id = n.id and c.is_demo = true);

insert into network_services (network_id, service_code, enabled, approved)
select n.id, s.code, false, false
from transfer_networks n
cross join (values
  ('send'), ('receive'), ('account'), ('bank'), ('wallet'),
  ('international'), ('local'), ('inquiry'), ('cancel'), ('refund')
) as s(code)
where n.code = 'DEMO-NET'
  and not exists (
    select 1 from network_services ns where ns.network_id = n.id and ns.service_code = s.code
  );
