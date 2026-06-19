/**
 * 從 content/research/journals/ 資料夾載入研究｜藝術家教師日誌內容。
 * 若資料夾內有 config.json，會覆寫 site-content.json 中對應的 archive.research 與教師日誌。
 * 已設定 Sanity 時預設以 Sanity 為主；本機若要強制使用資料夾，請在 config.json 加 "override": true。
 */
(function () {
  const BASE = "./content/research/journals";

  async function loadResearchJournals() {
    const configRes = await fetch(`${BASE}/config.json`, { cache: "no-store" });
    if (!configRes.ok) return null;

    const config = await configRes.json();
    const sanityActive = Boolean(String(window.SANITY_PROJECT_ID || "").trim());
    if (sanityActive && config.override !== true) return null;

    const years = Array.isArray(config.years) ? config.years : [];
    const byYear = {};

    await Promise.all(
      years.map(async (year) => {
        const yearRes = await fetch(`${BASE}/${year}.json`, { cache: "no-store" });
        if (!yearRes.ok) return;
        byYear[year] = await yearRes.json();
      })
    );

    return { config, years, byYear };
  }

  window.mergeResearchFolderContent = async function mergeResearchFolderContent(content) {
    try {
      const loaded = await loadResearchJournals();
      if (!loaded) return content;

      const { config, years, byYear } = loaded;
      content.archive = content.archive || {};
      content.archive.research = {
        ...(content.archive.research || {}),
        heading: config.heading || content.archive.research?.heading || "研究",
        journalTitle: config.journalTitle || content.archive.research?.journalTitle || "藝術家教師日誌",
        bookshelf: {
          ...(content.archive.research?.bookshelf || {}),
          ...(config.bookshelf || {}),
          tabYears: config.tabYears || config.bookshelf?.tabYears,
          defaultYear: config.defaultYear || config.bookshelf?.defaultYear,
        },
      };

      content.archive.teachers = content.archive.teachers || {};
      const teachers = content.archive.teachers;
      const existingYears = Array.isArray(teachers.years) ? teachers.years : [];
      teachers.years = [...new Set([...existingYears, ...years])].sort();
      teachers.byYear = teachers.byYear || {};
      teachers.journals = teachers.journals || {};

      for (const year of years) {
        const pack = byYear[year];
        if (!pack) continue;

        if (Array.isArray(pack.teachers) && pack.teachers.length) {
          teachers.byYear[year] = {
            ...(teachers.byYear[year] || {}),
            title: pack.title || `${year}年藝術家教師`,
            teachers: pack.teachers,
          };
        }

        const journalMap = pack.journals && typeof pack.journals === "object" ? pack.journals : {};
        for (const [teacherId, journal] of Object.entries(journalMap)) {
          if (
            journal &&
            (Array.isArray(journal.spreads) || Array.isArray(journal.pages))
          ) {
            teachers.journals[teacherId] = journal;
          }
        }
      }

      if (years.length && !teachers.defaultYear) {
        teachers.defaultYear = years[years.length - 1];
      }
    } catch (err) {
      console.warn("研究日誌資料夾載入失敗：", err);
    }

    return content;
  };
})();
