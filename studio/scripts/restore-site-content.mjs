import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const corruptedPath = path.join(root, "content/site-content.json");
const historyPath = path.join(
  process.env.APPDATA || "",
  "Cursor/User/History/-d89e1a4/wKD4.json"
);
const outPath = corruptedPath;

function fixJsonLineSyntax(line) {
  const trimmed = line.trimEnd();
  if (trimmed.endsWith('",') || trimmed.endsWith('"}') || trimmed.endsWith('"]')) return line;

  // Key/value string: "key": "value
  if (/":\s*"/.test(trimmed)) {
    if (/,\s*$/.test(trimmed) && !trimmed.endsWith('",')) {
      return trimmed.replace(/,\s*$/, '",');
    }
    if (!trimmed.endsWith('"')) return `${trimmed}"`;
  }

  // Bare quoted string in arrays: "value,
  if (/^\s*"/.test(trimmed) && !trimmed.includes('":') && /,\s*$/.test(trimmed) && !trimmed.endsWith('",')) {
    return trimmed.replace(/,\s*$/, '",');
  }
  if (
    /^\s*"/.test(trimmed) &&
    !trimmed.includes('":') &&
    !trimmed.endsWith('"') &&
    !trimmed.endsWith('",') &&
    !/[{[]\s*$/.test(trimmed)
  ) {
    return `${trimmed}"`;
  }

  return line;
}

function isCorruptedString(value) {
  if (typeof value !== "string") return false;
  return value.includes("\uFFFD") || value.includes("?");
}

function deepMergePreferGood(good, bad) {
  if (bad === undefined || bad === null) return good;
  if (good === undefined || good === null) return bad;
  if (typeof good !== typeof bad) return bad;
  if (typeof good === "string") {
    return isCorruptedString(bad) ? good : bad;
  }
  if (Array.isArray(good) && Array.isArray(bad)) {
    const len = Math.max(good.length, bad.length);
    return Array.from({ length: len }, (_, i) => {
      if (i >= bad.length) return good[i];
      if (i >= good.length) return bad[i];
      return deepMergePreferGood(good[i], bad[i]);
    });
  }
  if (typeof good === "object") {
    const out = { ...bad };
    for (const key of Object.keys(good)) {
      if (key in bad) out[key] = deepMergePreferGood(good[key], bad[key]);
    }
    for (const key of Object.keys(bad)) {
      if (!(key in good)) out[key] = bad[key];
    }
    return out;
  }
  return bad;
}

const numMap = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一"];
const numMap2 = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四"];

function fixArchive(archive, introBody) {
  const a = JSON.parse(JSON.stringify(archive));
  a.home.banner.title = "義家藝館檔案庫";
  a.home.intro.heading = "義家藝館介紹";
  a.home.intro.body = introBody;
  a.home.intro.links = [
    { label: "作品", href: "#archive/practice" },
    { label: "藝術家教師", href: "#archive/teachers" },
  ];
  a.home.featuredMediaMoreLabel = "了解更多＞";
  a.home.pastExhibitionsPreview.heading = "歷屆展覽回顧";
  a.home.pastExhibitionsPreview.moreLabel = "了解更多＞";
  a.home.specialExhibitionsTitle = "特展";
  a.home.specialExhibitions = [
    {
      title: "推開自由門",
      href: "#exhibition-left/about",
      image: a.home.specialExhibitions?.[0]?.image,
    },
    {
      title: "成為自由人",
      href: "#exhibition-right/about",
      image: a.home.specialExhibitions?.[1]?.image,
    },
  ];
  a.home.featuredMedia = (a.home.featuredMedia || []).map((item, i) => ({
    ...item,
    title: `精選影音${numMap[i] || i + 1}`,
    caption: `影音說明${numMap[i] || i + 1}`,
    image: {
      ...item.image,
      alt: `精選影音${numMap[i] || i + 1}`,
    },
  }));
  a.home.pastExhibitionsPreview.items = (a.home.pastExhibitionsPreview.items || []).map((item, i) => {
    const letter = String.fromCharCode(65 + i);
    return {
      ...item,
      title: `作品名稱 ${letter}`,
      author: `作者 ${letter}`,
      image: { ...item.image, alt: `測試圖 ${letter}` },
    };
  });
  a.home.teachersPreview.heading = "藝術家教師";
  a.home.teachersPreview.moreLabel = "了解更多＞";
  a.home.teachersPreview.teachers = (a.home.teachersPreview.teachers || []).map((t, i) => ({
    ...t,
    name: `教師${numMap[i] || i + 1}`,
  }));
  a.home.worksPreview.heading = "藝術家教師作品";
  a.home.worksPreview.items = (a.home.worksPreview.items || []).map((item, i) => ({
    ...item,
    title: `作品${numMap[i] || i + 1}`,
    author: `教師${numMap[i] || i + 1}`,
  }));

  for (const year of Object.keys(a.exhibitionsByYear || {})) {
    const pack = a.exhibitionsByYear[year];
    pack.overview.heading = "展覽概述";
    pack.overview.body = `${year} 年度展覽概述。`;
    pack.works = (pack.works || []).map((work, i) => ({
      ...work,
      title: work.title?.includes("家X") ? "家X書" : `${year} 作品${numMap[i] || i + 1}`,
      author: work.author?.includes("義家") ? "義家藝館" : "作者",
    }));
    if (year === "2026" && pack.quickLinks) {
      pack.quickLinks = [
        { label: "網站", href: "#archive/practice" },
        { label: "影音", href: "#archive/media?year=2026" },
        { label: "藝術家教師", href: "#archive/teachers?year=2026" },
      ];
    }
  }

  a.practice.authors = ["教師一", "教師二", "教師三"];
  a.practice.worksByYear["2025"] = (a.practice.worksByYear["2025"] || []).map((work, i) => ({
    ...work,
    title: `作品${numMap[i] || i + 1}`,
    author: ["教師一", "教師二", "教師三"][i % 3],
  }));

  a.media.featuredCarousel = (a.media.featuredCarousel || []).map((slide, i) => ({
    ...slide,
    title: `精選照片${numMap[i] || i + 1}`,
    caption: "精選輪播說明",
  }));
  const yearPack = a.media.byYear?.["2025"];
  if (yearPack) {
    yearPack.title = "2025田野踏查紀錄";
    yearPack.overview = "文字概述當年之田野踏查狀況。";
    yearPack.items = (yearPack.items || []).map((item, i) => ({
      ...item,
      type: "video",
      title: `踏查影片${numMap2[i + 1] || i + 1}`,
      caption: `田野踏查紀錄影片${numMap2[i + 1] || i + 1}`,
      youtubeUrl: "https://www.youtube.com/",
    }));
  }
  a.media.photos = (a.media.photos || []).map((p, i) => ({
    ...p,
    title: `照片${numMap[i] || i + 1}`,
    caption: "照片說明",
  }));
  if (a.media.recommendedText) {
    a.media.recommendedText.title = "推薦文本標題";
  }

  for (const year of Object.keys(a.teachers?.byYear || {})) {
    const pack = a.teachers.byYear[year];
    pack.title = `${year}年藝術家教師`;
    pack.teachers = (pack.teachers || []).map((t, i) => ({
      ...t,
      name: `教師${numMap2[i + 1] || i + 1}`,
      bio: "藝術家教師簡介文字。",
    }));
  }
  for (const [tid, journal] of Object.entries(a.teachers?.journals || {})) {
    const n = Number(String(tid).replace("t", "")) || 1;
    journal.pages = (journal.pages || []).map((page) => ({
      ...page,
      title: "第一頁",
      body: `教師${numMap2[n] || n}的日誌內容。`,
    }));
  }

  a.bibliography = (a.bibliography || []).map((book, i) => ({
    ...book,
    title: `參考書目${numMap2[i + 1] || i + 1}`,
    author: "作者",
    description: "此書的介紹章節",
  }));
  a.collection.heading = "典藏";
  a.collection.body = "典藏區塊說明文字。";
  a.research.heading = "研究";
  a.research.body = "研究區塊說明文字。";
  return a;
}

const wkd4 = JSON.parse(fs.readFileSync(historyPath, "utf8"));
let text = fs.readFileSync(corruptedPath, "utf8");
text = text.split("\n").map(fixJsonLineSyntax).join("\n");
const broken = JSON.parse(text);

const introBody =
  wkd4.exhibitions?.["exhibition-left"]?.about?.blocks?.[1]?.body ||
  "義家藝館計畫自 2014 年啟動，以榮民之家為田野調查起點，逐步發展為結合藝術、教育與檔案工作的長期計畫。";

const result = deepMergePreferGood(wkd4, broken);
result.site = {
  ...wkd4.site,
  headerNav: [
    { id: "archive", label: "檔案庫", href: "#archive/index" },
    { id: "co-create", label: "共創", href: "#co-create/text" },
  ],
};
result.homeZones = [
  {
    ...wkd4.homeZones[0],
    href: "#exhibition-left/about",
  },
  {
    ...wkd4.homeZones[1],
    label: "檔案庫",
    title: "義家藝館",
    href: "#archive/index",
    accent: true,
    hotspot: broken.homeZones?.[1]?.hotspot || wkd4.homeZones[1].hotspot,
  },
  {
    ...wkd4.homeZones[2],
    href: "#exhibition-right/about",
  },
];
result.archiveSubnav = [
  { id: "index", label: "檔案庫首頁", href: "#archive/index" },
  { id: "exhibitions", label: "歷屆展覽回顧", href: "#archive/exhibitions" },
  { id: "practice", label: "藝術實踐", href: "#archive/practice" },
  { id: "media", label: "影音", href: "#archive/media" },
  { id: "collection", label: "典藏", href: "#archive/collection" },
  { id: "research", label: "研究", href: "#archive/research" },
  { id: "teachers", label: "藝術家教師日誌", href: "#archive/teachers" },
  { id: "bibliography", label: "參考書目", href: "#archive/bibliography" },
];
result.classicsSubnav = [
  { id: "years", label: "歷年網站", href: "#archive/exhibitions" },
  { id: "practice", label: "藝術實踐", href: "#archive/practice" },
  { id: "media", label: "影音", href: "#archive/media" },
];
result.exhibitions = {
  ...deepMergePreferGood(wkd4.exhibitions, broken.exhibitions),
  "exhibition-right": {
    ...wkd4.exhibitions["exhibition-right"],
    about: {
      heading: "關於展覽",
      blocks: [
        {
          body: "此展覽以榮民之家田野經驗為主軸，透過創作、檔案與個人記憶的對話，呈現「家」的多重面貌。",
        },
        {
          body: "展覽邀請觀者走入不同場域，思考自由、身體與歸屬在當代社會中的樣貌。",
        },
      ],
    },
  },
};
result.classics = deepMergePreferGood(wkd4.classics, broken.classics);
result.research = deepMergePreferGood(wkd4.research, broken.research);
result.archive = fixArchive(broken.archive, introBody);

fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log("Restored:", outPath, "bytes:", fs.statSync(outPath).size);
