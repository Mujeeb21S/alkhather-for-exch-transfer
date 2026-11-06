update faqs
set answer_ar = 'لا. إنشاء الحوالة يتم في الفرع. الموقع للتعريف ومتابعة الحالة والتواصل.',
    answer_en = 'No. A transfer is created at a branch. The site is for information, status lookup, and contact.'
where question_ar = 'هل أستطيع إرسال حوالة من الموقع؟';

update faqs
set answer_ar = 'السعر الملزم هو الذي يعلنه الموظف في نقطة الخدمة وقت العملية.',
    answer_en = 'The binding rate is the one stated at the service point when you transact.'
where question_ar = 'هل الأسعار على الموقع قابلة للتنفيذ؟';

update faqs
set answer_ar = 'تنفيذ الحوالة يتم في الفرع. صفحة الشركاء تعرض الأسماء المعتمدة للتعريف، والموقع لا ينشئ حوالة.',
    answer_en = 'A transfer is completed at a branch. The partners page lists the approved names. The site does not create a transfer.'
where question_ar = 'هل الموقع متصل بشريك تحويل دولي؟';

update faqs
set question_ar = 'هل يظهر رصيد الإيداع الإنساني على الموقع؟',
    question_en = 'Does the site show a humanitarian deposit balance?',
    answer_ar = 'لا. الرصيد وحركته لا يُعرضان هنا. المراجعة تتم مع المفوّض وخدمة العملاء.',
    answer_en = 'No. The balance and its movements are not shown here. Review them with the authorized person and customer service.'
where question_ar = 'هل أرى رصيد الإيداع في حسابي؟';

update faqs
set answer_ar = 'إن بعتَ عملة أجنبية للشركة فالسعر سعر الشراء. إن اشتريتَ منها عملة أجنبية فالسعر سعر البيع. السعر الملزم هو المعلن في نقطة الخدمة.',
    answer_en = 'If you sell foreign currency to the company, use the buy rate. If you buy foreign currency, use the sell rate. The binding rate is the one stated at the service point.'
where question_ar = 'أي السعرين أستخدم؟';

update faqs set published = false
where question_ar in (
  'أي عملات تظهر في اللوحة؟',
  'لماذا بعض الفروع موسومة بأنها تجريبية؟'
);

update services
set body_ar = replace(body_ar, 'لا من حساب الموقع وحده', 'لا من هذه الصفحة'),
    body_en = replace(body_en, 'not by a website account alone', 'not from this page')
where slug = 'corporate';

update services
set body_ar = replace(body_ar, 'الرصيد وحركته لا يظهران في الحساب الرقمي.', 'الرصيد وحركته لا يُعرضان على الموقع.')
where slug = 'aid-deposit';
