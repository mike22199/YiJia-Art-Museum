import { defineField, defineType } from "sanity";

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [{ name: "alt", type: "string", title: "圖片說明（無障礙）" }],
  });

const imageRefObject = defineType({
  name: "imageRef",
  title: "圖片",
  type: "object",
  fields: [
    imageField("asset", "上傳圖片"),
    defineField({ name: "alt", type: "string", title: "圖片說明" }),
  ],
});

const linkItem = defineType({
  name: "timelineLink",
  title: "連結",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", title: "顯示文字" }),
    defineField({
      name: "href",
      type: "string",
      title: "連結",
      description: "通常不需修改，除非工程師指示",
    }),
  ],
});

const timelineEntry = defineType({
  name: "timelineEntry",
  title: "時間軸項目",
  type: "object",
  fields: [
    defineField({ name: "year", type: "string", title: "年份" }),
    imageField("timelineImage", "時間軸插圖（可留空）"),
    defineField({
      name: "imagePosition",
      type: "string",
      title: "插圖位置",
      options: {
        list: [
          { title: "年份上方", value: "above" },
          { title: "年份下方", value: "below" },
        ],
      },
      initialValue: "below",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "下方四個連結",
      of: [{ type: "timelineLink" }],
    }),
  ],
  preview: {
    select: { title: "year", media: "timelineImage" },
  },
});

const introBook = defineType({
  name: "introBook",
  title: "日誌書本",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "書名／標題" }),
    defineField({ name: "href", type: "string", title: "連結", initialValue: "#archive/research" }),
    imageField("cover", "封面圖"),
  ],
});

const introSection = defineType({
  name: "introSection",
  title: "介紹區塊",
  type: "object",
  fields: [
    defineField({
      name: "id",
      type: "string",
      title: "區塊 ID",
      options: {
        list: [
          { title: "網站", value: "website" },
          { title: "藝術實踐", value: "practice" },
          { title: "影音", value: "media" },
          { title: "藝術家教師日誌", value: "journal" },
        ],
      },
    }),
    defineField({ name: "title", type: "string", title: "區塊標題" }),
    defineField({ name: "heading", type: "string", title: "小標題" }),
    defineField({ name: "body", type: "text", title: "內文", rows: 5 }),
    defineField({ name: "subtitleEn", type: "string", title: "英文副標（選填）" }),
    defineField({ name: "caption", type: "string", title: "影音說明（選填）" }),
    imageField("image", "區塊圖片"),
    defineField({
      name: "layout",
      type: "string",
      title: "版型",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "books",
      type: "array",
      title: "日誌書本列表",
      of: [{ type: "introBook" }],
      hidden: ({ parent }) => parent?.id !== "journal",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "heading" },
  },
});

const yearDetailEntry = defineType({
  name: "yearDetailEntry",
  title: "年度介紹頁",
  type: "object",
  fields: [
    defineField({
      name: "yearKey",
      type: "string",
      title: "年度 ID",
      description: "必須與網址 ?year= 相同，例如 2021",
    }),
    defineField({ name: "year", type: "string", title: "年份（顯示用）" }),
    defineField({ name: "title", type: "string", title: "主標題" }),
    defineField({ name: "subtitle", type: "string", title: "副標題" }),
    imageField("poster", "主視覺海報"),
    defineField({
      name: "introSections",
      type: "array",
      title: "四項介紹",
      of: [{ type: "introSection" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "yearKey" },
  },
});

const aboutBlock = defineType({
  name: "aboutBlock",
  title: "段落",
  type: "object",
  fields: [defineField({ name: "body", type: "text", title: "內文", rows: 4 })],
});

const exhibitionEntry = defineType({
  name: "exhibitionEntry",
  title: "展覽入口",
  type: "object",
  fields: [
    defineField({ name: "id", type: "string", title: "ID", readOnly: true }),
    defineField({ name: "doorLabel", type: "string", title: "右下角按鈕文字" }),
    defineField({ name: "yearDetailId", type: "string", title: "連到的年度 ID", description: "例如 2021" }),
    defineField({ name: "aboutHeading", type: "string", title: "關於展覽標題" }),
    defineField({
      name: "aboutBlocks",
      type: "array",
      title: "關於展覽段落",
      of: [{ type: "aboutBlock" }],
    }),
  ],
});

const archiveCarouselSlide = defineType({
  name: "archiveCarouselSlide",
  title: "輪播項目",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "標題" }),
    defineField({ name: "caption", type: "text", title: "說明", rows: 2 }),
    imageField("image", "輪播圖片"),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});

const archiveMediaItem = defineType({
  name: "archiveMediaItem",
  title: "媒體項目",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "標題" }),
    defineField({ name: "caption", type: "text", title: "說明", rows: 3 }),
    defineField({
      name: "keywords",
      type: "string",
      title: "關鍵字（搜尋用，選填）",
    }),
    imageField("image", "縮圖"),
    defineField({
      name: "youtubeUrl",
      type: "url",
      title: "YouTube 連結",
      description: "僅動態影音紀錄需要填寫",
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});

const archiveMediaYearPack = defineType({
  name: "archiveMediaYearPack",
  title: "年度內容",
  type: "object",
  fields: [
    defineField({ name: "year", type: "string", title: "年份", description: "例如 2025" }),
    defineField({ name: "overview", type: "text", title: "年度介紹", rows: 4 }),
    defineField({
      name: "items",
      type: "array",
      title: "媒體列表",
      of: [{ type: "archiveMediaItem" }],
    }),
  ],
  preview: {
    select: { title: "year", subtitle: "overview" },
  },
});

const archiveMediaSection = defineType({
  name: "archiveMediaSection",
  title: "典藏媒體區",
  type: "object",
  fields: [
    defineField({
      name: "perPage",
      type: "number",
      title: "每頁顯示筆數",
      description: "照片紀錄建議 8（一行兩張、四行）；動態影音紀錄建議 4（一行一支、四行）。",
      initialValue: 8,
      validation: (rule) => rule.min(1).max(30),
    }),
    defineField({
      name: "featuredCarousel",
      type: "array",
      title: "頂部輪播",
      of: [{ type: "archiveCarouselSlide" }],
    }),
    defineField({
      name: "yearPacks",
      type: "array",
      title: "各年度內容",
      of: [{ type: "archiveMediaYearPack" }],
    }),
  ],
});

const researchJournalPage = defineType({
  name: "researchJournalPage",
  title: "日誌頁面",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "頁面標題" }),
    defineField({
      name: "body",
      type: "text",
      title: "內文（掃描圖尚未提供時使用）",
      rows: 4,
    }),
    defineField({ name: "date", type: "string", title: "日期（選填）" }),
    defineField({
      name: "color",
      type: "string",
      title: "佔位底色（選填）",
      description: "例如 #f4f1ea",
    }),
    imageField("image", "頁面掃描圖"),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});

