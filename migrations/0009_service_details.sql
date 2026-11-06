alter table services add column if not exists audience_ar text not null default '';
alter table services add column if not exists audience_en text not null default '';
alter table services add column if not exists covers_ar jsonb not null default '[]'::jsonb;
alter table services add column if not exists covers_en jsonb not null default '[]'::jsonb;

update services set
  audience_ar = 'الأفراد الذين يصرفون عملة، أو يرسلون حوالة، أو يستلمونها لأنفسهم أو لأسرتهم.',
  audience_en = 'Individuals exchanging currency, or sending or collecting a transfer for themselves or their family.',
  summary_ar = 'صرف وحوالات للأفراد تُنجز في الفرع، مع متابعة الحالة من الموقع دون كشف أطراف العملية.',
  summary_en = 'Exchange and transfers for individuals, completed at a branch, with status followed on the site and the parties kept private.',
  body_ar = $b$خدمة الأفراد هي المسار المعتاد لمن يتعامل باسمه الشخصي. الصرف يتم على المنضدة بعد إعلان سعر الشراء أو البيع، والحوالة تُنشأ في نظام الشركة داخل الفرع ثم يُسلَّم العميل رقماً مرجعياً ورمز تحقق.

الموقع لا يبيع عملة ولا يرسل حوالة. دوره أن يوضح المسار، ويعرض الأسعار الإرشادية، ويُظهر حالة الحوالة بعد مطابقة الرقم والرمز. البيانات التي تظهر بعد المطابقة هي الحالة ومدينة الاستلام وتعليمات عامة، لا اسم المرسل ولا المستفيد ولا المبلغ.

يمكن إتمام التعامل في أي فرع منشور في الدليل. ساعات العمل لكل فرع لم تُعلَن بعد، لذلك يُفضل الاتصال بالرقم الظاهر للفرع قبل الحضور.$b$,
  body_en = $b$The individual service is the ordinary path for a person acting in their own name. Exchange happens at the counter after the buy or sell rate is stated. A transfer is created in the company system inside the branch, and the customer is given a reference and a verification code.

The website neither sells currency nor sends a transfer. It explains the path, shows indicative rates, and reveals transfer status after the reference and code match. What appears then is the status, the payout city, and general instructions — not the sender, the beneficiary, or the amount.

The transaction can be completed at any branch listed in the directory. Working hours are not published yet, so call the number shown for that branch before visiting.$b$,
  covers_ar = '["شراء العملات المعتمدة في الفرع وبيعها","إرسال حوالة من نقطة الخدمة","استلام حوالة بعد التحقق من الهوية","متابعة الحالة من الموقع بالرقم والرمز"]'::jsonb,
  covers_en = '["Buying and selling currencies handled at the branch","Sending a transfer from a service point","Collecting a transfer after identity is checked","Following status on the site with the reference and code"]'::jsonb,
  steps_ar = '["اختيار الفرع من الدليل والاتصال به عند الحاجة","إبراز الهوية التي تطلبها نقطة الخدمة","الاطلاع على السعر أو بيانات الحوالة قبل التأكيد","استلام الإيصال، ومع الحوالة الرقم المرجعي ورمز التحقق","متابعة الحالة لاحقاً من صفحة الحوالات دون مشاركة الرمز"]'::jsonb,
  steps_en = '["Choose a branch from the directory and call ahead if needed","Present the identification the service point asks for","Read the rate or the transfer details before confirming","Take the receipt and, for a transfer, the reference and verification code","Follow status later on the transfers page without sharing the code"]'::jsonb,
  requirements_ar = '["هوية سارية حسب ما تطلبه نقطة الخدمة","للصرف: عملة قابلة للعد والفحص","للاستلام: الرقم المرجعي ورمز التحقق وهوية المستفيد","عدم إرسال الرمز في رسالة أو شكوى"]'::jsonb,
  requirements_en = '["Valid identification as required at the service point","For exchange: currency that can be counted and checked","For pickup: the reference, the verification code, and the beneficiary’s identification","Do not send the code in a message or a complaint"]'::jsonb,
  fees_ar = 'لا تُنشر تعرفة ثابتة للأفراد على الموقع. رسم الصرف أو الحوالة يُذكر في نقطة الخدمة قبل إتمام العملية، ويظهر في الإيصال.',
  fees_en = 'No fixed individual tariff is published on the site. The exchange or transfer fee is stated at the service point before the transaction and appears on the receipt.'
where slug = 'individuals';

update services set
  audience_ar = 'الشركات والتجار والمنشآت، ومن يحتاج صرفاً متكرراً أو حوالات بتنسيق مسبق.',
  audience_en = 'Companies, merchants, and organizations, and anyone who needs repeated exchange or transfers arranged in advance.',
  summary_ar = 'تنسيق الصرف والتحويلات للمنشآت وكبار العملاء عبر خدمة العملاء، والتنفيذ في نقطة الخدمة.',
  summary_en = 'Exchange and transfers for organizations and major clients, arranged through customer service and completed at a service point.',
  body_ar = $b$هذه الخدمة لمن لا يناسبه المرور الفردي المعتاد: شركة، تاجر، أو عميل يتكرر تعامله أو يكبر حجمه. تبدأ بطلب يوضح اسم المنشأة، واسم المفوّض، ونوع الاحتياج: صرف، حوالة صادرة، أو استلام.

