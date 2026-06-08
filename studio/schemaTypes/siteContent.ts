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
    defineField({ name: "href", type: "string", title: "連結", initialValue: "#research/book" }),
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
];
