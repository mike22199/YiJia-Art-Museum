function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== undefined && v !== null) node.setAttribute(k, String(v));
  }
  for (const c of children || []) {
    if (c === null || c === undefined) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function escapeText(s) {
  return String(s ?? "");
}

function normalizeSection(section) {
  const raw = String(section || "").trim();
  const cleaned = raw.includes("?") ? raw.split("?")[0] : raw;
  return cleaned.trim().toLowerCase() || "text";
}

function parseRoute() {
  const raw = (location.hash || "").replace(/^#/, "").trim();
  if (!raw) return { id: "home", section: "index" };
  const slash = raw.indexOf("/");
  const id = slash >= 0 ? raw.slice(0, slash) : raw;
  const rest = slash >= 0 ? raw.slice(slash + 1) : "";
  const q = rest.indexOf("?");
  const section = normalizeSection(q >= 0 ? rest.slice(0, q) : rest || "index");
  return { id: id || "home", section: section || "index" };
}

function setRoute(id, section) {
  const s = normalizeSection(section);
  location.hash = `#${id}/${s}`;
}

function storageKeyForDiary(scopeId, section) {
  return `FIFI_DIARY_${scopeId}__${normalizeSection(section)}`;
}

function loadLocalDiary(scopeId, section) {
  try {
    const raw = localStorage.getItem(storageKeyForDiary(scopeId, section));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalDiary(scopeId, section, entries) {
  localStorage.setItem(storageKeyForDiary(scopeId, section), JSON.stringify(entries));
}

function mergedDiary(scopeId, section, diarySeed) {
  const seeded = Array.isArray(diarySeed) ? diarySeed : [];
  const local = loadLocalDiary(scopeId, section);
  const all = [...local, ...seeded];
  return all
    .slice()
    .sort((a, b) => String(b?.date || "").localeCompare(String(a?.date || "")));
}

function flattenIndexItems() {
  const nav = window.SITE_CONTENT?.nav || [];
  const items = [];

  for (const group of nav) {
    for (const it of group.items || []) {
      if (it.type === "node") {
        items.push({
          kind: "node",
          id: it.id,
          label: it.label || it.id,
          children: (it.children || []).filter((c) => c.type === "section"),
        });
      } else if (it.type === "page") {
        items.push({
          kind: "page",
          id: it.id,
          label: it.label || it.id,
        });
      }
    }
  }

  const nodes = items.filter((x) => x.kind === "node");
  const pages = items.filter((x) => x.kind === "page");
  return [...nodes, ...pages];
}

function sectionLabelFallback(section) {
  const s = normalizeSection(section);
  if (s === "timeline") return "年代";
  if (s === "topic") return "主題";
  if (s === "images") return "相片記錄";
  if (s === "text") return "文字內容";
  if (s === "diary") return "日誌";
  if (s === "tramitologia") return "Tramitología";
  if (s === "address") return "Address / Discurso";
  if (s === "discussion") return "Discussion / Conversación";
  if (s === "interview") return "Interview";
  return s;
}

function ensureCursorFlyout() {
  let flyout = document.getElementById("cursorFlyout");
  if (flyout) return flyout;

  flyout = el("div", { id: "cursorFlyout", class: "cursorFlyout", role: "menu" }, [
    el("div", { id: "cursorFlyoutTitle", class: "cursorFlyoutTitle", text: "" }),
    el("div", { id: "cursorFlyoutBody" }),
  ]);
  document.body.appendChild(flyout);
  return flyout;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function navigateFromHref(href) {
  const raw = String(href || "").trim();
  if (!raw) {
    setRoute("home", "index");
    return;
  }
  location.hash = raw.startsWith("#") ? raw : `#${raw}`;
}

function yearIntroHref(year, sectionId) {
  const y = encodeURIComponent(year || "");
  const base = `#classics/year?year=${y}`;
  return sectionId ? `${base}&section=${encodeURIComponent(sectionId)}` : base;
}

function hotspotCenterX(hs) {
  if (!hs) return "50%";
  const left = parseFloat(String(hs.left || "0"));
  const width = parseFloat(String(hs.width || "0"));
  if (Number.isNaN(left) || Number.isNaN(width)) return "50%";
  return `${left + width / 2}%`;
}

function zoneHotspotStyle(hs) {
  return [
    hs?.left ? `left:${hs.left}` : "",
    hs?.top ? `top:${hs.top}` : "",
    hs?.width ? `width:${hs.width}` : "",
    hs?.height ? `height:${hs.height}` : "",
  ]
    .filter(Boolean)
    .join(";");
}

function zoneNavStyle(zone) {
  const nav = zone.nav || {};
  const left = nav.left || hotspotCenterX(zone.hotspot);
  return `left:${left};width:${nav.width || "14%"};`;
}

function defaultHomeZones() {
  return [
    {
      id: "left",
      label: "開幕展",
      title: "開幕展（左）",
      href: "#exhibition-left/about",
      hotspot: { left: "20.5%", top: "35.5%", width: "5.7%", height: "23.5%" },
      nav: { left: "23.3%" },
    },
    {
      id: "center",
      label: "檔案庫",
      title: "典藏庫",
      href: "#classics/years",
      accent: true,
      hotspot: { left: "46.7%", top: "62%", width: "6.6%", height: "10.5%" },
      nav: { left: "50%" },
    },
    {
      id: "right",
      label: "開幕展",
      title: "開幕展（右）",
      href: "#exhibition-right/about",
      hotspot: { left: "73.8%", top: "35.5%", width: "5.7%", height: "23.5%" },
      nav: { left: "76.7%" },
    },
  ];
}

function renderHome(main) {
  const homeImage = window.SITE_CONTENT?.homeImage || "./assets/images/mainsite.png";
  const zones = Array.isArray(window.SITE_CONTENT?.homeZones)
    ? window.SITE_CONTENT.homeZones
    : defaultHomeZones();

  document.body.classList.add("isHomePage");
  main.classList.remove("mainSingle");
  main.classList.add("mainHome");

  const root = el("div", { class: "home homeMuseum" });

  const stage = el("div", { class: "museumStage" }, [
    el("img", {
      class: "museumPhoto",
      src: homeImage,
      alt: "義家藝館首頁",
      loading: "eager",
    }),
    el(
      "div",
      { class: "museumHotspots", "aria-label": "首頁入口" },
      zones.map((zone) => {
        const hs = zone.hotspot || {};

        return el(
          "a",
          {
            class: `museumHotspot museumHotspot--${zone.id || "zone"}${zone.accent ? " museumHotspot--accent" : ""}`,
            href: zone.href || "#home/index",
            style: zoneHotspotStyle(hs),
            "aria-label": zone.title || zone.label || "入口",
            onclick: (e) => {
              e.preventDefault();
              navigateFromHref(zone.href);
            },
          },
          [el("span", { class: "museumHotspotLabel", text: zone.title || zone.label || "" })]
        );
      })
    ),
    el(
      "nav",
      { class: "museumNav", "aria-label": "首頁導覽" },
      zones.map((zone) =>
        el(
          "a",
          {
            class: `museumNavItem museumNavItem--${zone.id || "zone"}${zone.accent ? " museumNavItem--accent" : ""}`,
            href: zone.href || "#home/index",
            style: zoneNavStyle(zone),
            "aria-label": zone.label || zone.title || "入口",
            onclick: (e) => {
              e.preventDefault();
              navigateFromHref(zone.href);
            },
          },
          [
            el("span", { class: "museumNavIcon", "aria-hidden": "true" }),
            el("span", { class: "museumNavText", text: zone.label || zone.title || "" }),
          ]
        )
      )
    ),
  ]);

  root.appendChild(el("section", { class: "homeMuseumArea" }, [stage]));
  main.innerHTML = "";
  main.appendChild(root);
}

function renderCoCreate(main) {
  const page = window.SITE_CONTENT?.pages?.["co-create"] || { title: "共創 / 投稿" };
  const pageEl = el("div", { class: "page" });
  pageEl.appendChild(
    el("div", { class: "backRow" }, [
      el("button", { class: "backLink", type: "button", text: "Back to home", onclick: () => setRoute("home", "index") }),
    ])
  );
  renderHero(pageEl, page);

  const panel = el("div", { class: "panel" });
  panel.appendChild(el("div", { class: "textBlock" }, [el("h3", { text: "投稿" })]));
  panel.appendChild(el("div", { style: "height:10px" }));

  const nameEl = el("input", { id: "cc_name", type: "text", placeholder: "匿名 / 名字" });
  const titleEl = el("input", { id: "cc_title", type: "text", placeholder: "標題" });
  const bodyEl = el("textarea", { id: "cc_body", placeholder: "在這裡輸入投稿文字……" });
  const statusEl = el("div", { id: "cc_status", class: "muted", text: "" });

  const clear = () => {
    localStorage.removeItem("FIFI_CO_CREATE_DRAFT");
    nameEl.value = "";
    titleEl.value = "";
    bodyEl.value = "";
    statusEl.textContent = "";
  };

  const save = () => {
    const name = String(nameEl.value || "").trim();
    const title = String(titleEl.value || "").trim();
    const body = String(bodyEl.value || "").trim();
    localStorage.setItem("FIFI_CO_CREATE_DRAFT", JSON.stringify({ name, title, body, savedAt: new Date().toISOString() }));
    statusEl.textContent = "";
  };

  panel.appendChild(
    el("div", { class: "composer" }, [
      el("div", { class: "field" }, [el("label", { text: "Name（可留空）" }), nameEl]),
      el("div", { class: "field" }, [el("label", { text: "Title（可留空）" }), titleEl]),
      el("div", { class: "field", style: "grid-column: 1 / -1" }, [el("label", { text: "Text" }), bodyEl]),
      el("div", { class: "actions" }, [
        statusEl,
        el("button", { class: "btn btnGhost", type: "button", text: "Clear", onclick: clear }),
        el("button", { class: "btn", type: "button", text: "Save draft", onclick: save }),
      ]),
    ])
  );

  try {
    const raw = localStorage.getItem("FIFI_CO_CREATE_DRAFT");
    if (raw) {
      const d = JSON.parse(raw);
      nameEl.value = d?.name || "";
      titleEl.value = d?.title || "";
      bodyEl.value = d?.body || "";
      statusEl.textContent = "";
    }
  } catch {}

  pageEl.appendChild(panel);
  main.innerHTML = "";
  main.appendChild(pageEl);
}

function getHashQuery() {
  const raw = String(location.hash || "");
  const i = raw.indexOf("?");
  if (i < 0) return new URLSearchParams("");
  return new URLSearchParams(raw.slice(i + 1));
}

function renderClassics(main, route) {
  const page = window.SITE_CONTENT?.pages?.["classics"] || { title: "典籍" };
  const data = window.SITE_CONTENT?.classics || {};
  const section = normalizeSection(route.section || "years");
  const view = section || "years";

  const pageEl = el("div", { class: "page" });
  pageEl.appendChild(
    el("div", { class: "backRow" }, [
      el("button", { class: "backLink", type: "button", text: "Back to home", onclick: () => setRoute("home", "index") }),
      el("div", { class: "tabs" }, [
        el("button", { class: `tab ${view === "years" ? "tabActive" : ""}`, type: "button", text: "歷年網站", onclick: () => setRoute("classics", "years") }),
        el("button", { class: `tab ${view === "practice" ? "tabActive" : ""}`, type: "button", text: "藝術實踐", onclick: () => setRoute("classics", "practice") }),
        el("button", { class: `tab ${view === "media" ? "tabActive" : ""}`, type: "button", text: "影音與歷年展演", onclick: () => setRoute("classics", "media") }),
      ]),
    ])
  );
  renderHero(pageEl, page);

  const panel = el("div", { class: "panel" });

  if (view === "years") {
    const links = Array.isArray(data.yearsWebsites) ? data.yearsWebsites : [];
    panel.appendChild(el("div", { class: "textBlock" }, [el("h3", { text: "歷年網站" })]));
    panel.appendChild(el("div", { style: "height:10px" }));
    panel.appendChild(
      el(
        "div",
        { class: "linkList" },
        links.map((x) =>
          el("a", { class: "linkItem", href: x.url, target: "_blank", rel: "noreferrer" }, [
            el("div", { class: "linkTitle", text: x.title || x.url }),
            el("div", { class: "linkHint", text: "open ↗" }),
          ])
        )
      )
    );
  } else if (view === "practice") {
    const works = Array.isArray(data.artPracticeWorks) ? data.artPracticeWorks : [];
    const params = getHashQuery();
    const activeId = params.get("work") || (works[0] ? works[0].id : "");
    const active = works.find((w) => String(w.id) === String(activeId)) || works[0] || null;

    panel.appendChild(el("div", { class: "textBlock" }, [el("h3", { text: "藝術實踐" })]));
    panel.appendChild(el("div", { style: "height:10px" }));

    panel.appendChild(
      el(
        "div",
        { class: "subTabs" },
        works.map((w) =>
          el("button", {
            class: `tab ${active && w.id === active.id ? "tabActive" : ""}`,
            type: "button",
            text: `${w.title || "Work"}${w.year ? ` (${w.year})` : ""}`,
            onclick: () => {
              location.hash = `#classics/practice?work=${encodeURIComponent(w.id)}`;
            },
          })
        )
      )
    );

    if (active) {
      panel.appendChild(el("div", { style: "height:10px" }));
      panel.appendChild(
        el("div", { class: "detail" }, [
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "作品名" }), el("div", { class: "detailVal", text: active.title || "" })]),
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "年分" }), el("div", { class: "detailVal", text: active.year || "" })]),
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "理念" }), el("div", { class: "detailVal", text: active.concept || "" })]),
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "媒材" }), el("div", { class: "detailVal", text: active.materials || "" })]),
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "備註" }), el("div", { class: "detailVal", text: active.notes || "" })]),
        ])
      );
    }
  } else if (view === "media") {
    const media = data.media || {};
    const videos = Array.isArray(media.youtubeEmbeds) ? media.youtubeEmbeds : [];
    const perfs = Array.isArray(media.performances) ? media.performances : [];
    const params = getHashQuery();
    const activePerfId = params.get("perf") || "";
    const activePerf = perfs.find((p) => String(p.id) === String(activePerfId)) || null;

    panel.appendChild(el("div", { class: "textBlock" }, [el("h3", { text: "影音" })]));
    panel.appendChild(el("div", { style: "height:10px" }));

    for (const v of videos) {
      const yid = String(v.youtubeId || "").trim();
      panel.appendChild(
        el("div", { class: "videoWrap" }, [
          el("div", { class: "videoTitle", text: v.title || "Video" }),
          yid
            ? el("iframe", {
                class: "videoFrame",
                src: `https://www.youtube.com/embed/${encodeURIComponent(yid)}`,
                title: v.title || "YouTube video",
                frameborder: "0",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                allowfullscreen: "true",
              })
            : null,
        ])
      );
      panel.appendChild(el("div", { style: "height:10px" }));
    }

    panel.appendChild(el("div", { class: "textBlock" }, [el("h3", { text: "歷年展演" })]));
    panel.appendChild(el("div", { style: "height:10px" }));
    panel.appendChild(
      el(
        "div",
        { class: "perfGrid" },
        perfs.map((p) =>
          el(
            "button",
            {
              class: `perfCard ${activePerf && activePerf.id === p.id ? "perfCardActive" : ""}`,
              type: "button",
              onclick: () => {
                location.hash = `#classics/media?perf=${encodeURIComponent(p.id)}`;
              },
            },
            [el("div", { class: "perfTitle", text: p.title || "Performance" }), el("div", { class: "perfMeta", text: p.year || "" }), el("div", { class: "perfDesc", text: p.description || "" })]
          )
        )
      )
    );

    if (activePerf) {
      panel.appendChild(el("div", { style: "height:10px" }));
      panel.appendChild(
        el("div", { class: "detail" }, [
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "展演名" }), el("div", { class: "detailVal", text: activePerf.title || "" })]),
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "年分" }), el("div", { class: "detailVal", text: activePerf.year || "" })]),
          el("div", { class: "detailRow" }, [el("div", { class: "detailKey", text: "詳細" }), el("div", { class: "detailVal", text: activePerf.details || "" })]),
        ])
      );
    }
  }

  pageEl.appendChild(panel);
  main.innerHTML = "";
  main.appendChild(pageEl);
}

