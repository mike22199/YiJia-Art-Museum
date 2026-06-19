/* 義家藝館檔案庫 — 靜態版型（素材由 site-content.json 的 archive 區塊填入） */

const ARCHIVE_PLACEHOLDER_PHOTO = "./assets/images/placeholder-photo.svg";
const ARCHIVE_PLACEHOLDER_BOOK = "./assets/images/placeholder-book.svg";
const ARCHIVE_PLACEHOLDER_AVATAR = "./app/house.svg";
const JOURNAL_OPEN_BOOK = "./assets/images/Journal/open-book.png";
const JOURNAL_CLOSE_BOOK = "./assets/images/Journal/Close-book.png";
const JOURNAL_FLIPBOOK_FRAME = "./assets/images/Journal/Flip-book.png";
const JOURNAL_BOOKSHELF = "./assets/images/Journal/Book-shelf.png";
const RESEARCH_SHELF_TAB_YEARS = ["2019", "2020", "2021", "2022", "2027"];
const RESEARCH_SHELF_BOOK_HOTSPOTS = [
  { id: "b01", left: "3.9%", width: "1.8%" },
  { id: "b02", left: "5.8%", width: "2.1%" },
  { id: "b03", left: "8.0%", width: "1.9%" },
  { id: "b04", left: "9.9%", width: "2.0%" },
  { id: "b05", left: "12.0%", width: "1.6%" },
  { id: "b06", left: "13.7%", width: "1.6%" },
  { id: "b07", left: "15.4%", width: "1.9%" },
  { id: "b08", left: "17.4%", width: "1.9%" },
  { id: "b09", left: "19.4%", width: "2.1%" },
  { id: "b10", left: "21.6%", width: "2.1%" },
  { id: "b11", left: "23.8%", width: "1.9%" },
  { id: "b12", left: "25.8%", width: "1.9%" },
  { id: "b13", left: "27.8%", width: "1.9%" },
  { id: "b14", left: "29.8%", width: "1.9%" },
  { id: "b15", left: "31.8%", width: "1.9%" },
  { id: "b16", left: "33.8%", width: "1.3%" },
  { id: "b17", left: "35.2%", width: "3.7%" },
  { id: "b18", left: "39.1%", width: "2.4%" },
  { id: "b19", left: "41.7%", width: "2.1%" },
  { id: "b20", left: "43.9%", width: "2.3%" },
  { id: "b21", left: "46.3%", width: "2.1%" },
  { id: "b22", left: "48.5%", width: "2.3%" },
  { id: "b23", left: "50.9%", width: "2.5%" },
];
const ARCHIVE_TEACHER_AVATAR_COLORS = [
  "#b82020",
  "#2a6b8c",
  "#4a8c5c",
  "#c47a20",
  "#6b4f8c",
  "#c45c7a",
  "#3d6b8c",
  "#8c6b4a",
  "#5c8c6b",
  "#7a4a8c",
  "#8c4a5c",
  "#4a7a8c",
  "#6b8c3d",
  "#8c3d6b",
];

function archiveIsPlaceholderImage(src) {
  const value = String(src || "").trim();
  return !value || value.includes("placeholder") || value === ARCHIVE_PLACEHOLDER_PHOTO;
}

function archiveColorBlockSrc(label, color, sublabel = "") {
  const safeLabel = String(label || "").trim() || "圖";
  const subTag = sublabel
    ? `<text x='400' y='280' text-anchor='middle' fill='rgba(255,255,255,.85)' font-family='sans-serif' font-size='18'>${sublabel}</text>`
    : "";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><rect width='800' height='450' fill='${color}'/><text x='400' y='230' text-anchor='middle' fill='#fff' font-family='sans-serif' font-size='32' font-weight='700'>${safeLabel}</text>${subTag}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function archivePosterImageSrc(poster, year) {
  const src = poster?.src || "";
  if (!archiveIsPlaceholderImage(src)) return src;
  return archiveColorBlockSrc(String(year || ""), "#3d5a6b", "展覽海報");
}

function archiveWorkImageSrc(work, index = 0) {
  const src = work?.image?.src || "";
  if (!archiveIsPlaceholderImage(src)) return src || ARCHIVE_PLACEHOLDER_PHOTO;
  const title = String(work?.title || `作品 ${index + 1}`).replace(/^20\d{2}\s*/, "").trim();
  const label = title.length > 10 ? `${title.slice(0, 9)}…` : title;
  const color = ARCHIVE_TEACHER_AVATAR_COLORS[index % ARCHIVE_TEACHER_AVATAR_COLORS.length];
  return archiveColorBlockSrc(label, color);
}

function archiveFeaturedSlideSrc(slide, index = 0) {
  const src = slide?.image?.src || "";
  if (!archiveIsPlaceholderImage(src)) return src || ARCHIVE_PLACEHOLDER_PHOTO;
  const title = String(slide?.title || `精選 ${index + 1}`).replace(/^精選/, "").trim() || `精選 ${index + 1}`;
  const label = title.length > 10 ? `${title.slice(0, 9)}…` : title;
  const color = ARCHIVE_TEACHER_AVATAR_COLORS[index % ARCHIVE_TEACHER_AVATAR_COLORS.length];
  return archiveColorBlockSrc(label, color, "精選");
}

function archiveMediaImageSrc(item, index = 0) {
  const src = item?.image?.src || "";
  if (!archiveIsPlaceholderImage(src)) return src || ARCHIVE_PLACEHOLDER_PHOTO;
  const isVideo = archiveMediaItemIsVideo(item);
  const title = String(item?.title || (isVideo ? `影片 ${index + 1}` : `照片 ${index + 1}`)).replace(/^20\d{2}\s*/, "").trim();
  const label = title.length > 10 ? `${title.slice(0, 9)}…` : title;
  const color = ARCHIVE_TEACHER_AVATAR_COLORS[index % ARCHIVE_TEACHER_AVATAR_COLORS.length];
  return archiveColorBlockSrc(label, color, isVideo ? "影片" : "");
}

function resolveYoutubeWatchUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : raw;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const embedMatch = parsed.pathname.match(/^\/embed\/([^/]+)/);
      if (embedMatch?.[1]) {
        return `https://www.youtube.com/watch?v=${encodeURIComponent(embedMatch[1])}`;
      }
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    }
  } catch {
    return raw;
  }
  return raw;
}

function archiveMediaItemIsVideo(item) {
  return item?.type === "video" || Boolean(item?.youtubeUrl || item?.videoUrl);
}

function archiveMediaItemYoutubeUrl(item) {
  return resolveYoutubeWatchUrl(item?.youtubeUrl || item?.videoUrl || "");
}

