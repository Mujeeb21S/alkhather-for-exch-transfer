import { writeFileSync } from "node:fs";

const nav = [
  ["index.html", "الرئيسية"],
  ["about.html", "من نحن"],
  ["services.html", "الخدمات"],
  ["rates.html", "الأسعار"],
  ["branches.html", "الفروع"],
  ["transfers.html", "الحوالات"],
  ["contact.html", "تواصل"],
  ["faq.html", "الأسئلة"],
];

const head = (title, description) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#0B3D2E">
  <link rel="icon" href="assets/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="stylesheet" href="css/style.css">
  <script>
    try { if (localStorage.getItem("akh-theme") === "dark") document.documentElement.setAttribute("data-theme", "dark"); } catch (e) {}
  </script>
</head>
<body>
<a class="skip" href="#content">تخطي إلى المحتوى</a>
<div class="topbar">
  <div class="topbar-inner">
    <p><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ترخيص البنك المركزي اليمني رقم 486</p>
    <div class="topbar-actions">
      <a href="tel:+967712720300"><i class="fa-solid fa-phone" aria-hidden="true"></i> 712720300</a>
      <a href="https://wa.me/967712720300" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> واتساب</a>
      <button type="button" class="theme-toggle" data-theme-toggle aria-pressed="false" aria-label="التبديل إلى الوضع الداكن"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>
    </div>
  </div>
</div>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="index.html">
      <img src="assets/logo.png" alt="" width="455" height="413">
      <span><strong>الخضر للصرافة</strong><small>والتحويلات</small></span>
    </a>
    <button type="button" class="nav-toggle" data-nav-toggle aria-expanded="false" aria-label="القائمة"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
    <nav class="nav" data-nav aria-label="التنقل الرئيسي">
      ${nav.map(([href, label]) => `<a href="${href}"${title.startsWith(label) || (href === "index.html" && title.startsWith("الخضر للصرافة والتحويلات")) ? ' aria-current="page"' : ""}>${label}</a>`).join("\n      ")}
    </nav>
  </div>
</header>
<main id="content">
`;

const foot = `
</main>
<footer class="site-footer">
  <div class="footer-inner">
    <div>
      <p class="license"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ترخيص رقم 486</p>
      <p>شركة محسن الخضر للصرافة والتحويلات النقدية. منشأة مصرفية فردية بموجب القانون رقم 14 لسنة 2000. الموقع للتعريف والمتابعة، والتنفيذ في الفروع فقط.</p>
      <p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> مأرب، الشارع العام، جوار مؤسسة الكهرباء</p>
    </div>
    <div>
      <p><a href="tel:+967712720300">خدمة العملاء 712720300</a></p>
      <p><a href="tel:+9676304111">06304111</a> · <a href="tel:+9676303985">06303985</a></p>
      <p><a href="faq.html">الأسئلة</a> · <a href="privacy.html">الخصوصية</a> · <a href="terms.html">الشروط</a></p>
    </div>
  </div>
  <p class="fine">الخضر للصرافة والتحويلات — ترخيص البنك المركزي اليمني رقم 486</p>
</footer>
<a class="wa-float" href="https://wa.me/967712720300" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> واتساب</a>
<div class="dock">
  <a href="tel:+967712720300"><i class="fa-solid fa-phone" aria-hidden="true"></i> اتصال</a>
  <a href="https://wa.me/967712720300" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> واتساب</a>
