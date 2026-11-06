/* سلوك مشترك: الوضع، القائمة، المحوّل، ونماذج واتساب. لا يتصل بنظام مالي. */
(function () {
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var navBtn = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function paint(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try { localStorage.setItem("akh-theme", theme); } catch (err) { /* التخزين قد يكون ممنوعاً */ }
    if (!toggle) return;
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.innerHTML = '<i class="fa-solid ' + (dark ? "fa-sun" : "fa-moon") + '" aria-hidden="true"></i>';
    toggle.setAttribute("aria-label", dark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن");
  }

  var saved = "light";
  try { saved = localStorage.getItem("akh-theme") === "dark" ? "dark" : "light"; } catch (err) { saved = "light"; }
  paint(saved);

  if (toggle) {
    toggle.addEventListener("click", function () {
      paint(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  if (navBtn && nav) {
    navBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      navBtn.innerHTML = '<i class="fa-solid ' + (open ? "fa-xmark" : "fa-bars") + '" aria-hidden="true"></i>';
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        navBtn.setAttribute("aria-expanded", "false");
        navBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      }
    });
  }

  var rateForm = document.querySelector("[data-rate-form]");
  if (rateForm) {
    var out = document.querySelector("[data-rate-out]");
    rateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var amount = Number(rateForm.amount.value);
      var from = rateForm.from.value;
      var to = rateForm.to.value;
      var rateFrom = from === "YER" ? 1 : Number(rateForm.rateFrom.value);
      var rateTo = to === "YER" ? 1 : Number(rateForm.rateTo.value);
      if (!(amount > 0) || !(rateFrom > 0) || !(rateTo > 0) || from === to) {
        out.dataset.empty = "0";
        out.textContent = "أدخل مبلغاً أكبر من صفر، وسعرين مختلفين كما أُعلنا في الفرع.";
        return;
      }
      var value = (amount * rateFrom) / rateTo;
      out.dataset.empty = "0";
      out.textContent = "التقدير: " + value.toLocaleString("ar-YE", { maximumFractionDigits: 2 }) + " " + to + ". هذا الرقم من الأسعار التي كتبتها، والسعر الملزم هو المعلن في الفرع قبل التنفيذ.";
    });
    function syncRates() {
      rateForm.rateFrom.disabled = rateForm.from.value === "YER";
      rateForm.rateTo.disabled = rateForm.to.value === "YER";
    }
    rateForm.from.addEventListener("change", syncRates);
    rateForm.to.addEventListener("change", syncRates);
    syncRates();
  }

  var track = document.querySelector("[data-track-form]");
  if (track) {
    track.addEventListener("submit", function (event) {
      event.preventDefault();
      var box = document.querySelector("[data-track-out]");
      box.dataset.empty = "0";
      box.textContent = "هذه الصفحة لا تتصل بنظام الحوالات، ولا تعرض الاسم أو المبلغ أو الهاتف. للمتابعة اتصل بخدمة العملاء على 712720300 واذكر الرقم والرمز مشافهة. لا ترسل الرمز في واتساب.";
    });
  }

  document.querySelectorAll("[data-wa-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      if (String(data.get("company") || "").trim()) return;
      var lines = ["رسالة من موقع الخضر للصرافة"];
      ["name", "phone", "topic", "message"].forEach(function (key) {
        var value = String(data.get(key) || "").trim();
        if (value) lines.push(key + ": " + value);
      });
      var url = "https://wa.me/967712720300?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  });
})();
