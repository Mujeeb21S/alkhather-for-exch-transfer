alter table site_settings add column if not exists respect_ar text not null default '';
alter table site_settings add column if not exists respect_en text not null default '';
alter table site_settings add column if not exists strategy_ar text not null default '';
alter table site_settings add column if not exists strategy_en text not null default '';

update site_settings set
  address_ar = 'المكتب الرئيسي، محافظة مأرب، الشارع العام',
  address_en = 'Head office, Marib Governorate, Main Street',
  about_ar = $about_ar$منشأة مصرفية فردية يمنية تمارس نشاطها المصرفي ضمن النطاق الجغرافي للجمهورية اليمنية، بموجب القانون رقم 14 لسنة 2000، وتحمل ترخيصاً رسمياً رقم 486 صادراً عن البنك المركزي اليمني. يقع مكتبها الرئيسي في محافظة مأرب، الشارع العام.$about_ar$,
  about_en = $about_en$A Yemeni sole banking establishment operating inside the Republic of Yemen under Law No. 14 of 2000. It holds official license No. 486 issued by the Central Bank of Yemen. Its head office is in Marib Governorate, on Main Street.$about_en$,
  mission_ar = $mission_ar$الإسهام في التنمية الاجتماعية والاقتصادية ورفع المستوى المعيشي للفرد والمجتمع، عبر تقديم خدمات مالية متميزة وحديثة تتلاءم مع متطلبات الحركة المالية، وتعزز قدرات الشركة وجودة أدائها المصرفي بما يرضي عملاءها ويوفر لهم الخدمات المالية ذات العوائد الجيدة بالنسبة للمودعين والمساهمين والعملاء.$mission_ar$,
  mission_en = $mission_en$To contribute to social and economic development and to raising the standard of living of individuals and society, by offering distinctive, modern financial services that match the needs of financial activity, strengthen the company, and satisfy clients — including returns that serve depositors, shareholders, and customers.$mission_en$,
  vision_ar = $vision_ar$يتمثل طموح شركة محسن الخضر للصرافة والتحويلات النقدية في إيصال الخدمات المالية والمصرفية لكل مواطن، وتغطية كافة المناطق وخصوصاً النائية. كما تطمح الشركة إلى إنشاء مشاريع تمويل تهدف إلى دعم الشباب والفئات الفقيرة في عموم محافظات اليمن.$vision_ar$,
  vision_en = $vision_en$Mohsen Al Khadher Exchange & Cash Transfers aspires to bring financial and banking services to every citizen and to cover all areas, especially remote ones. The company also aims to establish financing projects that support young people and poorer groups across Yemen’s governorates.$vision_en$,
  goals_ar = $goals_ar$1. تقديم خدمات مالية نوعية ومبتكرة وفقاً لأحدث النظم والأساليب المالية، بجودة عالية وتكلفة منخفضة تلائم احتياجات العملاء في الظروف الاقتصادية الصعبة.
2. رفع حصة الشركة في السوق وزيادة الانتشار والتوسع المصرفي، والاقتراب من العملاء عبر التوسع في المدن والأرياف.
3. استيعاب الكوادر البشرية المتميزة والطموحة التي تؤمن بقيم الشركة ومبادئها.$goals_ar$,
  goals_en = $goals_en$1. Offer distinctive, innovative financial services under current methods, with high quality and a low cost suited to clients in difficult economic conditions.
2. Raise the company’s market share and extend its banking presence, drawing closer to clients by expanding in cities and rural areas.
3. Take in capable, ambitious people who believe in the company’s values and principles.$goals_en$,
  commitment_ar = $commitment_ar$الالتزام بمبادئ وأحكام الشريعة الإسلامية في جميع التعاملات والخدمات المصرفية والاستثمارات، لأن تلك الأحكام تحكم المجتمع الذي تمارس فيه الشركة نشاطها.
