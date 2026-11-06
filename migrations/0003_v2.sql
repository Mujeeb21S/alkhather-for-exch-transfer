alter table rates add column if not exists change_pct numeric(8, 4) not null default 0;
alter table rates add column if not exists region text not null default '';
alter table rates add column if not exists is_base boolean not null default false;

alter table rates drop constraint if exists rates_code_key;
create unique index if not exists rates_code_region_uidx on rates (code, region);

insert into rates (code, name_ar, name_en, buy, sell, direction, is_demo, sort_order, change_pct, region, is_base)
values
  ('YER', 'ريال يمني', 'Yemeni rial', 1, 1, 'flat', false, 0, 0, '', true),
  ('AED', 'درهم إماراتي', 'UAE dirham', 27, 28, 'flat', true, 3, 0, '', false),
  ('OMR', 'ريال عُماني', 'Omani rial', 260, 265, 'flat', true, 4, 0, '', false),
  ('QAR', 'ريال قطري', 'Qatari riyal', 27, 28, 'flat', true, 5, 0, '', false),
  ('KWD', 'دينار كويتي', 'Kuwaiti dinar', 320, 328, 'flat', true, 6, 0, '', false),
  ('EUR', 'يورو', 'Euro', 108, 111, 'flat', true, 7, 0, '', false),
  ('GBP', 'جنيه إسترليني', 'Sterling pound', 125, 129, 'flat', true, 8, 0, '', false)
on conflict (code, region) do nothing;

delete from transfers
where is_demo = true
  and reference in ('KH-24081', 'KH-24082', 'KH-24083');

update news_posts
set
  body_ar = 'من صفحة الحوالات أدخل الرقم المرجعي ورمز التحقق الصادرين من نقطة الخدمة. إن تطابقا تظهر الحالة فقط: قيد الإنشاء، قيد المعالجة، تم الإرسال، جاهزة للاستلام، تم الاستلام، ملغاة، أو مرفوضة، مع مدينة الاستلام وتعليمات عامة. لا تُعرض أمثلة برموز تحقق على الموقع.',
  body_en = 'On the transfers page enter the reference and verification code issued at the service point. If they match, only status is shown, plus payout city and general instructions. Sample codes are not published on the site.',
  excerpt_ar = 'الاستعلام يطلب الرقم والرمز الصادرين من الفرع، ولا ينشر رموزاً تجريبية.',
  excerpt_en = 'Lookup needs the reference and code issued at the branch. Sample codes are not published.'
where slug = 'how-to-track';

create table if not exists partners (
  id serial primary key,
  name_ar text not null,
  name_en text not null,
  kind text not null default 'network',
  note_ar text not null default '',
  note_en text not null default '',
  url text not null default '',
  is_demo boolean not null default true,
  published boolean not null default false,
  sort_order int not null default 0
);

create table if not exists managed_pages (
  slug text primary key,
  title_ar text not null,
  title_en text not null,
  body_ar text not null,
  body_en text not null,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists complaints (
  id serial primary key,
  reference text not null unique,
  pin_hash text not null,
  name text not null,
  phone text not null,
  email text not null default '',
  topic text not null,
  message text not null,
  status text not null default 'received' check (status in ('received', 'reviewing', 'closed')),
  reply text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id serial primary key,
  title_ar text not null,
  title_en text not null,
  city_ar text not null default '',
  city_en text not null default '',
  body_ar text not null,
  body_en text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists job_applications (
  id serial primary key,
  job_id int references jobs (id) on delete set null,
  name text not null,
  phone text not null,
  email text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

insert into managed_pages (slug, title_ar, title_en, body_ar, body_en)
values
(
  'privacy',
  'سياسة الخصوصية',
  'Privacy',
  'نجمع من النماذج الاسم ورقم الهاتف والبريد ونص الرسالة لنرد على الطلب. الاستعلام عن الحوالة لا يخزّن الاسم الظاهر للزائر، ويعرض الحالة فقط بعد الرمز. لا نبيع هذه البيانات. يمكن للإدارة تعديل هذا النص، وهو ليس بديلاً عن سياسة قانونية معتمدة من مستشار الشركة.',
  'Forms collect a name, phone, email, and message so the desk can reply. Transfer lookup does not show party names and returns status only after the code matches. Data is not sold. Administrators can edit this text. It is not a substitute for a policy approved by the company''s counsel.'
),
(
  'terms',
  'شروط الاستخدام',
  'Terms of use',
  'الموقع للتعريف والمتابعة والتواصل. لا يُنشئ أمراً ملزماً بالصرف أو بالحوالة. السعر الملزم هو المعلن في نقطة الخدمة. استخدام النماذج يعني الموافقة على مراجعة الطلب من الموظفين المختصين.',
  'The site is for information, follow-up, and contact. It does not create a binding exchange or transfer order. The binding rate is the one stated at the service point. Sending a form allows the relevant staff to review it.'
),
(
  'compliance',
  'سياسة الامتثال',
  'Compliance',
  'تلتزم نقطة الخدمة بطلب المستندات التي تحددها الشركة قبل تنفيذ أي عملية. هذه الصفحة تصف المبدأ ولا تنشر رقم ترخيص أو تعميماً لم يُسلَّم للمنصة. النص قابل للتعديل من لوحة المحتوى.',
  'The service point requests the documents the company requires before any transaction. This page states the principle. It does not publish a license number or circular that was not given to the platform. Content staff can edit the text.'
),
(
  'aml',
  'مكافحة غسل الأموال وتمويل الإرهاب',
  'AML and CFT',
  'قد تُرفض عملية أو يُطلب مستند إضافي عند الاشتباه، وفق سياسة الشركة والالتزامات النظامية المطبقة في نقطة الخدمة. الموقع لا يتخذ قرار إبلاغ جهة رقابية بنفسه ولا يدّعي اعتماداً لم يُثبت.',
  'A transaction may be refused or extra documents requested when suspicion arises, under company policy and the rules that apply at the service point. The website does not itself file a regulatory report and does not claim an approval it was not given.'
),
(
  'kyc',
  'اعرف عميلك',
  'Know your customer',
  'التعرف على العميل يتم في الفرع أو لدى الوكيل المعتمد عبر الهوية والمستندات التي تطلبها الشركة. إنشاء حساب على الموقع لا يُعد تعرفاً مكتمل الهوية، ورقم الهاتف المحفوظ فيه غير موثّق برسالة نصية.',
  'Customer identification happens at a branch or approved agent with the identity documents the company requires. A website account is not completed identification, and a saved phone number is not verified by SMS.'
),
(
  'fraud',
  'التحذيرات الأمنية',
  'Fraud warnings',
  'لا تطلب الشركة رمز التحقق أو كلمة المرور عبر قنوات غير معروفة. لا ترسل مبلغاً لشخص يدّعي أنه موظف دون التأكد من رقم الفرع المعتمد في هذه المنصة بعد نشره من الإدارة. أبلغ عن حالة مشتبه بها عبر مركز الشكاوى.',
  'The company does not ask for a verification code or password through unknown channels. Do not send money to someone claiming to be staff unless you have confirmed an official branch number published here by an administrator. Report a suspicious case through the complaints desk.'
)
on conflict (slug) do nothing;