</div>
<script src="js/main.js"></script>
</body>
</html>
`;

function page(file, title, description, body) {
  writeFileSync(new URL("../site/" + file, import.meta.url), head(title, description) + body + foot);
}

const intl = [
  "ويسترن يونيون", "موني غرام", "ريا لتحويل الأموال", "تيراباي", "ثونز", "يو بي تي", "شفت", "صرافة زمزم", "صرافة ألونوه", "إكسبريس موني", "دبي ريميت", "كاش إكسبريس",
];
const gulf = [
  "مصرف الراجحي", "خدمة إنجاز", "خدمة فوري – بنك الجزيرة", "خدمة كويك باي – البنك الأهلي", "مصرف الإنماء", "خدمة إرسال", "شركة بن يعلا", "زاجل للصرافة الكويتية", "شركة رضا الأنصاري",
];
const local = [
  "عدن اكسبرس", "القطيبي اكسبرس", "أبشر كاش", "الحداد اكسبرس", "الصلاحي اكسبرس", "الذهبي اكسبرس", "الإنماء اكسبرس", "المفلحي اكسبرس", "الوطنية للحوالات", "العمقي", "البسيري", "الطريحي", "أبوسند الفروي", "الناصر اكسبرس", "دادية اونلاين",
];
const chips = (items) => `<ul class="partners">${items.map((name) => `<li>${name}</li>`).join("")}</ul>`;

page("index.html", "الخضر للصرافة والتحويلات", "شركة محسن الخضر للصرافة والتحويلات النقدية. ترخيص 486، فروع في مأرب وصنعاء وشبوة، ومتابعة الحوالة دون كشف أطرافها.", `
<div class="wrap hero">
  <div>
    <p class="kicker">AL KHADHER EXCHANGE</p>
    <h1>صرافة وتحويلات بوضوح يُعتمد عليه</h1>
    <p class="lede">شركة محسن الخضر للصرافة والتحويلات النقدية. تعرّف على الفروع والخدمات، وتابع حالة الحوالة دون كشف أطرافها. الصرف والتحويل يتمان في نقطة الخدمة، لا من هذه الصفحة.</p>
    <div class="actions">
      <a class="btn btn-primary" href="transfers.html"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> متابعة حوالة</a>
      <a class="btn btn-ghost" href="branches.html"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> الفروع</a>
    </div>
    <ul class="pills">
      <li><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ترخيص 486</li>
      <li><i class="fa-solid fa-lock" aria-hidden="true"></i> استعلام بلا كشف الأطراف</li>
      <li><i class="fa-solid fa-building" aria-hidden="true"></i> سبع نقاط خدمة</li>
    </ul>
  </div>
  <figure class="figure">
    <img src="assets/head-office.jpg" alt="واجهة المركز الرئيسي للخضر للصرافة في مأرب">
    <figcaption>المركز الرئيسي في مأرب، الشارع العام، جوار مؤسسة الكهرباء.</figcaption>
  </figure>
</div>
<section class="wrap section">
  <h2>لماذا الخضر</h2>
  <div class="grid-4">
    <article class="card"><div class="icon"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></div><h3>سبع نقاط خدمة</h3><p>مركز رئيسي في مأرب، وفروع في حريب والمحطة وصافر ومفرق السد وصنعاء وشبوة.</p></article>
    <article class="card"><div class="icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></div><h3>ترخيص موثّق</h3><p>ترخيص رقم 486 صادر عن البنك المركزي اليمني بموجب القانون رقم 14 لسنة 2000.</p></article>
    <article class="card"><div class="icon"><i class="fa-solid fa-lock" aria-hidden="true"></i></div><h3>خصوصية الحوالة</h3><p>المتابعة لا تعرض الاسم ولا المبلغ ولا الهاتف على هذه الصفحة.</p></article>
    <article class="card"><div class="icon"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i></div><h3>قناة شكوى واضحة</h3><p>راسل خدمة العملاء على 712720300 واحتفظ بما يفيد المتابعة.</p></article>
  </div>
</section>
<section class="wrap section">
  <h2>الخدمات</h2>
  <div class="grid-3">
    <a class="card media-card" href="services.html"><img src="assets/individuals.jpg" alt=""><div><h3>الأفراد</h3><p>صرف وحوالات تُنجز في الفرع.</p></div></a>
    <a class="card media-card" href="services.html"><img src="assets/corporate.jpg" alt=""><div><h3>الشركات</h3><p>تنسيق مسبق ثم تنفيذ في نقطة الخدمة.</p></div></a>
    <a class="card media-card" href="services.html"><img src="assets/humanitarian.jpg" alt=""><div><h3>المنظمات</h3><p>نقد وقسائم، وضامن، وإيداع. دون كشوف على الموقع.</p></div></a>
  </div>