تسجيل الطلب من صفحة التواصل لا يفتح حساباً ولا يحجز سعراً ولا يحرّك مبلغاً. خدمة العملاء تراجع الطلب وتحدد المستندات وموعد التعامل. السعر والرسم المؤسسيان يُتفق عليهما في الفرع وقت التنفيذ، ولا يُعلنان هنا كأرقام.

المفوّض هو من تتواصل معه الشركة. أي تغيير في المفوّض يتم بإبلاغ الفرع، لا من حساب الموقع وحده.$b$,
  body_en = $b$This service is for a relationship that does not fit the ordinary individual counter: a company, a merchant, or a client whose dealings are repeated or larger. It starts with a request naming the entity, the authorized person, and the need: exchange, an outbound transfer, or a collection.

Filing the request on the contact page does not open an account, lock a rate, or move money. Customer service reviews it and sets the documents and the time of the visit. Institutional price and fee are agreed at the branch when the transaction is done, and are not published here as figures.

The authorized person is who the company will speak to. A change of that person is reported at the branch, not by a website account alone.$b$,
  covers_ar = '["تنسيق صرف للمنشأة","حوالات صادرة أو واردة باسمها","تحديد مفوّض بالتواصل","متابعة الطلب عبر خدمة العملاء"]'::jsonb,
  covers_en = '["Arranging exchange for an organization","Outbound or inbound transfers in its name","Naming an authorized contact","Following the request through customer service"]'::jsonb,
  steps_ar = '["إرسال طلب من صفحة التواصل مع وصف الاحتياج","انتظار مراجعة خدمة العملاء","تقديم المستندات التي تُطلب","تنفيذ العملية في الفرع بواسطة المفوّض","الاحتفاظ بالإيصال للسجلات"]'::jsonb,
  steps_en = '["Send a request from the contact page describing the need","Wait for customer service to review it","Provide the documents that are asked for","Complete the transaction at the branch through the authorized person","Keep the receipt for the records"]'::jsonb,
  requirements_ar = '["اسم المنشأة ومدينة التعامل","اسم المفوّض ورقم هاتفه","وصف واضح: صرف أو حوالة أو استلام","مستندات المنشأة حسب ما تعتمده الشركة لاحقاً، ولم تُنشر قائمة مغلقة هنا"]'::jsonb,
  requirements_en = '["The entity name and the city of the visit","The authorized person’s name and phone","A clear description: exchange, transfer, or collection","Entity documents as the company later requires; no closed checklist is published here"]'::jsonb,
  fees_ar = 'لا توجد تعرفة شركات منشورة. الرسم والسعر يُذكران للمفوّض قبل التنفيذ.',
  fees_en = 'No corporate tariff is published. The fee and the rate are stated to the authorized person before execution.'
where slug = 'corporate';

update services set
  audience_ar = 'كل زائر أو عميل يريد الاطلاع أو المتابعة من غير حضور، من دون تنفيذ مالي عبر المتصفح.',
  audience_en = 'Any visitor or customer who wants to look something up or follow it without a visit, and without a financial transaction in the browser.',
  summary_ar = 'النافذة الرقمية الحالية: الأسعار، المحوّل، تتبع الحوالة، الفروع، الحساب، والتواصل.',
  summary_en = 'The current digital window: rates, the converter, transfer tracking, branches, an account, and contact.',
  body_ar = $b$الخضر أونلاين اسم القناة الرقمية على هذا الموقع، وليس تطبيقاً مستقلاً تم تسليمه. من هنا تُراجع لوحة الأسعار والمحوّل الإرشادي، ويُستعلم عن حالة حوالة، وتُفتح أرقام الفروع، ويُرسل طلب أو شكوى.

إنشاء حساب بالبريد يتيح ربط حوالة بالحساب بعد إدخال رقمها ورمزها، ومتابعة الطلبات التي أُرسلت من الحساب نفسه. الحساب لا يعرض رصيداً ولا يسمح بالسحب أو الإيداع أو إنشاء حوالة.

ما دام السعر موسوماً تجريبياً فهو للتجربة لا للتنفيذ. السعر الملزم هو المعلن على المنضدة.$b$,
  body_en = $b$Al Khadher Online is the name of the digital channel on this site. It is not a separate app that was delivered. From here you review the rate board and the illustrative converter, look up a transfer, open branch numbers, and send a request or a complaint.

An email account lets you link a transfer after entering its reference and code, and follow requests sent from that same account. The account shows no balance and cannot withdraw, deposit, or create a transfer.

