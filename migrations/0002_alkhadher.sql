create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  phone text not null default '',
  email text not null default '',
  address_ar text not null default '',
  address_en text not null default '',
  hours_ar text not null default '',
  hours_en text not null default '',
  whatsapp text not null default '',
  facebook text not null default '',
  x_url text not null default '',
  instagram text not null default '',
  about_ar text not null default '',
  about_en text not null default '',
  vision_ar text not null default '',
  vision_en text not null default '',
  mission_ar text not null default '',
  mission_en text not null default '',
  values_ar text not null default '',
  values_en text not null default '',
  goals_ar text not null default '',
  goals_en text not null default '',
  commitment_ar text not null default '',
  commitment_en text not null default '',
  transparency_ar text not null default '',
  transparency_en text not null default '',
  legal_ar text not null default '',
  legal_en text not null default '',
  rates_disclaimer_ar text not null default '',
  rates_disclaimer_en text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists services (
  slug text primary key,
  title_ar text not null,
  title_en text not null,
  summary_ar text not null,
  summary_en text not null,
  body_ar text not null,
  body_en text not null,
  steps_ar jsonb not null default '[]'::jsonb,
  steps_en jsonb not null default '[]'::jsonb,
  requirements_ar jsonb not null default '[]'::jsonb,
  requirements_en jsonb not null default '[]'::jsonb,
  fees_ar text not null,
  fees_en text not null,
  sort_order int not null,
  published boolean not null default true
);