الالتزام بمعايير الجودة والأداء المصرفي المعتمدة عالمياً، ومنها معايير أيزو وأنظمة قياس الجودة.
الالتزام بتأدية العمل المصرفي بمهنية عالية وبأحدث التقنيات، بأداء يلبي متطلبات العملاء ويتناسب مع ظروف المناطق التي تنتشر فيها الفروع ونقاط الخدمة.
الالتزام باختيار كادر بشري متميز يؤمن برسالة الشركة وبمنظومة قيمها ومبادئها.
الالتزام بالقوانين والتشريعات والتعليمات الصادرة عن جهات الإشراف في مناطق تواجد الشركة وفروعها، والامتثال الطوعي لها بما ينفع الشركة والمجتمع والاقتصاد.$commitment_ar$,
  commitment_en = $commitment_en$Commitment to the principles and rulings of Islamic sharia in dealings, banking services, and investments, because those rulings govern the society in which the company operates.
Commitment to internationally recognized standards of banking quality and performance, including ISO and other quality-measurement systems.
Commitment to carrying out banking work professionally and with current technology, at a standard that meets clients and fits the conditions of the areas where branches and service points operate.
Commitment to choosing distinguished staff who believe in the company’s mission, values, and principles.
Commitment to the laws, regulations, and instructions of the supervisory authorities where the company and its branches are present, and to voluntary compliance that benefits the company, society, and the economy.$commitment_en$,
  values_ar = $values_ar$تؤدي شركة الخضر للصرافة والتحويلات نشاطها المصرفي بأمانة وتفانٍ وإخلاص، وتستشعر ثقل الأمانة وتبعاتها. الأمانة هي الجسر الذي يصل الشركة بعملائها.$values_ar$,
  values_en = $values_en$Al Khadher Exchange & Transfers carries out its banking activity with honesty, devotion, and sincerity, and it treats that trust as a weight it must carry. Trust is the bridge between the company and its clients.$values_en$,
  respect_ar = $respect_ar$الاحترام المتبادل هو السائد في علاقة الشركة بعملائها، وفي علاقة قيادتها بموظفيها، وفي علاقة الموظفين بعضهم ببعض.
منذ انطلاق الشركة في العمل المصرفي لم يعهد العملاء منها إساءة لفظية أو فعلية. وإن صدرت إساءة ضد الشركة فإن موظفيها يواجهونها بالإحسان.
تعامل الشركة عملاءها بالمساواة والاحترام بغض النظر عن الاختلاف الديني أو الجغرافي أو الجنسية أو العرق.
خصوصية العملاء وأسرارهم لا تُفشى ولا يُتلاعب بها.$respect_ar$,
  respect_en = $respect_en$Mutual respect governs the company’s relationship with clients, leadership’s relationship with staff, and staff relationships with one another.
Since the company began its banking work, clients have not known verbal or physical abuse from it. If someone abuses the company, staff answer with good conduct.
Clients are treated equally and with respect regardless of religion, geography, nationality, or ethnicity.
Client privacy and confidential matters are not disclosed or tampered with.$respect_en$,
  transparency_ar = $transparency_ar$الوضوح والشفافية ركيزتان في مهام الشركة ومسؤولياتها وإجراءاتها وأهدافها، سواء مع الموظفين أو العملاء أو الجهات الرسمية.
تتسم علاقة الشركة بموظفيها بالوضوح في إنجاز المهام وفي مناقشة التحديات والإخفاقات والطموحات التي تتطلع إليها القيادة وتعول على الكادر في تحقيقها.
أما مع العملاء، فالخدمات وما يطرأ على نظام الشركة يكون في متناول الجميع. تُفتح قنوات التواصل للتوضيح وإزالة اللبس، وللتغلب على تعارض المصالح بين الشركة وعملائها.$transparency_ar$,
  transparency_en = $transparency_en$Clarity and transparency are foundations of the company’s duties, procedures, and aims, whether with staff, clients, or official bodies.