function archiveTeacherAvatarSrc(teacher, index = 0) {
  const src = teacher?.avatar?.src || "";
  if (src && !src.includes("house.svg") && !src.includes("placeholder")) return src;
  const label = String(teacher?.name || "師").trim().slice(0, 1) || "師";
  const color = ARCHIVE_TEACHER_AVATAR_COLORS[index % ARCHIVE_TEACHER_AVATAR_COLORS.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='${color}'/><text x='60' y='68' text-anchor='middle' fill='#fff' font-family='sans-serif' font-size='42' font-weight='700'>${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function archiveData() {
  return window.SITE_CONTENT?.archive || {};
}

function archiveSubnavItems() {
  const items = Array.isArray(window.SITE_CONTENT?.archiveSubnav)
    ? window.SITE_CONTENT.archiveSubnav
    : [
        { id: "collection", label: "典藏", href: "#archive/collection" },
        { id: "research", label: "研究", href: "#archive/research" },
        { id: "performances", label: "最新展演", href: "#archive/performances" },
        { id: "teachers", label: "藝術家教師", href: "#archive/teachers" },
        { id: "bibliography", label: "延伸閱讀", href: "#archive/bibliography" },
      ];

  if (!isArchiveCollectionHomeEnabled()) {
    return items.map((item) =>
      item.id === "collection" ? { ...item, href: archiveCollectionNavHref() } : item
    );
  }
  return items;
}

const ARCHIVE_COLLECTION_SUBSECTIONS = new Set(["exhibitions", "photos", "videos"]);

function isArchiveCollectionHomeEnabled() {
  const flag = archiveData().collectionHomeEnabled;
  return flag !== false;
}

function archiveCollectionLandingSection() {
  const preferred = archiveData().defaultCollectionSection || "exhibitions";
  return ARCHIVE_COLLECTION_SUBSECTIONS.has(preferred) ? preferred : "exhibitions";
}

function archiveCollectionNavHref() {
  if (isArchiveCollectionHomeEnabled()) return "#archive/collection";
  return `#archive/${archiveCollectionLandingSection()}`;
}

function renderArchiveBackToCollection(label = "返回典藏") {
  return el("nav", { class: "archiveCollectionNav", "aria-label": "典藏導覽" }, [
    el("a", {
      class: "archiveCollectionBack",
      href: archiveCollectionNavHref(),
      text: `← ${label}`,
      onclick: (e) => {
        e.preventDefault();
        navigateFromHref(archiveCollectionNavHref());
      },
    }),
  ]);
}

function renderArchiveYearTabs(years, selectedYear, baseHref) {
  const list = Array.isArray(years) ? years : [];
  const current = selectedYear || list[0] || "";
  const tabs = el("div", { class: "archiveYearTabs", role: "tablist", "aria-label": "年份選擇" });

  list.forEach((year) => {
    const href = `${baseHref}${baseHref.includes("?") ? "&" : "?"}year=${encodeURIComponent(year)}`;
    tabs.appendChild(
      el(
        "a",
        {
          class: `archiveYearTab${year === current ? " archiveYearTabActive" : ""}`,
          href,
          role: "tab",
          "aria-selected": year === current ? "true" : "false",
          text: year,
          onclick: (e) => {
            e.preventDefault();
            navigateFromHref(href);
          },
        }
      )
    );
  });

  return tabs;
}

function renderArchiveSectionTitle(title, moreLink) {
  const row = el("div", { class: "archiveSectionHead" }, [
    el("h2", { class: "archiveSectionTitle", text: title || "" }),
  ]);
  if (moreLink?.href) {
    row.appendChild(
      el(
        "a",
        {
          class: "archiveMoreLink",
          href: moreLink.href,
          text: moreLink.label || "了解更多＞",
          onclick: (e) => {
            if (String(moreLink.href).startsWith("#")) {
              e.preventDefault();
              navigateFromHref(moreLink.href);
            }
          },
        }
      )
    );
  }
  return row;
}

function renderArchiveIntroNavLink(link) {
  const href = link.href || "#archive/index";
  return el(
    "a",
    {
      class: "archiveIntroNavLink",
      href,
      onclick: (e) => {
        if (String(href).startsWith("#")) {
          e.preventDefault();
          navigateFromHref(href);
        }
      },
    },
    [
      el("span", { class: "archiveIntroNavLabel", text: link.label || "" }),
      el("span", { class: "archiveIntroNavArrow", text: "›", "aria-hidden": "true" }),
    ]
  );
}

function renderArchiveHomeCarouselSlide(item, variant) {
  const imgSrc = item.image?.src || ARCHIVE_PLACEHOLDER_PHOTO;
  const imgAlt = item.image?.alt || item.title || "";
  const overlayChildren = [
    el("span", { class: "archiveHomeCarouselTitle", text: item.title || "" }),
    variant === "media" && item.caption
      ? el("p", { class: "archiveHomeCarouselCaption", text: item.caption })
      : null,
  ];

  if (variant === "exhibit") {
    const href = item.href || "#home/index";
    return el(
      "a",
      {
        class: "archiveHomeCarouselSlide archiveHomeCarouselSlide--link",
        href,
        onclick: (e) => {
          if (String(href).startsWith("#")) {
            e.preventDefault();
            navigateFromHref(href);
          }
        },
      },
      [
        el("img", { class: "archiveHomeCarouselImg", src: imgSrc, alt: imgAlt, loading: "lazy" }),
        el("div", { class: "archiveHomeCarouselOverlay" }, overlayChildren),
      ]
    );
  }

  return el("article", { class: "archiveHomeCarouselSlide" }, [
    el("img", { class: "archiveHomeCarouselImg", src: imgSrc, alt: imgAlt, loading: "lazy" }),
    el("div", { class: "archiveHomeCarouselOverlay" }, overlayChildren),
  ]);
}

function renderArchiveHomeCarousel(items, options = {}) {
  const list = Array.isArray(items) && items.length ? items : [];
  if (!list.length) return null;

  const variant = options.variant === "exhibit" ? "exhibit" : "media";
  let index = 0;

  const stage = el("div", { class: "archiveHomeCarouselStage", role: "group", "aria-roledescription": "輪播", "aria-label": options.ariaLabel || "內容輪播" });
  const dots = el("div", { class: "archiveCarouselDots", role: "tablist", "aria-label": "輪播指示" });

  const syncDots = () => {
    dots.querySelectorAll(".archiveCarouselDot").forEach((dot, i) => {
      dot.classList.toggle("archiveCarouselDot--active", i === index);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  };

  const syncSlide = () => {
    stage.replaceChildren(renderArchiveHomeCarouselSlide(list[index], variant));
    syncDots();
  };

  list.forEach((_, i) => {
    dots.appendChild(
      el("button", {
        class: `archiveCarouselDot${i === 0 ? " archiveCarouselDot--active" : ""}`,
        type: "button",
        role: "tab",
        "aria-label": `第 ${i + 1} 項`,
        "aria-selected": i === 0 ? "true" : "false",
        onclick: () => {
          index = i;
          syncSlide();
        },
      })
    );
  });

  const go = (dir) => {
    index = (index + dir + list.length) % list.length;
    syncSlide();
  };

  const carousel = el("div", { class: "archiveHomeCarousel archiveHomeCarousel--fullBleed" }, [
    el("div", { class: "archiveHomeCarouselFrame" }, [
      el("button", {
        class: "archiveCarouselBtn archiveHomeCarouselBtn archiveHomeCarouselBtn--prev",
        type: "button",
        text: "‹",
        "aria-label": "上一項",
        onclick: () => go(-1),
      }),
      stage,
      el("button", {
        class: "archiveCarouselBtn archiveHomeCarouselBtn archiveHomeCarouselBtn--next",
        type: "button",
        text: "›",
        "aria-label": "下一項",
        onclick: () => go(1),
      }),
    ]),
    dots,
  ]);

  syncSlide();
  return carousel;
}

function getArchivePastCarouselPerView() {
  if (typeof window !== "undefined" && window.innerWidth <= 560) return 1;
  if (typeof window !== "undefined" && window.innerWidth <= 900) return 2;
  return 4;
}

function renderArchivePastPreviewCarousel(items, options = {}) {
  const list = Array.isArray(items) && items.length ? items : [];
  if (!list.length) return null;

  let index = 0;
  let perView = getArchivePastCarouselPerView();

  const track = el("div", { class: "archivePastCarouselTrack" });
  list.forEach((work, itemIndex) => {
    track.appendChild(
      el("div", { class: `archivePastCarouselItem archivePastCarouselItem--${itemIndex + 1}` }, [
        renderArchiveWorkCard(work, { preview: true }),
      ])
    );
  });

  const viewport = el("div", { class: "archivePastCarouselViewport" }, [track]);
  const stage = el("div", {
    class: "archiveHomeCarouselStage archivePastCarouselStage",
    role: "group",
    "aria-roledescription": "輪播",
    "aria-label": options.ariaLabel || "歷屆展覽回顧",
  }, [viewport]);

  const dots = el("div", { class: "archiveCarouselDots", role: "tablist", "aria-label": "輪播指示" });
  const prevBtn = el("button", {
    class: "archiveCarouselBtn archiveHomeCarouselBtn archiveHomeCarouselBtn--prev",
    type: "button",
    text: "‹",
    "aria-label": "上一組",
  });
  const nextBtn = el("button", {
    class: "archiveCarouselBtn archiveHomeCarouselBtn archiveHomeCarouselBtn--next",
    type: "button",
    text: "›",
    "aria-label": "下一組",
  });

  const maxIndex = () => Math.max(0, list.length - perView);

  const syncDots = () => {
    const total = maxIndex() + 1;
    dots.replaceChildren();
    if (total <= 1) {
      dots.hidden = true;
      return;
    }
    dots.hidden = false;
    for (let i = 0; i < total; i += 1) {
      dots.appendChild(
        el("button", {
          class: `archiveCarouselDot${i === index ? " archiveCarouselDot--active" : ""}`,
          type: "button",
          role: "tab",
          "aria-label": `第 ${i + 1} 組`,
          "aria-selected": i === index ? "true" : "false",
          onclick: () => {
            index = i;
            sync();
          },
        })
      );
    }
  };

  const syncButtons = () => {
    const atEnd = maxIndex();
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= atEnd;
    prevBtn.hidden = atEnd === 0;
    nextBtn.hidden = atEnd === 0;
  };

  const updateLayout = () => {
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 16;
    const viewWidth = viewport.clientWidth;
    if (!viewWidth) return;
    const itemWidth = (viewWidth - gap * (perView - 1)) / perView;
    track.querySelectorAll(".archivePastCarouselItem").forEach((node) => {
      node.style.flex = `0 0 ${itemWidth}px`;
      node.style.width = `${itemWidth}px`;
    });
    track.style.transform = `translateX(-${index * (itemWidth + gap)}px)`;
  };

  const sync = () => {
    index = Math.min(maxIndex(), Math.max(0, index));
    updateLayout();
    syncDots();
    syncButtons();
  };

  const go = (dir) => {
    index = Math.min(maxIndex(), Math.max(0, index + dir));
    sync();
  };

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  const onResize = () => {
    const nextPerView = getArchivePastCarouselPerView();
    if (nextPerView !== perView) {
      perView = nextPerView;
    }
    sync();
  };

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(onResize);
    ro.observe(viewport);
  } else if (typeof window !== "undefined") {
    window.addEventListener("resize", onResize);
  }

  const carousel = el("div", { class: "archiveHomeCarousel archivePastCarousel" }, [
    el("div", { class: "archiveHomeCarouselFrame" }, [prevBtn, stage, nextBtn]),
    dots,
  ]);

  const scheduleSync = (attempt = 0) => {
    sync();
    if (!viewport.clientWidth && attempt < 8) {
      requestAnimationFrame(() => scheduleSync(attempt + 1));
    }
  };

  requestAnimationFrame(() => scheduleSync());
  return carousel;
}

function resolveCollectionHome() {
  const data = archiveData();
  const home = data.collectionHome || {};
  const legacy = data.home || {};

  const exhibitionsPreview = home.exhibitionsPreview || {};
  const staticImagesPreview = home.staticImagesPreview || {};
  const dynamicImagesPreview = home.dynamicImagesPreview || {};

  return {
    banner: home.banner || legacy.banner || {},
    intro: home.intro || legacy.intro || {},
    exhibitionsPreview: {
      title: exhibitionsPreview.title || "歷屆展覽",
      moreHref: exhibitionsPreview.moreHref || "#archive/exhibitions",
      moreLabel: exhibitionsPreview.moreLabel || "了解更多＞",
      items:
        Array.isArray(exhibitionsPreview.items) && exhibitionsPreview.items.length
          ? exhibitionsPreview.items
          : legacy.pastExhibitionsPreview?.items || legacy.specialExhibitions || [],
    },
    staticImagesPreview: {
      title: staticImagesPreview.title || "照片紀錄",
      moreHref: staticImagesPreview.moreHref || "#archive/photos",
      moreLabel: staticImagesPreview.moreLabel || "了解更多＞",
      items:
        Array.isArray(staticImagesPreview.items) && staticImagesPreview.items.length
          ? staticImagesPreview.items
          : legacy.featuredMedia || [],
    },
    dynamicImagesPreview: {
      title: dynamicImagesPreview.title || "動態影音紀錄",
      moreHref: dynamicImagesPreview.moreHref || "#archive/videos",
      moreLabel: dynamicImagesPreview.moreLabel || "了解更多＞",
      items:
        Array.isArray(dynamicImagesPreview.items) && dynamicImagesPreview.items.length
          ? dynamicImagesPreview.items
          : legacy.featuredMedia || [],
    },
  };
}

function renderArchiveCollectionPreviewSection(preview) {
  const items = Array.isArray(preview?.items) ? preview.items : [];
  if (!items.length) return null;

  const sec = el("section", { class: "archiveBlock archiveBlock--carouselBleed" });
  sec.appendChild(
    renderArchiveSectionTitle(preview.title || "", {
      href: preview.moreHref,
      label: preview.moreLabel || "了解更多＞",
    })
  );
  sec.appendChild(
    renderArchiveHomeCarousel(items, {
      variant: "media",
      ariaLabel: preview.title || "典藏預覽",
    })
  );
  return sec;
}

function renderArchiveCollectionHome() {
  const home = resolveCollectionHome();
  const root = el("div", { class: "archiveHome" });

  const banner = home.banner || {};
  const bannerImg = banner.image?.src || ARCHIVE_PLACEHOLDER_PHOTO;
  root.appendChild(
    el("section", { class: "archiveBanner", "aria-label": "主視覺" }, [
      el("div", { class: "archiveBannerInner" }, [
        el("img", {
          class: "archiveBannerImg",
          src: bannerImg,
          alt: banner.image?.alt || "典藏主視覺",
          loading: "eager",
        }),
        el("div", { class: "archiveBannerOverlay" }, [
          el("h1", { class: "archiveBannerTitle", text: banner.title || "典藏" }),
          el("p", { class: "archiveBannerSub", text: banner.subtitle || "When Home Becomes A Museum" }),
        ]),
      ]),
    ])
  );

  const intro = home.intro || {};
  if (intro.heading || intro.body) {
    root.appendChild(
      el("section", { class: "archiveBlock archiveIntro" }, [
        renderArchiveSectionTitle(intro.heading || "義家藝館介紹"),
        intro.body ? el("p", { class: "archiveIntroBody", text: intro.body }) : null,
      ])
    );
  }

  const exhibitionsSec = renderArchiveCollectionPreviewSection(home.exhibitionsPreview);
  if (exhibitionsSec) root.appendChild(exhibitionsSec);

  const staticSec = renderArchiveCollectionPreviewSection(home.staticImagesPreview);
  if (staticSec) root.appendChild(staticSec);

  const dynamicSec = renderArchiveCollectionPreviewSection(home.dynamicImagesPreview);
  if (dynamicSec) root.appendChild(dynamicSec);

  return root;
}

function resolvePastExhibitionsList() {
  const data = archiveData();
  const configured = data.pastExhibitions?.items;
  if (Array.isArray(configured) && configured.length) return configured;

  const years = Array.isArray(data.exhibitionYears) ? data.exhibitionYears : [];
  const byYear = data.exhibitionsByYear || {};
  return years.map((year) => {
    const pack = byYear[year];
    return {
      title: `${year} 歷屆展覽`,
      href: `https://example.com/exhibition/${year}`,
      image: pack?.poster || { src: "", alt: `${year} 歷屆展覽` },
    };
  });
}

function renderArchiveExhibitionBanner(item, index = 0) {
  const href = item.href || "#";
  const isExternal = !String(href).startsWith("#");
  const imgSrc = item.image?.src
    ? archiveIsPlaceholderImage(item.image.src)
      ? archivePosterImageSrc(item.image, item.year || index)
      : item.image.src
    : archivePosterImageSrc(null, item.year || index);
  const imgAlt = item.image?.alt || item.title || "歷屆展覽";

  return el(
    "a",
    {
      class: "archiveExhibitionBanner",
      href,
      target: isExternal ? "_blank" : undefined,
      rel: isExternal ? "noopener noreferrer" : undefined,
      onclick: (e) => {
        if (String(href).startsWith("#")) {
          e.preventDefault();
          navigateFromHref(href);
        }
      },
    },
    [
      el("img", { class: "archiveExhibitionBannerImg", src: imgSrc, alt: imgAlt, loading: "lazy" }),
      el("div", { class: "archiveHomeCarouselOverlay" }, [
        el("span", { class: "archiveHomeCarouselTitle", text: item.title || "" }),
        item.caption ? el("p", { class: "archiveHomeCarouselCaption", text: item.caption }) : null,
      ]),
    ]
  );
}

function renderArchiveHome() {
  const home = archiveData().home || {};
  const root = el("div", { class: "archiveHome" });

  const banner = home.banner || {};
  const bannerImg = banner.image?.src || ARCHIVE_PLACEHOLDER_PHOTO;
  root.appendChild(
    el("section", { class: "archiveBanner", "aria-label": "主視覺" }, [
      el("div", { class: "archiveBannerInner" }, [
        el("img", {
          class: "archiveBannerImg",
          src: bannerImg,
          alt: banner.image?.alt || "檔案庫主視覺",
          loading: "eager",
        }),
        el("div", { class: "archiveBannerOverlay" }, [
          el("h1", { class: "archiveBannerTitle", text: banner.title || "義家藝館檔案庫" }),
          el("p", { class: "archiveBannerSub", text: banner.subtitle || "When Home Becomes A Museum" }),
        ]),
      ]),
    ])
  );

  const intro = home.intro || {};
  const teachersPreview = home.teachersPreview || {};
  const worksPreview = home.worksPreview || {};
  const introLinks = Array.isArray(intro.links) && intro.links.length
    ? intro.links
    : [
        { label: "作品", href: worksPreview.moreHref || "#archive/practice" },
        { label: "藝術家教師", href: teachersPreview.moreHref || "#archive/teachers" },
      ];
  root.appendChild(
    el("section", { class: "archiveBlock archiveIntro" }, [
      renderArchiveSectionTitle(intro.heading || "義家藝館介紹"),
      intro.body ? el("p", { class: "archiveIntroBody", text: intro.body }) : null,
      el(
        "nav",
        { class: "archiveIntroNav", "aria-label": "義家藝館介紹捷徑" },
        introLinks.map((link) => renderArchiveIntroNavLink(link))
      ),
    ])
  );

  const specialExhibitions = Array.isArray(home.specialExhibitions) ? home.specialExhibitions : [];
  if (specialExhibitions.length) {
    const sec = el("section", { class: "archiveBlock archiveBlock--carouselBleed" });
    sec.appendChild(renderArchiveSectionTitle(home.specialExhibitionsTitle || "特展"));
    sec.appendChild(
      renderArchiveHomeCarousel(specialExhibitions, {
        variant: "exhibit",
        ariaLabel: home.specialExhibitionsTitle || "特展",
      })
    );
    root.appendChild(sec);
  }

  const featured = Array.isArray(home.featuredMedia) ? home.featuredMedia : [];
  if (featured.length) {
    const sec = el("section", { class: "archiveBlock archiveBlock--carouselBleed" });
    sec.appendChild(
      renderArchiveSectionTitle(home.featuredMediaTitle || "精選影音", {
        href: home.featuredMediaMoreHref || "#archive/media",
        label: home.featuredMediaMoreLabel || "了解更多＞",
      })
    );
    sec.appendChild(
      renderArchiveHomeCarousel(featured, {
        variant: "media",
        ariaLabel: home.featuredMediaTitle || "精選影音",
      })
    );
    root.appendChild(sec);
  }

  const pastPreview = home.pastExhibitionsPreview || {};
  const previewItems = Array.isArray(pastPreview.items) ? pastPreview.items : [];
  if (previewItems.length) {
    const sec = el("section", { class: "archiveBlock" });
    sec.appendChild(
      renderArchiveSectionTitle(pastPreview.heading || "歷屆展覽回顧", {
        href: pastPreview.moreHref || "#archive/exhibitions",
        label: pastPreview.moreLabel || "了解更多＞",
      })
    );
    sec.appendChild(
      renderArchivePastPreviewCarousel(previewItems, {
        ariaLabel: pastPreview.heading || "歷屆展覽回顧",
      })
    );
    root.appendChild(sec);
  }

  return root;
}

function workCollectionId(work) {
  return String(work?.collectionId || work?.id || "").trim();
}

function renderArchiveWorkCard(work, options = {}) {
  const framed = options.exhibitions || options.framed;
  let cardClass = "archiveWorkCard";
  if (options.preview) cardClass += " archiveWorkCard--preview";
  if (framed) cardClass += " archiveWorkCard--exhibitions";

  const textBlock = [
    el("h3", { class: "archiveWorkTitle", text: work.title || "" }),
    el("p", { class: "archiveWorkAuthor", text: work.author || "" }),
  ];

  const imageIndex = Number.isFinite(options.index) ? options.index : 0;
  const imageSrc = framed
    ? archiveWorkImageSrc(work, imageIndex)
    : work.image?.src || ARCHIVE_PLACEHOLDER_PHOTO;

  return el("article", { class: cardClass }, [
    el("div", { class: "archiveWorkImg" }, [
      el("img", {
        src: imageSrc,
        alt: work.image?.alt || work.title || "",
        loading: "lazy",
      }),
    ]),
    ...(framed ? [el("div", { class: "archiveWorkMeta" }, textBlock)] : textBlock),
  ]);
}

function renderArchiveLinkedWorkCard(work, options = {}) {
  const card = renderArchiveWorkCard(work, options);
  const collectionId = workCollectionId(work);
  if (!collectionId) return card;

  return el(
    "a",
    {
      class: "archiveWorkCardLink",
      href: collectionWorkHref(collectionId),
      onclick: (e) => {
        e.preventDefault();
        navigateFromHref(collectionWorkHref(collectionId));
      },
    },
    [card]
  );
}

function renderArchiveTeacherRow(teachers) {
  const row = el("div", { class: "archiveTeacherRow" });
  teachers.forEach((t) => {
    row.appendChild(
      el("div", { class: "archiveTeacherChip" }, [
        el("img", {
          class: "archiveTeacherAvatar",
          src: t.avatar?.src || ARCHIVE_PLACEHOLDER_AVATAR,
          alt: t.avatar?.alt || t.name || "",
          loading: "lazy",
        }),
        el("span", { class: "archiveTeacherName", text: t.name || "" }),
      ])
    );
  });
  return row;
}

function defaultExhibitionQuickLinks(year) {
  const y = encodeURIComponent(year);
  return [
    { label: "網站", href: "#archive/practice" },
    { label: "影音", href: `#archive/media?year=${y}` },
    { label: "藝術家教師", href: `#archive/teachers?year=${y}` },
  ];
}

function resolveExhibitionYearPack(byYear, year) {
  const raw = byYear[year];
  const teachersData = archiveData().teachers || {};
  const fallbackTeachers = teachersData.byYear?.[year]?.teachers || [];
  const demoTeachers = teachersData.byYear?.["2026"]?.teachers || [];

  const resolveTeachers = (packTeachers) => {
    if (Array.isArray(packTeachers) && packTeachers.length) return packTeachers;
    if (fallbackTeachers.length) return fallbackTeachers;
    return demoTeachers;
  };

  if (Array.isArray(raw)) {
    return {
      poster: null,
      overview: null,
      quickLinks: defaultExhibitionQuickLinks(year),
      works: raw,
      teachers: resolveTeachers(),
    };
  }

  const pack = raw || {};
  return {
    poster: pack.poster || null,
    overview: pack.overview || null,
    quickLinks:
      Array.isArray(pack.quickLinks) && pack.quickLinks.length
        ? pack.quickLinks
        : defaultExhibitionQuickLinks(year),
    works: Array.isArray(pack.works) ? pack.works : [],
    teachers: resolveTeachers(pack.teachers),
  };
}

function renderArchiveExhibitionHero(pack, year) {
  const overview = pack.overview || {};
  return el("section", { class: "archiveExhibitionHero", "aria-label": `${year} 展覽介紹` }, [
    el("figure", { class: "archiveExhibitionPoster" }, [
      el("img", {
        src: archivePosterImageSrc(pack.poster, year),
        alt: pack.poster?.alt || `${year} 展覽海報`,
        loading: "lazy",
      }),
    ]),
    el("div", { class: "archiveExhibitionOverview" }, [
      el("h2", { class: "archiveExhibitionOverviewTitle", text: overview.heading || "展覽概論" }),
      el("p", {
        class: "archiveExhibitionOverviewBody",
        text: overview.body || "",
      }),
    ]),
  ]);
}

function renderArchiveTeacherGrid(teachers) {
  const list = Array.isArray(teachers) ? teachers : [];
  const grid = el("div", { class: "archiveTeacherGrid archiveTeacherGrid--exhibitions" });
  list.forEach((t, index) => {
    grid.appendChild(
      el("div", { class: "archiveTeacherChip archiveTeacherChip--exhibitions" }, [
        el("img", {
          class: "archiveTeacherAvatar archiveTeacherAvatar--exhibitions",
          src: archiveTeacherAvatarSrc(t, index),
          alt: t.avatar?.alt || t.name || "",
          loading: "lazy",
        }),
        el("span", { class: "archiveTeacherName archiveTeacherName--exhibitions", text: t.name || "" }),
      ])
    );
  });
  return grid;
}

const PAST_EXHIBITION_ROW_SIZE = 4;

function defaultPastExhibitionLinks(year, pack = {}) {
  const website = pack.href || pack.website || pack.link || `https://example.com/exhibition/${year}`;
  if (Array.isArray(pack.links) && pack.links.length) {
    const websiteLink = pack.links.find((link) => link.label === "網站");
    if (websiteLink) return [websiteLink];
  }

  return [{ label: "網站", href: website }];
}

function resolvePastExhibitionYearPack(year) {
  const data = archiveData();
  const past = data.pastExhibitions || {};
  const byYear = past.byYear || {};
  const configured = byYear[year];
  const legacyItem = Array.isArray(past.items)
    ? past.items.find((item) => String(item.year || "").trim() === String(year))
    : null;
  const exhibitionPack = data.exhibitionsByYear?.[year];

  const banner =
    configured?.banner ||
    configured?.image ||
    legacyItem?.banner ||
    legacyItem?.image ||
    exhibitionPack?.poster ||
    null;

  return {
    year,
    title: configured?.title || legacyItem?.title || `${year} 歷屆展覽`,
    href: configured?.href || configured?.website || legacyItem?.href || "",
    banner,
    links: defaultPastExhibitionLinks(year, { ...configured, ...legacyItem }),
  };
}

function resolvePastExhibitionTimelineRows() {
  const past = archiveData().pastExhibitions || {};
  const configuredRows = Array.isArray(past.rows) ? past.rows : null;

  if (configuredRows && configuredRows.length) {
    return configuredRows.slice(0, 2).map((row) =>
      (Array.isArray(row) ? row : [])
        .map((year) => String(year).trim())
        .filter(Boolean)
        .slice(0, PAST_EXHIBITION_ROW_SIZE)
    );
  }

  const years = Array.isArray(past.items) && past.items.length
    ? past.items.map((item) => String(item.year || "").trim()).filter(Boolean)
    : Array.isArray(archiveData().exhibitionYears)
      ? archiveData().exhibitionYears.map(String)
      : [];

  const uniqueYears = [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  if (!uniqueYears.length) return [["2026"], []];

  return [
    uniqueYears.slice(0, PAST_EXHIBITION_ROW_SIZE),
    uniqueYears.slice(PAST_EXHIBITION_ROW_SIZE, PAST_EXHIBITION_ROW_SIZE * 2),
  ].filter((row) => row.length);
}

function pastExhibitionBannerSrc(pack, index = 0) {
  const src = pack.banner?.src || "";
  if (src && !archiveIsPlaceholderImage(src)) return src;
  return archivePosterImageSrc(pack.banner, pack.year || index);
}

function renderPastExhibitionTimelineLink(link) {
  const href = link.href || "#";
  const isHash = String(href).startsWith("#");
  const isExternal = !isHash;

  return el(
    "a",
    {
      class: "archiveExhibitionTimelineLink",
      href,
      target: isExternal ? "_blank" : undefined,
      rel: isExternal ? "noopener noreferrer" : undefined,
      text: link.label || "",
      onclick: (e) => {
        if (isHash) {
          e.preventDefault();
          navigateFromHref(href);
        }
      },
    }
  );
}

function renderPastExhibitionTimelineColumn(year, index = 0) {
  const pack = resolvePastExhibitionYearPack(year);
  const bannerSrc = pastExhibitionBannerSrc(pack, index);
  const bannerAlt = pack.banner?.alt || pack.title || `${year} 展覽`;
  const websiteLink = pack.links.find((link) => link.label === "網站") || pack.links[0];
  const websiteHref = websiteLink?.href || pack.href || "#";
  const isHash = String(websiteHref).startsWith("#");
  const isExternal = !isHash;

  const bannerInner = el("img", {
    class: "archiveExhibitionTimelineBannerImg",
    src: bannerSrc,
    alt: bannerAlt,
    loading: "lazy",
  });

  const banner = el(
    "a",
    {
      class: "archiveExhibitionTimelineBanner archiveExhibitionTimelineBanner--link",
      href: websiteHref,
      target: isExternal ? "_blank" : undefined,
      rel: isExternal ? "noopener noreferrer" : undefined,
      "aria-label": `${year} 展覽網站`,
      onclick: (e) => {
        if (isHash) {
          e.preventDefault();
          navigateFromHref(websiteHref);
        }
      },
    },
    [bannerInner]
  );

  return el("div", { class: "archiveExhibitionTimelineColumn" }, [
    banner,
    el("div", { class: "archiveExhibitionTimelineMarker", "aria-hidden": "true" }, [
      el("span", { class: "archiveExhibitionTimelineDot" }),
      el("span", { class: "archiveExhibitionTimelineYear", text: year }),
    ]),
    el(
      "nav",
      { class: "archiveExhibitionTimelineLinks", "aria-label": `${year} 展覽連結` },
      pack.links.map((link) => renderPastExhibitionTimelineLink(link))
    ),
  ]);
}

function renderPastExhibitionTimelineRow(years, rowIndex = 0) {
  const list = Array.isArray(years) ? years : [];
  const slots = [...list];
  while (slots.length < PAST_EXHIBITION_ROW_SIZE) slots.push("");
  const normalized = slots.slice(0, PAST_EXHIBITION_ROW_SIZE);

  const row = el("section", { class: "archiveExhibitionTimelineRow" });
  const track = el("div", {
    class: "archiveExhibitionTimelineTrack",
    style: `--timeline-cols:${PAST_EXHIBITION_ROW_SIZE}`,
  });

  normalized.forEach((year, index) => {
    if (!year) {
      track.appendChild(
        el("div", {
          class: "archiveExhibitionTimelineColumn archiveExhibitionTimelineColumn--empty",
          "aria-hidden": "true",
        })
      );
      return;
    }
    track.appendChild(renderPastExhibitionTimelineColumn(year, rowIndex * 10 + index));
  });

  row.appendChild(track);
  return row;
}

function renderArchiveExhibitions() {
  const past = archiveData().pastExhibitions || {};
  const heading = past.heading || "歷屆網站";

  const root = el("div", { class: "archivePage archivePastWebsitesPage" });
  root.appendChild(el("h1", { class: "archivePastWebsitesTitle", text: heading }));

  if (typeof renderClassicsTimeline === "function") {
    root.appendChild(renderClassicsTimeline({ pastWebsites: true }));
  }

  return root;
}

function resolvePracticeWorks(practice, year, authorFilter, query) {
  const byYear = practice.worksByYear || {};
  let works = Array.isArray(byYear[year]) ? byYear[year] : [];

  if (!works.length && Array.isArray(practice.works)) {
    works = practice.works.filter((w) => !w.year || String(w.year) === String(year));
  }

  const author = (authorFilter || "").trim();
  const q = (query || "").trim().toLowerCase();

  return works.filter((work) => {
    if (author && String(work.author || "") !== author) return false;
    if (!q) return true;
    const hay = `${work.title || ""} ${work.author || ""}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderArchivePractice() {
  const practice = archiveData().practice || {};
  const years = Array.isArray(practice.filterYears) ? practice.filterYears : ["2025"];
  const authors = Array.isArray(practice.authors) ? practice.authors : [];
  const params = getHashQuery();
  const selectedYear = params.get("year") || years[0] || "2025";
  const selectedAuthor = params.get("author") || "";
  const searchQuery = params.get("q") || "";

  const root = el("div", { class: "archivePage archivePracticePage" });

  const filters = el("div", { class: "archiveFilters archiveFilters--practice" });
  const yearSel = el("select", { class: "archiveSelect", "aria-label": "年份選擇" });
  years.forEach((y) => yearSel.appendChild(el("option", { value: y, text: y })));
  yearSel.value = selectedYear;

  const authorSel = el("select", { class: "archiveSelect", "aria-label": "作者選擇" });
  authorSel.appendChild(el("option", { value: "", text: "作者選擇" }));
  authors.forEach((a) => authorSel.appendChild(el("option", { value: a, text: a })));
  authorSel.value = selectedAuthor;

  const searchInput = el("input", {
    class: "archiveSearchInput archiveSearchInput--practice",
    type: "search",
    placeholder: "關鍵字搜尋",
    "aria-label": "關鍵字搜尋",
    value: searchQuery,
  });

  const applyFilters = () => {
    const q = new URLSearchParams();
    if (yearSel.value) q.set("year", yearSel.value);
    if (authorSel.value) q.set("author", authorSel.value);
    if (searchInput.value.trim()) q.set("q", searchInput.value.trim());
    navigateFromHref(`#archive/practice?${q.toString()}`);
  };

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });
  yearSel.addEventListener("change", applyFilters);
  authorSel.addEventListener("change", applyFilters);

  const filtersLeft = el("div", { class: "archiveFiltersPracticeLeft" }, [yearSel, authorSel]);
  const filtersRight = el("div", { class: "archiveFiltersPracticeRight" }, [searchInput]);
  filters.appendChild(filtersLeft);
  filters.appendChild(filtersRight);
  root.appendChild(filters);

  const works = resolvePracticeWorks(practice, selectedYear, selectedAuthor, searchQuery);
  const grid = el("div", { class: "archiveWorkGrid archiveWorkGrid--practice" });
  works.forEach((work, index) =>
    grid.appendChild(renderArchiveLinkedWorkCard(work, { framed: true, index }))
  );
  root.appendChild(grid);

  return root;
}

const ARCHIVE_MEDIA_PER_PAGE = 9;

function resolveArchiveRecordYearPack(section, year) {
  const byYear = section.byYear || {};
  const pack = byYear[year];
  if (pack && typeof pack === "object") {
    return {
      overview: pack.overview || "",
      items: Array.isArray(pack.items) ? pack.items : [],
    };
  }
  return { overview: "", items: [] };
}

function normalizeLegacyMediaSection(legacy, sectionKey) {
  const years = Array.isArray(legacy.years) ? legacy.years : ["2025"];
  const byYear = {};
  const isVideoSection = sectionKey === "videos";

  years.forEach((year) => {
    const pack = resolveMediaYearPack(legacy, year);
    let items = pack.items;
    if (isVideoSection) {
      items = items.filter((item) => archiveMediaItemIsVideo(item));
    } else {
      items = items.filter((item) => !archiveMediaItemIsVideo(item));
      if (!items.length && Array.isArray(legacy.photos)) {
        items = legacy.photos.map((p) => ({
          type: "photo",
          title: p.title,
          caption: p.caption,
          keywords: p.keywords,
          image: p.image,
        }));
      }
    }
    byYear[year] = { overview: pack.overview, items };
  });

  const carousel = Array.isArray(legacy.featuredCarousel) ? legacy.featuredCarousel : [];
  return {
    years,
    perPage: legacy.perPage || ARCHIVE_MEDIA_PER_PAGE,
    featuredCarousel: isVideoSection
      ? carousel.filter((slide) => archiveMediaItemIsVideo(slide))
      : carousel.filter((slide) => !archiveMediaItemIsVideo(slide)),
    byYear,
  };
}

function resolveArchiveRecordSection(sectionKey) {
  const archive = archiveData();
  const direct = archive[sectionKey];
  if (direct && (Array.isArray(direct.years) || direct.byYear)) {
    return {
      years: Array.isArray(direct.years) ? direct.years : Object.keys(direct.byYear || {}),
      perPage: direct.perPage || ARCHIVE_MEDIA_PER_PAGE,
      featuredCarousel: Array.isArray(direct.featuredCarousel) ? direct.featuredCarousel : [],
      byYear: direct.byYear || {},
    };
  }
  return normalizeLegacyMediaSection(archive.media || {}, sectionKey);
}

function archiveMediaItemSearchText(item) {
  return `${item.title || ""} ${item.caption || ""} ${item.keywords || ""}`.toLowerCase();
}

function openArchivePhotoLightbox(item, index = 0) {
  const src = archiveMediaImageSrc(item, index);
  const img = el("img", {
    class: "archivePhotoLightboxImg",
    src,
    alt: item.image?.alt || item.title || "照片",
  });
  const caption = item.caption || item.title || "";
  const content = el("figure", { class: "archivePhotoLightbox" }, [
    img,
    caption ? el("figcaption", { class: "archivePhotoLightboxCaption", text: caption }) : null,
  ]);
  openArchiveModal({
    title: item.title || "照片紀錄",
    content,
    lightbox: true,
    wide: true,
  });
}

function renderArchiveMediaPagination(currentPage, totalPages, buildHref) {
  if (totalPages <= 1) return null;

  const nav = el("nav", { class: "archiveMediaPager", "aria-label": "分頁" });
  for (let page = 1; page <= totalPages; page += 1) {
    nav.appendChild(
      el("a", {
        class: `archiveMediaPagerBtn${page === currentPage ? " archiveMediaPagerBtn--active" : ""}`,
        href: buildHref(page),
        text: String(page),
        "aria-current": page === currentPage ? "page" : undefined,
        onclick: (e) => {
          e.preventDefault();
          navigateFromHref(buildHref(page));
        },
      })
    );
  }

  if (currentPage < totalPages) {
    nav.appendChild(
      el("a", {
        class: "archiveMediaPagerNext",
        href: buildHref(currentPage + 1),
        text: "下一頁 ›",
        onclick: (e) => {
          e.preventDefault();
          navigateFromHref(buildHref(currentPage + 1));
        },
      })
    );
  }

  return nav;
}

function resolveMediaYearPack(media, year) {
  const byYear = media.byYear || {};
  const pack = byYear[year];
  if (pack && typeof pack === "object") {
    return {
      title: pack.title || `${year}田野踏查紀錄`,
      overview: pack.overview || "",
      items: Array.isArray(pack.items) ? pack.items : [],
    };
  }
  const legacyPhotos = Array.isArray(media.photos) ? media.photos : [];
  return {
    title: `${year}田野踏查紀錄`,
    overview: media.recommendedText?.body || "",
    items: legacyPhotos.map((p) => ({
      type: p.youtubeUrl || p.videoUrl ? "video" : "photo",
      title: p.title,
      caption: p.caption,
      image: p.image,
      youtubeUrl: p.youtubeUrl || p.videoUrl,
    })),
  };
}

function renderArchiveFeaturedCarousel(slides) {
  const list = Array.isArray(slides) && slides.length ? slides : [];
  const section = el("section", { class: "archiveBlock archiveBlock--carouselBleed archiveMediaFeatured" });
  if (!list.length) return section;

  const items = list.map((slide, index) => ({
    title: slide.title || "",
    caption: slide.caption || "",
    image: {
      src: archiveFeaturedSlideSrc(slide, index),
      alt: slide.image?.alt || slide.title || "精選照片",
    },
  }));

  const carousel = renderArchiveHomeCarousel(items, {
    variant: "media",
    ariaLabel: "精選照片輪播",
  });
  if (carousel) section.appendChild(carousel);
  return section;
}

function renderArchiveMediaGalleryItem(item, index = 0) {
  const isVideo = archiveMediaItemIsVideo(item);
  const youtubeUrl = archiveMediaItemYoutubeUrl(item);
  const thumb = archiveMediaImageSrc(item, index);

  const inner = [
    el("div", { class: "archiveMediaGalleryThumb" }, [
      el("img", {
        src: thumb,
        alt: item.image?.alt || item.title || "",
        loading: "lazy",
      }),
      isVideo ? el("span", { class: "archiveMediaGalleryPlay", text: "▶", "aria-hidden": "true" }) : null,
    ]),
  ];

  if (isVideo && youtubeUrl) {
    return el(
      "a",
      {
        class: "archiveMediaGalleryItem archiveMediaGalleryItem--video",
        href: youtubeUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        title: item.title || "在 YouTube 觀看",
        "aria-label": `${item.title || "影片"}（在 YouTube 觀看）`,
      },
      inner
    );
  }

  return el(
    "button",
    {
      class: "archiveMediaGalleryItem",
      type: "button",
      "aria-label": item.title || `照片 ${index + 1}`,
      onclick: () => openArchivePhotoLightbox(item, index),
    },
    inner
  );
}

function resolveMediaItemsByType(media, year, mediaType) {
  const yearPack = resolveMediaYearPack(media, year);
  if (mediaType === "video") {
    return yearPack.items.filter((item) => archiveMediaItemIsVideo(item));
  }
  if (mediaType === "photo") {
    const photos = yearPack.items.filter((item) => !archiveMediaItemIsVideo(item));
    if (photos.length) return photos;
    const legacyPhotos = Array.isArray(media.photos) ? media.photos : [];
    return legacyPhotos.map((p) => ({
      type: "photo",
      title: p.title,
      caption: p.caption,
      image: p.image,
    }));
  }
  return yearPack.items;
}

function renderArchiveMediaPage(options = {}) {
  const sectionKey = options.sectionKey || "photos";
  const pageTitle = options.pageTitle || "照片紀錄";
  const baseHref = options.baseHref || `#archive/${sectionKey}`;

  const section = resolveArchiveRecordSection(sectionKey);
  const years = section.years.length ? section.years : ["2025"];
  const perPage = section.perPage || ARCHIVE_MEDIA_PER_PAGE;
  const params = getHashQuery();
  const year = params.get("year") || years[0] || "2025";
  const query = (params.get("q") || "").trim().toLowerCase();
  const yearPack = resolveArchiveRecordYearPack(section, year);
  const typeItems = yearPack.items;
  const featured =
    Array.isArray(section.featuredCarousel) && section.featuredCarousel.length
      ? section.featuredCarousel
      : typeItems.slice(0, 5);

  const buildHref = (pageNum) => {
    const q = new URLSearchParams({ year });
    if (query) q.set("q", params.get("q") || "");
    if (pageNum > 1) q.set("page", String(pageNum));
    const qs = q.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  };

  const filtered = typeItems.filter((item) => {
    if (!query) return true;
    return archiveMediaItemSearchText(item).includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const requestedPage = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const pageOffset = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(pageOffset, pageOffset + perPage);

  const root = el("div", { class: "archivePage archiveMediaPage" });
  root.appendChild(renderArchiveBackToCollection());
  root.appendChild(renderArchiveFeaturedCarousel(featured));
  root.appendChild(el("h1", { class: "archivePageTitle archivePageTitle--media", text: pageTitle }));

  const filters = el("div", { class: "archiveFilters archiveFilters--media" });
  const yearSel = el("select", { class: "archiveSelect archiveSelect--media", "aria-label": "年份" });
  years.forEach((y) => yearSel.appendChild(el("option", { value: y, text: y })));
  yearSel.value = year;

  const searchInput = el("input", {
    class: "archiveSearchInput archiveSearchInput--media",
    type: "search",
    placeholder: "關鍵字",
    "aria-label": "關鍵字",
    value: params.get("q") || "",
  });

  const applyFilters = () => {
    const q = new URLSearchParams({ year });
    if (searchInput.value.trim()) q.set("q", searchInput.value.trim());
    navigateFromHref(`${baseHref}?${q.toString()}`);
  };

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });
  yearSel.addEventListener("change", applyFilters);

  filters.appendChild(
    el("div", { class: "archiveFiltersMediaField" }, [
      el("span", { class: "archiveFilterLabel", text: "年份" }),
      yearSel,
    ])
  );
  filters.appendChild(
    el("div", { class: "archiveFiltersMediaField archiveFiltersMediaField--search" }, [
      el("span", { class: "archiveFilterLabel", text: "關鍵字" }),
      searchInput,
      el("button", {
        class: "archiveFilterSearchBtn",
        type: "button",
        text: "搜索",
        onclick: applyFilters,
      }),
    ])
  );
  root.appendChild(filters);

  const recordSec = el("section", { class: "archiveMediaRecord" });
  recordSec.appendChild(el("h2", { class: "archiveMediaYearHeading", text: year }));
  if (yearPack.overview) {
    recordSec.appendChild(el("p", { class: "archiveMediaYearOverview", text: yearPack.overview }));
  }

  const grid = el("div", { class: "archiveMediaGallery" });
  if (!pageItems.length) {
    grid.appendChild(
      el("p", { class: "archiveMediaGalleryEmpty", text: query ? "找不到符合關鍵字的項目。" : "此年份尚無內容。" })
    );
  } else {
    pageItems.forEach((item, i) => {
      grid.appendChild(renderArchiveMediaGalleryItem(item, pageOffset + i));
    });
  }
  recordSec.appendChild(grid);

  const pager = renderArchiveMediaPagination(currentPage, totalPages, buildHref);
  if (pager) recordSec.appendChild(pager);

  root.appendChild(recordSec);
  return root;
}

function renderArchivePhotos() {
  return renderArchiveMediaPage({
    sectionKey: "photos",
    pageTitle: "照片紀錄",
    baseHref: "#archive/photos",
  });
}

function renderArchiveVideos() {
  return renderArchiveMediaPage({
    sectionKey: "videos",
    pageTitle: "動態影音紀錄",
    baseHref: "#archive/videos",
  });
}

function renderArchiveMedia() {
  return renderArchiveMediaPage({
    sectionKey: "videos",
    pageTitle: "動態影音紀錄",
    baseHref: "#archive/media",
  });
}

function bibliographyBookCoverSrc(book, index = 0) {
  const src = book?.cover?.src || "";
  if (src && !archiveIsPlaceholderImage(src)) return src || ARCHIVE_PLACEHOLDER_BOOK;
  const label = String(book?.title || `書目 ${index + 1}`).trim();
  const shortLabel = label.length > 8 ? `${label.slice(0, 7)}…` : label;
  const color = ARCHIVE_TEACHER_AVATAR_COLORS[index % ARCHIVE_TEACHER_AVATAR_COLORS.length];
  return archiveColorBlockSrc(shortLabel, color, book?.year || "書目");
}

function resolveBibliographyAction(book) {
  const preview = String(book?.preview || book?.previewUrl || book?.file || "").trim();
  const href = String(book?.href || book?.link || book?.url || "").trim();
  const action = book?.action && typeof book.action === "object" ? book.action : null;

  if (action?.type === "preview" && action.href) {
    return {
      type: "preview",
      href: action.href,
      label: action.label || "預覽檔案",
    };
  }
  if (action?.type === "link" && action.href) {
    return {
      type: "link",
      href: action.href,
      label: action.label || "前往閱讀",
    };
  }
  if (preview) {
    return {
      type: "preview",
      href: preview,
      label: book?.previewLabel || action?.label || "預覽檔案",
    };
  }
  if (href) {
    return {
      type: "link",
      href,
      label: book?.linkLabel || action?.label || "前往閱讀",
    };
  }
  return { type: "none", href: "", label: "" };
}

function bibliographyPreviewKind(url) {
  const lower = String(url || "").toLowerCase().split("?")[0];
  if (lower.endsWith(".pdf")) return "pdf";
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(lower)) return "image";
  return "file";
}

function openBibliographyPreviewModal(book) {
  const action = resolveBibliographyAction(book);
  const kind = bibliographyPreviewKind(action.href);
  const children = [];

  if (kind === "image") {
    children.push(
      el("img", {
        class: "archiveBibliographyPreviewImage",
        src: action.href,
        alt: book.cover?.alt || book.title || "延伸閱讀預覽",
        loading: "lazy",
      })
    );
  } else {
    children.push(
      el("iframe", {
        class: "archiveBibliographyPreviewFrame",
        src: action.href,
        title: `${book.title || "延伸閱讀"}預覽`,
        loading: "lazy",
      })
    );
    if (kind === "file") {
      children.push(
        el(
          "a",
          {
            class: "archiveBibliographyPreviewDownload",
            href: action.href,
            target: "_blank",
            rel: "noopener noreferrer",
            text: "若無法預覽，請點此開啟或下載檔案",
          }
        )
      );
    }
  }

  if (book.description) {
    children.push(el("p", { class: "archiveBibliographyPreviewNote", text: book.description }));
  }

  openArchiveModal({
    title: book.title || "延伸閱讀",
    content: el("div", { class: "archiveBibliographyPreviewDialog" }, children),
    wide: true,
    preview: true,
  });
}

function bibliographyMetaLine(book) {
  const parts = [];
  if (book.year) parts.push(String(book.year));
  if (book.author) parts.push(String(book.author));
  return parts.join(" · ");
}

function renderArchiveBibliographyItem(book, index) {
  const action = resolveBibliographyAction(book);
  const isInteractive = action.type !== "none";

  const inner = [
    book.title ? el("h3", { class: "archiveBibliographyItemTitle", text: book.title }) : null,
    el("p", {
      class: "archiveBibliographyItemDesc",
      text: book.description || book.intro || "我是介紹",
    }),
  ];

  if (!isInteractive) {
    return el("article", { class: "archiveBibliographyItem" }, inner);
  }

  const itemClass = `archiveBibliographyItem archiveBibliographyItem--interactive archiveBibliographyItem--${action.type}`;
  const ariaLabel = `${book.title || "延伸閱讀"}：${action.label}`;

  if (action.type === "link") {
    const isHash = String(action.href).startsWith("#");
    const isExternal = !isHash;
    return el(
      "a",
      {
        class: itemClass,
        href: action.href,
        target: isExternal ? "_blank" : undefined,
        rel: isExternal ? "noopener noreferrer" : undefined,
        "aria-label": ariaLabel,
        onclick: (e) => {
          if (isHash) {
            e.preventDefault();
            navigateFromHref(action.href);
          }
        },
      },
      inner
    );
  }

  return el(
    "button",
    {
      class: itemClass,
      type: "button",
      "aria-label": ariaLabel,
      onclick: () => openBibliographyPreviewModal(book),
    },
    inner
  );
}

function resolveBibliographyCategories(data) {
  const configured = Array.isArray(data.bibliographyCategories) ? data.bibliographyCategories : [];
  if (configured.length) {
    return configured.map((category) => ({
      id: category.id || category.title || "category",
      title: category.title || "",
      items: Array.isArray(category.items) ? category.items : [],
    }));
  }

  const flat = Array.isArray(data.bibliography) ? data.bibliography : [];
  const legacy = Array.isArray(window.SITE_CONTENT?.research?.bibliography)
    ? window.SITE_CONTENT.research.bibliography
    : [];
  const items = flat.length
    ? flat
    : legacy.map((book) => ({
        title: book.title,
        author: book.author,
        year: book.year,
        description: book.note || book.description || "",
        href: book.href || book.link,
        preview: book.preview || book.file,
        cover: book.cover,
      }));

  if (!items.length) return [];

  return [
    { id: "academic", title: "學術論文", items: items.slice(0, 3) },
    { id: "reviews", title: "展演評論", items: items.slice(3, 6) },
    { id: "books", title: "參考書", items: items.slice(6, 9) },
  ].filter((category) => category.items.length);
}

function renderArchiveBackToTopButton() {
  return el("button", {
    class: "archiveBackToTop",
    type: "button",
    text: "▲",
    "aria-label": "回到頂端",
    onclick: () => {
      const shell = document.querySelector(".innerShell");
      if (shell) {
        shell.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });
}

function renderArchiveBibliographyCategory(category, categoryIndex = 0) {
  const items = Array.isArray(category.items) ? category.items : [];
  if (!category.title && !items.length) return null;

  const section = el("section", { class: "archiveBibliographyCategory" });
  section.appendChild(
    el("h2", { class: "archiveBibliographyCategoryTitle", text: category.title || "" })
  );

  const list = el("div", { class: "archiveBibliographyList" });
  items.forEach((book, index) => {
    list.appendChild(renderArchiveBibliographyItem(book, categoryIndex * 10 + index));
    if (index < items.length - 1) {
      list.appendChild(el("hr", { class: "archiveBibliographyDivider", "aria-hidden": "true" }));
    }
  });
  section.appendChild(list);
  return section;
}

function renderArchiveBibliography() {
  const data = archiveData();
  const categories = resolveBibliographyCategories(data);

  const root = el("div", { class: "archivePage archiveBibliographyPage" });
  const body = el("div", { class: "archiveBibliographyBody" });
  categories.forEach((category, index) => {
    const block = renderArchiveBibliographyCategory(category, index);
    if (block) body.appendChild(block);
  });
  root.appendChild(body);

  return root;
}

function performanceBannerPlaceholderSrc() {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 360'><rect width='1200' height='360' fill='#b8b4b0'/></svg>";
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function performanceBannerImageSrc(banner) {
  const src = banner?.image?.src || "";
  if (src && !archiveIsPlaceholderImage(src)) return src;
  return performanceBannerPlaceholderSrc();
}

function resolvePerformanceBanners() {
  const performances = archiveData().performances || {};
  const configured = Array.isArray(performances.banners) ? performances.banners : [];
  if (configured.length) return configured;

  const legacy = archiveData().home?.specialExhibitions || [];
  if (legacy.length) {
    return legacy.map((item) => ({
      title: item.title,
      href: item.href,
      image: item.image,
    }));
  }

  return [
    { title: "推開自由門", href: "#exhibition-left/about" },
    { title: "成為自由人", href: "#exhibition-right/about" },
  ];
}

function performanceMetaLine(banner, field, fallback) {
  const value = String(banner?.[field] || "").trim();
  return value || fallback;
}

function renderArchivePerformanceCard(banner, index) {
  const href = banner.href || "#home/index";
  const imgSrc = performanceBannerImageSrc(banner);
  const imgAlt = banner.image?.alt || banner.title || "最新展演";
  const author = performanceMetaLine(banner, "author", "作者xxx");
  const period = performanceMetaLine(
    banner,
    "period",
    performanceMetaLine(banner, "exhibitionPeriod", "展期")
  );

  return el(
    "article",
    { class: "archivePerformanceCard" },
    [
      el(
        "a",
        {
          class: "archivePerformanceCardLink",
          href,
          "aria-label": banner.title || "最新展演",
          onclick: (e) => {
            if (String(href).startsWith("#")) {
              e.preventDefault();
              navigateFromHref(href);
            }
          },
        },
        [
          el("div", { class: "archivePerformanceCardMedia" }, [
            el("img", {
              class: "archivePerformanceCardImg",
              src: imgSrc,
              alt: imgAlt,
              loading: index === 0 ? "eager" : "lazy",
            }),
          ]),
          el("div", { class: "archivePerformanceCardBody" }, [
            banner.title
              ? el("h2", { class: "archivePerformanceCardTitle", text: banner.title })
              : null,
            el("p", { class: "archivePerformanceCardMeta", text: author }),
            el("p", { class: "archivePerformanceCardMeta", text: period }),
          ]),
        ]
      ),
    ]
  );
}

function renderArchivePerformances() {
  const performances = archiveData().performances || {};
  const banners = resolvePerformanceBanners().slice(0, 2);

  const root = el("div", { class: "archivePage archivePerformancesPage" });
  root.appendChild(
    el("h1", {
      class: "archivePageTitle archivePerformancesTitle",
      text: performances.heading || "最新展演",
    })
  );

  const list = el("div", { class: "archivePerformancesList" });
  banners.forEach((banner, index) => {
    list.appendChild(renderArchivePerformanceCard(banner, index));
  });
  root.appendChild(list);

  return root;
}

function teacherSummaryText(teacher) {
  const summary = String(teacher?.summary || "").trim();
  if (summary) return summary;
  const bio = String(teacher?.bio || "").trim();
  if (!bio) return "藝術家介紹";
  return bio.length > 48 ? `${bio.slice(0, 47)}…` : bio;
}

function teacherDetailText(teacher) {
  return String(teacher?.detail || teacher?.bio || teacher?.summary || "").trim() || "藝術家介紹";
}

function openTeacherDetailModal(teacher, index = 0) {
  const content = el("div", { class: "archiveTeacherDetailDialog" }, [
    el("img", {
      class: "archiveTeacherDetailAvatar",
      src: archiveTeacherAvatarSrc(teacher, index),
      alt: teacher?.avatar?.alt || teacher?.name || "",
      loading: "lazy",
    }),
    el("h3", { class: "archiveTeacherDetailName", text: teacher?.name || "藝術家教師" }),
    el("p", { class: "archiveTeacherDetailBio", text: teacherDetailText(teacher) }),
  ]);
  openArchiveModal({
    title: teacher?.name || "藝術家教師",
    content,
  });
}

function renderArchiveTeacherGridCard(teacher, index) {
  return el(
    "button",
    {
      class: "archiveTeachersGridCard",
      type: "button",
      "aria-label": `查看 ${teacher.name || "藝術家教師"} 介紹`,
      onclick: () => openTeacherDetailModal(teacher, index),
    },
    [
      el("img", {
        class: "archiveTeachersGridAvatar",
        src: archiveTeacherAvatarSrc(teacher, index),
        alt: teacher.avatar?.alt || teacher.name || "",
        loading: "lazy",
      }),
      el("h3", { class: "archiveTeachersGridName", text: teacher.name || "姓名" }),
      el("p", { class: "archiveTeachersGridSummary", text: teacherSummaryText(teacher) }),
    ]
  );
}

function renderArchiveTeachers() {
  const teachersData = archiveData().teachers || {};
  const years = Array.isArray(teachersData.years) ? teachersData.years : ["2026"];
  const params = getHashQuery();
  const year = params.get("year") || teachersData.defaultYear || years[years.length - 1] || "2026";
  const yearPack = (teachersData.byYear || {})[year] || {};
  const teachers = (Array.isArray(yearPack.teachers) ? yearPack.teachers : []).slice(0, 8);

  const root = el("div", { class: "archivePage archiveTeachersPage archiveTeachersPage--grid" });
  root.appendChild(el("h1", { class: "archivePageTitle", text: "藝術家教師" }));

  if (years.length > 1) {
    root.appendChild(renderArchiveYearTabs(years, year, "#archive/teachers"));
  }

  const section = el("section", { class: "archiveTeachersYearSection" });
  section.appendChild(
    el("h2", { class: "archiveTeachersYearHeading", text: String(year) })
  );

  const grid = el("div", { class: "archiveTeachersGrid" });
  if (teachers.length) {
    teachers.forEach((teacher, index) => {
      grid.appendChild(renderArchiveTeacherGridCard(teacher, index));
    });
  } else {
    grid.appendChild(el("p", { class: "archiveIntroBody", text: "此年度尚無藝術家教師資料。" }));
  }
  section.appendChild(grid);
  root.appendChild(section);

  return root;
}

function renderArchiveTeacherProfile(teacher) {
  const aside = el("aside", { class: "archiveTeachersProfile" });
  if (!teacher) {
    aside.appendChild(el("p", { class: "muted", text: "請選擇藝術家教師。" }));
    return aside;
  }
  aside.appendChild(
    el("img", {
      class: "archiveTeachersProfileAvatar",
      src: teacher.avatar?.src || ARCHIVE_PLACEHOLDER_AVATAR,
      alt: teacher.avatar?.alt || teacher.name || "",
      loading: "lazy",
    })
  );
  aside.appendChild(el("h3", { class: "archiveTeachersProfileName", text: teacher.name || "藝術家教師名字" }));
  aside.appendChild(
    el("p", {
      class: "archiveTeachersProfileBio",
      text: teacher.bio || "藝術家介紹",
    })
  );
  return aside;
}

function teacherPickerHref(year, teacherId, teachersData) {
  return archiveTeacherNavHref(year, teacherId, teachersData, "teachers");
}

function archiveTeacherNavHref(year, teacherId, teachersData, section = "teachers") {
  const q = new URLSearchParams({ year });
  if (teacherId && teachersData) {
    const list = teachersData.byYear?.[year]?.teachers || [];
    if (list.some((t) => t.id === teacherId)) {
      q.set("teacher", teacherId);
    } else if (list[0]?.id) {
      q.set("teacher", list[0].id);
    }
  } else if (teacherId) {
    q.set("teacher", teacherId);
  }
  return `#archive/${section}?${q.toString()}`;
}

function teacherNotebookIconSrc(name = "") {
  const label = String(name || "").trim().slice(0, 1) || "日";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100'><rect x='14' y='10' width='52' height='80' rx='3' fill='#f2d34a' stroke='#c9a820' stroke-width='1.5'/><rect x='10' y='14' width='8' height='10' rx='4' fill='none' stroke='#8a6d10' stroke-width='2'/><rect x='10' y='30' width='8' height='10' rx='4' fill='none' stroke='#8a6d10' stroke-width='2'/><rect x='10' y='46' width='8' height='10' rx='4' fill='none' stroke='#8a6d10' stroke-width='2'/><rect x='10' y='62' width='8' height='10' rx='4' fill='none' stroke='#8a6d10' stroke-width='2'/><rect x='10' y='78' width='8' height='10' rx='4' fill='none' stroke='#8a6d10' stroke-width='2'/><line x1='22' y1='22' x2='60' y2='22' stroke='#d4b830' stroke-width='1.2'/><text x='40' y='58' text-anchor='middle' fill='#8a6d10' font-family='sans-serif' font-size='16' font-weight='700'>${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function renderArchiveTeacherPicker(teachers, selected, year, years, teachersData, options = {}) {
  const navSection = options.section || "teachers";
  const useNotebookIcon = options.notebookIcon ?? navSection === "research";
  const navHref = (y, id) => archiveTeacherNavHref(y, id, teachersData, navSection);

  const section = el("section", { class: "archiveTeachersPicker" });
  section.appendChild(
    el("h2", { class: "archiveTeachersPickerTitle", text: `${year}年藝術家教師` })
  );

  const carousel = el("div", { class: "archiveTeachersCarousel" });
  const prevBtn = el("button", {
    class: "archiveTeachersCarouselBtn archiveTeachersCarouselBtn--prev",
    type: "button",
    text: "‹",
    "aria-label": "上一位教師",
  });
  const nextBtn = el("button", {
    class: "archiveTeachersCarouselBtn archiveTeachersCarouselBtn--next",
    type: "button",
    text: "›",
    "aria-label": "下一位教師",
  });
  const track = el("div", { class: "archiveTeachersCarouselTrack" });

  const list = Array.isArray(teachers) ? teachers : [];
  const selectedIndex = Math.max(
    0,
    list.findIndex((t) => t.id === selected?.id)
  );

  list.forEach((t) => {
    const isActive = t.id === selected?.id;
    const iconClass = useNotebookIcon
      ? "archiveTeachersCarouselNotebook"
      : "archiveTeachersCarouselAvatar";
    const iconSrc = useNotebookIcon
      ? isActive
        ? JOURNAL_OPEN_BOOK
        : JOURNAL_CLOSE_BOOK
      : t.avatar?.src || ARCHIVE_PLACEHOLDER_AVATAR;

    track.appendChild(
      el(
        "button",
        {
          class: `archiveTeachersCarouselItem${isActive ? " archiveTeachersCarouselItem--active" : ""}`,
          type: "button",
          "aria-pressed": isActive ? "true" : "false",
          onclick: () => navigateFromHref(navHref(year, t.id)),
        },
        [
          el("img", {
            class: iconClass,
            src: iconSrc,
            alt: t.avatar?.alt || t.name || "",
            loading: "lazy",
          }),
          el("span", { class: "archiveTeachersCarouselName", text: t.name || "姓名" }),
        ]
      )
    );
  });

  if (list.length) {
    prevBtn.addEventListener("click", () => {
      const prev = list[Math.max(0, selectedIndex - 1)];
      if (prev) navigateFromHref(navHref(year, prev.id));
    });
    nextBtn.addEventListener("click", () => {
      const next = list[Math.min(list.length - 1, selectedIndex + 1)];
      if (next) navigateFromHref(navHref(year, next.id));
    });
    prevBtn.disabled = selectedIndex <= 0;
    nextBtn.disabled = selectedIndex >= list.length - 1;
  } else {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }

  carousel.appendChild(prevBtn);
  carousel.appendChild(track);
  carousel.appendChild(nextBtn);
  section.appendChild(carousel);

  if (!options.hideTimeline) {
    section.appendChild(renderArchiveTeacherTimeline(years, year, selected?.id, teachersData, navSection));
  }

  window.requestAnimationFrame(() => {
    const active = track.querySelector(".archiveTeachersCarouselItem--active");
    if (active) {
      active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  });

  return section;
}

function renderArchiveTeacherTimeline(years, year, teacherId, teachersData, section = "teachers") {
  const bar = el("div", { class: "archiveTeachersTimeline", role: "tablist", "aria-label": "年份選擇" });
  years.forEach((y) => {
    const href = archiveTeacherNavHref(y, teacherId, teachersData, section);
    bar.appendChild(
      el(
        "a",
        {
          class: `archiveTeachersTimelineYear${y === year ? " archiveTeachersTimelineYear--active" : ""}`,
          href,
          role: "tab",
          "aria-selected": y === year ? "true" : "false",
          text: y,
          onclick: (e) => {
            e.preventDefault();
            navigateFromHref(href);
          },
        }
      )
    );
  });
  return bar;
}

const JOURNAL_PAPER_COLOR = "#f4f0e6";
const JOURNAL_COVER_COLOR = "#ffffff";
// 翻書尺寸：JOURNAL_FRAME_FIT_SCALE 整體縮放（1 = 100%）
// 跨頁比例：有掃描圖時自動偵測；無圖時用 JOURNAL_DEFAULT_SPREAD_ASPECT
const JOURNAL_DEFAULT_SPREAD_ASPECT = 2.56;
const JOURNAL_FRAME_FIT_SCALE = 1;

function firstSpreadImageSrc(spreads) {
  const hit = (Array.isArray(spreads) ? spreads : []).find((spread) => spread?.image?.src);
  return hit?.image?.src || "";
}

function detectSpreadAspect(spreads) {
  const src = firstSpreadImageSrc(spreads);
  if (!src) return Promise.resolve(JOURNAL_DEFAULT_SPREAD_ASPECT);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
      resolve(aspect > 1 ? aspect : JOURNAL_DEFAULT_SPREAD_ASPECT);
    };
    img.onerror = () => resolve(JOURNAL_DEFAULT_SPREAD_ASPECT);
    img.src = src;
  });
}

function resolveStfPageSize(shellEl, spreadAspect = JOURNAL_DEFAULT_SPREAD_ASPECT, scale = JOURNAL_FRAME_FIT_SCALE) {
  const rect = shellEl.getBoundingClientRect();
  const availW = Math.max(160, rect.width || shellEl.clientWidth || 480) * scale;
  const availH = Math.max(140, rect.height || shellEl.clientHeight || 280) * scale;

  let spreadW = availW;
  let spreadH = spreadW / spreadAspect;
  if (spreadH > availH) {
    spreadH = availH;
    spreadW = spreadH * spreadAspect;
  }

  const width = Math.max(120, Math.round(spreadW / 2));
  const height = Math.max(100, Math.round(spreadH));

  return {
    width,
    height,
    spreadW: width * 2,
    spreadH: height,
  };
}

function applyStfBookLayout(hostEl, layout) {
  hostEl.style.width = `${layout.spreadW}px`;
  hostEl.style.height = `${layout.spreadH}px`;
  hostEl.style.maxWidth = "100%";
  hostEl.style.maxHeight = "100%";
  hostEl.style.flex = "0 0 auto";
}

function createStPageElement(kind, options = {}) {
  const page = el("div", { class: "archiveStfPage" });
  if (kind === "cover" || kind === "back") {
    page.dataset.density = "hard";
    page.style.backgroundColor = JOURNAL_COVER_COLOR;
    return page;
  }
  if (kind === "spread-half") {
    page.style.backgroundColor = JOURNAL_PAPER_COLOR;
    const half = el("div", { class: `flipSpreadHalf flipSpreadHalf--${options.side}` });
    half.appendChild(
      el("img", {
        class: "flipSpreadImage",
        src: options.src,
        alt: options.alt || "日誌跨頁",
        draggable: "false",
      })
    );
    page.appendChild(half);
    return page;
  }
  page.style.backgroundColor = JOURNAL_PAPER_COLOR;
  return page;
}

function spreadsToStPageElements(spreads) {
  const pages = [];
  for (const spread of spreads) {
    if (spread?.kind === "cover") {
      pages.push(createStPageElement("cover"));
      continue;
    }
    if (spread?.kind === "back") {
      pages.push(createStPageElement("back"));
      continue;
    }
    if (spread?.image?.src) {
      pages.push(
        createStPageElement("spread-half", {
          side: "left",
          src: spread.image.src,
          alt: spread.image.alt || spread.title || "",
        })
      );
      pages.push(
        createStPageElement("spread-half", {
          side: "right",
          src: spread.image.src,
          alt: spread.image.alt || spread.title || "",
        })
      );
    }
  }
  return pages.length ? pages : [createStPageElement("cover"), createStPageElement("back")];
}

function spreadIndexFromPageIndex(pageIndex, spreads) {
  let pagePtr = 0;
  for (let i = 0; i < spreads.length; i += 1) {
    if (pagePtr >= pageIndex) return i;
    const spread = spreads[i];
    if (spread?.kind === "cover" || spread?.kind === "back") pagePtr += 1;
    else if (spread?.image?.src) pagePtr += 2;
  }
  return Math.max(0, spreads.length - 1);
}

function buildPlaceholderJournalSpreads() {
  return [{ kind: "cover" }, { kind: "back" }];
}

function resolveJournalSpreads(journal, teacherName) {
  if (Array.isArray(journal?.spreads) && journal.spreads.length) {
    return journal.spreads;
  }

  const pages = Array.isArray(journal?.pages) ? journal.pages.filter(Boolean) : [];
  if (!pages.length) return buildPlaceholderJournalSpreads();

  if (journal?.layout === "spread" || pages.every((page) => page?.image?.src)) {
    const spreads = [{ kind: "cover" }];
    pages.forEach((page) => {
      spreads.push({
        title: page.title || "",
        image: page.image,
      });
    });
    spreads.push({ kind: "back" });
    return spreads;
  }

  return buildPlaceholderJournalSpreads();
}

function buildPlaceholderJournalPages(teacherName) {
  return buildPlaceholderJournalSpreads();
}

function resolveJournalPages(journal, teacherName) {
  return resolveJournalSpreads(journal, teacherName);
}

function wrapResearchJournalFrame(viewerContent) {
  const frame = el("div", { class: "archiveJournalFrame" }, [
    el("img", {
      class: "archiveJournalFrameBg",
      src: JOURNAL_FLIPBOOK_FRAME,
      alt: "",
      loading: "lazy",
      "aria-hidden": "true",
    }),
    el("div", { class: "archiveJournalFrameContent" }, [viewerContent]),
  ]);
  return frame;
}

function renderArchiveIssuuFlipbook(spreads, id, options = {}) {
  const list = Array.isArray(spreads) && spreads.length ? spreads : buildPlaceholderJournalSpreads();
  const wrap = el("div", { class: "archiveTeachersViewer" });
  const viewer = el("div", {
    class: "archiveJournalWrap archiveJournalWrap--stf flipBookWrap",
    id: id || "archive-journal",
  });
  const pageCounter = el("span", { class: "archiveIssuuPageNo", text: "" });
  const toolbar = el("div", { class: "archiveIssuuToolbar" }, [
    el("span", { class: "archiveIssuuHint", text: "點擊書頁左右側翻頁 · 方向鍵亦可 · 手機可用下方按鈕" }),
    pageCounter,
    el("button", {
      class: "btn btnGhost archiveIssuuZoomBtn",
      type: "button",
      text: "放大檢視",
      onclick: () => viewer.classList.toggle("archiveJournalWrap--zoomed"),
    }),
  ]);

  const prevBtn = el("button", {
    class: "btn btnGhost archiveIssuuNavBtn",
    type: "button",
    text: "‹ 上一頁",
    "aria-label": "上一跨頁",
  });
  const nextBtn = el("button", {
    class: "btn archiveIssuuNavBtn",
    type: "button",
    text: "下一頁 ›",
    "aria-label": "下一跨頁",
  });

  const bookShell = el("div", { class: "archiveStfBookShell" });
  const bookHost = el("div", {
    class: "archiveStfBookHost",
    role: "group",
    "aria-label": "教師日誌",
    tabindex: "0",
  });
  const pageEls = spreadsToStPageElements(list);
  pageEls.forEach((page) => bookHost.appendChild(page));
  bookShell.appendChild(bookHost);

  const updateNav = (pageFlip) => {
    if (!pageFlip) return;
    const pageIndex = pageFlip.getCurrentPageIndex();
    const spreadIdx = spreadIndexFromPageIndex(pageIndex, list);
    pageCounter.textContent = `${spreadIdx + 1} / ${list.length}`;
    prevBtn.disabled = spreadIdx <= 0;
    nextBtn.disabled = spreadIdx >= list.length - 1;
  };

  let pageFlip = null;
  let resizeObserver = null;
  let flipLocked = false;
  let resizeTimer = null;
  const isMobile = () => window.matchMedia("(max-width: 720px)").matches;

  const scheduleLayoutUpdate = () => {
    if (!pageFlip || flipLocked) return;
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!pageFlip || flipLocked) return;
      pageFlip.update();
      updateNav(pageFlip);
    }, 120);
  };

  const initPageFlip = async () => {
    if (!window.St?.PageFlip) {
      if (!bookHost.querySelector(".archiveStfFallback")) {
        bookHost.appendChild(
          el("p", { class: "archiveStfFallback", text: "翻頁元件載入失敗，請重新整理頁面。" })
        );
      }
      return;
    }
    if (pageFlip) {
      scheduleLayoutUpdate();
      return;
    }

    const spreadAspect = await detectSpreadAspect(list);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const layout = resolveStfPageSize(bookShell, spreadAspect);
    applyStfBookLayout(bookHost, layout);
    const mobile = isMobile();

    pageFlip = new St.PageFlip(bookHost, {
      width: layout.width,
      height: layout.height,
      size: "fixed",
      showCover: true,
      drawShadow: true,
      flippingTime: 900,
      usePortrait: mobile,
      mobileScrollSupport: false,
      autoSize: false,
      maxShadowOpacity: 0.42,
      swipeDistance: 30,
      disableFlipByClick: mobile,
    });

    pageFlip.loadFromHTML(pageEls);
    pageFlip.on("flip", () => updateNav(pageFlip));
    pageFlip.on("changeState", (e) => {
      flipLocked = e.data !== "read";
    });
    pageFlip.on("changeOrientation", () => {
      if (!flipLocked) scheduleLayoutUpdate();
    });

    prevBtn.onclick = () => pageFlip.flipPrev();
    nextBtn.onclick = () => pageFlip.flipNext();

    bookHost.onkeydown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        pageFlip.flipPrev();
      } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        pageFlip.flipNext();
      }
    };

    requestAnimationFrame(() => {
      pageFlip.update();
      updateNav(pageFlip);
    });
  };

  viewer.appendChild(bookShell);
  viewer.appendChild(
    el("div", { class: "bookControls archiveIssuuControls" }, [prevBtn, nextBtn])
  );

  wrap.appendChild(toolbar);
  wrap.appendChild(viewer);
  const result = options.frame ? wrapResearchJournalFrame(wrap) : wrap;

  requestAnimationFrame(() => {
    initPageFlip();
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => scheduleLayoutUpdate());
      resizeObserver.observe(bookShell);
    } else {
      window.addEventListener("resize", () => scheduleLayoutUpdate());
    }
  });

  return result;
}