function buildResearchBookData() {
  const data = window.SITE_CONTENT?.research || {};
  const journals = Array.isArray(data.artistJournals) ? data.artistJournals : [];
  const pages = [];
  for (const j of journals) {
    const artist = j.artist || "Artist";
    const ps = Array.isArray(j.pages) ? j.pages : [];
    for (const p of ps) {
      pages.push({ artist, date: p.date || "", title: p.title || "", body: p.body || "", color: p.color || "" });
    }
  }
  return pages.length
    ? pages
    : [
        { artist: "藝術家", date: "2024-01-01", title: "第一頁", body: "" },
        { artist: "藝術家", date: "2024-01-02", title: "第二頁", body: "" },
      ];
}

function renderResearch(main, route) {
  const page = window.SITE_CONTENT?.pages?.["research"] || { title: "研究" };
  const data = window.SITE_CONTENT?.research || {};
  const section = normalizeSection(route.section || "book");
  const view = section || "book";

  const pageEl = el("div", { class: "page" });
  pageEl.appendChild(
    el("div", { class: "backRow" }, [
      el("button", { class: "backLink", type: "button", text: "Back to home", onclick: () => setRoute("home", "index") }),
      el("div", { class: "tabs" }, [
        el("button", { class: `tab ${view === "book" ? "tabActive" : ""}`, type: "button", text: "翻書閱讀", onclick: () => setRoute("research", "book") }),
        el("button", { class: `tab ${view === "reading" ? "tabActive" : ""}`, type: "button", text: "參考 / 導讀", onclick: () => setRoute("research", "reading") }),
      ]),
    ])
  );
  renderHero(pageEl, page);

  const panel = el("div", { class: "panel" });

  if (view === "book") {
    const pages = buildResearchBookData();
    const params = getHashQuery();
    let idx = Math.max(0, Math.min(pages.length - 1, Number(params.get("p") || 0) || 0));

    const updateHash = (nextIdx) => {
      const n = Math.max(0, Math.min(pages.length - 1, nextIdx));
      location.hash = `#research/book?p=${n}`;
    };

    const left = el("div", { class: "bookPane" });
    const right = el("div", { class: "bookSide" });

    const bookWrap = el("div", { class: "flipBookWrap" });
    const book = el("div", { class: "flipBook", role: "group", "aria-label": "book" });
    const pageFront = el("div", { class: "flipPage flipPageFront" });
    const pageBack = el("div", { class: "flipPage flipPageBack" });

    const renderPage = (node, p, side, showNo) => {
      node.innerHTML = "";
      node.style.backgroundColor = p.color || "#ffffff";
      node.appendChild(
        el("div", { class: "bookMeta" }, [el("div", { class: "bookArtist", text: p.artist || "" }), el("div", { class: "bookDate", text: p.date || "" })])
      );
      node.appendChild(el("div", { class: "bookTitle", text: p.title || "" }));
      node.appendChild(el("div", { class: "bookBody", text: p.body || "" }));
      node.appendChild(el("div", { class: "bookPageNo", text: `${showNo} / ${pages.length}` }));
      node.setAttribute("data-side", side);
    };

    const sync = () => {
      const p1 = pages[idx];
      const p2 = pages[Math.min(pages.length - 1, idx + 1)] || p1;
      renderPage(pageFront, p1, "front", idx + 1);
      renderPage(pageBack, p2, "back", Math.min(pages.length, idx + 2));
      book.style.backgroundColor = p2.color || "#ffffff";
    };

    const FLIP_MS = 1200;

    const resetPageFront = () => {
      pageFront.style.transition = "none";
      pageFront.style.transform = "rotateY(0deg)";
      pageFront.style.transformOrigin = "left center";
      void pageFront.offsetWidth;
      pageFront.style.removeProperty("transition");
      pageFront.style.removeProperty("transform");
      pageFront.style.removeProperty("transform-origin");
    };

    const flip = (dir) => {
      if (dir > 0 && idx >= pages.length - 1) return;
      if (dir < 0 && idx <= 0) return;
      if (book.classList.contains("isFlipping")) return;

      book.classList.remove("flipDirNext", "flipDirPrev", "isFlipping");
      resetPageFront();

      const startFlip = () => {
        book.classList.add(dir > 0 ? "flipDirNext" : "flipDirPrev", "isFlipping");
      };

      if (dir < 0) {
        const leavingIdx = idx;
        idx = Math.max(0, idx - 1);
        renderPage(pageFront, pages[idx], "front", idx + 1);
        renderPage(pageBack, pages[leavingIdx], "back", leavingIdx + 1);
        book.style.backgroundColor = pages[leavingIdx].color || "#ffffff";
        pageFront.style.transition = "none";
        pageFront.style.transformOrigin = "left center";
        pageFront.style.transform = "rotateY(-160deg)";
        void pageFront.offsetWidth;
        requestAnimationFrame(() => {
          startFlip();
          pageFront.style.removeProperty("transition");
          pageFront.style.removeProperty("transform");
          pageFront.style.removeProperty("transform-origin");
        });
      } else {
        requestAnimationFrame(startFlip);
      }

      window.setTimeout(() => {
        if (dir > 0) idx = Math.min(pages.length - 1, idx + 1);
        sync();
        resetPageFront();
        book.classList.remove("isFlipping", "flipDirNext", "flipDirPrev");
        updateHash(idx);
      }, FLIP_MS);
    };

    book.appendChild(pageBack);
    book.appendChild(pageFront);
    bookWrap.appendChild(book);
    sync();

    // 點書本左右側翻頁（僅點擊，滑過不翻）
    book.addEventListener("click", (e) => {
      if (book.classList.contains("isFlipping")) return;
      const rect = book.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(1, rect.width);
      if (x < 0.46) flip(-1);
      else if (x > 0.54) flip(1);
    });

    book.addEventListener("mousemove", (e) => {
      if (book.classList.contains("isFlipping")) return;
      const rect = book.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(1, rect.width);
      book.classList.toggle("clickZoneLeft", x < 0.46);
      book.classList.toggle("clickZoneRight", x > 0.54);
    });
    book.addEventListener("mouseleave", () => {
      book.classList.remove("clickZoneLeft", "clickZoneRight");
    });

    const controls = el("div", { class: "bookControls" }, [
      el("button", { class: "btn btnGhost", type: "button", text: "Prev", onclick: () => flip(-1) }),
      el("button", { class: "btn", type: "button", text: "Next", onclick: () => flip(1) }),
    ]);

    left.appendChild(
      el("div", { class: "textBlock" }, [
        el("h3", { text: "翻書閱讀" }),
      ])
    );
    left.appendChild(el("div", { style: "height:10px" }));
    left.appendChild(bookWrap);
    left.appendChild(el("div", { style: "height:10px" }));
    left.appendChild(controls);

    const bib = Array.isArray(data.bibliography) ? data.bibliography : [];
    const guides = Array.isArray(data.readingGuides) ? data.readingGuides : [];
    const detail = el("div", { class: "readingDetail muted", text: "點擊右側項目以查看內容。" });

    const mkItem = (title, meta, onClick) =>
      el("button", { class: "readingItem", type: "button", onclick: onClick }, [
        el("div", { class: "readingItemTitle", text: title }),
        el("div", { class: "readingItemMeta", text: meta }),
      ]);

    right.appendChild(el("div", { class: "readingGroupTitle", text: "參考書目" }));
    right.appendChild(
      el(
        "div",
        { class: "readingList" },
        bib.map((b) =>
          mkItem(
            b.title || "書目",
            `${b.author || ""}${b.year ? ` • ${b.year}` : ""}`.trim(),
            () => {
              detail.classList.remove("muted");
              detail.textContent = `${b.title || ""}${b.author ? `｜${b.author}` : ""}${b.year ? `（${b.year}）` : ""}\n\n${b.note || ""}`;
            }
          )
        )
      )
    );

    right.appendChild(el("div", { style: "height:10px" }));
    right.appendChild(el("div", { class: "readingGroupTitle", text: "導讀文本" }));
    right.appendChild(
      el(
        "div",
        { class: "readingList" },
        guides.map((g) =>
          mkItem(g.title || "導讀", "open", () => {
            detail.classList.remove("muted");
            detail.textContent = `${g.title || "導讀"}\n\n${g.body || ""}`;
          })
        )
      )
    );

    right.appendChild(el("div", { style: "height:10px" }));
    right.appendChild(el("div", { class: "readingDetail" }, [detail]));

    panel.appendChild(el("div", { class: "researchSplit" }, [left, right]));
  } else {
    const bib = Array.isArray(data.bibliography) ? data.bibliography : [];
    const guides = Array.isArray(data.readingGuides) ? data.readingGuides : [];
    const detail = el("div", { class: "readingDetail muted", text: "點擊上方項目以查看內容。" });

    panel.appendChild(
      el("div", { class: "textBlock" }, [
        el("h3", { text: "參考書目與導讀" }),
      ])
    );
    panel.appendChild(el("div", { style: "height:10px" }));

    panel.appendChild(el("div", { class: "readingGroupTitle", text: "參考書目" }));
    panel.appendChild(
      el(
        "div",
        { class: "readingList" },
        bib.map((b) =>
          el("button", { class: "readingItem", type: "button", onclick: () => {
            detail.classList.remove("muted");
            detail.textContent = `${b.title || ""}${b.author ? `｜${b.author}` : ""}${b.year ? `（${b.year}）` : ""}\n\n${b.note || ""}`;
          }}, [el("div", { class: "readingItemTitle", text: b.title || "書目" }), el("div", { class: "readingItemMeta", text: `${b.author || ""}${b.year ? ` • ${b.year}` : ""}`.trim() })])
        )
      )
    );

    panel.appendChild(el("div", { style: "height:10px" }));
    panel.appendChild(el("div", { class: "readingGroupTitle", text: "導讀文本" }));
    panel.appendChild(
      el(
        "div",
        { class: "readingList" },
        guides.map((g) =>
          el("button", { class: "readingItem", type: "button", onclick: () => {
            detail.classList.remove("muted");
            detail.textContent = `${g.title || "導讀"}\n\n${g.body || ""}`;
          }}, [el("div", { class: "readingItemTitle", text: g.title || "導讀" }), el("div", { class: "readingItemMeta", text: "open" })])
        )
      )
    );

    panel.appendChild(el("div", { style: "height:10px" }));
    panel.appendChild(el("div", { class: "readingDetail" }, [detail]));
  }

  pageEl.appendChild(panel);
  main.innerHTML = "";
  main.appendChild(pageEl);
}