const researchTeacherRef = defineType({
  name: "researchTeacherRef",
  title: "教師",
  type: "object",
  fields: [
    defineField({
      name: "id",
      type: "string",
      title: "教師 ID",
      description: "例如 t01，需與日誌的 teacherId 一致",
    }),
    defineField({ name: "name", type: "string", title: "姓名" }),
  ],
  preview: {
    select: { title: "name", subtitle: "id" },
  },
});

const researchTeacherJournal = defineType({
  name: "researchTeacherJournal",
  title: "教師日誌",
  type: "object",
  fields: [
    defineField({
      name: "teacherId",
      type: "string",
      title: "教師 ID",
      description: "與上方教師列表的 id 相同",
    }),
    defineField({
      name: "pages",
      type: "array",
      title: "日誌頁面（依翻頁順序排列）",
      of: [{ type: "researchJournalPage" }],
    }),
  ],
  preview: {
    select: { title: "teacherId" },
  },
});

const researchJournalYearPack = defineType({
  name: "researchJournalYearPack",
  title: "年度日誌",
  type: "object",
  fields: [
    defineField({ name: "year", type: "string", title: "年份", description: "例如 2026" }),
    defineField({
      name: "teachers",
      type: "array",
      title: "該年度教師列表",
      of: [{ type: "researchTeacherRef" }],
    }),
    defineField({
      name: "journals",
      type: "array",
      title: "各教師日誌",
      of: [{ type: "researchTeacherJournal" }],
    }),
  ],
  preview: {
    select: { title: "year" },
  },
});

const bookshelfHotspot = defineType({
  name: "bookshelfHotspot",
  title: "書櫃熱區",
  type: "object",
  fields: [
    defineField({ name: "left", type: "string", title: "左側位置（%）" }),
    defineField({ name: "top", type: "string", title: "上方位置（%）" }),
    defineField({ name: "width", type: "string", title: "寬度（%）" }),
    defineField({ name: "height", type: "string", title: "高度（%）" }),
  ],
});

const bookshelfLockedBook = defineType({
  name: "bookshelfLockedBook",
  title: "書櫃書本",
  type: "object",
  fields: [
    defineField({ name: "id", type: "string", title: "ID" }),
    defineField({ name: "label", type: "string", title: "書名標籤" }),
    defineField({ name: "hotspot", type: "bookshelfHotspot", title: "點擊熱區" }),
  ],
});