</section>
`);

page("about.html", "من نحن | الخضر للصرافة", "نبذة شركة محسن الخضر للصرافة والتحويلات النقدية، رسالتها ورؤيتها وقيمها، وترخيص 486.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / من نحن</p>
  <h1>من نحن</h1>
  <p class="lede">شركة محسن الخضر للصرافة والتحويلات النقدية.</p>
</div>
<section class="wrap section grid-2">
  <article class="card">
    <h2>نبذة</h2>
    <p>منشأة مصرفية فردية يمنية تمارس نشاطها المصرفي ضمن النطاق الجغرافي للجمهورية اليمنية، بموجب القانون رقم 14 لسنة 2000، وتحمل ترخيصاً رسمياً رقم 486 صادراً عن البنك المركزي اليمني. يقع مكتبها الرئيسي في مأرب، الشارع العام، جوار مؤسسة الكهرباء.</p>
    <h2>الرسالة</h2>
    <p>الإسهام في التنمية الاجتماعية والاقتصادية ورفع المستوى المعيشي للفرد والمجتمع، عبر تقديم خدمات مالية متميزة وحديثة تتلاءم مع متطلبات الحركة المالية، وتعزز قدرات الشركة وجودة أدائها المصرفي بما يرضي عملاءها.</p>
    <h2>الرؤية</h2>
    <p>إيصال الخدمات المالية والمصرفية لكل مواطن، وتغطية المناطق وخصوصاً النائية، مع الطموح إلى مشاريع تمويل تدعم الشباب والفئات الفقيرة في محافظات اليمن.</p>
  </article>
  <figure class="figure">
    <img src="assets/head-office.jpg" alt="مبنى المركز الرئيسي">
    <figcaption>المركز الرئيسي، مأرب.</figcaption>
  </figure>
</section>
<section class="wrap section">
  <h2>الأهداف</h2>
  <div class="grid-3">
    <article class="card"><h3>جودة بكلفة مناسبة</h3><p>خدمات مالية وفق أساليب العمل المعتمدة، بجودة عالية وكلفة تلائم ظروف العملاء.</p></article>
    <article class="card"><h3>انتشار أقرب للناس</h3><p>توسيع الحضور في المدن والأرياف والاقتراب من العملاء.</p></article>
    <article class="card"><h3>كوادر تؤمن بالقيم</h3><p>استيعاب كفاءات متميزة تؤمن بمبادئ الشركة.</p></article>
  </div>
</section>
<section class="wrap section">
  <h2>القيم</h2>
  <div class="grid-2">
    <article class="card"><h3>الالتزام</h3><p>الالتزام بأحكام الشريعة الإسلامية في التعاملات، وبالقوانين والتعليمات الصادرة عن جهات الإشراف، وبأداء مهني يناسب ظروف مناطق الفروع.</p></article>
    <article class="card"><h3>الأمانة</h3><p>تؤدي الشركة نشاطها بأمانة وتفانٍ. الأمانة هي الجسر الذي يصلها بعملائها.</p></article>
    <article class="card"><h3>الاحترام</h3><p>احترام متبادل مع العملاء والموظفين، ومساواة بغض النظر عن الدين أو الجغرافيا أو الجنسية أو العرق. خصوصية العملاء لا تُفشى.</p></article>
    <article class="card"><h3>الوضوح</h3><p>الوضوح في الإجراءات مع الموظفين والعملاء والجهات الرسمية، وقنوات تواصل لإزالة اللبس.</p></article>
  </div>
</section>
<section class="wrap section card">
  <h2>الاستراتيجية</h2>
  <p>وضعت قيادة الشركة استراتيجية ممتدة للتطور والنمو والتجديد، بما يجعل الشركة منشأة راسخة في السوق المالية ويميز خدماتها. تسعى إلى تطوير خدماتها والاقتراب من عملائها في المدن والأرياف، والعناية بكوادرها بالتأهيل.</p>
</section>
<section class="wrap section">
  <h2>شركاء التحويل</h2>
  <p class="muted">الأسماء كما ذكرتها الشركة. لا شعارات ولا رسوم منشورة هنا.</p>
  <article class="card"><h3>دولي</h3>${chips(intl)}</article>
  <article class="card"><h3>خليجي</h3>${chips(gulf)}</article>
  <article class="card"><h3>محلي بترخيص البنك المركزي</h3>${chips(local)}</article>
</section>
`);

