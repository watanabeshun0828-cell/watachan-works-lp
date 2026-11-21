/* お店の情報（ここを書き換えると、サイトの表示が変わります）
   実際の納品では、お客様がこのファイルの文字を直すだけで、お知らせ・商品・営業時間を更新できる形にします。
   架空のお店のサンプルです。2026-11-20：静的な見本（どうぶつパンと焼き菓子の店）とそろえました。 */

// 営業時間（0=日曜 … 6=土曜）。null の曜日は定休日。
window.SHOP = {
  name: "petite douceur",
  hours: {
    0: { open: "08:00", close: "18:00" },
    1: { open: "08:00", close: "18:00" },
    2: null, // 火曜定休
    3: { open: "08:00", close: "18:00" },
    4: { open: "08:00", close: "18:00" },
    5: { open: "08:00", close: "18:00" },
    6: { open: "08:00", close: "18:00" }
  }
};

// 商品（image が空の商品は、文字だけのカードになります）。2026-11-21：お店の作り直し（v3）に合わせた品ぞろえ
var IMG = "../petite-douceur/img/";
window.PRODUCTS = [
  { id: "bread",    cat: "パン",         name: "毎日の食パン",         desc: "北海道産小麦100%。卵を使わない角食パン。毎朝8時に焼き上がります。", price: 480, unit: "1斤", image: IMG + "bk-bread-800.jpg" },
  { id: "croissant",cat: "パン",         name: "クロワッサン",         desc: "発酵バターで層を重ねて。焼き上がりは8時と11時です。", price: 280, unit: "1個", image: IMG + "pd-p-croissant.jpg" },
  { id: "campagne", cat: "パン",         name: "カンパーニュ",         desc: "粉をふった、皮の香ばしい田舎パン。半分からお分けします。", price: 520, unit: "1/2", image: IMG + "pd-p-campagne.jpg" },
  { id: "baguette", cat: "パン",         name: "バゲット",             desc: "外はばりっと、中はもっちり。夕方までに売り切れることがあります。", price: 320, unit: "1本", image: IMG + "pd-p-baguette.jpg" },
  { id: "butter",   cat: "焼き菓子",     name: "バターサンド",         desc: "発酵バターのクリームと、ほろ苦いキャラメル。", price: 320, unit: "1個", image: IMG + "bk-butter-800.jpg" },
  { id: "galette",  cat: "焼き菓子",     name: "ガレット・ブルトンヌ", desc: "厚めに焼いた、ざくざくのバタークッキー。", price: 260, unit: "1枚", image: IMG + "pd-p-galette.jpg" },
  { id: "set",      cat: "焼き菓子",     name: "冬の焼き菓子セット",   desc: "5種類の詰め合わせ。前日17時までのご予約で、のしをお付けします。", price: 1480, unit: "1箱", image: IMG + "bk-set-800.jpg" },
  { id: "bear",     cat: "どうぶつパン", name: "くまのチョコパン",     desc: "棚のいちばん下の段に。顔はひとつずつ手で描いています。", price: 220, unit: "1個", image: IMG + "bk-bear.jpg" },
  { id: "cat",      cat: "どうぶつパン", name: "ねこのカスタードパン", desc: "平飼い卵の自家製カスタード入り。", price: 240, unit: "1個", image: IMG + "bk-cat.jpg" }
];

// お知らせ。daysAgo は「何日前の投稿か」（サンプルでは、いつ開いても NEW が見えるよう、日数で書いています。
// 実際の納品では、date: "2026-11-03" のように、日付を直接書きます）
window.NEWS = [
  { daysAgo: 1,  tag: "新商品",   title: "冬の焼き菓子セットを始めました", body: "シュトーレンは12月だけのお取り扱いです。箱入りは前日17時までにご予約ください。" },
  { daysAgo: 4,  tag: "お休み",   title: "年末年始は、12月29日から1月4日までお休みします", body: "取り置きは、12月28日の受け取り分まで承ります。" },
  { daysAgo: 9,  tag: "新商品",   title: "クロワッサンの焼き上がりを、1日2回にしました", body: "8時と11時に焼き上がります。取り置きは前日17時まで承ります。" },
  { daysAgo: 21, tag: "お知らせ", title: "ホームページを新しくしました", body: "営業状況や、ご予約が、見やすくなりました。" }
];