While a rate is marked as a sample it is for trial, not execution. The binding rate is the one stated at the counter.$b$,
  covers_ar = '["لوحة أسعار ومحوّل إرشادي","تتبع حالة الحوالة","دليل الفروع وأرقامها","حساب لمتابعة حوالة أو طلب مرتبط","نماذج التواصل والشكاوى"]'::jsonb,
  covers_en = '["A rate board and an illustrative converter","Transfer-status lookup","The branch directory and phone numbers","An account to follow a linked transfer or request","Contact and complaint forms"]'::jsonb,
  steps_ar = '["فتح الخدمة المطلوبة من القائمة","للمتابعة: إدخال رقم الحوالة ورمزها","للحساب: التسجيل بالبريد ثم ربط الحوالة عند الحاجة","للتواصل: إرسال النموذج وانتظار الرد"]'::jsonb,
  steps_en = '["Open the needed service from the menu","For follow-up: enter the transfer reference and code","For an account: register with email, then link a transfer if needed","For contact: send the form and wait for the reply"]'::jsonb,
  requirements_ar = '["بريد صحيح لإنشاء الحساب","رقم الحوالة ورمزها إن كان الغرض المتابعة","لا يُطلب تنزيل تطبيق"]'::jsonb,
  requirements_en = '["A valid email to create an account","The transfer reference and code if the purpose is follow-up","No app download is required"]'::jsonb,
  fees_ar = 'استخدام الصفحات العامة والحساب مجاني. رسوم الصرف والحوالة تُحسب في الفرع فقط.',
  fees_en = 'Public pages and the account are free to use. Exchange and transfer fees are calculated only at the branch.'
where slug = 'online';

update services set
  audience_ar = 'من يريد تقدير مبلغ قبل زيارة الفرع، أو تنفيذ صرف فعلي على المنضدة.',
  audience_en = 'Anyone estimating an amount before a visit, or completing an actual exchange at the counter.',
  summary_ar = 'شراء العملة وبيعها مقابل الريال اليمني. المحوّل إرشادي، والسعر الملزم يُعلن في الفرع.',
  summary_en = 'Buying and selling currency against the Yemeni rial. The converter is illustrative; the binding rate is stated at the branch.',
  body_ar = $b$تحويل العملات في الشركة يتم نقداً في نقطة الخدمة. للوحة سعران مقابل الريال اليمني: سعر الشراء هو ما تدفعه الشركة حين تشتري العملة الأجنبية من العميل، وسعر البيع هو ما يدفعه العميل حين يشتري العملة الأجنبية من الشركة.

المحوّل في صفحة الأسعار يمر عبر الريال حتى بين عملتين أجنبيتين: بيع العملة الأولى بسعر الشراء، ثم شراء العملة الثانية بسعر البيع. الناتج تقدير. إن بقي السطر موسوماً تجريبياً فهو ليس سعر سوق ولا أمر تنفيذ.

العملات الظاهرة هي ما أضافته الإدارة. لا تُعرض هنا قائمة مغلقة بكل ما يصرفه الفرع إن اختلف المتاح في الصندوق يوم التنفيذ.$b$,
  body_en = $b$Currency conversion at the company is done in cash at a service point. The board has two rates against the Yemeni rial: the buy rate is what the company pays when it buys foreign currency from the customer, and the sell rate is what the customer pays when buying foreign currency from the company.

The converter on the rates page crosses through the rial even between two foreign currencies: the first is sold at the buy rate, then the second is bought at the sell rate. The result is an estimate. If the row is still marked as a sample, it is neither a market price nor an order.

The currencies shown are those an administrator added. This page does not claim a closed list of everything a branch can exchange if the till differs on the day.$b$,
  covers_ar = '["سعر شراء وسعر بيع مقابل الريال","محوّل تقديري بين العملات عبر الريال","تنفيذ الصرف في الفرع بعد إعلان السعر","إيصال بالعملية"]'::jsonb,
  covers_en = '["A buy rate and a sell rate against the rial","An estimate between currencies via the rial","Exchange at the branch after the rate is stated","A receipt for the transaction"]'::jsonb,
  steps_ar = '["مراجعة اللوحة أو المحوّل للتقدير فقط","تأكيد السعر على المنضدة قبل العد","تسليم العملة واستلام المقابل","أخذ الإيصال"]'::jsonb,
  steps_en = '["Use the board or converter for an estimate only","Confirm the rate at the counter before counting","Hand over the currency and receive the other side","Take the receipt"]'::jsonb,
  requirements_ar = '["عملة بحالة تقبلها نقطة الخدمة","هوية إذا طلبها الفرع","الالتزام بحد الصرف المعلن في الفرع إن وُجد، ولم يُنشر حد رقمي هنا"]'::jsonb,
  requirements_en = '["Currency in a condition the service point accepts","Identification if the branch asks for it","Any exchange limit announced at the branch; no numeric limit is published here"]'::jsonb,
  fees_ar = 'قد يكون مقابل الخدمة داخلاً في فرق سعري الشراء والبيع أو رسماً منفصلاً يُذكر قبل التنفيذ. لا رقم منشور على هذه الصفحة.',
  fees_en = 'The charge may sit inside the buy–sell spread or be a separate fee stated before the deal. No figure is published on this page.'