page("services.html", "الخدمات | الخضر للصرافة", "خدمات الأفراد والشركات والمنظمات الإنسانية لدى الخضر للصرافة. التنفيذ في الفرع، ولا تُرفع كشوف من الموقع.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / الخدمات</p>
  <h1>الخدمات</h1>
  <p class="lede">ثلاث قنوات. لا يُنشأ صرف ولا حوالة من المتصفح.</p>
</div>
<section class="wrap section grid-2">
  <article class="card media-card">
    <img src="assets/individuals.jpg" alt="">
    <div>
      <h2>خدمات الأفراد</h2>
      <p>شراء العملات المعتمدة وبيعها، وإرسال حوالة أو استلامها، يتم في الفرع بعد إبراز الهوية والاطلاع على السعر قبل التأكيد.</p>
      <ul>
        <li>اختر الفرع من الدليل.</li>
        <li>اطلع على السعر أو بيانات الحوالة قبل الموافقة.</li>
        <li>احتفظ بالإيصال، ومع الحوالة بالرقم والرمز.</li>
      </ul>
      <p class="hint">لا تُنشر تعرفة ثابتة هنا. الرسم يُذكر في نقطة الخدمة ويظهر في الإيصال.</p>
    </div>
  </article>
  <article class="card media-card">
    <img src="assets/corporate.jpg" alt="">
    <div>
      <h2>الشركات وكبار العملاء</h2>
      <p>للشركات والتجار ومن يحتاج تنسيقاً مسبقاً. الطلب عبر صفحة التواصل لا يحجز سعراً ولا يحرّك مبلغاً. خدمة العملاء تحدد الموعد، والتنفيذ في الفرع بواسطة المفوّض.</p>
      <a class="btn btn-primary" href="contact.html">إرسال طلب</a>
    </div>
  </article>
</section>
<section class="wrap section">
  <h2>المنظمات الإنسانية</h2>
  <div class="grid-3">
    <article class="card media-card"><img src="assets/aid-cash.jpg" alt=""><div><h3>النقد والقسائم</h3><p>تنسيق توزيع وفق اتفاق مع المنظمة. لا يُرفع كشف مستفيدين من الموقع.</p></div></article>
    <article class="card media-card"><img src="assets/aid-guarantor.jpg" alt=""><div><h3>الضامن</h3><p>مسار يُرتب مع خدمة العملاء. الصفحة ليست ضماناً قائماً بذاته.</p></div></article>
    <article class="card media-card"><img src="assets/aid-deposit.jpg" alt=""><div><h3>الإيداع الإنساني</h3><p>استلام مبلغ لغرض مسمى في الاتفاق. ليس حساب توفير، ولا يُعرض رصيد على الموقع.</p></div></article>
  </div>
</section>
`);

page("rates.html", "الأسعار | الخضر للصرافة", "محوّل تقديري يعتمد السعر الذي أُعلن لك في الفرع. لا لوحة أسعار تنفيذية على الموقع.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / الأسعار</p>
  <h1>أسعار الصرف</h1>
  <p class="lede">لا تُعرض لوحة أسعار على هذا الموقع. السعر الملزم هو الذي يعلنه الموظف قبل إتمام العملية.</p>
</div>
<section class="wrap section grid-2">
  <form class="card form" data-rate-form>
    <h2>محوّل تقديري</h2>
    <label>المبلغ<input name="amount" inputmode="decimal" required aria-describedby="hint-amount"></label>
    <p class="hint" id="hint-amount">اكتب المبلغ الذي تريد تقديره، لا يُنفَّذ شيء من هنا.</p>
    <label>من<select name="from"><option value="USD">دولار أمريكي</option><option value="SAR">ريال سعودي</option><option value="YER">ريال يمني</option><option value="EUR">يورو</option></select></label>
    <label>إلى<select name="to"><option value="YER">ريال يمني</option><option value="USD">دولار أمريكي</option><option value="SAR">ريال سعودي</option><option value="EUR">يورو</option></select></label>
    <label>ريال يمني مقابل 1 من عملة المصدر<input name="rateFrom" inputmode="decimal" aria-describedby="hint-rate"></label>
    <label>ريال يمني مقابل 1 من عملة الوجهة<input name="rateTo" inputmode="decimal"></label>
    <p class="hint" id="hint-rate">انقل الرقم كما سمعته في الفرع. إن كانت العملة الريال اليمني يُؤخذ سعرها 1.</p>
    <button class="btn btn-primary" type="submit">احسب التقدير</button>
    <p class="result" data-rate-out data-empty="1" role="status"></p>
  </form>
  <article class="card">
    <h2>كيف يُقرأ السعر</h2>
    <p>إن بعتَ عملة أجنبية للشركة فالسعر سعر الشراء. إن اشتريتَ منها عملة أجنبية فالسعر سعر البيع. بين عملتين أجنبيتين يمر التقدير عبر الريال: قسمة مبلغ المصدر في سعره ثم قسمته على سعر الوجهة.</p>
    <p class="note">الناتج تقدير حسابي فقط، وليس أمراً للتنفيذ.</p>
  </article>
</section>
`);