function renderHero(container, page) {
  const hero = page?.hero || {};
  const img = hero.image;
  const caption = hero.caption || "";
  const title = page?.title || "";

  const heroEl = el("div", { class: "hero" }, [
    img
      ? el("img", {
          class: "heroImg",
          src: img,
          alt: `${escapeText(title)} hero`,
          loading: "lazy",
        })
      : el("div", { class: "heroImg" }),
    el("div", { class: "heroBar" }, [
      el("div", { class: "heroTitle", text: title }),
      el("div", { class: "heroCaption", text: caption }),
    ]),
  ]);

  container.appendChild(heroEl);
}

function renderImages(container, images) {
  const imgs = Array.isArray(images) ? images : [];
  if (!imgs.length) return;

  const grid = el("div", { class: "grid" });
  for (const img of imgs) {
    grid.appendChild(
      el("div", { class: "card" }, [
        el("img", {
          src: img.src,
          alt: img.alt || "image",
          loading: "lazy",
        }),
        el("div", { class: "cardBody" }, [
          el("div", { class: "note", text: img.note || "" }),
        ]),
      ])
    );
  }
  container.appendChild(el("div", { class: "panel" }, [grid]));
}

function renderText(container, blocks) {
  const bks = Array.isArray(blocks) ? blocks : [];
  if (!bks.length) return;
  const wrapper = el("div", { class: "panel" });
  for (const b of bks) {
    wrapper.appendChild(
      el("div", { class: "textBlock" }, [
        b.heading ? el("h3", { text: b.heading }) : null,
        b.body ? el("p", { text: b.body }) : null,
      ])
    );
    wrapper.appendChild(el("div", { style: "height:10px" }));
  }
  container.appendChild(wrapper);
}