where slug = 'currency-convert';

update services set
  audience_ar = 'من يحمل الرقم المرجعي ورمز التحقق الصادرين من نقطة الخدمة، سواء كان المرسل أو المستفيد أو من ائتُمن عليهما.',
  audience_en = 'Whoever holds the reference and verification code issued at the service point: the sender, the beneficiary, or a person trusted with both.',
  summary_ar = 'استعلام يُظهر حالة الحوالة ومدينة الاستلام والتعليمات، ويخفي الأسماء والمبلغ.',
  summary_en = 'A lookup that shows transfer status, payout city, and instructions, and hides names and the amount.',
  body_ar = $b$بعد إنشاء الحوالة في الفرع يُطبع أو يُملى رقم مرجعي ورمز تحقق. إدخالهما معاً في صفحة الحوالات يعرض الحالة فقط. الرقم وحده أو الرمز وحده لا يكفي، والخطأ في أحدهما يُجاب عنه بعدم العثور من غير تفصيل.

الحالات المعتمدة في النظام: لم تُستكمل بعد، قيد المراجعة، أُرسلت، جاهزة للاستلام، تم الاستلام، ملغاة، أو مرفوضة. مع الحالة تظهر مدينة الاستلام إن سُجّلت، وتعليمات مختصرة: مثلاً إبراز الهوية والرمز عند الجاهزية.

لا يظهر اسم المرسل ولا المستفيد ولا المبلغ ولا الهاتف. إن ضاع الرمز لا يُعاد من الموقع؛ تُراجع نقطة الخدمة أو تُقدَّم شكوى من دون كتابة الرمز في نص الرسالة.$b$,
  body_en = $b$After a transfer is created at the branch, a reference and a verification code are printed or read out. Entering both on the transfers page shows status only. Either one alone is not enough, and a wrong value is answered as not found, without extra detail.

The statuses in the system are: not finished yet, under review, sent, ready for pickup, collected, cancelled, or rejected. With the status, the payout city is shown when it was recorded, plus a short instruction — for example to present identification and the code when it is ready.

Sender, beneficiary, amount, and phone stay hidden. A lost code is not reissued on the site. See the service point, or file a complaint without writing the code in the message.$b$,
  covers_ar = '["مطابقة الرقم المرجعي مع رمز التحقق","عرض الحالة ومدينة الاستلام","تعليمات الاستلام أو المراجعة","مسار شكوى من دون كشف بيانات الحوالة"]'::jsonb,
  covers_en = '["Matching the reference with the verification code","Showing status and payout city","Pickup or review instructions","A complaint path that does not reveal transfer data"]'::jsonb,
  steps_ar = '["الاحتفاظ بالرقم والرمز من إيصال الفرع","فتح صفحة الحوالات","إدخال الاثنين ثم عرض الحالة","عند الجاهزية: التوجه للمدينة الظاهرة بالهوية والرمز"]'::jsonb,
  steps_en = '["Keep the reference and code from the branch receipt","Open the transfers page","Enter both and show the status","When ready: go to the city shown with identification and the code"]'::jsonb,
  requirements_ar = '["رقم مرجعي صادر من النظام","رمز تحقق لم يُشارك علناً","هوية المستفيد عند الاستلام الفعلي في الفرع"]'::jsonb,
  requirements_en = '["A reference issued by the system","A verification code that was not posted publicly","Beneficiary identification at the actual pickup in the branch"]'::jsonb,
  fees_ar = 'الاستعلام من الموقع بلا رسم. رسم الحوالة نفسه حُسب عند إنشائها ويظهر في إيصال الفرع لا في نتيجة التتبع.',
  fees_en = 'Lookup on the site has no fee. The transfer fee was calculated when it was created and is on the branch receipt, not in the tracking result.'
where slug = 'track-transfer';

update services set
  audience_ar = 'أي عميل أو زائر لديه شكوى على خدمة أو فرع، أو مقترح لتحسين التعامل.',
  audience_en = 'Any customer or visitor with a complaint about a service or a branch, or a suggestion to improve the service.',
  summary_ar = 'تسجيل شكوى أو مقترح، ثم متابعة الحالة والرد برقم ورمز من دون نشر نص الرسالة.',
  summary_en = 'File a complaint or a suggestion, then follow status and the reply with a reference and code. The message text is not published.',
  body_ar = $b$صفحة الشكاوى تستقبل نوعين: شكوى على تعامل أو فرع أو حوالة، ومقترحاً لا يتطلب معالجة نزاع. بعد الإرسال يظهر رقم متابعة ورمز مرة واحدة. احفظهما. المتابعة لاحقاً تعرض الحالة ورد خدمة العملاء إن كُتب، ولا تعيد نص الشكوى حتى لا يُقرأ من جهاز آخر.

اذكر الفرع أو رقم الحوالة إن وُجد، وصف ما حدث، ورقم هاتف للرد. لا تكتب رمز تحقق الحوالة ولا كلمة مرور الحساب داخل النص. الشكوى لا تُلغي حوالة ولا تُعيد مبلغاً من تلقاء نفسها؛ المعالجة تتم عبر خدمة العملاء ثم الفرع.

