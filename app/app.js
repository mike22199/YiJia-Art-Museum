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
  const parts = [];
  if (nav.left) parts.push(`left:${nav.left}`);
  if (nav.right) parts.push(`right:${nav.right}`);
  if (nav.bottom != null) parts.push(`bottom:${nav.bottom}`);
  else parts.push("bottom:0");
  if (nav.width) parts.push(`width:${nav.width}`);
  if (nav.height) parts.push(`height:${nav.height}`);
  return parts.join(";");
}

function homeBoxStyle(box) {
  if (!box) return "";
  return [
    box.left != null ? `left:${box.left}` : "",
    box.top != null ? `top:${box.top}` : "",
    box.right != null ? `right:${box.right}` : "",
    box.bottom != null ? `bottom:${box.bottom}` : "",
    box.width ? `width:${box.width}` : "",
    box.height ? `height:${box.height}` : "",
  ]
    .filter(Boolean)
    .join(";");
}

function renderSwapImages(defaultSrc, hoverSrc) {
  return [
    el("img", {
      class: "museumSwapArt museumSwapArt--default",
      src: defaultSrc,
      alt: "",
      loading: "eager",
    }),
    el("img", {
      class: "museumSwapArt museumSwapArt--hover",
      src: hoverSrc,
      alt: "",
      loading: "eager",
    }),
  ];
}

function renderSwapLink(className, href, label, box, defaultSrc, hoverSrc) {
  return el(
    "a",
    {
      class: className,
      href: href || "#home/index",
      style: homeBoxStyle(box),
      "aria-label": label || "入口",
      onclick: (e) => {
        e.preventDefault();
        navigateFromHref(href);
      },
    },
    renderSwapImages(defaultSrc, hoverSrc)
  );
}


let museumStageFitCleanup = null;

function bindMuseumStageFit(stage) {
  const inner = stage?.querySelector(".museumStageInner");
  if (!inner) return;

  if (museumStageFitCleanup) {
    museumStageFitCleanup();
    museumStageFitCleanup = null;
  }

  const update = () => {
    const vv = window.visualViewport;
    const vw = Math.round(vv?.width ?? window.innerWidth);
    const vh = Math.round(vv?.height ?? window.innerHeight);
    // 一律 contain：完整顯示 1920×1080，所有視窗尺寸行為一致
    const scale = Math.min(vw / 1920, vh / 1080);
    inner.style.setProperty("--home-scale", String(scale));
    stage.dataset.fit = "contain";
  };

  update();

  const onResize = () => update();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });
  const vv = window.visualViewport;
  if (vv) vv.addEventListener("resize", onResize, { passive: true });

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
  if (ro) ro.observe(stage);

  museumStageFitCleanup = () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    if (vv) vv.removeEventListener("resize", onResize);
    if (ro) ro.disconnect();
  };
}

/** 1920×1080 畫布座標（對照 home-reference.jpg）→ 百分比 */
const HOME_LAYOUT_REF = {
  bannerLeft: { x: 316, y: 404, w: 179, h: 461 },
  bannerRight: { x: 1425, y: 404, w: 179, h: 461 },
  door: { x: 853, y: 578, w: 215, h: 243 },
  navLeft: { x: 358, y: 969, w: 178, h: 111 },
  navCenter: { x: 856, y: 969, w: 209, h: 111 },
  navRight: { x: 1384, y: 969, w: 178, h: 111 },
};

function layoutBoxToPercent(box) {
  const W = 1920;
  const H = 1080;
  return {
    left: `${(box.x / W) * 100}%`,
    top: `${(box.y / H) * 100}%`,
    width: `${(box.w / W) * 100}%`,
    height: `${(box.h / H) * 100}%`,
    bottom: box.bottom != null ? `${(box.bottom / H) * 100}%` : undefined,
  };
}

function layoutNavBox(box) {
  const W = 1920;
  const H = 1080;
  return {
    left: `${(box.x / W) * 100}%`,
    bottom: "0",
    width: `${(box.w / W) * 100}%`,
    height: `${(box.h / H) * 100}%`,
  };
}

const HOME_ASSET_DEFAULTS = {
  door: {
    default: "./assets/images/home/door.png",
    hover: "./assets/images/home/Door-Open.png",
    ...layoutBoxToPercent(HOME_LAYOUT_REF.door),
  },
  bannerLeft: {
    default: "./assets/images/home/Banner-Left.png",
    hover: "./assets/images/home/Banner-Left-Open.png",
    ...layoutBoxToPercent(HOME_LAYOUT_REF.bannerLeft),
  },
  bannerRight: {
    default: "./assets/images/home/Banner-Left.png",
    hover: "./assets/images/home/Banner-Left-Open.png",
    left: `${(HOME_LAYOUT_REF.bannerRight.x / 1920) * 100}%`,
    top: `${(HOME_LAYOUT_REF.bannerRight.y / 1080) * 100}%`,
    width: `${(HOME_LAYOUT_REF.bannerRight.w / 1920) * 100}%`,
    height: `${(HOME_LAYOUT_REF.bannerRight.h / 1080) * 100}%`,
  },
  nav: {
    left: {
      image: "./assets/images/home/exhibition-right.png",
      imageHover: "./assets/images/home/exhibition-right-Open.png",
      ...layoutNavBox(HOME_LAYOUT_REF.navLeft),
    },
    center: {
      image: "./assets/images/home/archive.png",
      imageHover: "./assets/images/home/archive-Open.png",
      ...layoutNavBox(HOME_LAYOUT_REF.navCenter),
    },
    right: {
      image: "./assets/images/home/exhibition-right.png",
      imageHover: "./assets/images/home/exhibition-right-Open.png",
      ...layoutNavBox(HOME_LAYOUT_REF.navRight),
    },
  },
};