create table if not exists faqs (
  id serial primary key,
  service_slug text references services (slug) on delete set null,
  question_ar text not null,
  question_en text not null,
  answer_ar text not null,
  answer_en text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists rates (
  id serial primary key,
  code text not null unique,
  name_ar text not null,
  name_en text not null,
  buy numeric(18, 4) not null,
  sell numeric(18, 4) not null,
  direction text not null default 'flat' check (direction in ('up', 'down', 'flat')),
  is_demo boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists branches (
  id serial primary key,
  kind text not null default 'branch' check (kind in ('branch', 'agent')),
  name_ar text not null,
  name_en text not null,
  governorate_ar text not null,
  governorate_en text not null,
  city_ar text not null,
  city_en text not null,
  address_ar text not null default '',
  address_en text not null default '',
  phone text not null default '',
  hours_ar text not null default '',
  hours_en text not null default '',
  services_ar text not null default '',
  services_en text not null default '',
  lat numeric(9, 6),
  lng numeric(9, 6),
  is_demo boolean not null default true,
  active boolean not null default true
);

create index if not exists branches_gov_idx on branches (governorate_ar);

create table if not exists news_posts (
  id serial primary key,
  slug text not null unique,
  kind text not null check (kind in ('news', 'announcement', 'alert', 'update', 'offer')),
  title_ar text not null,
  title_en text not null,
  excerpt_ar text not null,
  excerpt_en text not null,
  body_ar text not null,
  body_en text not null,
  is_demo boolean not null default true,
  published boolean not null default false,
  published_at timestamptz not null default now()
);

create table if not exists profiles (
  user_id text primary key,
  display_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (
    role in ('customer', 'system_admin', 'content', 'rates', 'branches', 'support', 'reports')
  ),
  phone_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inquiries (
  id serial primary key,
  name text not null,
  phone text not null,
  email text not null default '',
  topic text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists inquiries_phone_idx on inquiries (phone, created_at);

create table if not exists support_tickets (
  id serial primary key,
  user_id text not null,
  subject text not null,
  body text not null,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  reply text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists support_tickets_user_idx on support_tickets (user_id);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  title_ar text not null,
  title_en text not null,
  body_ar text not null,
  body_en text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

create table if not exists transfers (
  id serial primary key,
  reference text not null unique,
  pin_hash text not null,
  status text not null check (
    status in ('draft', 'processing', 'sent', 'ready', 'collected', 'cancelled', 'rejected')
  ),
  currency text not null,
  amount numeric(18, 2) not null,
  sender_name text not null default '',
  beneficiary_name text not null default '',
  pickup_city_ar text not null default '',
  pickup_city_en text not null default '',
  user_id text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transfers_user_idx on transfers (user_id);

create table if not exists audit_log (
  id serial primary key,
  actor_id text not null,
  action text not null,
  entity text not null,
  entity_id text not null default '',
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_idx on audit_log (created_at desc);

create table if not exists idempotency_keys (
  key text primary key,
  scope text not null,
  created_at timestamptz not null default now()
);

create table if not exists rate_limits (
  bucket text primary key,
  hits int not null,
  window_start timestamptz not null
);

insert into site_settings (
  id, about_ar, about_en, vision_ar, vision_en, mission_ar, mission_en,
  values_ar, values_en, goals_ar, goals_en, commitment_ar, commitment_en,
  transparency_ar, transparency_en, legal_ar, legal_en,
  rates_disclaimer_ar, rates_disclaimer_en, hours_ar, hours_en
) values (
  1,
  'الخضر للصرافة والتحويلات شركة تعمل في قطاع الصرافة والتحويلات المالية في الجمهورية اليمنية. هذه المنصة نافذة رقمية للتعرّف على الخدمات، ومتابعة لوحة أسعار معلَّمة بوضوح، والاستعلام عن حالة الحوالة بعد التحقق، والتواصل مع الشركة. لا تُنفَّذ من الموقع عمليات مالية مباشرة قبل الربط بنظام الشركة المعتمد.',
  'Al Khadher Exchange & Money Transfers operates in currency exchange and remittances in the Republic of Yemen. This platform is a digital window for services, a clearly labeled rate board, transfer-status lookup after verification, and contact with the company. It does not execute financial transactions until it is connected to the company''s approved core system.',
  'أن تكون وجهتنا الرقمية واضحة وموثوقة لعملاء الصرافة والتحويلات، دون مبالغة في ما لم يُعتمد بعد.',
  'A clear and trustworthy digital front for exchange and transfer clients, without claims that have not been approved.',
  'تيسير الوصول إلى معلومات الخدمات والفروع وأسعار الصرف الإرشادية، وحماية بيانات الحوالة من الظهور قبل التحقق.',
  'Make service, branch, and indicative rate information easy to reach, and keep transfer details hidden until verified.',
  'الوضوح قبل الوعد. أقل قدر من البيانات. عدم عرض رقم أو عنوان أو رسم لم تعتمده الشركة. الفصل بين التصفح العام والوظائف التي تحتاج صلاحية.',
  'Clarity before promises. Minimum data. No unpublished number, address, or fee. A hard split between public browsing and privileged actions.',
  'إتاحة الاستعلام عن حالة الحوالة، وتنظيم محتوى الخدمات والأخبار، وتهيئة طبقة تكامل يمكن ربطها لاحقاً بنظام الخضر المركزي.',
  'Offer transfer-status lookup, keep service and news content manageable, and prepare an integration layer for the future core system.',
  'الاستجابة لطلبات التواصل والدعم من خلال قنوات توثّق الطلب ولا تدّعي تنفيذاً مالياً لم يتم.',
  'Answer contact and support requests through recorded channels, without claiming a financial action that did not happen.',
  'ما هو تجريبي يُوسَم تجريبياً. ما لم يُستلم من الشركة يبقى فارغاً حتى تُدخله الإدارة. سجل التدقيق لا يُحرَّر من الواجهة.',
  'Demo data stays labeled as demo. Facts not supplied by the company stay empty until an administrator enters them. The audit log cannot be edited from the interface.',
  'لم تُزوَّد هذه النسخة برقم ترخيص أو سجل تجاري أو تاريخ تأسيس. لن يُعرض أي من ذلك حتى تعتمده الشركة من لوحة التحكم. لا تُعد هذه الصفحة مستنداً نظامياً.',
  'This release was not given a license number, commercial registration, or founding date. None of those will be shown until the company enters them. This page is not a regulatory certificate.',
  'الأرقام أدناه نماذج توضيحية مخزّنة في النظام لتجربة اللوحة والمحوّل. ليست أسعار سوق وليست أسعاراً تنفيذية.',
  'The figures below are illustrative samples stored so the board and converter can be tried. They are not market prices and not executable quotes.',
  'تُحدَّد ساعات العمل لكل فرع بعد اعتماد بياناته.',
  'Working hours are set per branch once its record is approved.'
) on conflict (id) do nothing;

insert into services (
  slug, title_ar, title_en, summary_ar, summary_en, body_ar, body_en,
  steps_ar, steps_en, requirements_ar, requirements_en, fees_ar, fees_en, sort_order
) values
(
  'currency-exchange',
  'شراء وبيع العملات',
  'Currency buy and sell',
  'صرف العملات المعتمدة لدى الشركة وفق السعر المعلن في نقطة الخدمة.',
  'Exchange of currencies the company actually handles, at the rate stated at the service point.',
  'تُنفَّذ عملية الصرف حضورياً في فرع أو لدى وكيل معتمد بعد إبراز السعر للعميل. اللوحة الرقمية هنا للعرض والمتابعة، ولا تُنشئ أمر شراء أو بيع ملزماً.',
  'Exchange is completed in person at a branch or approved agent after the rate is shown to the customer. The digital board is for display and follow-up. It does not create a binding buy or sell order.',
  '["زيارة نقطة خدمة معتمدة","الاطلاع على سعر الشراء أو البيع قبل التنفيذ","تقديم إثبات الهوية وفق سياسة الشركة","استلام المبلغ وإيصال العملية"]'::jsonb,
  '["Visit an approved service point","Read the buy or sell rate before the deal","Present identification as required by company policy","Collect the amount and the receipt"]'::jsonb,
  '["هوية سارية وفق ما تطلبه نقطة الخدمة","العملة بحالة مقبولة للعد والفحص","الالتزام بالحدود التي تعلنها الشركة في الفرع"]'::jsonb,
  '["Valid identification as required at the counter","Currency in a condition that can be counted and checked","Limits announced by the company at the branch"]'::jsonb,
  'لا يُعرض رسم ثابت هنا. أي عمولة تُذكر في نقطة الخدمة قبل إتمام العملية.',
  'No fixed fee is published here. Any commission is stated at the service point before the deal is completed.',
  1
),
(
  'transfers',
  'التحويلات المالية',
  'Money transfers',
  'إرسال واستلام الحوالات مع رقم مرجعي ورمز تحقق لمتابعة الحالة فقط.',
  'Send and receive transfers with a reference and a verification code that reveal status only.',
  'بعد تسجيل الحوالة في نظام الشركة يحصل العميل على رقم حوالة ورمز تحقق. المنصة تعرض حالة الحوالة بعد مطابقتهما، ولا تعرض اسم المرسل أو المستفيد أو المبلغ للزائر.',
  'Once the company system records a transfer, the customer receives a reference and a verification code. The platform shows status only after both match. Visitors never see sender, beneficiary, or amount.',
  '["تسجيل الحوالة في نقطة الخدمة","استلام الرقم المرجعي ورمز التحقق","متابعة الحالة من صفحة الحوالات","الاستلام أو التسليم وفق الحالة المعتمدة"]'::jsonb,
  '["Register the transfer at a service point","Keep the reference and verification code","Follow status on the transfers page","Collect or deliver according to the confirmed status"]'::jsonb,
  '["بيانات مطابقة لهوية المرسل والمستفيد حسب سياسة الشركة","رقم حوالة صادر من النظام","رمز تحقق لا يُشارك إلا مع صاحب الحق"]'::jsonb,
  '["Identity details required by company policy","A reference issued by the system","A verification code shared only with the entitled party"]'::jsonb,
  'رسوم الحوالة تُحسب عند الإنشاء في نقطة الخدمة ولا تُقدَّر على الموقع.',
  'Transfer fees are calculated when the transfer is created at the service point, not estimated on the website.',
  2
),
(
  'local-remittance',
  'الحوالات المحلية',
  'Local remittances',
  'تحويل داخل المدن والمحافظات التي تغطيها شبكة الفروع والوكلاء بعد اعتمادها.',
  'Transfers inside cities and governorates covered by the branch and agent network once that network is approved.',
  'الحوالة المحلية تُسلَّم عبر فرع أو وكيل ظاهر في دليل الشبكة. النقاط التجريبية على الموقع ليست مكاتب عاملة حتى تزيل الإدارة وسم التجربة.',
  'A local transfer is paid out through a branch or agent listed in the network directory. Demo points on the site are not operating offices until an administrator removes the demo flag.',
  '["تحديد مدينة الاستلام من الشبكة المعتمدة","إنشاء الحوالة وأخذ الرقم المرجعي","إبلاغ المستفيد بالرقم ورمز التحقق","الاستلام بعد التحقق من الهوية"]'::jsonb,
  '["Choose a payout city from the approved network","Create the transfer and take the reference","Give the beneficiary the reference and code","Collect after identity is checked"]'::jsonb,
  '["مدينة استلام ضمن الشبكة المعتمدة","هوية المستفيد عند الصرف","رمز التحقق"]'::jsonb,
  '["A payout city inside the approved network","Beneficiary identification at payout","The verification code"]'::jsonb,
  'تُعرض الرسوم محلياً في إيصال الإنشاء، لا على هذه الصفحة.',
  'Fees appear on the creation receipt at the counter, not on this page.',
  3
),
(
  'international-remittance',
  'الحوالات الدولية',
  'International remittances',
  'إرسال واستقبال حوالات خارجية عند توفر شريك معتمد ومسار نظامي.',
  'Inbound and outbound international transfers when an approved partner and a lawful corridor exist.',
  'لم يُربط الموقع بأي بنك أو شركة تحويل دولية. صفحة الخدمة تشرح المسار التشغيلي المتوقع، ولا تدّعي تنفيذ حوالة دولية من المتصفح.',
  'The site is not connected to any bank or international money-transfer company. This page describes the expected operating path. It does not send an international transfer from the browser.',
  '["التأكد من أن المسار متاح في الفرع","استكمال بيانات المرسل والمستفيد","مراجعة الرسوم وسعر الصرف قبل التأكيد","متابعة الحالة بالرقم المرجعي"]'::jsonb,
  '["Confirm the corridor is available at the branch","Complete sender and beneficiary details","Review fees and the exchange rate before confirming","Track status with the reference"]'::jsonb,
  '["غرض تحويل مقبول حسب سياسة الشركة","بيانات مستفيد كافية للشريك عند الاعتماد","مستندات تطلبها نقطة الخدمة"]'::jsonb,
  '["A purpose accepted under company policy","Beneficiary details sufficient for the partner once approved","Documents requested at the service point"]'::jsonb,
  'لا توجد تعرفة دولية منشورة في هذه النسخة.',
  'No international tariff is published in this release.',
  4
),
(
  'corporate',
  'خدمات الشركات والتجار',
  'Corporate and merchant services',
  'ترتيب صرف وتحويلات لحسابات الأعمال عبر مسؤول خدمة الشركات.',
  'Exchange and transfer arrangements for business accounts through the corporate desk.',
  'تخدم هذه القناة التجار والشركات التي تحتاج تنسيقاً مسبقاً. الطلب يُسجَّل كنموذج تواصل، ولا يفتح حساباً بنكياً ولا يحرّك رصيداً.',
  'This desk is for merchants and companies that need prior coordination. A request is stored as a contact record. It does not open a bank account or move a balance.',
  '["إرسال طلب من صفحة التواصل مع تحديد النوع","مراجعة الطلب من خدمة العملاء","تحديد المستندات المطلوبة","استكمال التعامل في نقطة الخدمة"]'::jsonb,
  '["Send a request from the contact page and choose the topic","Customer service reviews the request","Required documents are specified","The relationship is completed at a service point"]'::jsonb,
  '["بيانات المنشأة كما ستعتمدها الشركة لاحقاً","مفوّض بالتواصل","وصف واضح للاحتياج"]'::jsonb,
  '["Entity details the company will later approve","An authorized contact","A clear description of the need"]'::jsonb,
  'التسعير المؤسسي يُتفق عليه خارج الموقع.',
  'Institutional pricing is agreed outside the website.',
  5
),
(
  'agents',
  'خدمات العملاء والوكلاء',
  'Customers and agents',
  'تعريف بمسار الوكيل المعتمد وقنوات متابعة العميل.',
  'How an approved agent relationship works, and how a customer follows up.',
  'الوكيل يظهر في الدليل بعد إضافته من لوحة الفروع. لا يُمنح أي زائر صفة وكيل بمجرد إنشاء حساب على المنصة.',
  'An agent appears in the directory only after being added from the branch desk. Creating a website account does not make a visitor an agent.',
  '["تقديم طلب الوكالة عبر التواصل","مراجعة داخلية حسب سياسة الشركة","إضافة نقطة الوكيل إلى الدليل عند الاعتماد","التزام الوكيل بإجراءات التحقق عند الصرف"]'::jsonb,
  '["Apply through the contact form","Internal review under company policy","The agent point is added to the directory once approved","The agent follows payout verification procedures"]'::jsonb,
  '["طلب مكتوب","بيانات تواصل صحيحة","عدم استخدام هذه الصفحة كتفويض قائم بذاته"]'::jsonb,
  '["A written request","Accurate contact details","This page is not itself an authorization"]'::jsonb,
  'عمولات الوكلاء اتفاق تشغيلي ولا تُنشر هنا كأرقام.',
  'Agent commissions are an operating agreement and are not published here as figures.',
  6
)
on conflict (slug) do nothing;

insert into faqs (service_slug, question_ar, question_en, answer_ar, answer_en, sort_order)
select * from (values
  (null::text, 'هل الأسعار على الموقع قابلة للتنفيذ؟', 'Are the rates on the site executable?', 'لا، ما لم تُزل الإدارة وسم التجربة وتربط اللوحة بمصدر تعتمده الشركة. السعر الملزم هو المعلن في نقطة الخدمة وقت العملية.', 'No, unless an administrator removes the demo flag and connects the board to a source the company approves. The binding rate is the one stated at the service point.', 1),
  (null::text, 'ماذا يظهر عند الاستعلام عن حوالة؟', 'What does a transfer lookup show?', 'بعد صحة الرقم ورمز التحقق تظهر الحالة فقط، مع عملة الحوالة ومدينة الاستلام إن وُجدت. لا يظهر الاسم ولا المبلغ ولا الهاتف.', 'After the reference and code match, only status is shown, plus currency and payout city when present. Name, amount, and phone stay hidden.', 2),
  (null::text, 'هل أستطيع إرسال حوالة من الموقع؟', 'Can I send a transfer from the website?', 'لا. الإنشاء يتم في نظام الشركة عبر الفرع أو الوكيل. الموقع للمتابعه والتواصل وإدارة المحتوى.', 'No. Creation happens in the company system at a branch or agent. The website is for follow-up, contact, and content.', 3),
  ('currency-exchange', 'أي عملات تظهر في اللوحة؟', 'Which currencies appear on the board?', 'تُزرع الدولار والريال السعودي كنماذج. يمكن لمسؤول الأسعار إضافة عملات أخرى، ومنها الريال اليمني القديم عند اعتماد سياسة الشركة.', 'US dollar and Saudi riyal are seeded as samples. The rates officer can add others, including the old Yemeni rial once company policy exists.', 4),
  ('local-remittance', 'لماذا بعض الفروع موسومة بأنها تجريبية؟', 'Why are some branches marked demo?', 'لأن الشركة لم تزوّد هذه النسخة بعناوين رسمية. النقاط الظاهرة أمثلة قابلة للحذف حتى تُدخل الإدارة الفروع الحقيقية.', 'Because the company did not supply official addresses for this release. Visible points are examples an administrator can delete until real branches are entered.', 5),
  ('international-remittance', 'هل الموقع متصل بشريك تحويل دولي؟', 'Is the site connected to an international partner?', 'غير متصل. لا يوجد تكامل مع بنك أو شبكة تحويل في هذه النسخة، ولن يُحاكى اتصال غير موجود.', 'It is not. There is no bank or transfer-network integration in this release, and a missing connection is not simulated.', 6)
) as seed(service_slug, question_ar, question_en, answer_ar, answer_en, sort_order)
where not exists (select 1 from faqs);

insert into rates (code, name_ar, name_en, buy, sell, direction, is_demo, sort_order)
values
  ('USD', 'دولار أمريكي', 'US dollar', 100.0000, 102.0000, 'flat', true, 1),
  ('SAR', 'ريال سعودي', 'Saudi riyal', 26.0000, 27.0000, 'flat', true, 2)
on conflict (code) do nothing;

insert into branches (
  kind, name_ar, name_en, governorate_ar, governorate_en, city_ar, city_en,
  address_ar, address_en, phone, hours_ar, hours_en, services_ar, services_en, is_demo, active
)
select * from (values
  ('branch', 'نموذج فرع — عدن', 'Sample branch — Aden', 'عدن', 'Aden', 'عدن', 'Aden', 'عنوان غير رسمي، يُستبدل من لوحة التحكم', 'Unofficial placeholder address, replace it from the console', '', 'بانتظار الاعتماد', 'Pending approval', 'صرف، حوالات محلية', 'Exchange, local transfers', true, true),
  ('branch', 'نموذج فرع — أمانة العاصمة', 'Sample branch — Capital', 'أمانة العاصمة', 'Capital', 'صنعاء', 'Sana''a', 'عنوان غير رسمي، يُستبدل من لوحة التحكم', 'Unofficial placeholder address, replace it from the console', '', 'بانتظار الاعتماد', 'Pending approval', 'صرف، حوالات', 'Exchange, transfers', true, true),
  ('agent', 'نموذج وكيل — تعز', 'Sample agent — Taiz', 'تعز', 'Taiz', 'تعز', 'Taiz', 'نقطة تعريفية وليست وكيلاً معتمداً بعد', 'An illustrative point, not yet an approved agent', '', 'بانتظار الاعتماد', 'Pending approval', 'استلام حوالات', 'Transfer payout', true, true)
) as seed(kind, name_ar, name_en, governorate_ar, governorate_en, city_ar, city_en, address_ar, address_en, phone, hours_ar, hours_en, services_ar, services_en, is_demo, active)
where not exists (select 1 from branches);

insert into news_posts (slug, kind, title_ar, title_en, excerpt_ar, excerpt_en, body_ar, body_en, is_demo, published)
values
(
  'demo-rates-notice',
  'alert',
  'تنبيه: لوحة الأسعار تجريبية',
  'Notice: the rate board is a sample',
  'الأرقام المزروعة في اللوحة ليست أسعار السوق ولا أسعاراً تنفيذية.',
  'Figures seeded on the board are neither market prices nor executable quotes.',
  'أُضيفت أسعار الدولار والريال السعودي بأرقام دائرية حتى يمكن تجربة اللوحة ومحوّل العملات. مسؤول الأسعار يستطيع تعديلها. يبقى وسم التجربة ظاهراً ما دام الحقل مفعّلاً، حتى لا تُقرأ اللوحة كسعر ملزم.',
  'Dollar and Saudi riyal prices were added as round figures so the board and converter can be tried. The rates officer can edit them. The demo flag stays visible while enabled, so the board is not read as a binding quote.',
  true,
  true
),
(
  'how-to-track',
  'update',
  'كيف تُستعلم عن حالة حوالة',
  'How to look up a transfer',
  'يلزم رقم الحوالة ورمز التحقق، والنتيجة حالة فقط.',
  'You need the reference and the verification code. The result is status only.',
  'من صفحة الحوالات أدخل الرقم والرمز. إن تطابقا تظهر الحالة: قيد الإنشاء، قيد المعالجة، تم الإرسال، جاهزة للاستلام، تم الاستلام، ملغاة، أو مرفوضة. الأمثلة KH-24081 وKH-24082 وKH-24083 بيانات تجريبية مزروعة للتجربة.',
  'On the transfers page enter the reference and code. If they match, status is one of: draft, processing, sent, ready for pickup, collected, cancelled, or rejected. Samples KH-24081, KH-24082, and KH-24083 are seeded demo records.',
  true,
  true
),
(
  'branches-pending',
  'announcement',
  'دليل الفروع بانتظار البيانات الرسمية',
  'The branch directory is waiting for official data',
  'النقاط الظاهرة نماذج حتى تُدخل الإدارة العناوين المعتمدة.',
  'Visible points are samples until administrators enter approved addresses.',
  'لم يُسلَّم عنوان أو هاتف رسمي مع طلب بناء المنصة. لذلك أُضيفت ثلاث نقاط موسومة بأنها تجريبية، ويمكن إيقافها أو استبدالها من لوحة الفروع. الخريطة تُرسم فقط عند حفظ إحداثيات حقيقية.',
  'No official address or phone was supplied with the build request. Three points marked as demo were added and can be retired or replaced from the branch console. A map link appears only after real coordinates are saved.',
  true,
  true
)
on conflict (slug) do nothing;

insert into transfers (
  reference, pin_hash, status, currency, amount, sender_name, beneficiary_name,
  pickup_city_ar, pickup_city_en, is_demo
)
values
(
  'KH-24081',
  '5010c493958a86e59cdc3b94179856b6c2fea01c7e1b293ff115706c4ff4d6dc',
  'ready',
  'USD',
  1500.00,
  'مرسل تجريبي',
  'مستفيد تجريبي',
  'عدن',
  'Aden',
  true
),
(
  'KH-24082',
  '81ef440003f4e8657159bdad09aabc798a29d6b12cdf450b842cb414c7452db5',
  'processing',
  'SAR',
  4000.00,
  'مرسل تجريبي',
  'مستفيد تجريبي',
  'تعز',
  'Taiz',
  true
),
(
  'KH-24083',
  'c838df5335c1eba2532f32090cd555d17c9e218289d99ecaf55525d7b199aa88',
  'collected',
  'USD',
  800.00,
  'مرسل تجريبي',
  'مستفيد تجريبي',
  'صنعاء',
  'Sana''a',
  true
)
on conflict (reference) do nothing;