لا مدة زمنية موعودة للرد على هذه الصفحة، لأن الشركة لم تحدد أجلاً للنشر.$b$,
  body_en = $b$The complaints page takes two kinds of message: a complaint about a transaction, a branch, or a transfer, and a suggestion that is not a dispute. After sending, a tracking reference and a code appear once. Keep them. Later lookup shows the status and the customer-service reply if one was written. It does not return the complaint text, so it cannot be read from another device.

Name the branch or the transfer reference if you have it, describe what happened, and leave a phone number. Do not put a transfer verification code or an account password in the text. A complaint does not cancel a transfer or refund money by itself. Customer service and then the branch handle it.

No response deadline is promised on this page, because the company has not set one for publication.$b$,
  covers_ar = '["شكوى على خدمة أو فرع أو حوالة","مقترح تحسين","رقم ورمز للمتابعة","عرض الحالة والرد فقط"]'::jsonb,
  covers_en = '["A complaint about a service, branch, or transfer","A suggestion","A reference and code for follow-up","Status and the reply only"]'::jsonb,
  steps_ar = '["فتح صفحة الشكاوى","اختيار الموضوع وكتابة الوصف ورقم الهاتف","حفظ الرقم والرمز الظاهرين مرة واحدة","متابعة الحالة لاحقاً بالرقمين","الانتظار حتى يتغير الوضع أو يصل رد"]'::jsonb,
  steps_en = '["Open the complaints page","Choose the topic and write the description and phone number","Save the reference and code shown once","Check status later with both","Wait until the status changes or a reply arrives"]'::jsonb,
  requirements_ar = '["اسم ورقم هاتف","وصف يكفي لفهم الطلب","عدم تضمين أسرار الحوالة أو الحساب"]'::jsonb,
  requirements_en = '["A name and a phone number","A description clear enough to understand the request","No transfer or account secrets in the text"]'::jsonb,
  fees_ar = 'تقديم الشكوى أو المقترح ومتابعته بلا رسم.',
  fees_en = 'Filing a complaint or a suggestion, and following it, has no fee.'
where slug = 'suggestions';

update services set
  audience_ar = 'المنظمات الإنسانية التي تريد ترتيب توزيع أو ضمان أو إيداع مع الشركة، عبر مفوّض معروف.',
  audience_en = 'Humanitarian organizations that want to arrange distribution, a guarantee, or a deposit with the company, through a known authorized person.',
  summary_ar = 'ثلاث خدمات تُرتب في الفرع: توزيع النقد والقسائم، والضامن، والإيداع الإنساني.',
  summary_en = 'Three services arranged at the branch: cash and voucher distribution, a guarantor role, and humanitarian deposit.',
  body_ar = $b$خدمات المنظمات الإنسانية ليست تبرعاً يُجمع من الموقع، ولا كشفاً عاماً بالمستفيدين. هي تعاقد تشغيلي بين المنظمة والشركة يُستكمل في نقطة الخدمة. الصفحات الثلاث التابعة تشرح شكل كل خدمة من غير أن تنشر شروط عقد بعينه.

لا تُقبل قوائم أسماء ولا مبالغ عبر نموذج الموقع. التنسيق يبدأ برسالة من المفوّض تحدد الخدمة والمدينة، ثم تطلب الشركة ما يلزم من تخويل ومستندات. ما لم يُوقَّع في الفرع لا يُعد اتفاقاً نافذاً.

لم تُسلَّم أسماء منظمات متعاقدة، لذلك لا تُعرض شعارات شركاء في هذا القسم.$b$,
  body_en = $b$Humanitarian services are not a donation collected on the site, and not a public list of beneficiaries. They are an operating arrangement between the organization and the company, completed at a service point. The three child pages describe the shape of each service without publishing the terms of any particular contract.

Name lists and amounts are not accepted through the website form. Coordination starts with a message from the authorized person naming the service and the city. The company then asks for the authorization and documents it needs. Nothing is a binding agreement until it is signed at the branch.

No contracted organizations were supplied, so no partner logos are shown in this section.$b$,
  covers_ar = '["توزيع النقد والقسائم للمستفيدين","دور الضامن وفق اتفاق مكتوب","إيداع مبالغ مخصصة لغرض إنساني","التنسيق عبر مفوّض المنظمة لا عبر الموقع"]'::jsonb,
  covers_en = '["Cash and voucher distribution to beneficiaries","A guarantor role under a written agreement","Deposit of amounts set aside for a humanitarian purpose","Coordination through the organization’s representative, not through the site"]'::jsonb,
  steps_ar = '["تحديد الخدمة من الصفحات الثلاث","مراسلة الشركة باسم المنظمة والمدينة","تقديم التخويل الذي يُطلب","استكمال الاتفاق في الفرع","تنفيذ الدفع أو الإيداع في نقطة الخدمة فقط"]'::jsonb,
  steps_en = '["Choose the service from the three pages","Write to the company in the organization’s name and name the city","Provide the authorization that is requested","Complete the agreement at the branch","Pay or deposit only at the service point"]'::jsonb,
  requirements_ar = '["جهة منظمة ومفوّض للتواصل","مدينة الفرع المقصود","عدم إرسال كشوف مستفيدين عبر نموذج التواصل العام"]'::jsonb,
  requirements_en = '["An organization and an authorized contact","The branch city intended","Do not send beneficiary lists through the public contact form"]'::jsonb,
  fees_ar = 'مقابل كل خدمة يُحدد في الاتفاق ولا يُنشر كنسبة على الموقع.',
  fees_en = 'The charge for each service is set in the agreement and is not published as a percentage on the site.'
