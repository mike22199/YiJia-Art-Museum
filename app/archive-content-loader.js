/**
 * 從 content/archive/photos|videos/ 資料夾載入典藏媒體內容。
 * 圖片／影片內容：Sanity 有資料時用後台；沒有時才用本機資料夾示範稿。
 * 每頁筆數等版面數字：一律用本機 config.json（不受後台 perPage 影響）。
 * 若要整段改走本機、忽略後台內容，請在 config.json 加 "override": true。
 */
(function () {
  const SECTION_KEYS = ["photos", "videos"];

  function sectionHasMediaContent(section) {
    if (!section || typeof section !== "object") return false;
    const carousel = Array.isArray(section.featuredCarousel) ? section.featuredCarousel : [];
    if (carousel.length) return true;
    const byYear = section.byYear || {};
    return Object.values(byYear).some((pack) => Array.isArray(pack?.items) && pack.items.length);
  }

  async function loadArchiveSection(key) {
    const base = `./content/archive/${key}`;
    const configRes = await fetch(`${base}/config.json`, { cache: "no-store" });
    if (!configRes.ok) return null;

    const config = await configRes.json();
    const years = Array.isArray(config.years) ? config.years : [];
    const byYear = {};

    await Promise.all(
      years.map(async (year) => {
        const yearRes = await fetch(`${base}/${year}.json`, { cache: "no-store" });
        if (!yearRes.ok) return;
        byYear[year] = await yearRes.json();
      })
    );

    return {
      years,
      perPage: config.perPage || (key === "videos" ? 2 : 8),
      featuredCarousel: Array.isArray(config.featuredCarousel) ? config.featuredCarousel : [],
      byYear,
      override: config.override === true,
    };
  }

  window.mergeArchiveFolderContent = async function mergeArchiveFolderContent(content) {
    const archive = content.archive || {};
    content.archive = archive;

    await Promise.all(
      SECTION_KEYS.map(async (key) => {
        try {
          const folder = await loadArchiveSection(key);
          if (!folder) return;

          const existing = archive[key];
          if (folder.override || !sectionHasMediaContent(existing)) {
            archive[key] = folder;
            return;
          }

          existing.perPage = folder.perPage;
        } catch (err) {
          console.warn(`典藏資料夾載入失敗 (${key})：`, err);
        }
      })
    );

    return content;
  };
})();
