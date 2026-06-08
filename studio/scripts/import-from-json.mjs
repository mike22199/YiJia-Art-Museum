/**
 * 將 content/site-content.json 匯入 Sanity
 *
 * 使用方式（在 studio 資料夾）：
 *   set SANITY_PROJECT_ID=你的projectId
 *   set SANITY_DATASET=production
 *   set SANITY_TOKEN=你的_write_token
 *   npm run import
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_TOKEN;

if (!projectId || !token) {
  console.error("請設定環境變數：SANITY_PROJECT_ID、SANITY_TOKEN");
  console.error("Token 請到 sanity.io/manage → API → Tokens 建立（Editor 權限）");
  process.exit(1);
}

const jsonPath = path.resolve(__dirname, "../../content/site-content.json");
const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const technical = {
  homeZones: raw.homeZones,
  classicsSubnav: raw.classicsSubnav,
  nav: raw.nav,
  pages: raw.pages,
  research: raw.research,
  homeBanners: raw.homeBanners,
  classics: {
    yearsWebsites: raw.classics?.yearsWebsites,
    artPracticeWorks: raw.classics?.artPracticeWorks,
    media: raw.classics?.media,
  },
};

function mapIntroSection(sec) {
  return {
    _type: "introSection",
    id: sec.id,
    title: sec.title,
    heading: sec.heading,
    body: sec.body,
    subtitleEn: sec.subtitleEn,
    caption: sec.caption,
    layout: sec.layout,
    books: (sec.books || []).map((b) => ({
      _type: "introBook",
      title: b.title,
      href: b.href,
    })),
  };
}

function mapYearDetail(key, detail) {
  return {
    _type: "yearDetailEntry",
    yearKey: key,
    year: detail.year,
    title: detail.title,
    subtitle: detail.subtitle,
    introSections: (detail.introSections || []).map(mapIntroSection),
  };
}

function mapExhibition(entry) {
  if (!entry) return undefined;
  return {
    _type: "exhibitionEntry",
    id: entry.id,
    doorLabel: entry.doorLabel,
    yearDetailId: entry.yearDetailId,
    aboutHeading: entry.about?.heading,
    aboutBlocks: (entry.about?.blocks || []).map((b) => ({ _type: "aboutBlock", body: b.body })),
  };
}

const doc = {
  _id: "siteContent",
  _type: "siteContent",
  siteTitle: raw.site?.title,
  siteSubtitle: raw.site?.subtitle,
  footerAddress: raw.site?.footer?.address,
  footerPhone: raw.site?.footer?.phone,
  footerFax: raw.site?.footer?.fax,
  footerEmail: raw.site?.footer?.email,
  footerYoutube: raw.site?.footer?.social?.youtube,
  footerFacebook: raw.site?.footer?.social?.facebook,
  timelineRows: (raw.classics?.timelineRows || []).map((row) => ({
    _type: "timelineRow",
    entries: (row.entries || []).map((e) => ({
      _type: "timelineEntry",
      year: e.year,
      imagePosition: e.imagePosition,
      links: (e.links || []).map((l) => ({ _type: "timelineLink", label: l.label, href: l.href })),
    })),
  })),
  yearDetailsList: Object.entries(raw.classics?.yearDetails || {}).map(([key, detail]) =>
    mapYearDetail(key, detail)
  ),
  exhibitionLeft: mapExhibition(raw.exhibitions?.["exhibition-left"]),
  exhibitionRight: mapExhibition(raw.exhibitions?.["exhibition-right"]),
  technicalJson: JSON.stringify(technical, null, 2),
};

const res = await fetch(
  `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
  }
);

const body = await res.json();
if (!res.ok) {
  console.error("匯入失敗：", body);
  process.exit(1);
}

console.log("✓ 已匯入 siteContent 到 Sanity");
console.log("  下一步：在 studio 執行 npm run dev，上傳圖片後 Publish");