where slug = 'humanitarian';

update services set
  audience_ar = 'منظمة لديها مستفيدون يُصرف لهم نقد أو قسائم عبر فرع، وفق كشف تتفق عليه مع الشركة خارج الموقع.',
  audience_en = 'An organization whose beneficiaries are paid in cash or vouchers at a branch, against a list agreed with the company outside the site.',
  summary_ar = 'صرف نقد أو تسليم قسائم في الفرع بالتنسيق مع المنظمة، من غير نشر الأسماء أو القيم.',
  summary_en = 'Cash payout or voucher delivery at the branch, coordinated with the organization, without publishing names or values.',
  body_ar = $b$تسلّم المنظمة الشركة آلية التوزيع: المدينة، والفرع، وشكل الصرف نقداً أو قسيمة، والتخويل. الكشف نفسه لا يُرفع على الموقع ولا يُعرض للزوار. الصرف يتم على المنضدة بعد مطابقة هوية المستفيد لما اعتمدته المنظمة.

القسيمة في هذا السياق مستند تسليم تتفق عليه الجهتان، وليست منتجاً رقمياً يُشترى من الصفحة. قيم الدفعات وعدد المستفيدين لا يُعلنان هنا لأنهما من تفاصيل كل عملية.

إن اختُلف على صرف، تُقدَّم الملاحظة عبر الشكاوى أو عبر المفوّض، من غير كتابة بيانات مستفيدين حساسة في نص عام.$b$,
  body_en = $b$The organization gives the company the distribution method: the city, the branch, whether the payout is cash or a voucher, and the authorization. The list itself is not uploaded to the site and is not shown to visitors. Payout is at the counter after the beneficiary’s identity is matched to what the organization approved.

A voucher here is a delivery document the two parties agree, not a digital product bought on the page. Payment values and beneficiary counts are not announced here because they belong to each operation.

If a payout is disputed, the note goes through complaints or through the authorized person, without putting sensitive beneficiary data in a public text.$b$,
  covers_ar = '["الاتفاق على المدينة وشكل الصرف","اعتماد الكشف لدى الطرفين خارج الموقع","الصرف في الفرع بعد الهوية","عدم عرض الأسماء أو المبالغ للزوار"]'::jsonb,
  covers_en = '["Agreement on the city and the form of payout","A list approved by both parties outside the site","Payout at the branch after identification","No names or amounts shown to visitors"]'::jsonb,
  steps_ar = '["طلب الخدمة وتحديد الفرع","تسليم التخويل والكشف للشركة في قناة تعتمدها","إبلاغ المستفيدين بموعد الصرف عبر المنظمة لا عبر الموقع","الصرف على المنضدة","مراجعة الفروقات مع المفوّض"]'::jsonb,
  steps_en = '["Request the service and name the branch","Deliver the authorization and the list through a channel the company accepts","The organization, not the website, tells beneficiaries when to come","Payout at the counter","Differences are reviewed with the authorized person"]'::jsonb,
  requirements_ar = '["تخويل من المنظمة","كشف معتمد لا يُرسل في النموذج العام","هوية المستفيد عند الصرف حسب الاتفاق"]'::jsonb,
  requirements_en = '["Authorization from the organization","An approved list, not sent in the public form","Beneficiary identification at payout, as the agreement requires"]'::jsonb,
  fees_ar = 'عمولة التوزيع جزء من الاتفاق وغير منشورة هنا.',
  fees_en = 'The distribution commission is part of the agreement and is not published here.'
where slug = 'aid-cash';

update services set
  audience_ar = 'منظمة تطلب من الشركة دوراً ضامناً في عملية إنسانية، ويُحصر هذا الدور في اتفاق مكتوب.',
  audience_en = 'An organization asking the company for a guarantor role in a humanitarian operation, limited to what a written agreement says.',
  summary_ar = 'دور الضامن يُدرس ثم يُوقَّع في الفرع. هذه الصفحة ليست ضماناً قائماً.',
  summary_en = 'A guarantor role is reviewed and then signed at the branch. This page is not itself a guarantee.',
  body_ar = $b$خدمة الضامن تعني أن الشركة قد تقبل، بعد المراجعة، أن تضمن جانباً محدداً من تعامل المنظمة وفق نص الاتفاق: نطاقه، وحدّه، ومدته، وما يُخرج الشركة منه. لا يُستنتج من اسم الخدمة أن كل طلب يُقبل، ولا أن الضمان مفتوح بلا سقف.

