# Sanity 使用教學｜義家藝館

這份文件分兩部分：

- **A. 工程師第一次設定**（你做一次）
- **B. 編輯者日常使用**（給不懂程式的人）

---

## A. 工程師第一次設定

### 你需要準備

- [Node.js 18+](https://nodejs.org/)（已安裝可在終端機打 `node -v` 確認）
- Sanity 免費帳號
- 本專案已推上 GitHub，並用 Netlify 部署（或本機 Live Server 測試）

### 步驟 1：建立 Sanity 專案

1. 到 [sanity.io](https://www.sanity.io) 註冊／登入  
2. 也可在終端機執行（在任意資料夾）：

```bash
npm create sanity@latest
```

若使用本專案內建的 Studio，**跳過 create**，直接做步驟 2。

3. 到 [sanity.io/manage](https://www.sanity.io/manage) 建立新 Project  
4. 記下 **Project ID**（例如 `abc123xy`）

### 步驟 2：啟動本專案的 Studio

```bash
cd studio
npm install
```

建立 `studio/.env`（可複製 `.env.example`）：

```env
SANITY_STUDIO_PROJECT_ID=你的ProjectID
SANITY_STUDIO_DATASET=production
```

啟動後台：

```bash
npm run dev
```

瀏覽器會打開 `http://localhost:3333`，這是**內容編輯後台**。

### 步驟 3：建立 API Token（匯入資料用）

1. [sanity.io/manage](https://www.sanity.io/manage) → 你的專案 → **API** → **Tokens**  
2. 新增 Token，權限選 **Editor**  
3. 複製 Token（只顯示一次）

### 步驟 4：把現有 JSON 匯入 Sanity

在 `studio` 資料夾（PowerShell）：

```powershell
$env:SANITY_PROJECT_ID="你的ProjectID"
$env:SANITY_DATASET="production"
$env:SANITY_TOKEN="你的Token"
npm run import
```

成功后会看到「已匯入 siteContent」。

### 步驟 5：在 Studio 上傳圖片

匯入後**文字**已在 Sanity，**圖片**需在 Studio 裡手動上傳：

1. 打開「網站內容」文件  
2. 在「首頁主視覺圖」「年度介紹頁」等欄位點選上傳  
3. 按右上角 **Publish**

### 步驟 6：設定 CORS（讓網站讀得到 Sanity）

1. sanity.io/manage → API → **CORS origins**  
2. 新增：
   - `http://localhost:5500`（Live Server）
   - `http://127.0.0.1:5500`
   - `https://你的网域.netlify.app`

勾選 **Allow credentials**（如有選項）。

### 步驟 7：讓公開網站連接 Sanity

編輯專案根目錄的 `index.html`：

```html
window.SANITY_PROJECT_ID = "你的ProjectID";
window.SANITY_DATASET = "production";
```

存檔 → 推上 GitHub → Netlify 自動部署。

**原理**：網站會先讀 Sanity；若失敗則退回 `content/site-content.json`。

### 步驟 8：部署 Studio 給編輯者（可選）

編輯者需要後台網址，可部署到 Sanity 託管：

```bash
cd studio
npm run deploy
```

會獲得類似 `https://你的名稱.sanity.studio` 的網址，發給編輯者即可。

---

## B. 編輯者日常使用（不需懂程式）

### 登入

1. 打開工程師提供的 Studio 網址  
2. 用受邀的 Email 登入（Google / GitHub 等）

### 修改內容

1. 左側點 **「網站內容」**（應該只有這一份文件）  
2. 找到要改的區塊，例如：

| Studio 裡的名稱 | 對應網站位置 |
|----------------|-------------|
| 網站名稱 / 英文副標 | 頁首 Logo 旁文字 |
| 页尾地址、电话 | 页面最下方 |
| 典藏｜歷年時間軸 | `#classics/years` 時間軸 |
| 典藏｜各年度詳細介紹頁 | 點年份圖後的四段介紹 |
| 開幕展（左／右側入口） | 首頁左右海報裡的「關於展覽」 |

3. 改文字：直接在欄位裡打字  
4. 換圖片：點圖片欄 → **Upload** 上傳新圖  
5. **非常重要**：改完後按右上角 **Publish**（發布）  
6. 打開公開網站，**重新整理**（Ctrl+F5）確認

### 請勿修改

- **進階設定（JSON，僅工程師）** — 裡面有首頁點擊區域等技術設定  
- 連結裡的 `#classics/year?year=2021` 等 — 除非工程師說明  

### 常見問題

**Q：我按 Publish 了，網站沒變？**  
- 等 10～30 秒再刷新  
- 確認工程師已在 `index.html` 填入 `SANITY_PROJECT_ID`  
- 用 Ctrl+F5 強制刷新

**Q：圖片變空白？**  
- 確認有按 Publish  
- 在 Studio 重新上傳該圖片並 Publish

**Q：我改錯想還原？**  
- Studio 文件下方有 **Revision history**（修訂歷史）可還原

---

## 資料結構說明（給工程師）

```
Sanity Studio（编辑）
       ↓ Publish
Sanity Cloud API
       ↓ loadSiteContent()
app/sanity-normalize.js（转成 SITE_CONTENT 格式）
       ↓
app.js 渲染网页
```

- 可編輯欄位：`studio/schemaTypes/siteContent.ts`  
- 轉換邏輯：`app/sanity-normalize.js`  
- 本地備份／備用：`content/site-content.json`  
- 匯入腳本：`studio/scripts/import-from-json.mjs`

---

## 邀請其他編輯者

sanity.io/manage → Project → **Members** → Invite  
對方只需 Studio 網址 + Email 登入，**不需要** GitHub 或 VS Code。

---

## 下一步（可選）

- **Visual Preview**：在 Studio 內嵌預覽網站（需額外設定 Presentation tool）  
- **只開放部分欄位**：在 schema 調整 `readOnly` / `hidden`  
- **多語言**：Sanity 支援 i18n 插件

如有問題，可先確認：Project ID、CORS、Publish、SANITY_PROJECT_ID 四項是否都已設定。
