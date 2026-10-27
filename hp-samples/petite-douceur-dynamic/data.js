/* お店の情報（ここを書き換えると、サイトの表示が変わります）
   実際の納品では、お客様がこのファイルの文字を直すだけで、お知らせ・商品・営業時間を更新できる形にします。
   架空のお店のサンプルです。 */

// 営業時間（0=日曜 … 6=土曜）。open が null の曜日は定休日。
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
  },
  // 焼き上がりの時間（営業日ごとに同じ）
  bakes: [
    { time: "08:00", label: "食パン・ハーフサイズ食パン" },
    { time: "10:00", label: "どうぶつパン・バターサンド・フィナンシェ" },
    { time: "14:00", label: "午後の焼き菓子・2回目の食パン" }
  ]
};

// 商品（image が空の商品は、文字だけのカードになります）
window.PRODUCTS = [
  { id: "butter",   cat: "焼き菓子",   name: "バターサンド",         desc: "発酵バターとほろ苦キャラメルの、シンプルな組み合わせ。", price: 320,  unit: "1個", image: "../petite-douceur/img/item-butter.jpg" },
  { id: "financier",cat: "焼き菓子",   name: "フィナンシェ",         desc: "焦がしバターの香りが広がる、しっとりとした焼き菓子。",   price: 240,  unit: "1個", image: "img/item-financier.jpg" },
  { id: "galette",  cat: "焼き菓子",   name: "ガレット・ブルトンヌ", desc: "厚めに焼いた、ざくざくとした食感のバタークッキー。",     price: 260,  unit: "1枚", image: "img/item-galette.jpg" },
  { id: "set",      cat: "焼き菓子",   name: "季節の焼き菓子セット", desc: "その時期の果物や素材を使った、5種類の詰め合わせ。",       price: 1480, unit: "1箱", image: "../petite-douceur/img/item-set.jpg" },
  { id: "bread",    cat: "パン",       name: "毎日の食パン",         desc: "朝食にちょうどいい、軽やかな口どけの角食パン。",         price: 480,  unit: "1斤", image: "../petite-douceur/img/item-bread.jpg" },
  { id: "half",     cat: "パン",       name: "ハーフサイズ食パン",   desc: "毎日の食パンを、食べきりやすい半分のサイズで。",         price: 260,  unit: "半斤", image: "img/item-half.jpg" },
  { id: "bear",     cat: "どうぶつパン", name: "くまのチョコパン",   desc: "ほんのりビターなチョコクリーム入り。耳はチョコで焼き分けています。", price: 220, unit: "1個", image: "../petite-douceur/img/pan-bear.jpg" },
  { id: "cat",      cat: "どうぶつパン", name: "ねこのカスタードパン", desc: "たまごたっぷりの、自家製カスタード入り。",             price: 240,  unit: "1個", image: "../petite-douceur/img/pan-cat.jpg" },
  { id: "chick",    cat: "どうぶつパン", name: "ひよこのメロンパン", desc: "さくさくのクッキー生地に、小さなくちばし。いちばんの人気者です。", price: 200, unit: "1個", image: "../petite-douceur/img/pan-chick.jpg" },
  { id: "turtle",   cat: "どうぶつパン", name: "かめのメロンパン",   desc: "甲羅の模様がメロンパン。頭と足は、ふんわりのパン生地です。", price: 260, unit: "1個", image: "../petite-douceur/img/pan-turtle.jpg" }
];

// お知らせ。daysAgo は「何日前の投稿か」（サンプルでは、いつ開いても NEW が見えるよう、日数で書いています。
// 実際の納品では、date: "2026-11-03" のように、日付を直接書きます）
window.NEWS = [
  { daysAgo: 1,  tag: "新商品",   title: "季節の焼き菓子セットが、秋の味になりました", body: "栗と紅茶を使った5種類の詰め合わせです。なくなり次第、終了します。" },
  { daysAgo: 4,  tag: "お休み",   title: "来週の火曜日は、定休日のほかに水曜日もお休みします", body: "仕入れのため、水曜日は臨時休業とさせていただきます。ご予約は、前日までにお願いします。" },
  { daysAgo: 9,  tag: "お知らせ", title: "どうぶつパンの、焼き上がり時間が変わります", body: "午前10時ごろの焼き上がりは、変わりません。売り切れの日は、午後にもう一度焼く日もあります。" },
  { daysAgo: 21, tag: "お知らせ", title: "ホームページを新しくしました", body: "営業状況や、ご予約が、見やすくなりました。" }
];