function collectionWorkHref(workId) {
  return `#archive/collection?work=${encodeURIComponent(workId)}`;
}

function findCollectionWork(workId) {
  const items = Array.isArray(archiveData().collection?.items) ? archiveData().collection.items : [];
  return items.find((item) => item.id === workId) || null;
}

function renderArchiveCollectionWorkCard(work, index = 0) {
  return renderArchiveLinkedWorkCard(work, { framed: true, index });
}

function renderArchiveCollectionDetail(work) {
  const root = el("div", { class: "archivePage archiveCollectionDetailPage" });
  const nav = el("nav", { class: "archiveCollectionNav", "aria-label": "典藏導覽" });
  nav.appendChild(
    el("a", {
      class: "archiveCollectionBack",
      href: archiveCollectionNavHref(),
      text: "← 返回典藏列表",
      onclick: (e) => {
        e.preventDefault();
        navigateFromHref(archiveCollectionNavHref());
      },
    })
  );
  const source = work.source;
  if (source?.href && source?.label) {
    nav.appendChild(
      el("a", {
        class: "archiveCollectionBack archiveCollectionSource",
        href: source.href,
        text: `← 返回${source.label}`,
        onclick: (e) => {
          e.preventDefault();
          navigateFromHref(source.href);
        },
      })
    );
  }
  root.appendChild(nav);

  const imageIndex = findCollectionWork(work.id)
    ? (archiveData().collection?.items || []).findIndex((item) => item.id === work.id)
    : 0;
  const heroSrc = archiveWorkImageSrc(work, Math.max(0, imageIndex));

  root.appendChild(
    el("div", { class: "archiveCollectionHero" }, [
      el("img", {
        src: heroSrc,
        alt: work.image?.alt || work.title || "典藏作品",
        loading: "lazy",
      }),
    ])
  );
  root.appendChild(el("h1", { class: "archiveCollectionDetailTitle", text: work.title || "典藏作品" }));

  const metaParts = [work.author, work.year, work.materials, work.dimensions].filter(Boolean);
  if (metaParts.length) {
    root.appendChild(el("p", { class: "archiveCollectionMeta", text: metaParts.join(" · ") }));
  }
  if (work.accessionNo) {
    root.appendChild(el("p", { class: "archiveCollectionAccession", text: `典藏編號：${work.accessionNo}` }));
  }
  if (work.body) {
    root.appendChild(el("div", { class: "archiveCollectionBody", text: work.body }));
  }

  const gallery = Array.isArray(work.images) ? work.images.filter((img) => img?.src) : [];
  if (gallery.length) {
    const grid = el("div", { class: "archiveCollectionGallery" });
    gallery.forEach((img, i) => {
      grid.appendChild(
        el("figure", { class: "archiveCollectionGalleryItem" }, [
          el("img", { src: img.src, alt: img.alt || `${work.title || "作品"} 圖 ${i + 1}`, loading: "lazy" }),
        ])
      );
    });
    root.appendChild(grid);
  }

  return root;
}