function homeAssetBox(layers, key) {
  const raw = layers?.[key];
  if (typeof raw === "string" && raw.trim()) {
    return { ...HOME_ASSET_DEFAULTS[key], default: raw.trim() };
  }
  if (!raw || typeof raw !== "object") return { ...HOME_ASSET_DEFAULTS[key] };
  return { ...HOME_ASSET_DEFAULTS[key], ...raw };
}

function homeNavAsset(zone, layers) {
  const navKey = zone.id === "center" ? "center" : zone.id === "right" ? "right" : "left";
  const defaults = HOME_ASSET_DEFAULTS.nav[navKey];
  const layerNav = layers?.nav?.[navKey] || {};
  const zoneNav = zone.nav || {};
  return {
    left: zoneNav.left ?? layerNav.left ?? defaults.left,
    right: zoneNav.right ?? layerNav.right ?? defaults.right,
    bottom: zoneNav.bottom ?? layerNav.bottom ?? defaults.bottom,
    top: zoneNav.top ?? layerNav.top ?? defaults.top,
    width: zoneNav.width ?? layerNav.width ?? defaults.width,
    height: zoneNav.height ?? layerNav.height ?? defaults.height,
    image: homeLayerSrc(zoneNav, "image", null) || homeLayerSrc(layerNav, "image", null) || defaults.image,
    imageHover:
      homeLayerSrc(zoneNav, "imageHover", null) ||
      homeLayerSrc(layerNav, "imageHover", null) ||
      defaults.imageHover,
  };
}

function defaultHomeZones() {
  return [
    {
      id: "left",
      label: "特展",
      title: "特展（左）",
      href: "#exhibition-left/about",
      nav: { ...HOME_ASSET_DEFAULTS.nav.left },
    },
    {
      id: "center",
      label: "檔案庫",
      title: "典藏",
      href:
        (typeof archiveCollectionNavHref === "function" && archiveCollectionNavHref()) ||
        "#archive/collection",
      accent: true,
      nav: { ...HOME_ASSET_DEFAULTS.nav.center },
    },
    {
      id: "right",
      label: "特展",
      title: "特展（右）",
      href: "#exhibition-right/about",
      nav: { ...HOME_ASSET_DEFAULTS.nav.right },
    },
  ];
}

