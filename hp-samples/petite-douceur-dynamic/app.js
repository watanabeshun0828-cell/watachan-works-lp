/* petite douceur 動く見本：ブラウザの中だけで動く仕組み（サーバー不要）
   データは data.js にまとめてあります。架空の店舗のサンプルです。 */
(function () {
  "use strict";

  var SHOP = window.SHOP, PRODUCTS = window.PRODUCTS, NEWS = window.NEWS;
  var DAYS = ["日", "月", "火", "水", "木", "金", "土"];
  var $ = function (id) { return document.getElementById(id); };
  var yen = function (n) { return n.toLocaleString("ja-JP") + "円"; };

  /* ── 日本時間の「いま」を取り出す（見ている人の端末の時刻設定に左右されないように） */
  function nowJST() {
    var p = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false
    }).formatToParts(new Date());
    var g = {}; p.forEach(function (x) { g[x.type] = x.value; });
    var hh = parseInt(g.hour, 10) % 24;
    var wd = DAYS.indexOf(g.weekday);
    return { y: +g.year, m: +g.month, d: +g.day, h: hh, min: +g.minute, minutes: hh * 60 + (+g.minute), wd: wd };
  }
  function toMin(hhmm) { var a = hhmm.split(":"); return (+a[0]) * 60 + (+a[1]); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(y, m, d) { return y + "-" + pad(m) + "-" + pad(d); }
  function addDays(y, m, d, n) { var t = new Date(Date.UTC(y, m - 1, d + n)); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), wd: t.getUTCDay() }; }
  function nextOpenDay(now) {
    for (var i = 1; i <= 7; i++) { var t = addDays(now.y, now.m, now.d, i); if (SHOP.hours[t.wd]) return { offset: i, wd: t.wd, hours: SHOP.hours[t.wd] }; }
    return null;
  }

  /* ── 1. 営業状況（営業中／まもなく閉店／準備中／本日終了／定休日） */
  function renderStatus() {
    var now = nowJST(), h = SHOP.hours[now.wd], el = $("status");
    var main = el.querySelector(".status-main"), sub = el.querySelector(".status-sub"), state;
    function nextText() {
      var n = nextOpenDay(now); if (!n) return "";
      var when = n.offset === 1 ? "明日" : DAYS[n.wd] + "曜日";
      return "次の営業：" + when + " " + n.hours.open.replace(/^0/, "") + "〜";
    }
    if (!h) { state = "closed"; main.textContent = "本日は定休日です"; sub.textContent = nextText(); }
    else {
      var o = toMin(h.open), c = toMin(h.close);
      if (now.minutes < o) { state = "soon"; main.textContent = "準備中（" + h.open.replace(/^0/, "") + " 開店）"; sub.textContent = "あと" + (o - now.minutes) + "分で開店します"; }
      else if (now.minutes >= c) { state = "closed"; main.textContent = "本日の営業は終了しました"; sub.textContent = nextText(); }
      else if (c - now.minutes <= 30) { state = "last"; main.textContent = "まもなく閉店です"; sub.textContent = h.close.replace(/^0/, "") + " まで（あと" + (c - now.minutes) + "分）"; }
      else { state = "open"; main.textContent = "営業中"; sub.textContent = h.close.replace(/^0/, "") + " まで"; }
    }
    el.setAttribute("data-state", state);
  }

  /* ── 2. 営業時間の表（今日の曜日に印を付ける） */
  function renderHours() {
    var now = nowJST(), body = document.querySelector("#hours-table tbody"), order = [1, 2, 3, 4, 5, 6, 0], html = "";
    order.forEach(function (wd) {
      var h = SHOP.hours[wd];
      html += '<tr' + (wd === now.wd ? ' class="today" aria-current="date"' : '') + '><td class="name">' + DAYS[wd] + "曜日" +
        (wd === now.wd ? ' <span class="badge">今日</span>' : '') + '</td><td class="desc">' +
        (h ? h.open.replace(/^0/, "") + "〜" + h.close.replace(/^0/, "") : "定休日") + "</td></tr>";
    });
    body.innerHTML = html;
  }

  /* ── 3. 今日の焼き上がり（次の焼き上がりを強調） */
  function renderBakes() {
    var now = nowJST(), h = SHOP.hours[now.wd], list = $("bake-list"), lead = $("bake-lead"), nextIdx = -1;
    if (!h) { lead.textContent = "本日は定休日です。次の営業日に、またお越しください。"; }
    else {
      for (var i = 0; i < SHOP.bakes.length; i++) { if (toMin(SHOP.bakes[i].time) > now.minutes) { nextIdx = i; break; } }
      if (nextIdx >= 0) { var diff = toMin(SHOP.bakes[nextIdx].time) - now.minutes; lead.textContent = "次の焼き上がりは " + SHOP.bakes[nextIdx].time.replace(/^0/, "") + "（あと" + Math.floor(diff / 60) + "時間" + (diff % 60) + "分）です。"; }
      else { lead.textContent = "本日の焼き上がりは、すべて終わりました。"; }
    }
    list.innerHTML = SHOP.bakes.map(function (b, i) {
      var past = h && toMin(b.time) <= now.minutes, cls = (i === nextIdx ? ' class="next"' : (past ? ' class="past"' : ''));
      return "<li" + cls + '><span class="t">' + b.time.replace(/^0/, "") + "</span><div><b>" + b.label + "</b>" +
        (i === nextIdx ? '<p><span class="badge">次の焼き上がり</span></p>' : (past ? "<p>焼き上がり済み（売り切れの場合があります）</p>" : "")) + "</div></li>";
    }).join("");
  }

  /* ── 4. お知らせ（種類で切り替え・NEW表示） */
  var newsTag = "すべて";
  function newsDate(n) {
    if (n.date) { var a = n.date.split("-"); return { y: +a[0], m: +a[1], d: +a[2], ago: null }; }
    var now = nowJST(), t = addDays(now.y, now.m, now.d, -n.daysAgo); return { y: t.y, m: t.m, d: t.d, ago: n.daysAgo };
  }
  function renderNews() {
    var tags = ["すべて"]; NEWS.forEach(function (n) { if (tags.indexOf(n.tag) < 0) tags.push(n.tag); });
    $("news-chips").innerHTML = tags.map(function (t) {
      return '<button type="button" class="chip" aria-pressed="' + (t === newsTag) + '" data-tag="' + t + '">' + t + "</button>";
    }).join("");
    var items = NEWS.filter(function (n) { return newsTag === "すべて" || n.tag === newsTag; });
    $("news-list").innerHTML = items.map(function (n) {
      var d = newsDate(n), isNew = d.ago !== null ? d.ago <= 7 : false;
      return '<li><div class="news-head"><time datetime="' + ymd(d.y, d.m, d.d) + '">' + d.y + "年" + d.m + "月" + d.d + "日</time>" +
        '<span class="tag">' + n.tag + "</span>" + (isNew ? '<span class="badge new">NEW</span>' : "") + "</div><h3>" + n.title + "</h3><p>" + n.body + "</p></li>";
    }).join("") || "<li><p>該当するお知らせはありません。</p></li>";
  }
  $("news-chips").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-tag]"); if (!b) return; newsTag = b.getAttribute("data-tag"); renderNews();
  });

  /* ── 5. 商品（種類・名前・価格順） */
  var cat = "すべて";
  function renderCats() {
    var cats = ["すべて"]; PRODUCTS.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    $("cat-chips").innerHTML = cats.map(function (c) {
      return '<button type="button" class="chip" aria-pressed="' + (c === cat) + '" data-cat="' + c + '">' + c + "</button>";
    }).join("");
  }
  function renderProducts() {
    var q = $("q").value.trim().toLowerCase(), sort = $("sort").value;
    var list = PRODUCTS.filter(function (p) {
      return (cat === "すべて" || p.cat === cat) && (!q || (p.name + p.desc).toLowerCase().indexOf(q) >= 0);
    });
    if (sort === "asc") list = list.slice().sort(function (a, b) { return a.price - b.price; });
    if (sort === "desc") list = list.slice().sort(function (a, b) { return b.price - a.price; });
    $("count").textContent = list.length + "件の商品が見つかりました";
    $("products").innerHTML = list.map(function (p) {
      var img = p.image ? '<button type="button" class="zoom" data-id="' + p.id + '" aria-label="' + p.name + 'の写真を拡大する"><img src="' + p.image + '" alt="' + p.name + 'の写真" loading="lazy"></button>'
        : '<div class="noimg" aria-hidden="true">' + p.cat + "</div>";
      return '<div class="card' + (p.cat === "どうぶつパン" ? " animal" : "") + '">' + img + '<div class="card-body"><span class="cat">' + p.cat + "</span><h3>" + p.name + "</h3><p>" + p.desc +
        '</p><span class="price">' + p.unit + " " + yen(p.price) + "</span></div></div>";
    }).join("") || '<p class="empty">条件に合う商品が見つかりませんでした。検索の言葉を変えてみてください。</p>';
  }
  $("cat-chips").addEventListener("click", function (e) { var b = e.target.closest("button[data-cat]"); if (!b) return; cat = b.getAttribute("data-cat"); renderCats(); renderProducts(); });
  $("q").addEventListener("input", renderProducts);
  $("sort").addEventListener("change", renderProducts);
  $("products").addEventListener("click", function (e) {
    var b = e.target.closest("button.zoom"); if (!b) return;
    var p = PRODUCTS.filter(function (x) { return x.id === b.getAttribute("data-id"); })[0];
    $("lb-img").src = p.image; $("lb-img").alt = p.name + "の写真"; $("lb-cap").textContent = p.name + "　" + p.unit + " " + yen(p.price);
    $("lightbox").showModal();
  });

  /* ── 6. ご予約：個数の選択・合計金額・日付と時間の制限・入力チェック・確認画面 */
  var qty = {}; PRODUCTS.forEach(function (p) { qty[p.id] = 0; });
  function renderOrder() {
    $("order-list").innerHTML = PRODUCTS.map(function (p) {
      return '<li><span class="o-name">' + p.name + '<small>' + p.unit + " " + yen(p.price) + '</small></span><span class="stepper">' +
        '<button type="button" data-id="' + p.id + '" data-d="-1" aria-label="' + p.name + 'を1つ減らす">−</button>' +
        '<output id="q-' + p.id + '" aria-live="polite">0</output>' +
        '<button type="button" data-id="' + p.id + '" data-d="1" aria-label="' + p.name + 'を1つ増やす">＋</button></span></li>';
    }).join("");
  }
  function total() { return PRODUCTS.reduce(function (s, p) { return s + p.price * qty[p.id]; }, 0); }
  function syncOrder() {
    PRODUCTS.forEach(function (p) { $("q-" + p.id).textContent = qty[p.id]; });
    $("total").textContent = yen(total());
    if (total() > 0) $("e-order").textContent = "";
  }
  $("order-list").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-id]"); if (!b) return;
    var id = b.getAttribute("data-id"), d = +b.getAttribute("data-d");
    qty[id] = Math.max(0, Math.min(20, qty[id] + d)); syncOrder();
  });

  var dateEl = $("f-date"), timeEl = $("f-time");
  function setDateMin() {
    var now = nowJST(), h = SHOP.hours[now.wd], closeMin = h ? toMin(h.close) : 0, start = 0;
    if (!h || now.minutes >= closeMin - 60) start = 1; // 閉店の1時間前を過ぎたら、翌日から
    var t = addDays(now.y, now.m, now.d, start); dateEl.min = ymd(t.y, t.m, t.d);
    var m = addDays(now.y, now.m, now.d, 30); dateEl.max = ymd(m.y, m.m, m.d);
  }
  function weekdayOf(str) { var a = str.split("-"); return new Date(Date.UTC(+a[0], +a[1] - 1, +a[2])).getUTCDay(); }
  function buildTimes() {
    $("e-date").textContent = "";
    if (!dateEl.value) { timeEl.innerHTML = '<option value="">先に、受け取り日を選んでください</option>'; return; }
    var wd = weekdayOf(dateEl.value), h = SHOP.hours[wd];
    if (!h) {
      $("e-date").textContent = DAYS[wd] + "曜日は定休日です。別の日を選んでください。";
      dateEl.value = ""; timeEl.innerHTML = '<option value="">先に、受け取り日を選んでください</option>'; return;
    }
    var now = nowJST(), isToday = dateEl.value === ymd(now.y, now.m, now.d), from = toMin(h.open), to = toMin(h.close) - 30, opts = '<option value="">選んでください</option>';
    if (isToday) from = Math.max(from, Math.ceil((now.minutes + 60) / 30) * 30); // 本日は、1時間後以降
    for (var m = from; m <= to; m += 30) { var t = pad(Math.floor(m / 60)) + ":" + pad(m % 60); opts += '<option value="' + t + '">' + t.replace(/^0/, "") + "</option>"; }
    timeEl.innerHTML = opts;
    if (from > to) { $("e-date").textContent = "この日は、受け付けできる時間が残っていません。別の日を選んでください。"; }
  }
  dateEl.addEventListener("change", buildTimes);

  function validate() {
    var ok = true, firstBad = null;
    function bad(id, msg, el) { $(id).textContent = msg; ok = false; if (!firstBad) firstBad = el; }
    ["e-name", "e-mail", "e-tel", "e-date", "e-time", "e-order"].forEach(function (id) { $(id).textContent = ""; });
    var name = $("f-name").value.trim(), mail = $("f-mail").value.trim(), tel = $("f-tel").value.trim();
    if (!name) bad("e-name", "お名前を入力してください。", $("f-name"));
    if (!mail) bad("e-mail", "メールアドレスを入力してください。", $("f-mail"));
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) bad("e-mail", "メールアドレスの形式を確認してください（例：example@mail.com）。", $("f-mail"));
    var digits = tel.replace(/[\s\-ー－()（）]/g, "");
    if (!tel) bad("e-tel", "電話番号を入力してください。", $("f-tel"));
    else if (!/^0\d{9,10}$/.test(digits)) bad("e-tel", "電話番号は、ハイフンありでも、なしでも、入力できます（例：090-1234-5678）。", $("f-tel"));
    if (!dateEl.value) bad("e-date", "受け取り日を選んでください。", dateEl);
    if (!timeEl.value) bad("e-time", "受け取り時間を選んでください。", timeEl);
    if (total() === 0) bad("e-order", "ご注文の商品を、1つ以上選んでください。", $("order-list").querySelector("button"));
    if (firstBad) firstBad.focus();
    return ok;
  }

  $("form").addEventListener("submit", function (e) {
    e.preventDefault(); $("done").hidden = true;
    if (!validate()) return;
    var wd = weekdayOf(dateEl.value), a = dateEl.value.split("-");
    var lines = PRODUCTS.filter(function (p) { return qty[p.id] > 0; }).map(function (p) { return p.name + " × " + qty[p.id] + "（" + yen(p.price * qty[p.id]) + "）"; });
    var rows = [["お名前", $("f-name").value.trim()], ["メール", $("f-mail").value.trim()], ["電話", $("f-tel").value.trim()],
      ["受け取り", (+a[1]) + "月" + (+a[2]) + "日（" + DAYS[wd] + "） " + timeEl.value.replace(/^0/, "")], ["ご注文", lines.join("\n")], ["合計（税込）", yen(total())]];
    if ($("f-note").value.trim()) rows.push(["ご要望", $("f-note").value.trim()]);
    $("summary").innerHTML = rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + esc(r[1]).replace(/\n/g, "<br>") + "</dd>"; }).join("");
    $("confirm").showModal();
  });
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  $("confirm").addEventListener("close", function () {
    if ($("confirm").returnValue === "ok") {
      var d = $("done"); d.textContent = "ありがとうございます。（見本のため、実際には送信されていません。実際のお店では、ここで、お店に届いたことをお知らせします。）";
      d.hidden = false; d.scrollIntoView({ behavior: "smooth", block: "center" });
      $("form").reset(); PRODUCTS.forEach(function (p) { qty[p.id] = 0; }); syncOrder(); buildTimes();
    }
  });
  $("form").addEventListener("reset", function () {
    setTimeout(function () { PRODUCTS.forEach(function (p) { qty[p.id] = 0; }); syncOrder(); buildTimes(); ["e-name", "e-mail", "e-tel", "e-date", "e-time", "e-order"].forEach(function (id) { $(id).textContent = ""; }); }, 0);
  });

  /* ── スマホのメニュー */
  var burger = document.querySelector(".burger"), links = $("nav-links");
  burger.addEventListener("click", function () { var open = links.classList.toggle("open"); burger.setAttribute("aria-expanded", open); });
  links.addEventListener("click", function (e) { if (e.target.closest("a")) { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

  /* ── スクロールの演出（動きを減らす設定の人には、出さない） */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var heroBg = document.querySelector(".hero-full .bg"), nav = document.querySelector(".site-nav"), bar = $("progress");
  var alts = document.querySelectorAll("section.alt"), ticking = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    nav.classList.toggle("scrolled", y > 10);
    if (!reduce) {
      if (heroBg && y < window.innerHeight * 1.2) heroBg.style.transform = "translate3d(0," + (y * 0.35) + "px,0) scale(1.08)"; // 背景を、文字よりゆっくり動かす
      for (var i = 0; i < alts.length; i++) {
        var r = alts[i].getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) alts[i].style.backgroundPosition = "0 " + (r.top * -0.15) + "px"; // 麦の模様が、ゆっくり流れる
      }
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // 見出し・カード・お知らせを、画面に入ったときに、ふわっと表示する
  function markReveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    var els = document.querySelectorAll(".section-head, .demo-box, .news-list li, .products .card, .timeline li, .form, .hours-table");
    els.forEach(function (el) {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 6) * 70 + "ms"; // 並んでいるものは、少しずつずらす
      io.observe(el);
    });
  }
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  // 絞り込みで作り直したカードにも、演出を付け直す
  ["products", "news-list"].forEach(function (id) { new MutationObserver(markReveal).observe($(id), { childList: true }); });

  /* ── 起動 */
  renderStatus(); renderHours(); renderBakes(); renderNews(); renderCats(); renderProducts(); renderOrder(); syncOrder(); setDateMin();
  markReveal(); onScroll();
  setInterval(function () { renderStatus(); renderBakes(); }, 30000); // 30秒ごとに、営業状況を更新
})();