function renderArchiveCollection() {
  const params = getHashQuery();
  const workId = (params.get("work") || "").trim();
  if (workId) {
    const work = findCollectionWork(workId);
    if (work) return renderArchiveCollectionDetail(work);
    const root = el("div", { class: "archivePage archiveCollectionPage" });
    root.appendChild(renderArchiveBackToCollection());
    root.appendChild(el("p", { class: "archiveIntroBody", text: "找不到這件典藏作品。" }));
    return root;
  }

  if (!isArchiveCollectionHomeEnabled()) {
    navigateFromHref(`#archive/${archiveCollectionLandingSection()}`);
    return el("div");
  }

  return renderArchiveCollectionHome();
}

function resolveResearchJournals() {
  const archiveResearch = archiveData().research || {};
  const configured = Array.isArray(archiveResearch.journals) ? archiveResearch.journals : [];
  if (configured.length) return configured;

  const legacy = Array.isArray(window.SITE_CONTENT?.research?.artistJournals)
    ? window.SITE_CONTENT.research.artistJournals
    : [];
  return legacy.map((journal, index) => ({
    id: journal.id || `journal-${index + 1}`,
    title: journal.title || `${journal.artist || "藝術家"} 日誌`,
    artist: journal.artist || "藝術家",
    cover: journal.cover || null,
    pages: journal.pages || [],
  }));
}