function renderDiary(container, scopeId, sectionKey, diarySeed) {
  const panel = el("div", { class: "panel" });

  const titleInput = el("input", { type: "text", placeholder: "標題（可留空）" });
  const dateInput = el("input", { type: "date" });
  const tagsInput = el("input", { type: "text", placeholder: "tags（用逗號分隔，可留空）" });
  const bodyInput = el("textarea", { placeholder: "在這裡寫下日誌內容……" });

  const status = el("div", { class: "muted", text: "新增後會保存在此瀏覽器（localStorage）。" });

  const addBtn = el("button", {
    class: "btn",
    type: "button",
    text: "Add entry",
    onclick: () => {
      const body = String(bodyInput.value || "").trim();
      if (!body) {
        status.textContent = "請先填寫日誌內容。";
        return;
      }
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const date = String(dateInput.value || `${yyyy}-${mm}-${dd}`);
      const entry = {
        date,
        title: String(titleInput.value || "").trim() || "Untitled",
        body,
        tags: String(tagsInput.value || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        _local: true,
        _createdAt: new Date().toISOString(),
      };
      const local = loadLocalDiary(scopeId, sectionKey);
      local.unshift(entry);
      saveLocalDiary(scopeId, sectionKey, local);
      titleInput.value = "";
      bodyInput.value = "";
      tagsInput.value = "";
      status.textContent = "已新增。";
      render();
    },
  });

  const clearBtn = el("button", {
    class: "btn btnGhost",
    type: "button",
    text: "Clear local entries",
    onclick: () => {
      saveLocalDiary(scopeId, sectionKey, []);
      status.textContent = "已清除本機新增日誌。";
      render();
    },
  });

  panel.appendChild(
    el("div", { class: "textBlock" }, [
      el("h3", { text: "Write / 撰寫" }),
    ])
  );

  panel.appendChild(
    el("div", { class: "composer" }, [
      el("div", { class: "field" }, [el("label", { text: "Title" }), titleInput]),
      el("div", { class: "field" }, [el("label", { text: "Date" }), dateInput]),
      el("div", { class: "field", style: "grid-column: 1 / -1" }, [
        el("label", { text: "Tags" }),
        tagsInput,
      ]),
      el("div", { class: "field", style: "grid-column: 1 / -1" }, [
        el("label", { text: "Body" }),
        bodyInput,
      ]),
      el("div", { class: "actions" }, [status, clearBtn, addBtn]),
    ])
  );

  container.appendChild(panel);

  const entries = mergedDiary(scopeId, sectionKey, diarySeed);
  if (!entries.length) return;

  const list = el("div", { class: "diaryList" });
  for (const e of entries) {
    const tags = Array.isArray(e.tags) ? e.tags : [];
    list.appendChild(
      el("div", { class: "entry" }, [
        el("div", { class: "entryHead" }, [
          el("div", { class: "entryTitle", text: e.title || "Untitled" }),
          el("div", {
            class: "entryMeta",
            text: `${e.date || ""}${e._local ? " • local" : ""}`,
          }),
        ]),
        el("div", { class: "entryBody", text: e.body || "" }),
        tags.length
          ? el("div", { class: "tags" }, tags.map((t) => el("span", { class: "tag", text: t })))
          : null,
      ])
    );
  }

  container.appendChild(el("div", { class: "panel" }, [el("div", { class: "textBlock" }, [
    el("h3", { text: "Diary / 日誌" }),
    el("p", { class: "muted", text: "顯示順序：本機新增（localStorage）會優先顯示，接著是內容檔內的預設日誌（diarySeed）。" }),
  ]), list]));
}

function renderMain(main, route) {
  const pages = window.SITE_CONTENT?.pages || {};
  const records = window.SITE_CONTENT?.records || {};

  const id = route.id || "about";
  const section = normalizeSection(route.section || "");

  document.body.classList.toggle("isHomePage", id === "home");
  document.body.classList.toggle("isInnerPage", id !== "home");
  main.classList.toggle("mainHome", id === "home");
  main.classList.toggle("mainSingle", id !== "home");
  main.classList.toggle("mainInner", id !== "home");

  if (id === "home") {
    renderHome(main);
    return;
  }

  if (id === "co-create") {
    renderCoCreatePage(main);
    return;
  }

  if (id === "archive") {
    renderArchivePage(main, route);
    return;
  }

  if (id === "classics") {
    const mapped = classicsSectionToArchive(normalizeSection(route.section || "years"));
    const raw = (location.hash || "").replace(/^#/, "");
    const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
    navigateFromHref(`#archive/${mapped}${q}`);
    return;
  }

  if (id === "research") {
    const container = el("div");
    renderResearch(container, route);
    const pageEl = container.firstChild;
    if (pageEl) {
      const back = pageEl.querySelector(".backRow");
      if (back) back.remove();
      const hero = pageEl.querySelector(".hero");
      if (hero) hero.remove();
      main.innerHTML = "";
      main.appendChild(wrapInnerPage(pageEl, { activeNav: "research" }));
    }
    return;
  }

  if (id.startsWith("exhibition-")) {
    renderExhibitionPage(main, route);
    return;
  }

  const node = pages[id] ? pages[id] : records[id] ? records[id] : pages.about;
  const scopeId = pages[id] || records[id] ? id : "about";
  const defaultSection =
    normalizeSection(node?.defaultSection || (pages[scopeId] ? "text" : "images"));
  const sectionKey = section || defaultSection;

  const sections = node?.sections || {};
  const current = sections[sectionKey] || sections[defaultSection] || null;

  const pageEl = el("div", { class: "page" });
  pageEl.appendChild(
    el("div", { class: "backRow" }, [
      el("button", {
        class: "backLink",
        type: "button",
        text: "Back to index",
        onclick: () => setRoute("home", "index"),
      }),
    ])
  );
  renderHero(pageEl, node);

  if (current) {
    if (sectionKey === "diary") {
      renderDiary(pageEl, scopeId, sectionKey, current.diarySeed);
    } else if (current.images) {
      renderImages(pageEl, current.images);
    } else if (current.blocks) {
      renderText(pageEl, current.blocks);
    } else if (current.diarySeed) {
      renderDiary(pageEl, scopeId, sectionKey, current.diarySeed);
    }
  }

  main.innerHTML = "";
  main.appendChild(pageEl);
}

function render() {
  const route = parseRoute();
  const main = document.getElementById("main");
  renderMain(main, route);
}

window.addEventListener("hashchange", render);

async function loadSiteContent() {
  const projectId = String(window.SANITY_PROJECT_ID || "").trim();
  const dataset = String(window.SANITY_DATASET || "production").trim();
  const jsonUrl = window.SITE_CONTENT_URL || "./content/site-content.json";

  const fallbackRes = await fetch(jsonUrl, { cache: "no-store" });
  if (!fallbackRes.ok) throw new Error(`HTTP ${fallbackRes.status}`);
  const fallback = await fallbackRes.json();

  if (projectId) {
    try {
      const query = encodeURIComponent('*[_type == "siteContent"][0]');
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const payload = await res.json();
        if (payload?.result && typeof window.normalizeSanitySiteContent === "function") {
          return window.normalizeSanitySiteContent(payload.result, fallback);
        }
        if (payload?.result) return payload.result;
      }
    } catch (err) {
      console.warn("Sanity 讀取失敗，改使用本地 JSON：", err);
    }
  }

  return fallback;
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    window.SITE_CONTENT = await loadSiteContent();
  } catch (err) {
    document.body.innerHTML =
      "<div style='padding:16px;font-family:ui-monospace,Consolas,monospace;color:#eee;line-height:1.7'>" +
      "<div style='font-weight:700;margin-bottom:6px'>內容載入失敗</div>" +
      "<div>請確認存在 <b>content/site-content.json</b>。</div>" +
      "<div style='margin-top:10px;color:#c9c7c4'>如果你是用『直接雙擊打開 HTML』，瀏覽器可能會擋住讀取 JSON。建議用本機靜態伺服器開啟（例如 VS Code Live Server，或在專案資料夾執行 <b>python -m http.server</b> 再用瀏覽器打開）。</div>" +
      "<div style='margin-top:10px;color:#c9c7c4'>錯誤：" +
      String(err && err.message ? err.message : err) +
      "</div></div>";
    return;
  }

  const site = window.SITE_CONTENT?.site || {};
  const titleEl = document.getElementById("siteTitle");
  const subEl = document.getElementById("siteSubtitle");
  if (titleEl) titleEl.textContent = site.title || "Archive";
  if (subEl) subEl.textContent = site.subtitle || "";
  if (site.title) document.title = site.title;

  const logoEl = document.getElementById("siteLogo");
  const logo = site.logo || null;
  if (logoEl && logo?.src) {
    logoEl.src = logo.src;
    logoEl.alt = logo.alt || "logo";
    logoEl.classList.add("isVisible");
  }

  if (!location.hash) setRoute("home", "index");
  render();
});

