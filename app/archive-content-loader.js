/**
 * 從 content/archive/photos|videos/ 資料夾載入典藏媒體內容。
 * 若資料夾內有 config.json，會覆寫 site-content.json 中對應的 archive.photos / archive.videos。
 * 已設定 Sanity 時預設以 Sanity 為主；本機若要強制使用資料夾，請在 config.json 加 "override": true。
 */
(function () {
  const SECTION_KEYS = ["photos", "videos"];

  async function loadArchiveSection(key) {
    const base = `./content/archive/${key}`;
    const configRes = await fetch(`${base}/config.json`, { cache: "no-store" });
    if (!configRes.ok) return null;

    const config = await configRes.json();
    const sanityActive = Boolean(String(window.SANITY_PROJECT_ID || "").trim());
    if (sanityActive && config.override !== true) return null;

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
      perPage: config.perPage || (key === "videos" ? 4 : 8),
      featuredCarousel: Array.isArray(config.featuredCarousel) ? config.featuredCarousel : [],
      byYear,
    };
  }

  window.mergeArchiveFolderContent = async function mergeArchiveFolderContent(content) {
    const archive = content.archive || {};
    content.archive = archive;

    await Promise.all(
      SECTION_KEYS.map(async (key) => {
        try {
          const section = await loadArchiveSection(key);
          if (section) archive[key] = section;
        } catch (err) {
          console.warn(`典藏資料夾載入失敗 (${key})：`, err);
        }
      })
    );

    return content;
  };
})();