function researchBookCoverSrc(journal, index = 0) {
  const src = journal?.cover?.src || "";
  if (src && !archiveIsPlaceholderImage(src)) return src;
  const label = String(journal?.title || journal?.artist || `日誌 ${index + 1}`).trim();
  const shortLabel = label.length > 8 ? `${label.slice(0, 7)}…` : label;
  const color =
    journal?.coverColor ||
    ARCHIVE_TEACHER_AVATAR_COLORS[index % ARCHIVE_TEACHER_AVATAR_COLORS.length];
  return archiveColorBlockSrc(shortLabel, color, "日誌");
}

function resolveResearchJournalPages(journal) {
  return resolveJournalSpreads(journal, journal?.artist || journal?.title || "藝術家");
}

function closeArchiveModal(overlay) {
  if (!overlay) return;
  overlay.classList.add("archiveModalOverlay--closing");
  window.setTimeout(() => overlay.remove(), 180);
}

function openArchiveModal(options = {}) {
  const existing = document.querySelector(".archiveModalOverlay");
  if (existing) existing.remove();

  const overlay = el("div", {
    class: "archiveModalOverlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": options.title || "對話視窗",
  });
  const backdrop = el("button", {
    class: "archiveModalBackdrop",
    type: "button",
    "aria-label": "關閉",
    onclick: () => closeArchiveModal(overlay),
  });
  const panelClass = `archiveModalPanel${options.wide ? " archiveModalPanel--wide" : ""}${
    options.flipbook ? " archiveModalPanel--flipbook" : ""
  }${options.preview ? " archiveModalPanel--preview" : ""}${
    options.lightbox ? " archiveModalPanel--lightbox" : ""
  }`;
  const panel = el("div", { class: panelClass });
  const closeBtn = el("button", {
    class: "archiveModalClose",
    type: "button",
    text: "×",
    "aria-label": "關閉",
    onclick: () => closeArchiveModal(overlay),
  });

  panel.appendChild(closeBtn);
  if (options.title) {
    panel.appendChild(el("h2", { class: "archiveModalTitle", text: options.title }));
  }
  const body = el("div", { class: "archiveModalBody" });
  if (options.content) body.appendChild(options.content);
  panel.appendChild(body);
  overlay.appendChild(backdrop);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const onKeydown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeArchiveModal(overlay);
    }
  };
  document.addEventListener("keydown", onKeydown, { once: true });
  requestAnimationFrame(() => overlay.classList.add("archiveModalOverlay--open"));
  return overlay;
}