const branches = [
  ["المركز الرئيسي", "مأرب، الشارع العام، جوار مؤسسة الكهرباء", [["06304111", "+9676304111"], ["06303985", "+9676303985"], ["خدمة العملاء 712720300", "+967712720300"]], "الإدارة: 06304990 · 06304991 · 711555724 · 777555724"],
  ["فرع حريب", "الشارع العام، أمام سبافون", [["06301277", "+9676301277"], ["06301280", "+9676301280"]], ""],
  ["فرع صنعاء", "شارع تعز، جوار دار الأيتام", [["01612224", "+9671612224"]], ""],
  ["فرع المحطة", "محطة بن معيلي، أمام سوق القات", [["06306517", "+9676306517"]], ""],
  ["فرع صافر", "سوق صافر، أمام الجامع", [["771871177", "+967771871177"]], ""],
  ["فرع شبوة", "العقلة، أمام بوابة الشركة النفطية", [["715710397", "+967715710397"], ["712042080", "+967712042080"]], ""],
  ["فرع مفرق السد", "مفرق السد", [["711969809", "+967711969809"]], ""],
];

page("branches.html", "الفروع | الخضر للصرافة", "عناوين فروع الخضر للصرافة وأرقامها في مأرب وصنعاء وشبوة، مع رابط خرائط من نص العنوان.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / الفروع</p>
  <h1>الفروع</h1>
  <p class="lede">سبع نقاط خدمة. طابق الرقم مع هذه الصفحة قبل أي تحويل.</p>
</div>
<section class="wrap section branch-list">
  ${branches.map(([name, address, phones, extra]) => `<article class="card branch">
    <h2><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${name}</h2>
    <p>${address}</p>
    <div class="phones">${phones.map(([label, tel]) => `<a href="tel:${tel}"><i class="fa-solid fa-phone" aria-hidden="true"></i> ${label}</a>`).join("")}
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address + " اليمن")}" target="_blank" rel="noopener"><i class="fa-solid fa-map" aria-hidden="true"></i> الخرائط</a>
    </div>
    ${extra ? `<p class="hint">${extra}</p>` : ""}
  </article>`).join("\n")}
</section>
`);

page("transfers.html", "الحوالات | الخضر للصرافة", "متابعة الحوالة تتم مع خدمة العملاء بالرقم والرمز. الصفحة لا تعرض الأسماء ولا المبالغ.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / الحوالات</p>
  <h1>متابعة الحوالة</h1>
  <p class="lede">الحوالة تُنشأ في الفرع. هذه الصفحة لا تعرض الاسم ولا المبلغ ولا هاتف الطرف الآخر.</p>
</div>
<section class="wrap section grid-2">
  <form class="card form" data-track-form>
    <h2>الاستعلام</h2>
    <label>رقم الحوالة<input name="reference" required autocomplete="off" aria-describedby="hint-ref"></label>
    <p class="hint" id="hint-ref">الرقم الصادر من نقطة الخدمة.</p>
    <label>رمز التحقق<input name="pin" required autocomplete="off" aria-describedby="hint-pin"></label>
    <p class="hint" id="hint-pin">لا تكتب الرمز في واتساب أو في نموذج الشكوى. اذكره هاتفياً لخدمة العملاء فقط.</p>
    <button class="btn btn-primary" type="submit">متابعة</button>
    <p class="result" data-track-out data-empty="1" role="status"></p>
  </form>
  <article class="card">
    <h2>مسار الاستلام</h2>
    <ol class="steps">
      <li><b>1</b><span>تُنشأ الحوالة في الفرع وتستلم رقماً ورمزاً.</span></li>
      <li><b>2</b><span>المستفيد يتوجه إلى مدينة الاستلام بعد التأكد من الحالة مع خدمة العملاء.</span></li>
      <li><b>3</b><span>يبرز هويته والرمز في نقطة الخدمة.</span></li>
    </ol>
    <h3>حالات تعريفية</h3>
    <p class="muted">قيد الإنشاء، قيد المعالجة، تم الإرسال، جاهزة للاستلام، تم الاستلام، ملغاة، مرفوضة. هذه مسميات عامة وليست نتيجة حوالتك.</p>
  </article>
</section>
`);

