update branches
set active = false
where is_demo = true
  and name_ar in ('نموذج فرع — عدن', 'نموذج فرع — أمانة العاصمة', 'نموذج وكيل — تعز');

insert into branches (
  kind, name_ar, name_en, governorate_ar, governorate_en, city_ar, city_en,
  address_ar, address_en, phone, hours_ar, hours_en, services_ar, services_en,
  is_demo, active
)
select *
from (values
  (
    'branch', 'المركز الرئيسي', 'Head office', 'مأرب', 'Marib', 'مأرب', 'Marib',
    'الشارع العام، جوار مؤسسة الكهرباء', 'Main Street, beside the Electricity Corporation',
    E'06304111\n06303985\nخدمة العملاء: 712720300\nالإدارة: 06304990\nالإدارة: 06304991\nالإدارة: 711555724\nالإدارة: 777555724',
    '', '', '', '', false, true
  ),
  (
    'branch', 'فرع حريب', 'Harib branch', 'مأرب', 'Marib', 'حريب', 'Harib',
    'الشارع العام، أمام سبافون', 'Main Street, opposite Sabafon',
    E'06301277\n06301280',
    '', '', '', '', false, true
  ),
  (
    'branch', 'فرع صنعاء', 'Sana''a branch', 'صنعاء', 'Sana''a', 'صنعاء', 'Sana''a',
    'شارع تعز، جوار دار الأيتام', 'Taiz Street, beside the orphanage',
    '01612224',
    '', '', '', '', false, true
  ),
  (
    'branch', 'فرع المحطة', 'Al Mahatta branch', 'مأرب', 'Marib', 'المحطة', 'Al Mahatta',
    'محطة بن معيلي، أمام سوق القات', 'Bin Muaili station, opposite the qat market',
    '06306517',
    '', '', '', '', false, true
  ),
  (
    'branch', 'فرع صافر', 'Safer branch', 'مأرب', 'Marib', 'صافر', 'Safer',
    'سوق صافر، أمام الجامع', 'Safer market, opposite the mosque',
    '771871177',
    '', '', '', '', false, true
  ),
  (
    'branch', 'فرع شبوة', 'Shabwa branch', 'شبوة', 'Shabwa', 'العقلة', 'Al Uqlah',
    'العقلة، أمام بوابة الشركة النفطية', 'Al Uqlah, opposite the oil-company gate',
    E'715710397\n712042080',
    '', '', '', '', false, true
  ),
  (
    'branch', 'فرع مفرق السد', 'Dam Junction branch', 'مأرب', 'Marib', 'مفرق السد', 'Dam Junction',
    'مفرق السد', 'Dam Junction',
    '711969809',
    '', '', '', '', false, true
  )
) as seed(
  kind, name_ar, name_en, governorate_ar, governorate_en, city_ar, city_en,
  address_ar, address_en, phone, hours_ar, hours_en, services_ar, services_en,
  is_demo, active
)
where not exists (
  select 1 from branches where name_ar = seed.name_ar and is_demo = false
);

update site_settings set
  address_ar = 'مأرب، الشارع العام، جوار مؤسسة الكهرباء',
  address_en = 'Marib, Main Street, beside the Electricity Corporation',
  phone = E'06304111\n06303985\nخدمة العملاء: 712720300\nالإدارة: 06304990 · 06304991 · 711555724 · 777555724',
  about_ar = replace(about_ar, 'في محافظة مأرب، الشارع العام', 'في مأرب، الشارع العام، جوار مؤسسة الكهرباء'),
  about_en = replace(about_en, 'in Marib Governorate, on Main Street', 'in Marib, on Main Street, beside the Electricity Corporation'),
  legal_ar = replace(legal_ar, 'المكتب الرئيسي في محافظة مأرب، الشارع العام', 'المكتب الرئيسي في مأرب، الشارع العام، جوار مؤسسة الكهرباء'),
  legal_en = replace(legal_en, 'in Marib Governorate, on Main Street', 'in Marib, on Main Street, beside the Electricity Corporation')
where id = 1;

update news_posts set
  title_ar = 'عناوين الفروع المعتمدة',
  title_en = 'Approved branch addresses',
  excerpt_ar = 'نُشرت عناوين الفروع وأرقامها. الخريطة تبقى بلا نقاط حتى تُسلَّم الإحداثيات.',
  excerpt_en = 'Branch addresses and phones are published. The map stays without pins until coordinates are supplied.',
  body_ar = 'أصبحت عناوين المركز الرئيسي والفروع وأرقام الهاتف ظاهرة في دليل الفروع وصفحة التواصل. لم تُسلَّم إحداثيات، لذلك لا تُرسم نقاط على الخريطة. ساعات العمل لكل فرع لم تُحدَّد بعد.',
  body_en = 'Head-office and branch addresses and phone numbers now appear in the directory and on the contact page. Coordinates were not supplied, so no map pins are drawn. Working hours for each branch are not set yet.',
  is_demo = false
where slug = 'branches-pending';