function openResearchJournalModal(journal, index = 0) {
  const pages = resolveResearchJournalPages(journal);
  const flipbook = renderArchiveIssuuFlipbook(pages, `research-journal-${journal.id || index}`);
  openArchiveModal({
    title: journal.title || journal.artist || "藝術家日誌",
    content: flipbook,
    flipbook: true,
    wide: true,
  });
}

function openResearchAccessModal(bookshelf = {}) {
  const message =
    bookshelf.accessMessage ||
    "若是要閱讀，請與網頁負責人要求存取權。";
  const content = el("div", { class: "archiveResearchAccessDialog" }, [
    el("p", { class: "archiveResearchAccessText", text: message }),
  ]);
  openArchiveModal({
    title: bookshelf.accessTitle || "索取閱讀權限",
    content,
  });
}

function renderResearchBookCard(journal, index) {
  const title = journal.title || journal.artist || `日誌 ${index + 1}`;
  const coverSrc = researchBookCoverSrc(journal, index);
  const coverAlt = journal.cover?.alt || title;

  return el(
    "button",
    {
      class: "archiveResearchBookCard",
      type: "button",
      "aria-label": `開啟 ${title}`,
      onclick: () => openResearchJournalModal(journal, index),
    },
    [
      el("div", { class: "archiveResearchBookCover" }, [
        el("img", { src: coverSrc, alt: coverAlt, loading: "lazy" }),
      ]),
      el("span", { class: "archiveResearchBookTitle", text: title }),
    ]
  );
}