The relationship with staff is clear about completing the work and about the challenges, failures, and ambitions that leadership sets and expects the team to carry.
With clients, services and changes in the company’s system are kept within reach. Communication channels stay open to explain, to remove ambiguity, and to deal with conflicts of interest between the company and its clients.$transparency_en$,
  strategy_ar = $strategy_ar$وضعت قيادة الشركة استراتيجية ممتدة للسير نحو التطور والنمو والتجديد، بما يجعل الشركة منشأة ضاربة في السوق المالية ويميز خدماتها المصرفية.
ستطور الشركة خدماتها بما يواكب المستجدات المالية واحتياجات السوق.
وستعزز الثقة والسمعة المالية لدى شرائح المجتمع، كخطوة لزيادة حضورها وإضافة خدمات نوعية وتنافسية حتى تبلغ موقعاً ريادياً في الصرافة والتحويلات.
ستسعى شركة محسن الخضر للصرافة والتحويلات إلى تطوير خدماتها الإلكترونية واستراتيجيتها التسويقية للاقتراب من عملائها في المدن والأرياف.
وستعتني بكوادرها عبر التأهيل والمهارات الحديثة اللازمة لتنفيذ الاستراتيجية وتلبية متطلبات العملاء، مع توفير ما يلزم للاستفادة من الخبرات المالية العربية والعالمية.$strategy_ar$,
  strategy_en = $strategy_en$Leadership set a standing strategy for growth and renewal, so the company can hold a firm place in the financial market and distinguish its banking services.
It will improve client services in step with financial developments and market needs.
It will strengthen trust and financial reputation across society, as a step toward a wider presence and competitive services, until it holds a leading place in exchange and transfers.
Mohsen Al Khadher Exchange & Transfers will develop its electronic services and marketing strategy to come closer to clients in cities and rural areas.
It will train its people in the skills the strategy and the clients require, and it will make room for them to draw on Arab and international financial experience.$strategy_en$,
  legal_ar = $legal_ar$تمارس الشركة نشاطها في الجمهورية اليمنية بموجب القانون رقم 14 لسنة 2000، وتحمل الترخيص الرسمي رقم 486 الصادر عن البنك المركزي اليمني. المكتب الرئيسي في محافظة مأرب، الشارع العام. لم يُسلَّم تاريخ تأسيس ولا رقم سجل تجاري منفصل عن هذا الترخيص، ولن يُعرض أي منهما حتى تعتمده الشركة. هذه الصفحة بيان تعريفي وليست بديلاً عن مستند الترخيص نفسه.$legal_ar$,
  legal_en = $legal_en$The company operates in the Republic of Yemen under Law No. 14 of 2000 and holds official license No. 486 issued by the Central Bank of Yemen. The head office is in Marib Governorate, on Main Street. A founding date and a commercial-register number separate from this license were not supplied and will not be shown until the company approves them. This page is an introduction, not a substitute for the license document itself.$legal_en$
where id = 1;

update managed_pages set
  body_ar = $comp_ar$تلتزم نقطة الخدمة بطلب المستندات التي تحددها الشركة قبل تنفيذ أي عملية. تعمل الشركة بموجب القانون رقم 14 لسنة 2000 وبترخيص رقم 486 الصادر عن البنك المركزي اليمني، كما هو مبيّن في صفحة من نحن. هذه الصفحة تصف مبدأ الامتثال ولا تنشر تعميماً لم يُسلَّم للمنصة. النص قابل للتعديل من لوحة المحتوى.$comp_ar$,
  body_en = $comp_en$The service point requests the documents the company requires before any transaction. The company operates under Law No. 14 of 2000 and license No. 486 issued by the Central Bank of Yemen, as stated on the About page. This page describes the compliance principle. It does not publish a circular that was not given to the platform. Content staff can edit the text.$comp_en$,
  updated_at = now()
where slug = 'compliance';
