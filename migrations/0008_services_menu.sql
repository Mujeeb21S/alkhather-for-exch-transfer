update services set published = false
where slug in ('currency-exchange', 'transfers', 'local-remittance', 'international-remittance', 'agents');

update services set
  title_ar = 'خدمات الشركات وكبار العملاء',
  title_en = 'Companies and major clients',
  summary_ar = 'تنسيق الصرف والتحويلات للشركات وكبار العملاء عبر نقطة الخدمة، بعد تسجيل الطلب.',
  summary_en = 'Exchange and transfer arrangements for companies and major clients, arranged at a service point after a request is logged.',
  sort_order = 2,
  published = true
where slug = 'corporate';

insert into services (
  slug, title_ar, title_en, summary_ar, summary_en, body_ar, body_en,
  steps_ar, steps_en, requirements_ar, requirements_en, fees_ar, fees_en, sort_order
) values
(
  'individuals',
  'خدمات الأفراد',
  'Individual services',
  'صرف وتحويلات للأفراد تُنجز في الفرع. الموقع للتعريف والمتابعة فقط.',
  'Exchange and transfers for individuals, completed at a branch. The site is for information and follow-up only.',
  $b$خدمات الأفراد تشمل الصرف والحوالات التي يطلبها الشخص لنفسه أو لأسرته. التنفيذ في الفرع أو لدى الوكيل المعتمد، بعد إبراز ما تطلبه نقطة الخدمة. لا تُنشأ العملية من المتصفح.$b$,
  $b$Individual services cover exchange and transfers a person requests for themselves or their family. They are completed at a branch or approved agent, after the documents the service point requires. The browser does not create the transaction.$b$,
  '["زيارة فرع أو وكيل معتمد","إبراز الهوية والمستندات المطلوبة","إتمام الصرف أو الحوالة في نقطة الخدمة","الاحتفاظ بالإيصال والرقم المرجعي"]'::jsonb,
  '["Visit a branch or approved agent","Present identification and any required documents","Complete the exchange or transfer at the counter","Keep the receipt and the reference"]'::jsonb,
  '["هوية حسب ما تطلبه نقطة الخدمة","الحضور أو تفويض تقبله الشركة"]'::jsonb,
  '["Identification as required at the service point","Attendance, or an authorization the company accepts"]'::jsonb,
  'أي رسم يُذكر في نقطة الخدمة قبل إتمام العملية، ولا يُقدَّر هنا.',
  'Any fee is stated at the service point before the transaction, and is not estimated here.',
  1
),
(
  'online',
  'الخضر أونلاين',
  'Al Khadher Online',
  'النافذة الرقمية الحالية: الأسعار، متابعة الحوالة، الفروع، والتواصل.',
  'The current digital window: rates, transfer tracking, branches, and contact.',
  $b$الخضر أونلاين هو اسم القناة الرقمية على هذا الموقع: لوحة الأسعار، محوّل إرشادي، متابعة حالة الحوالة، دليل الفروع، ونموذج التواصل. لم يُرفق تطبيق مستقل، ولا يُنفَّذ بيع أو حوالة من المتصفح.$b$,
  $b$Al Khadher Online is the name of the digital channel on this site: the rate board, an illustrative converter, transfer-status lookup, the branch directory, and the contact form. No separate app was supplied, and neither a sale nor a transfer is executed in the browser.$b$,
  '["فتح لوحة الأسعار أو متابعة الحوالة","إنشاء حساب إن رغبت بربط حوالة أو متابعة طلب","مراجعة الفروع للتوجه إلى نقطة الخدمة"]'::jsonb,
  '["Open the rate board or track a transfer","Create an account if you want to link a transfer or follow a request","Check the branches before going to a service point"]'::jsonb,
  '["رقم الحوالة ورمزها للمتابعة","لا يغني الحساب الرقمي عن الهوية في الفرع"]'::jsonb,
  '["The transfer reference and code for lookup","A website account does not replace identification at the branch"]'::jsonb,
  'لا رسم لاستخدام الصفحات العامة.',
  'There is no fee for using the public pages.',
  3
),
(
  'currency-convert',
  'تحويل عملات',
  'Currency conversion',
  'المحوّل على الموقع إرشادي. السعر الملزم هو المعلن في نقطة الخدمة.',
  'The converter on the site is illustrative. The binding rate is the one stated at the service point.',
  $b$تحويل العملات يتم في الفرع بعد إعلان سعر الشراء أو البيع. المحوّل في صفحة الأسعار يساعد على التقدير فقط، وما دام السعر موسوماً تجريبياً فهو ليس سعر سوق ولا سعر تنفيذ.$b$,
  $b$Currency conversion is done at the branch after the buy or sell rate is stated. The converter on the rates page is only an estimate. While a rate is marked as a sample, it is neither a market price nor an executable quote.$b$,
  '["مراجعة لوحة الأسعار","تأكيد السعر في نقطة الخدمة قبل العد","إتمام التحويل واستلام الإيصال"]'::jsonb,
  '["Review the rate board","Confirm the rate at the service point before counting","Complete the conversion and take the receipt"]'::jsonb,
  '["العملة بحالة قابلة للعد والفحص","هوية حسب طلب نقطة الخدمة"]'::jsonb,
  '["Currency in a condition that can be counted and checked","Identification if the service point asks for it"]'::jsonb,
  'لا تُنشر تعرفة ثابتة هنا.',
  'No fixed tariff is published here.',
  4
),
(
  'track-transfer',
  'تتبع حوالتك',
  'Track your transfer',
  'الحالة وتعليمات الاستلام بعد الرقم والرمز. بلا أسماء وبلا مبلغ.',
  'Status and pickup guidance after the reference and code. No names and no amount.',
  $b$من صفحة الحوالات أدخل الرقم المرجعي ورمز التحقق الصادرين من نقطة الخدمة. إن تطابقا تظهر الحالة ومدينة الاستلام وتعليمات عامة، مع مسار لتقديم شكوى. لا يظهر المرسل ولا المستفيد ولا المبلغ.$b$,
  $b$On the transfers page enter the reference and verification code issued at the service point. If they match, status, payout city, and general instructions are shown, with a path to file a complaint. Sender, beneficiary, and amount stay hidden.$b$,
  '["استلام الرقم والرمز من نقطة الخدمة","إدخالهما في صفحة الحوالات","اتباع تعليمات الحالة","التوجه للفرع عند الجاهزية للاستلام"]'::jsonb,
  '["Take the reference and code from the service point","Enter both on the transfers page","Follow the status instructions","Go to the branch when pickup is ready"]'::jsonb,
  '["الرقم المرجعي","رمز التحقق","هوية المستفيد عند الاستلام"]'::jsonb,
  '["The reference","The verification code","Beneficiary identification at pickup"]'::jsonb,
  'الاستعلام مجاني. رسوم الحوالة نفسها حُسبت عند إنشائها في الفرع.',
  'Lookup is free. The transfer fee itself was calculated when the transfer was created at the branch.',
  5
),
(
  'suggestions',
  'الشكاوى والمقترحات',
  'Complaints and suggestions',
  'نموذج شكوى أو مقترح، مع رقم متابعة يُظهر الحالة والرد فقط.',
  'A complaint or suggestion form, with a tracking number that shows status and the reply only.',
  $b$تُقدَّم الشكوى أو المقترح من صفحة الشكاوى. يظهر رقم ورمز مرة واحدة. المتابعة لا تعرض نص الرسالة للزائر، بل الحالة ورد خدمة العملاء إن وُجد.$b$,
  $b$A complaint or suggestion is sent from the complaints page. A reference and code are shown once. Tracking does not reveal the message text to a visitor, only the status and the customer-service reply when there is one.$b$,
  '["فتح صفحة الشكاوى","كتابة الموضوع والرسالة","حفظ الرقم والرمز","متابعة الحالة لاحقاً بالرقمين"]'::jsonb,
  '["Open the complaints page","Write the topic and the message","Keep the reference and code","Check status later with both"]'::jsonb,
  '["اسم ورقم هاتف","وصف واضح","عدم إرسال رمز حوالة أو كلمة مرور في نص الشكوى"]'::jsonb,
  '["A name and phone number","A clear description","Do not put a transfer code or a password in the complaint text"]'::jsonb,
  'لا رسم لتقديم الشكوى أو المقترح.',
  'There is no fee for a complaint or a suggestion.',
  6
),
(
  'humanitarian',
  'خدمات المنظمات الإنسانية',
  'Humanitarian organizations',
  'خدمات تُرتب مع المنظمة في نقطة الخدمة: التوزيع، الضامن، والإيداع الإنساني.',
  'Services arranged with the organization at a service point: distribution, guarantee, and humanitarian deposit.',
  $b$تقدّم الشركة خدمات للمنظمات الإنسانية وفق اتفاق يُستكمل في الفرع. هذه الصفحات تعرّف بالخدمات الثلاث ولا تدير كشوف المستفيدين ولا تصرف مبلغاً من الموقع.$b$,
  $b$The company offers services for humanitarian organizations under an arrangement completed at the branch. These pages name the three services. They do not manage beneficiary lists or pay out money from the website.$b$,
  '["تواصل المنظمة مع الشركة","تحديد الخدمة المطلوبة","استكمال الاتفاق والمستندات في نقطة الخدمة"]'::jsonb,
  '["The organization contacts the company","The required service is identified","The agreement and documents are completed at a service point"]'::jsonb,
  '["جهة منظمة معروفة للشركة","مفوّض بالتواصل","عدم اعتبار هذه الصفحة اتفاقاً نافذاً"]'::jsonb,
  '["An organization known to the company","An authorized contact","This page is not itself a binding agreement"]'::jsonb,
  'التكلفة تُحدد في الاتفاق، ولا تُنشر هنا.',
  'Cost is set in the agreement and is not published here.',
  7
),
(
  'aid-cash',
  'خدمة توزيع النقد والقسائم',
  'Cash and voucher distribution',
  'توزيع نقد أو قسائم لمستفيدين بالتنسيق مع المنظمة، خارج الموقع.',
  'Cash or voucher distribution to beneficiaries, coordinated with the organization and not run from the site.',
  $b$توزَّع المبالغ أو القسائم عبر تنسيق بين الشركة والمنظمة ونقطة الخدمة. أسماء المستفيدين وقيم الدفعات لا تُعرض على الموقع.$b$,
  $b$Amounts or vouchers are distributed through coordination between the company, the organization, and the service point. Beneficiary names and payment values are not shown on the site.$b$,
  '["اتفاق التوزيع مع المنظمة","تحديد نقطة الخدمة","التنفيذ في الفرع حسب الكشف المعتمد لدى الطرفين"]'::jsonb,
  '["A distribution agreement with the organization","A service point is chosen","Execution at the branch against the list both parties approved"]'::jsonb,
  '["تخويل من المنظمة","هوية المستفيد عند الصرف حسب الاتفاق"]'::jsonb,
  '["Authorization from the organization","Beneficiary identification at payout, as the agreement requires"]'::jsonb,
  'لا تُنشر عمولة التوزيع هنا.',
  'The distribution commission is not published here.',
  8
),
(
  'aid-guarantor',
  'خدمة الضامن',
  'Guarantor service',
  'دور الضامن يُحدد في الاتفاق مع المنظمة، ولم تُنشر شروطه التفصيلية على الموقع.',
  'The guarantor role is defined in the agreement with the organization. Its detailed terms are not published on the site.',
  $b$خدمة الضامن متاحة للمنظمات التي تتفق مع الشركة على هذا الدور. شروط الضمان وحدوده ومستنداته تُستكمل في الفرع، ولا تُستنتج من هذه الصفحة.$b$,
  $b$The guarantor service is for organizations that agree this role with the company. The terms, limits, and documents are completed at the branch and are not inferred from this page.$b$,
  '["طلب الخدمة من المنظمة","مراجعة الشركة للطلب","توقيع الاتفاق في نقطة الخدمة"]'::jsonb,
  '["The organization requests the service","The company reviews the request","The agreement is signed at a service point"]'::jsonb,
  '["بيانات المنظمة ومفوّضها","عدم اعتبار الصفحة ضماناً قائماً"]'::jsonb,
  '["The organization and its authorized person","This page is not itself a guarantee"]'::jsonb,
  'تُحدد المقابل في الاتفاق.',
  'The consideration is set in the agreement.',
  9
),
(
  'aid-deposit',
  'خدمة الإيداع الإنساني',
  'Humanitarian deposit',
  'إيداع مبالغ مخصصة لأغراض إنسانية وفق اتفاق الشركة والمنظمة.',
  'Deposit of amounts dedicated to humanitarian purposes under the company and the organization’s agreement.',
  $b$الإيداع الإنساني يُستقبل في نقطة الخدمة للغرض المتفق عليه مع المنظمة. الصفحة لا تقبل إيداعاً ولا تعرض أرصدة.$b$,
  $b$A humanitarian deposit is received at a service point for the purpose agreed with the organization. This page accepts no deposit and shows no balances.$b$,
  '["تحديد الغرض والجهة","مراجعة المستندات في الفرع","تسجيل الإيداع وإيصال العملية"]'::jsonb,
  '["The purpose and the organization are identified","Documents are reviewed at the branch","The deposit is recorded and a receipt is issued"]'::jsonb,
  '["اتفاق أو تخويل تقبله الشركة","إيداع فعلي في نقطة الخدمة لا عبر النموذج"]'::jsonb,
  '["An agreement or authorization the company accepts","The deposit is made at a service point, not through the form"]'::jsonb,
  'لا تُنشر عمولة الإيداع هنا.',
  'The deposit commission is not published here.',
  10
)
on conflict (slug) do nothing;

update faqs set
  answer_ar = 'نُشرت عناوين الفروع وأرقامها. لا تُرسم نقطة على الخريطة حتى تُسلَّم إحداثيات معتمدة.',
  answer_en = 'Branch addresses and phones are published. No map pin is drawn until approved coordinates are supplied.',
  question_ar = 'لماذا لا تظهر الفروع على الخريطة؟',
  question_en = 'Why are branches not shown on the map?'
where service_slug = 'local-remittance' and sort_order = 5;

update faqs set
  answer_ar = 'اللوحة تعرض عملات أضافتها الإدارة. ما بقي موسوماً تجريبياً ليس سعر سوق. السعر الملزم هو المعلن في نقطة الخدمة.',
  answer_en = 'The board shows currencies an administrator added. Anything still marked as a sample is not a market price. The binding rate is the one stated at the service point.'
where service_slug = 'currency-exchange' and sort_order = 4;