page("contact.html", "تواصل | الخضر للصرافة", "تواصل مع خدمة عملاء الخضر للصرافة على 712720300 أو واتساب الرقم نفسه.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / تواصل</p>
  <h1>تواصل</h1>
  <p class="lede">خدمة العملاء 712720300. النموذج يفتح واتساب ولا يحفظ رسالة على الموقع.</p>
</div>
<section class="wrap section grid-2">
  <form class="card form" data-wa-form>
    <h2>رسالة</h2>
    <label>الاسم<input name="name" required autocomplete="name"></label>
    <label>الهاتف<input name="phone" required inputmode="tel" autocomplete="tel" aria-describedby="hint-phone"></label>
    <p class="hint" id="hint-phone">رقم يستطيع الموظف الرد عليه.</p>
    <label>الموضوع<select name="topic"><option>استفسار</option><option>شركات</option><option>منظمات</option><option>شكوى</option></select></label>
    <label>الرسالة<textarea name="message" required aria-describedby="hint-msg"></textarea></label>
    <p class="hint" id="hint-msg">لا تضع رمز الحوالة ولا كلمة سر في النص.</p>
    <input name="company" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" >
    <button class="btn btn-primary" type="submit"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> إرسال عبر واتساب</button>
  </form>
  <article class="card">
    <h2>أرقام مباشرة</h2>
    <p><a href="tel:+967712720300">خدمة العملاء 712720300</a></p>
    <p><a href="https://wa.me/967712720300" target="_blank" rel="noopener">واتساب 712720300</a></p>
    <p>المركز: <a href="tel:+9676304111">06304111</a> · <a href="tel:+9676303985">06303985</a></p>
    <details>
      <summary>هواتف الإدارة</summary>
      <p>06304990 · 06304991 · 711555724 · 777555724</p>
    </details>
    <p class="note">للشكوى: اذكر الفرع أو رقم الحوالة إن وُجد، دون الرمز. المعالجة عبر خدمة العملاء ثم الفرع.</p>
  </article>
</section>
`);

page("faq.html", "الأسئلة | الخضر للصرافة", "أسئلة شائعة عن الصرف والحوالات والفروع لدى الخضر للصرافة.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / الأسئلة</p>
  <h1>الأسئلة</h1>
</div>
<section class="wrap section">
  ${[
    ["هل أستطيع إرسال حوالة من الموقع؟", "لا. إنشاء الحوالة يتم في الفرع. الموقع للتعريف والتواصل."],
    ["هل تظهر أسماء أطراف الحوالة؟", "لا. هذه الصفحة لا تعرض اسماً ولا مبلغاً ولا هاتفاً."],
    ["أين السعر الملزم؟", "في نقطة الخدمة قبل التنفيذ. المحوّل يحسب فقط الأرقام التي تدخلها أنت."],
    ["كيف أتحقق من رقم فرع؟", "طابقه مع صفحة الفروع قبل التحويل. القناة الرسمية لخدمة العملاء هي 712720300."],
    ["هل أرسل رمز الحوالة في واتساب؟", "لا. اذكر الرمز في مكالمة مع خدمة العملاء فقط."],
    ["هل أرفع كشف مستفيدين للمنظمة؟", "لا. الكشوف لا تُرفع من الموقع. نسّق القناة مع خدمة العملاء."],
  ].map(([q, a]) => `<details class="card"><summary>${q}</summary><p>${a}</p></details>`).join("\n")}
</section>
`);

