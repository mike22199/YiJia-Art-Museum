# 義家藝館｜內容修改指南 + Sanity CMS + Netlify 部署

## 一、現在怎麼改內容？

所有文字、連結、圖片路徑目前集中在 **`content/site-content.json`**。

| 想改什麼 | 編輯位置 |
|---------|---------|
| 首頁三個入口連結 | `homeZones` → 各區塊的 `href` |
| 首頁熱區位置 | `homeZones` → `hotspot`（left/top/width/height 百分比） |
| 底部導覽對齊 | `homeZones` → `nav.left` |
| 典藏時間軸 | `classics.timelineRows` |
| 某一年詳情（海報、橫幅、影音） | `classics.yearDetails["2021"]` |
| 開幕展「關於展覽」文字 | `exhibitions.exhibition-left.about.blocks` |
| 頁首選單 | `site.headerNav` |
| 頁尾聯絡方式 | `site.footer` |

改完存檔，重新整理瀏覽器即可（需用 Live Server 或 Netlify 等 http 方式開啟，不能直接雙擊 HTML）。

---

## 二、有沒有「可視化」一邊看一邊改的方法？

有三種，由易到難：

### 方法 A：VS Code Live Server（最快，零設定）

1. 在 VS Code 安裝 **Live Server** 擴充功能  
2. 對 `index.html` 按右鍵 → **Open with Live Server**  
3. 左側開 `content/site-content.json` 編輯，右側瀏覽器會即時更新  

適合：改文字、換圖片路徑、微調連結。

### 方法 B：Decap CMS（專案已內建 `/admin`）

- 後台網址：`https://你的網域.netlify.app/admin/`
- 需要 Netlify Identity + Git Gateway（詳見 `DEPLOY_AND_CMS_GUIDE.txt`）
- 在網頁表單裡改 JSON 欄位，按 Publish 後自動推上 GitHub → Netlify 重新部署  

適合：非工程背景編輯者、不想碰 JSON 語法。

> 目前 `admin/config.yml` 只定義部分欄位，之後可擴充 timeline、yearDetails 等。

### 方法 C：Sanity Studio（你之後想用的方案）

- 在 Sanity 網頁後台用**表單 + 即時預覽**編輯
- 網站從 Sanity API 讀資料（見下方原理）
- 可開啟 **Presentation / Live Preview**，左邊改、右邊看網站  

適合：內容多、需要圖片上傳、多人協作、視覺化編輯。

---

## 三、Sanity + Netlify 可行嗎？

**可行。** 你現在的架構是「靜態 HTML + JS 讀 JSON」，這是最適合接 Sanity 的型態之一。

### 原理（簡化版）

```
┌─────────────┐     編輯內容      ┌──────────────┐
│ Sanity      │ ───────────────► │ Sanity Cloud │
│ Studio      │                  │ (API/CDN)    │
└─────────────┘                  └──────┬───────┘
                                        │ fetch JSON
                                        ▼
┌─────────────┐   部署靜態檔   ┌──────────────┐
│ GitHub      │ ◄───────────── │ Netlify      │
│ (原始碼)    │                │ (託管網站)   │
└─────────────┘                └──────────────┘
```

1. 你在 **Sanity Studio** 改文字、上傳圖片  
2. 資料存在 Sanity 雲端  
3. 訪客打開 Netlify 上的網站時，`app.js` 向 Sanity API 要最新內容  
4. 若 Sanity 未設定或讀取失敗，自動退回本地 `site-content.json`  

專案已預留開關（`index.html`）：

```html
window.SANITY_PROJECT_ID = "";   <!-- 填入你的 project id -->
window.SANITY_DATASET = "production";
```

---

## 四、Sanity 設定步驟（第一次）

### 1. 建立 Sanity 專案

```bash
npm create sanity@latest -- --project-plan free
```

依提示建立 project，記下 **Project ID**。

### 2. 建立內容模型

在 Sanity Studio 新增 document type：`siteContent`  
欄位結構對應 `content/site-content.json`（site、homeZones、classics、exhibitions…）。

可參考 `sanity/schema/siteContent.js`（本專案附的範例 schema）。

### 3. 匯入現有內容

把 `content/site-content.json` 的內容貼進 Sanity 第一筆 `siteContent` 文件，或寫 migration script。

### 4. 設定 CORS

Sanity 管理後台 → **API** → **CORS origins** → 加入：

- `http://localhost:5500`（Live Server）
- `https://你的網站.netlify.app`

### 5. 啟用網站讀取

在 `index.html` 填入：

```html
window.SANITY_PROJECT_ID = "你的projectId";
window.SANITY_DATASET = "production";
```

重新部署 Netlify，網站就會從 Sanity 讀內容。

### 6. Netlify 部署

1. 專案推上 GitHub  
2. Netlify → Import project → 選 repo  
3. Build command：留空（或 `echo ok`）  
4. Publish directory：`.`（專案根目錄）  
5. 部署完成後開啟 `https://xxx.netlify.app/`  

`netlify.toml` 已放在專案根目錄。

---

## 五、Sanity 與 Decap 要選哪個？

| | Decap CMS | Sanity |
|--|-----------|--------|
| 內容存在 | GitHub repo 裡的 JSON | Sanity 雲端 |
| 視覺編輯 | 表單 | 表單 + 可開 Live Preview |
| 圖片 | 存 repo `/assets/uploads` | Sanity CDN（較省 repo 空間） |
| 費用 | 免費（搭 Netlify） | 免費方案夠小站使用 |
| 與現有架構 | 已內建 admin | 已預留 API 讀取 |

你可以：**現階段用 JSON + Live Server 開發，上線後接 Sanity**。

---

## 六、常見問題

**Q：改 hotspot 百分比怎麼對位？**  
在網址加 `#home/index`，用瀏覽器開發者工具檢查 `.museumHotspot` 元素，或直接暫時在 CSS 把 `.museumHotspot { background: rgba(255,0,0,.2); }` 打開對位。

**Q：Sanity 改了但網站沒變？**  
確認 `SANITY_PROJECT_ID` 已填、CORS 已加、Sanity 文件 `_type` 為 `siteContent`、且已 publish。

**Q：想完全不用 Sanity，只用 JSON？**  
維持 `SANITY_PROJECT_ID` 空白即可，一切照舊讀 `site-content.json`。