function homeLayerSrc(layers, key, fallback) {
  const value = layers?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function homeIntroOffset(value, fallback = "0") {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number" && Number.isFinite(value)) return `${value}px`;
  const text = String(value).trim();
  return text || fallback;
}

function getHomeIntroConfig(content) {
  const intro = content?.homeIntro;
  if (!intro || intro.enabled === false) return null;
  const gif = typeof intro.gif === "string" && intro.gif.trim() ? intro.gif.trim() : "";
  if (!gif) return null;
  return {
    gif,
    durationMs: Math.max(500, Number(intro.durationMs) || 4000),
    gifFadeOutMs: Math.max(0, Number(intro.gifFadeOutMs) || 500),
    contentFadeInMs: Math.max(0, Number(intro.contentFadeInMs) || 1400),
    oncePerSession: intro.oncePerSession !== false,
    storageKey: String(intro.storageKey || "fifiHomeIntroPlayed"),
    offsetX: homeIntroOffset(intro.offsetX, "0"),
    offsetY: homeIntroOffset(intro.offsetY, "0"),
  };
}

function shouldPlayHomeIntro(config) {
  if (!config) return false;
  if (!config.oncePerSession) return true;
  try {
    return !sessionStorage.getItem(config.storageKey);
  } catch {
    return true;
  }
}

function markHomeIntroPlayed(config) {
  if (!config?.oncePerSession) return;
  try {
    sessionStorage.setItem(config.storageKey, "1");
  } catch {
    /* ignore */
  }
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}

function bindHomeIntro(stage, introConfig) {
  const inner = stage?.querySelector(".museumStageInner");
  const overlay = stage?.querySelector(".museumIntroOverlay");
  const gifEl = overlay?.querySelector(".museumIntroGif");
  if (!inner || !overlay || !gifEl) return;

  const finishIntro = () => {
    overlay.classList.add("isFadingOut");
    inner.classList.remove("museumStageInner--awaitingIntro");
    inner.classList.add("museumStageInner--introRevealed");

    const removeOverlay = () => {
      overlay.remove();
      stage.classList.remove("museumStage--introActive");
    };

    if (introConfig.gifFadeOutMs > 0) {
      window.setTimeout(removeOverlay, introConfig.gifFadeOutMs + 80);
    } else {
      removeOverlay();
    }
  };

  let finished = false;
  const safeFinish = (playedSuccessfully = true) => {
    if (finished) return;
    finished = true;
    if (playedSuccessfully) markHomeIntroPlayed(introConfig);
    finishIntro();
  };

  gifEl.addEventListener("error", () => safeFinish(false));

  const startPlayback = () => {
    const src = gifEl.src;
    gifEl.src = "";
    gifEl.src = src;
    window.setTimeout(() => safeFinish(true), introConfig.durationMs);
  };

  if (gifEl.complete) startPlayback();
  else gifEl.addEventListener("load", startPlayback, { once: true });
}

function renderHome(main) {
  const content = window.SITE_CONTENT || {};
  const layers = content.homeLayers || {};
  const baseSrc =
    homeLayerSrc(layers, "base", null) ||
    content.homeImage ||
    "./assets/images/home/home-base.jpg";
  const door = homeAssetBox(layers, "door");
  const bannerLeft = homeAssetBox(layers, "bannerLeft");
  const bannerRight = homeAssetBox(layers, "bannerRight");
  const zones = Array.isArray(content.homeZones) ? content.homeZones : defaultHomeZones();
  const introConfig = getHomeIntroConfig(content);
  const playIntro = introConfig && shouldPlayHomeIntro(introConfig) && !prefersReducedMotion();

  document.body.classList.add("isHomePage");
  main.classList.remove("mainSingle");
  main.classList.add("mainHome");

  const root = el("div", { class: "home homeMuseum" });

  const stageInnerChildren = [
    el("img", {
      class: "museumPhoto museumPhoto--base",
      src: baseSrc,
      alt: "義家藝館首頁",
      loading: "eager",
    }),
    playIntro
      ? el("div", {
          class: "museumIntroOverlay",
          "aria-hidden": "true",
          style: `--home-intro-gif-fade: ${introConfig.gifFadeOutMs}ms; --home-intro-offset-x: ${introConfig.offsetX}; --home-intro-offset-y: ${introConfig.offsetY}`,
        }, [
          el("img", {
            class: "museumIntroGif",
            src: introConfig.gif,
            alt: "",
            loading: "eager",
            decoding: "sync",
          }),
        ])
      : null,
    renderSwapLink(
      "museumProp museumProp--banner-left",
      zones.find((z) => z.id === "left")?.href || "#exhibition-left/about",
      zones.find((z) => z.id === "left")?.title || "特展（左）",
      bannerLeft,
      bannerLeft.default,
      bannerLeft.hover
    ),
    renderSwapLink(
      "museumProp museumProp--banner-right",
      zones.find((z) => z.id === "right")?.href || "#exhibition-right/about",
      zones.find((z) => z.id === "right")?.title || "特展（右）",
      bannerRight,
      bannerRight.default,
      bannerRight.hover
    ),
    renderSwapLink(
      "museumProp museumProp--door",
      zones.find((z) => z.id === "center")?.href ||
        (typeof archiveCollectionNavHref === "function" && archiveCollectionNavHref()) ||
        "#archive/collection",
      zones.find((z) => z.id === "center")?.title || "典藏",
      door,
      door.default,
      door.hover
    ),
    el(
      "nav",
      { class: "museumNav", "aria-label": "首頁導覽" },
      zones.map((zone) => {
        const navAsset = homeNavAsset(zone, layers);
        return renderSwapLink(
          `museumNavItem museumNavItem--${zone.id || "zone"}`,
          zone.href,
          zone.label || zone.title,
          navAsset,
          navAsset.image,
          navAsset.imageHover
        );
      })
    ),
  ];

  const stageInner = el(
    "div",
    {
      class: `museumStageInner${playIntro ? " museumStageInner--awaitingIntro" : ""}`,
      style: playIntro ? `--home-intro-fade-in: ${introConfig.contentFadeInMs}ms` : undefined,
    },
    stageInnerChildren
  );
  const stage = el(
    "div",
    { class: `museumStage${playIntro ? " museumStage--introActive" : ""}` },
    [stageInner]
  );

  root.appendChild(el("section", { class: "homeMuseumArea" }, [stage]));
  main.innerHTML = "";
  main.appendChild(root);
  bindMuseumStageFit(stage);
  if (playIntro) bindHomeIntro(stage, introConfig);
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
    const raw = (location.hash || "").replace(/^#/, "");
    const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
    navigateFromHref(`#archive/research${q}`);
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

  let content = fallback;

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
          content = window.normalizeSanitySiteContent(payload.result, fallback);
        } else if (payload?.result) {
          content = payload.result;
        }
      }
    } catch (err) {
      console.warn("Sanity 讀取失敗，改使用本地 JSON：", err);
    }
  }

  if (typeof window.mergeArchiveFolderContent === "function") {
    content = await window.mergeArchiveFolderContent(content);
  }
  if (typeof window.mergeResearchFolderContent === "function") {
    content = await window.mergeResearchFolderContent(content);
  }

  return content;
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