page("privacy.html", "الخصوصية | الخضر للصرافة", "كيف يتعامل موقع الخضر للصرافة مع البيانات: لا حفظ للنماذج على الموقع، ولا عرض لبيانات أطراف الحوالة.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / الخصوصية</p>
  <h1>الخصوصية</h1>
</div>
<section class="wrap section card">
  <p>هذا الموقع صفحة تعريف. لا ينشئ حساباً، ولا يخزّن نماذج التواصل على خادم الشركة. عند الإرسال يفتح واتساب على هاتفك برقم خدمة العملاء 712720300.</p>
  <p>صفحة الحوالات لا تعرض الاسم ولا المبلغ ولا الهاتف. لا تكتب رمز التحقق في أي نموذج.</p>
  <p>يُحفظ اختيار الوضع الفاتح أو الداكن في متصفحك فقط حتى يبقى عند عودتك.</p>
  <p>أرقام الفروع المنشورة هي قنوات الشركة. طابق أي رقم مع صفحة الفروع قبل التعامل.</p>
</section>
`);

page("terms.html", "شروط الاستخدام | الخضر للصرافة", "استخدام موقع الخضر للصرافة تعريفي. الصرف والتحويل يتمان في الفروع بموجب ترخيص 486.", `
<div class="wrap page-head">
  <p class="crumbs"><a href="index.html">الرئيسية</a> / الشروط</p>
  <h1>شروط الاستخدام</h1>
</div>
<section class="wrap section card">
  <p>الموقع للتعريف بشركة محسن الخضر للصرافة والتحويلات النقدية، ترخيص البنك المركزي اليمني رقم 486، القانون رقم 14 لسنة 2000.</p>
  <p>لا يُنفَّذ صرف ولا تحويل ولا حجز سعر من المتصفح. السعر والرسم الملزمان هما المعلنان في الفرع قبل إتمام العملية، ويظهران في الإيصال.</p>
  <p>أسماء شركاء التحويل منشورة للتعريف، دون رسوم أو ادّعاء تنفيذ من هذه الصفحة.</p>
  <p>باستخدامك النموذج فأنت تنتقل إلى واتساب. لا تضمن الصفحة وصول الرسالة إلا إذا اكتملت من تطبيقك.</p>
</section>
`);

console.log("static pages written");