الطلب يصف العملية والمدينة والجهة المضمونة من غير نشر مبالغ على الموقع. الدراسة داخلية. إن قُبل الطلب يُوقَّع الاتفاق في نقطة الخدمة ويُسلَّم المفوّض نسخة. قبل التوقيع لا يوجد التزام.

لم تُنشر نماذج عقود ولا حدود رقمية لأن الشركة لم تسلمها لهذه النسخة من الموقع.$b$,
  body_en = $b$The guarantor service means the company may, after review, guarantee a defined part of the organization’s dealing, as the agreement text says: its scope, its limit, its term, and what releases the company. The name of the service does not mean every request is accepted, or that a guarantee is open-ended.

The request describes the operation, the city, and the party to be covered, without publishing amounts on the site. Review is internal. If the request is accepted, the agreement is signed at a service point and the authorized person receives a copy. Before signature there is no obligation.

No contract templates or numeric limits are published, because the company did not supply them for this version of the site.$b$,
  covers_ar = '["استقبال طلب الضمان من مفوّض المنظمة","مراجعة داخلية للنطاق","تحديد الحد والمدة في الاتفاق إن قُبل","التوقيع في نقطة الخدمة"]'::jsonb,
  covers_en = '["Receiving a guarantee request from the organization’s representative","An internal review of the scope","Setting the limit and term in the agreement if accepted","Signature at a service point"]'::jsonb,
  steps_ar = '["إرسال وصف العملية والمدينة","تقديم مستندات المنظمة التي تُطلب","انتظار نتيجة المراجعة","عند القبول: توقيع الاتفاق في الفرع","الاحتفاظ بالنسخة الموقعة كمرجع وحيد"]'::jsonb,
  steps_en = '["Send a description of the operation and the city","Provide the organization documents that are requested","Wait for the review","If accepted: sign the agreement at the branch","Keep the signed copy as the only reference"]'::jsonb,
  requirements_ar = '["مفوّض مخول بطلب الضمان","وصف مكتوب للنطاق المطلوب","عدم اعتبار هذه الصفحة ضماناً أو تفويضاً"]'::jsonb,
  requirements_en = '["A person authorized to request the guarantee","A written description of the scope requested","This page is not a guarantee or an authorization"]'::jsonb,
  fees_ar = 'مقابل الضمان، إن وُجد، يُكتب في الاتفاق ولا يُقدَّر على الموقع.',
  fees_en = 'Any charge for the guarantee is written in the agreement and is not estimated on the site.'
where slug = 'aid-guarantor';

update services set
  audience_ar = 'منظمة تودع لدى الشركة مبلغاً مخصصاً لغرض إنساني متفق عليه، لا وديعة استثمارية للأفراد.',
  audience_en = 'An organization depositing with the company an amount set aside for an agreed humanitarian purpose, not an investment deposit for individuals.',
  summary_ar = 'استلام مبلغ مخصص في الفرع مقابل إيصال. لا إيداع من الموقع ولا عرض للرصيد.',
  summary_en = 'An earmarked amount is received at the branch against a receipt. No deposit on the site and no balance on display.',
  body_ar = $b$الإيداع الإنساني استلام مبلغ من المنظمة لغرض سُمّي في الاتفاق، كتمويل توزيع لاحق أو تغطية عملية محددة. ليس حساب توفير، ولا يَعِد الموقع بعائد. الرصيد وحركته لا يظهران في الحساب الرقمي.

يُحضر المفوّض المبلغ أو وسيلة قبض تقبلها نقطة الخدمة، وتراجع الشركة التخويل، ثم تُصدر إيصالاً يذكر ما سُلّم. استخدام المبلغ لاحقاً يتم حسب الاتفاق، غالباً عبر خدمة التوزيع، لا بأمر من نموذج الموقع.

أي استفسار عن حركة مبلغ يتم عبر المفوّض وخدمة العملاء، لا عبر صفحة التتبع الخاصة بحوالات الأفراد.$b$,
  body_en = $b$A humanitarian deposit is the receipt of an amount from the organization for a purpose named in the agreement, such as funding a later distribution or covering a defined operation. It is not a savings account, and the site promises no return. The balance and its movements do not appear in the digital account.

The authorized person brings the amount, or a means of receipt the service point accepts. The company checks the authorization and issues a receipt for what was handed over. Later use of the amount follows the agreement, usually through the distribution service, not through an order on the website.