const archiveResearchSection = defineType({
  name: "archiveResearchSection",
  title: "研究區",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", title: "頁面主標", initialValue: "研究" }),
    defineField({
      name: "journalTitle",
      type: "string",
      title: "日誌區塊標題",
      initialValue: "藝術家教師日誌",
    }),
    defineField({
      name: "bookshelfHeading",
      type: "string",
      title: "書櫃區塊標題",
      initialValue: "書櫃典藏",
    }),
    defineField({
      name: "bookshelfCaption",
      type: "text",
      title: "書櫃說明",
      rows: 2,
    }),
    imageField("bookshelfImage", "書櫃底圖"),
    defineField({
      name: "bookshelfAccessTitle",
      type: "string",
      title: "索取權限對話框標題",
      initialValue: "索取閱讀權限",
    }),
    defineField({
      name: "bookshelfAccessMessage",
      type: "text",
      title: "索取權限說明文字",
      rows: 3,
    }),
    defineField({
      name: "bookshelfLockedBooks",
      type: "array",
      title: "書櫃上可點擊的書本",
      of: [{ type: "bookshelfLockedBook" }],
    }),
    defineField({
      name: "yearPacks",
      type: "array",
      title: "各年度教師日誌",
      of: [{ type: "researchJournalYearPack" }],
    }),
  ],
});

export default defineType({
  name: "siteContent",
  title: "網站內容",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      type: "string",
      title: "網站名稱",
      description: "例如：義家藝館",
    }),
    defineField({
      name: "siteSubtitle",
      type: "string",
      title: "英文副標",
      description: "例如：When Home Becomes A Museum",
    }),
    defineField({
      name: "footerAddress",
      type: "string",
      title: "頁尾地址",
    }),
    defineField({ name: "footerPhone", type: "string", title: "頁尾電話" }),
    defineField({ name: "footerFax", type: "string", title: "頁尾傳真" }),
    defineField({ name: "footerEmail", type: "string", title: "頁尾 Email" }),
    defineField({ name: "footerYoutube", type: "url", title: "YouTube 連結" }),
    defineField({ name: "footerFacebook", type: "url", title: "Facebook 連結" }),

    imageField("homeImage", "首頁主視覺圖"),

    defineField({
      name: "timelineRows",
      type: "array",
      title: "典藏｜歷年時間軸",
      of: [
        {
          type: "object",
          name: "timelineRow",
          title: "時間軸列",
          fields: [
            defineField({
              name: "entries",
              type: "array",
              title: "這一列的年份",
              of: [{ type: "timelineEntry" }],
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "yearDetailsList",
      type: "array",
      title: "典藏｜各年度詳細介紹頁",
      of: [{ type: "yearDetailEntry" }],
    }),

    defineField({
      name: "exhibitionLeft",
      type: "exhibitionEntry",
      title: "開幕展（左側入口）",
    }),
    defineField({
      name: "exhibitionRight",
      type: "exhibitionEntry",
      title: "開幕展（右側入口）",
    }),

    defineField({
      name: "archivePhotos",
      type: "archiveMediaSection",
      title: "典藏｜照片紀錄",
      description: "照片紀錄頁的輪播、各年度照片與介紹文字",
    }),
    defineField({
      name: "archiveVideos",
      type: "archiveMediaSection",
      title: "典藏｜動態影音紀錄",
      description: "動態影音紀錄頁的輪播、各年度影片與介紹文字",
    }),

    defineField({
      name: "archiveResearch",
      type: "archiveResearchSection",
      title: "研究｜藝術家教師日誌",
      description: "研究頁的翻書閱讀、教師日誌與書櫃設定",
    }),

    defineField({
      name: "technicalJson",
      type: "text",
      title: "進階設定（JSON，僅工程師）",
      description: "首頁熱區、選單結構等。一般編輯請勿修改。",
      rows: 20,
    }),
  ],
  preview: {
    prepare() {
      return { title: "義家藝館｜網站內容" };
    },
  },
});

export const objectTypes = [
  imageRefObject,
  linkItem,
  timelineEntry,
  introBook,
  introSection,
  yearDetailEntry,
  aboutBlock,
  exhibitionEntry,
  archiveCarouselSlide,
  archiveMediaItem,
  archiveMediaYearPack,
  archiveMediaSection,
  researchJournalPage,
  researchTeacherRef,
  researchTeacherJournal,
  researchJournalYearPack,
  bookshelfHotspot,
  bookshelfLockedBook,
  archiveResearchSection,
];