function flattenShelfBooks(list) {
  if (!Array.isArray(list)) return [];
  const flat = [];
  for (const item of list) {
    if (Array.isArray(item)) flat.push(...flattenShelfBooks(item));
    else if (item && typeof item === "object") flat.push(item);
  }
  return flat;
}

function researchHotspotStyle(hs) {
  const parts = [];
  if (hs?.left) parts.push(`left:${hs.left}`);
  if (hs?.top) parts.push(`top:${hs.top}`);
  if (hs?.width) parts.push(`width:${hs.width}`);
  if (hs?.height) parts.push(`height:${hs.height}`);
  const rotate = parseFloat(String(hs?.rotate ?? "").replace("deg", ""));
  if (!Number.isNaN(rotate) && rotate !== 0) {
    parts.push(`transform:rotate(${rotate}deg)`);
    parts.push("transform-origin:center bottom");
  }
  return parts.join(";");
}

function resolveResearchShelfBooks(bookshelf = {}) {
  const configured = flattenShelfBooks(bookshelf.shelfBooks);
  const area = bookshelf.booksArea || {};
  const defaultTop = area.top || "15.2%";
  const defaultHeight = area.height || "67%";

  if (configured.length) {
    return configured
      .map((book) => {
        const hs = book.hotspot || {};
        const hotspot = {
          top: hs.top || defaultTop,
          height: hs.height || defaultHeight,
          left: hs.left,
          width: hs.width,
        };
        const rotate = parseFloat(String(hs.rotate ?? "").replace("deg", ""));
        if (!Number.isNaN(rotate) && rotate !== 0) hotspot.rotate = rotate;
        return { ...book, hotspot };
      })
      .filter((book) => book.hotspot?.left && book.hotspot?.width);
  }

  return RESEARCH_SHELF_BOOK_HOTSPOTS.map((book) => ({
    id: book.id,
    hotspot: {
      left: book.left,
      top: defaultTop,
      width: book.width,
      height: defaultHeight,
    },
  }));
}