Questions about a movement go through the authorized person and customer service, not through the individual transfer-tracking page.$b$,
  covers_ar = '["تحديد الغرض في الاتفاق","استلام المبلغ في الفرع","إيصال بما سُلّم","استخدام لاحق حسب الاتفاق من غير رصيد على الموقع"]'::jsonb,
  covers_en = '["The purpose named in the agreement","Receipt of the amount at the branch","A receipt for what was handed over","Later use under the agreement, with no balance on the site"]'::jsonb,
  steps_ar = '["طلب الخدمة وتسمية الغرض والمدينة","تقديم تخويل الإيداع","تسليم المبلغ في نقطة الخدمة","استلام الإيصال","متابعة الاستخدام مع المفوّض لا من صفحة الحوالات"]'::jsonb,
  steps_en = '["Request the service and name the purpose and the city","Provide authorization to deposit","Hand over the amount at the service point","Take the receipt","Follow later use with the authorized person, not on the transfers page"]'::jsonb,
  requirements_ar = '["اتفاق أو تخويل مكتوب تقبله الشركة","إيداع فعلي في الفرع","مفوّض لاستلام الإيصال والسؤال عن الحركة"]'::jsonb,
  requirements_en = '["A written agreement or authorization the company accepts","The deposit made at the branch","An authorized person to take the receipt and ask about movements"]'::jsonb,
  fees_ar = 'عمولة الإيداع، إن وُجدت، تُذكر في الإيصال أو الاتفاق، لا على هذه الصفحة.',
  fees_en = 'Any deposit commission is stated on the receipt or in the agreement, not on this page.'
where slug = 'aid-deposit';

insert into faqs (service_slug, question_ar, question_en, answer_ar, answer_en, sort_order)
select v.service_slug, v.question_ar, v.question_en, v.answer_ar, v.answer_en, v.sort_order
from (values
  ('individuals', 'هل أرسل الحوالة من الصفحة؟', 'Can I send the transfer from the page?', 'لا. الإنشاء في الفرع. الصفحة للمتابعة بعد أن يصلك الرقم والرمز.', 'No. It is created at the branch. The page is for follow-up after you have the reference and code.', 10),
  ('corporate', 'هل طلب التواصل يحجز السعر؟', 'Does a contact request lock the rate?', 'لا. السعر يُعلن عند التنفيذ في الفرع، وطلب الموقع مجرد تنسيق.', 'No. The rate is stated when the deal is done at the branch. The website request only arranges the visit.', 11),
  ('online', 'هل يوجد تطبيق للجوال؟', 'Is there a mobile app?', 'لم يُسلَّم تطبيق مستقل. القناة الحالية هي هذا الموقع من المتصفح.', 'No separate app was supplied. The current channel is this website in the browser.', 12),
  ('currency-convert', 'أي السعرين أستخدم؟', 'Which of the two rates do I use?', 'إن بعتَ عملة أجنبية للشركة فالسعر سعر الشراء. إن اشتريتَ منها عملة أجنبية فالسعر سعر البيع. والمحوّل تقدير ما دام السطر تجريبياً.', 'If you sell foreign currency to the company, the rate is the buy rate. If you buy foreign currency from it, the rate is the sell rate. The converter is an estimate while the row is a sample.', 13),
  ('track-transfer', 'لماذا لا يظهر المبلغ؟', 'Why is the amount hidden?', 'حتى لا تُكشف الحوالة لمن حصل على الرقم وحده. الرمز مع الرقم يُظهر الحالة فقط.', 'So the transfer is not exposed to someone who has only the reference. The code together with the reference shows status only.', 14),
  ('suggestions', 'هل تُلغى الحوالة بمجرد الشكوى؟', 'Does a complaint cancel the transfer?', 'لا. الشكوى تُسجَّل للمتابعة. الإلغاء أو المراجعة يتمان عبر خدمة العملاء والفرع.', 'No. The complaint is logged for follow-up. Cancellation or review happens through customer service and the branch.', 15),
  ('humanitarian', 'هل أرفع كشف المستفيدين هنا؟', 'Do I upload the beneficiary list here?', 'لا. الكشوف لا تُرسل في النموذج العام. تُسلَّم في القناة التي تعتمدها الشركة بعد التواصل.', 'No. Lists are not sent in the public form. They are delivered through the channel the company accepts after contact.', 16),
  ('aid-cash', 'هل القسيمة تُشترى من الموقع؟', 'Is the voucher bought on the site?', 'لا. القسيمة مستند تسليم تتفق عليه المنظمة والشركة، ويُصرف في الفرع.', 'No. The voucher is a delivery document the organization and the company agree, and it is paid at the branch.', 17),
  ('aid-guarantor', 'هل الصفحة ذاتها ضمان؟', 'Is this page itself a guarantee?', 'لا. لا التزام قبل اتفاق موقّع في نقطة الخدمة، بعد قبول الطلب.', 'No. There is no obligation before an agreement is signed at a service point, after the request is accepted.', 18),
  ('aid-deposit', 'هل أرى رصيد الإيداع في حسابي؟', 'Can I see the deposit balance in my account?', 'لا. الحساب الرقمي لا يعرض أرصدة. الحركة تُراجع مع المفوّض وخدمة العملاء.', 'No. The digital account shows no balances. Movements are reviewed with the authorized person and customer service.', 19)
) as v(service_slug, question_ar, question_en, answer_ar, answer_en, sort_order)
where not exists (
  select 1 from faqs f where f.service_slug = v.service_slug and f.sort_order = v.sort_order
);
