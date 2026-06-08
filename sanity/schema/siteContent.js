// Sanity Studio schema 範例（需放入 Sanity 專案的 schema 目錄）
// 對應前端 loadSiteContent() 查詢：*[_type == "siteContent"][0]

export default {
  name: "siteContent",
  title: "網站內容",
  type: "document",
  fields: [
    {
      name: "site",
      title: "網站設定",
      type: "object",
      fields: [
        { name: "title", title: "標題", type: "string" },
        { name: "subtitle", title: "副標", type: "string" },
        {
          name: "footer",
          title: "頁尾",
          type: "object",
          fields: [
            { name: "address", type: "string", title: "地址" },
            { name: "phone", type: "string", title: "電話" },
            { name: "email", type: "string", title: "Email" },
          ],
        },
      ],
    },
    {
      name: "homeZones",
      title: "首頁入口",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "id", type: "string", title: "ID" },
            { name: "label", type: "string", title: "標籤" },
            { name: "href", type: "string", title: "連結" },
            {
              name: "hotspot",
              title: "熱區",
              type: "object",
              fields: [
                { name: "left", type: "string" },
                { name: "top", type: "string" },
                { name: "width", type: "string" },
                { name: "height", type: "string" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "classics",
      title: "典藏",
      type: "object",
      fields: [
        {
          name: "timelineRows",
          title: "時間軸",
          type: "array",
          of: [{ type: "object", name: "row", fields: [{ name: "entries", type: "array", of: [{ type: "object", fields: [{ name: "year", type: "string" }] }] }] }],
        },
        {
          name: "yearDetails",
          title: "年度詳情",
          type: "object",
          fields: [],
        },
      ],
    },
    {
      name: "exhibitions",
      title: "展覽",
      type: "object",
      fields: [],
    },
  ],
};
