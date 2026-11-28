/* 共通メニューの「開くメニュー」（2026-11-28）。生成元：LP制作/site_nav.py
   押す・Enter で開閉、Esc で閉じて親のボタンへ戻る、外側を押す／フォーカスが外れると閉じる。
   JSが動かないときは、親項目が writing.html・web.html へのリンクとして働く（CSSで指を乗せる／Tabで入ると開く） */
(function () {
  var dds = document.querySelectorAll(".gh .dd");
  if (!dds.length) return;
  function set(d, open) {
    d.classList.toggle("dd-open", open);
    var b = d.querySelector(".dd-btn"), label = d.querySelector(".dd-top").textContent;
    b.setAttribute("aria-expanded", open ? "true" : "false");
    b.setAttribute("aria-label", label + "のページ一覧を" + (open ? "閉じる" : "開く"));
  }
  function closeAll(except) { dds.forEach(function (d) { if (d !== except) set(d, false); }); }
  dds.forEach(function (d) {
    var b = d.querySelector(".dd-btn");
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !d.classList.contains("dd-open");
      closeAll(d); set(d, open);
    });
    d.addEventListener("focusout", function (e) { if (!d.contains(e.relatedTarget)) set(d, false); });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".gh .dd")) closeAll(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var o = document.querySelector(".gh .dd.dd-open");
    if (o) { set(o, false); o.querySelector(".dd-btn").focus(); }
  });
})();