function isResearchHotspotDebug() {
  try {
    return new URLSearchParams(location.search || "").get("hotspotDebug") === "1";
  } catch {
    return false;
  }
}

function renderResearchBookshelf(bookshelf = {}, options = {}) {
  const {
    tabYears = RESEARCH_SHELF_TAB_YEARS,
    currentYear = "",
    teachers = [],
    teachersData,
  } = options;
  const image = bookshelf.image || {};
  const imgSrc = image.src || JOURNAL_BOOKSHELF;
  const shelfBooks = resolveResearchShelfBooks(bookshelf);
  const hotspotDebug = isResearchHotspotDebug();
  const hotspotStyle = researchHotspotStyle;

  const yearTabs = el("div", {
    class: "archiveResearchBookshelfYearTabs",
    role: "tablist",
    "aria-label": "年份選擇",
  });
  tabYears.forEach((y) => {
    yearTabs.appendChild(
      el("button", {
        class: `archiveResearchBookshelfYearTab${y === currentYear ? " archiveResearchBookshelfYearTab--active" : ""}`,
        type: "button",
        role: "tab",
        text: y,
        "aria-selected": y === currentYear ? "true" : "false",
        onclick: () => navigateFromHref(archiveTeacherNavHref(y, "", teachersData, "research")),
      })
    );
  });

  const bookHotspots = el(
    "div",
    { class: "archiveResearchBookshelfHotspots", "aria-label": "書櫃書本" },
    shelfBooks.map((book, index) => {
      const hs = book.hotspot || {};
      const teacher = teachers[index] || null;
      const label = teacher?.name || book.label || `書本 ${index + 1}`;
      return el("button", {
        class: `archiveResearchBookshelfHotspot${teacher ? " archiveResearchBookshelfHotspot--linked" : ""}${hotspotDebug ? " archiveResearchBookshelfHotspot--debug" : ""}`,
        type: "button",
        style: hotspotStyle(hs),
        "aria-label": teacher ? `開啟 ${label} 日誌` : label,
        title: label,
        onclick: () => {
          if (teacher) {
            navigateFromHref(
              archiveTeacherNavHref(currentYear, teacher.id, teachersData, "research")
            );
            return;
          }
          openResearchAccessModal(bookshelf);
        },
      });
    })
  );

  const stage = el("div", {
    class: `archiveResearchBookshelfStage${hotspotDebug ? " archiveResearchBookshelfStage--debug" : ""}`,
  }, [
    el("img", {
      class: "archiveResearchBookshelfImg",
      src: imgSrc,
      alt: image.alt || "書櫃",
      loading: "lazy",
    }),
    bookHotspots,
    yearTabs,
  ]);

  return el("section", { class: "archiveResearchBookshelf" }, [
    hotspotDebug
      ? el("p", {
          class: "archiveResearchHotspotDebugBanner",
          text: "熱區除錯模式 · 開啟 admin/bookshelf-hotspots.html 調整座標",
        })
      : null,
    stage,
  ]);
}

function renderArchiveResearch() {
  const research = archiveData().research || {};
  const teachersData = archiveData().teachers || {};
  const bookshelf = research.bookshelf || {};
  const tabYears =
    Array.isArray(bookshelf.tabYears) && bookshelf.tabYears.length
      ? bookshelf.tabYears
      : RESEARCH_SHELF_TAB_YEARS;
  const params = getHashQuery();
  let year =
    params.get("year") ||
    bookshelf.defaultYear ||
    teachersData.defaultYear ||
    tabYears[tabYears.length - 1] ||
    "2027";
  if (!tabYears.includes(year)) year = tabYears[tabYears.length - 1];
  const yearPack = (teachersData.byYear || {})[year] || {};
  const teachers = Array.isArray(yearPack.teachers) ? yearPack.teachers : [];
  const selectedId = params.get("teacher") || (teachers[0] && teachers[0].id) || "";
  const selected = teachers.find((t) => t.id === selectedId) || teachers[0] || null;
  const journal = selected ? (teachersData.journals || {})[selected.id] : null;
  const journalSpreads = resolveJournalSpreads(journal, selected?.name);

  const root = el("div", { class: "archivePage archiveResearchPage archiveResearchPage--journal" });
  root.appendChild(el("h1", { class: "archivePageTitle", text: research.heading || "研究" }));

  const journalSec = el("section", { class: "archiveResearchJournal" });
  journalSec.appendChild(
    el("h2", { class: "archiveResearchJournalTitle", text: research.journalTitle || "藝術家教師日誌" })
  );
  journalSec.appendChild(
    renderArchiveIssuuFlipbook(
      journalSpreads,
      `research-journal-${year}-${selected?.id || "default"}`,
      { frame: true }
    )
  );
  journalSec.appendChild(
    el("p", {
      class: "archiveResearchJournalTeacherName",
      text: selected?.name ? `藝術家教師 ${selected.name}` : "藝術家教師名字",
    })
  );
  root.appendChild(journalSec);

  root.appendChild(
    renderArchiveTeacherPicker(teachers, selected, year, tabYears, teachersData, {
      section: "research",
      notebookIcon: true,
      hideTimeline: true,
    })
  );

  root.appendChild(
    renderResearchBookshelf(bookshelf, {
      tabYears,
      currentYear: year,
      teachers,
      teachersData,
    })
  );

  return root;
}

function renderArchivePlaceholderPage(title, heading, body, items) {
  const root = el("div", { class: "archivePage" });
  root.appendChild(el("h1", { class: "archivePageTitle", text: title }));
  if (heading) root.appendChild(el("h2", { class: "archiveSubTitle", text: heading }));
  if (body) root.appendChild(el("p", { class: "archiveIntroBody", text: body }));

  const list = Array.isArray(items) ? items : [];
  if (list.length) {
    const grid = el("div", { class: "archiveWorkGrid" });
    list.forEach((item) => grid.appendChild(renderArchiveWorkCard(item)));
    root.appendChild(grid);
  }
  return root;
}

function classicsSectionToArchive(section) {
  const collectionTarget = isArchiveCollectionHomeEnabled()
    ? "collection"
    : archiveCollectionLandingSection();
  const map = {
    years: "exhibitions",
    year: "exhibitions",
    practice: collectionTarget,
    media: "photos",
    index: collectionTarget,
  };
  return map[section] || section || collectionTarget;
}

function renderArchivePage(main, route) {
  let section = normalizeSection(route.section || "collection");
  const params = getHashQuery();

  if (section === "year") {
    const year = params.get("year");
    navigateFromHref(`#archive/exhibitions${year ? `?year=${encodeURIComponent(year)}` : ""}`);
    return;
  }

  if (section === "index") {
    const raw = (location.hash || "").replace(/^#/, "");
    const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
    navigateFromHref(`${archiveCollectionNavHref()}${q}`);
    return;
  }

  if (section === "practice" || section === "media") {
    const raw = (location.hash || "").replace(/^#/, "");
    const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
    const target =
      section === "media"
        ? "videos"
        : isArchiveCollectionHomeEnabled()
          ? "collection"
          : archiveCollectionLandingSection();
    navigateFromHref(`#archive/${target}${q}`);
    return;
  }

  let content;
  let activeSubnav = "";
  let activeNav = section;
  let contentClass = "";
  const collectionSections = new Set(["collection", "exhibitions", "photos", "videos"]);

  switch (section) {
    case "collection": {
      const workId = (params.get("work") || "").trim();
      if (!isArchiveCollectionHomeEnabled() && !workId) {
        navigateFromHref(`#archive/${archiveCollectionLandingSection()}`);
        return;
      }
      content = renderArchiveCollection();
      activeNav = "collection";
      if (!workId) contentClass = "innerContent--archiveHome";
      break;
    }
    case "exhibitions":
      content = renderArchiveExhibitions();
      activeNav = "collection";
      activeSubnav = "exhibitions";
      contentClass = "innerContent--pastWebsites";
      break;
    case "photos":
      content = renderArchivePhotos();
      activeNav = "collection";
      activeSubnav = "photos";
      contentClass = "innerContent--archiveMedia";
      break;
    case "videos":
      content = renderArchiveVideos();
      activeNav = "collection";
      activeSubnav = "videos";
      contentClass = "innerContent--archiveMedia";
      break;
    case "teachers":
      content = renderArchiveTeachers();
      break;
    case "bibliography":
      content = renderArchiveBibliography();
      contentClass = "innerContent--archiveBibliography";
      break;
    case "research":
      content = renderArchiveResearch();
      contentClass = "innerContent--archiveResearchJournal";
      break;
    case "performances":
      content = renderArchivePerformances();
      contentClass = "innerContent--archivePerformances";
      break;
    default:
      content = el("div");
  }

  main.innerHTML = "";
  const shell = wrapInnerPage(content, {
    activeNav,
    activeSubnav,
    showSubnav: collectionSections.has(section),
  });
  main.appendChild(shell);
  if (contentClass) {
    shell.querySelector(".innerContent")?.classList.add(contentClass);
  }
}
