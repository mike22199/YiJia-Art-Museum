/**
 * 將歷屆展覽、藝術實踐作品同步至 archive.collection.items，
 * 並為每件作品寫入 collectionId（與典藏 id 相同）。
 *
 * 用法：node studio/scripts/sync-collection-links.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.resolve(__dirname, "../../content/site-content.json");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const archive = data.archive;
const itemsById = new Map();

function upsertCollectionItem(work, meta) {
  const id = work.collectionId;
  if (!id) return;

  const existing = itemsById.get(id);
  if (existing) {
    existing.title = work.title || existing.title;
    existing.author = work.author || existing.author;
    existing.image = work.image || existing.image;
    if (meta.year) existing.year = meta.year;
    if (meta.source) existing.source = meta.source;
    return;
  }

  itemsById.set(id, {
    id,
    title: work.title || "",
    author: work.author || "",
    year: meta.year || "",
    image: work.image || { src: "./assets/images/placeholder-photo.svg", alt: "" },
    body:
      meta.body ||
      `此作品收錄於「${meta.source?.label || "檔案庫"}」。請在此補充典藏說明正文。`,
    source: meta.source || null,
  });
}

// 歷屆展覽
for (const [year, pack] of Object.entries(archive.exhibitionsByYear || {})) {
  const works = Array.isArray(pack?.works) ? pack.works : [];
  works.forEach((work, index) => {
    const seq = String(index + 1).padStart(2, "0");
    work.collectionId = work.collectionId || `ex-${year}-${seq}`;
    upsertCollectionItem(work, {
      year,
      source: {
        type: "exhibition",
        year,
        label: `歷屆展覽回顧 ${year}`,
        href: `#archive/exhibitions?year=${encodeURIComponent(year)}`,
      },
    });
  });
}

// 藝術實踐
for (const [year, works] of Object.entries(archive.practice?.worksByYear || {})) {
  if (!Array.isArray(works)) continue;
  works.forEach((work, index) => {
    const seq = String(index + 1).padStart(2, "0");
    work.collectionId = work.collectionId || `pr-${year}-${seq}`;
    upsertCollectionItem(work, {
      year,
      source: {
        type: "practice",
        year,
        label: `藝術實踐 ${year}`,
        href: `#archive/practice?year=${encodeURIComponent(year)}`,
      },
    });
  });
}

const sorted = [...itemsById.values()].sort((a, b) => a.id.localeCompare(b.id));
archive.collection = archive.collection || {};
archive.collection.heading = archive.collection.heading || "典藏作品";
archive.collection.body =
  archive.collection.body ||
  "本區收錄義家藝館長期保存之作品。歷屆展覽與藝術實踐頁面的作品方塊，點選後會進入對應的典藏說明頁。";
archive.collection.items = sorted;

fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Synced ${sorted.length} collection items.`);
