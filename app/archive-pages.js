/* 義家藝館檔案庫 — 靜態版型（素材由 site-content.json 的 archive 區塊填入） */

const ARCHIVE_PLACEHOLDER_PHOTO = "./assets/images/placeholder-photo.svg";
const ARCHIVE_PLACEHOLDER_BOOK = "./assets/images/placeholder-book.svg";
const ARCHIVE_PLACEHOLDER_AVATAR = "./app/house.svg";
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
  return Array.isArray(window.SITE_CONTENT?.archiveSubnav)
    ? window.SITE_CONTENT.archiveSubnav
    : [
        { id: "index", label: "檔案庫首頁", href: "#archive/index" },
        { id: "exhibitions", label: "歷屆展覽回顧", href: "#archive/exhibitions" },
        { id: "practice", label: "藝術實踐", href: "#archive/practice" },
        { id: "media", label: "影音", href: "#archive/media" },
        { id: "collection", label: "典藏", href: "#archive/collection" },
        { id: "research", label: "研究", href: "#archive/research" },
        { id: "teachers", label: "藝術家教師日誌", href: "#archive/teachers" },
        { id: "bibliography", label: "參考書目", href: "#archive/bibliography" },
      ];
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

function renderArchiveExhibitions() {
  const data = archiveData();
  const years = Array.isArray(data.exhibitionYears) ? data.exhibitionYears : ["2026"];
  const params = getHashQuery();
  const year = params.get("year") || years[0] || "2026";
  const byYear = data.exhibitionsByYear || {};
  const pack = resolveExhibitionYearPack(byYear, year);

  const root = el("div", { class: "archivePage archiveExhibitionsPage" });
  root.appendChild(el("h1", { class: "archivePageTitle", text: "歷屆展覽回顧" }));
  root.appendChild(renderArchiveYearTabs(years, year, "#archive/exhibitions"));
  root.appendChild(renderArchiveExhibitionHero(pack, year));

  root.appendChild(
    el(
      "nav",
      { class: "archiveIntroNav archiveIntroNav--triple", "aria-label": "展覽相關連結" },
      pack.quickLinks.map((link) => renderArchiveIntroNavLink(link))
    )
  );

  const worksSec = el("section", { class: "archiveBlock archiveExhibitionsWorks" });
  worksSec.appendChild(renderArchiveSectionTitle("作品"));
  const grid = el("div", { class: "archiveWorkGrid archiveWorkGrid--exhibitions" });
  pack.works.forEach((work, index) =>
    grid.appendChild(renderArchiveLinkedWorkCard(work, { exhibitions: true, index }))
  );
  worksSec.appendChild(grid);
  root.appendChild(worksSec);

  const teachersSec = el("section", { class: "archiveBlock archiveExhibitionsTeachers" });
  teachersSec.appendChild(renderArchiveSectionTitle("藝術家教師"));
  teachersSec.appendChild(renderArchiveTeacherGrid(pack.teachers));
  root.appendChild(teachersSec);

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

function renderArchiveMediaGalleryItem(item, onSelect, isActive, index = 0) {
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

  const handleSelect = (e) => onSelect(item, e.currentTarget);

  if (isVideo && youtubeUrl) {
    return el(
      "a",
      {
        class: `archiveMediaGalleryItem archiveMediaGalleryItem--video${isActive ? " archiveMediaGalleryItem--active" : ""}`,
        href: youtubeUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        title: item.title || "在 YouTube 觀看",
        "aria-label": `${item.title || "影片"}（在 YouTube 觀看）`,
        onclick: (e) => {
          handleSelect(e);
          if (e.defaultPrevented || e.button !== 0) return;
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          window.open(youtubeUrl, "_blank", "noopener,noreferrer");
        },
      },
      inner
    );
  }

  return el(
    "button",
    {
      class: `archiveMediaGalleryItem${isActive ? " archiveMediaGalleryItem--active" : ""}`,
      type: "button",
      onclick: handleSelect,
    },
    inner
  );
}

function renderArchiveMedia() {
  const media = archiveData().media || {};
  const years = Array.isArray(media.years) ? media.years : ["2025"];
  const params = getHashQuery();
  const year = params.get("year") || years[0] || "2025";
  const query = (params.get("q") || "").trim().toLowerCase();
  const yearPack = resolveMediaYearPack(media, year);
  const featured =
    Array.isArray(media.featuredCarousel) && media.featuredCarousel.length
      ? media.featuredCarousel
      : yearPack.items.slice(0, 5);

  const root = el("div", { class: "archivePage archiveMediaPage" });
  root.appendChild(renderArchiveFeaturedCarousel(featured));

  const filters = el("div", { class: "archiveFilters archiveFilters--media" });
  const yearSel = el("select", { class: "archiveSelect", "aria-label": "年份選擇" });
  years.forEach((y) => yearSel.appendChild(el("option", { value: y, text: y })));
  yearSel.value = year;

  const searchInput = el("input", {
    class: "archiveSearchInput archiveSearchInput--practice",
    type: "search",
    placeholder: "關鍵字搜尋",
    "aria-label": "關鍵字搜尋",
    value: params.get("q") || "",
  });

  const applyFilters = () => {
    const q = new URLSearchParams({ year });
    if (searchInput.value.trim()) q.set("q", searchInput.value.trim());
    navigateFromHref(`#archive/media?${q.toString()}`);
  };

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });
  yearSel.addEventListener("change", applyFilters);

  filters.appendChild(el("div", { class: "archiveFiltersMediaLeft" }, [yearSel, searchInput]));
  root.appendChild(filters);

  const filtered = yearPack.items.filter((item) => {
    if (!query) return true;
    const hay = `${item.title || ""} ${item.caption || ""}`.toLowerCase();
    return hay.includes(query);
  });

  const recordSec = el("section", { class: "archiveMediaRecord" });
  recordSec.appendChild(el("h2", { class: "archiveMediaRecordTitle", text: yearPack.title }));

  const layout = el("div", { class: "archiveMediaRecordLayout" });
  const grid = el("div", { class: "archiveMediaGallery" });

  const overviewBox = el("div", { class: "archiveMediaSidebarBox archiveMediaSidebarBox--overview" }, [
    el("h3", { class: "archiveMediaSidebarLabel", text: "田野踏查概述" }),
    el("p", {
      class: "archiveMediaSidebarText",
      text:
        yearPack.overview ||
        "",
    }),
  ]);
  const captionBody = el("div", { class: "archiveMediaSidebarBody" }, [
    el("p", { class: "archiveMediaSidebarText", text: "點選左側縮圖以檢視說明。" }),
  ]);
  const captionBox = el("div", { class: "archiveMediaSidebarBox archiveMediaSidebarBox--caption" }, [
    el("h3", { class: "archiveMediaSidebarLabel", text: "影片說明" }),
    captionBody,
  ]);

  const selectItem = (item, activeEl) => {
    grid.querySelectorAll(".archiveMediaGalleryItem").forEach((node) => {
      node.classList.remove("archiveMediaGalleryItem--active");
    });
    if (activeEl) activeEl.classList.add("archiveMediaGalleryItem--active");

    const youtubeUrl = archiveMediaItemYoutubeUrl(item);
    const isVideo = archiveMediaItemIsVideo(item);
    captionBody.replaceChildren(
      el("p", { class: "archiveMediaSidebarText", text: item.caption || item.title || "" }),
      isVideo && youtubeUrl
        ? el(
            "a",
            {
              class: "archiveMediaYoutubeLink",
              href: youtubeUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              text: "在 YouTube 觀看",
            }
          )
        : null
    );
  };

  filtered.forEach((item, i) => {
    grid.appendChild(renderArchiveMediaGalleryItem(item, selectItem, i === 0, i));
  });
  if (filtered.length) {
    const firstEl = grid.querySelector(".archiveMediaGalleryItem");
    selectItem(filtered[0], firstEl);
  }

  layout.appendChild(grid);
  layout.appendChild(el("aside", { class: "archiveMediaSidebar" }, [overviewBox, captionBox]));
  recordSec.appendChild(layout);
  root.appendChild(recordSec);

  return root;
}

function renderArchiveBibliography() {
  const items = Array.isArray(archiveData().bibliography) ? archiveData().bibliography : [];
  const root = el("div", { class: "archivePage archiveBibliographyPage" });
  root.appendChild(el("h1", { class: "archivePageTitle", text: "推薦文本" }));

  const list = el("div", { class: "archiveBibliographyList" });
  items.forEach((book, i) => {
    list.appendChild(
      el("article", { class: "archiveBibliographyItem" }, [
        el("div", { class: "archiveBibliographyCover" }, [
          el("img", {
            src: book.cover?.src || ARCHIVE_PLACEHOLDER_BOOK,
            alt: book.cover?.alt || book.title || `書籍 ${i + 1}`,
            loading: "lazy",
          }),
        ]),
        el("div", { class: "archiveBibliographyText" }, [
          el("h2", { text: book.title || "" }),
          book.author ? el("p", { class: "archiveBibliographyMeta", text: book.author }) : null,
          el("p", { class: "archiveBibliographyDesc", text: book.description || "" }),
        ]),
      ])
    );
  });
  root.appendChild(list);
  return root;
}

function renderArchiveTeachers() {
  const teachersData = archiveData().teachers || {};
  const years = Array.isArray(teachersData.years) ? teachersData.years : ["2026"];
  const params = getHashQuery();
  const year = params.get("year") || teachersData.defaultYear || years[years.length - 1] || "2026";
  const yearPack = (teachersData.byYear || {})[year] || {};
  const teachers = Array.isArray(yearPack.teachers) ? yearPack.teachers : [];
  const selectedId = params.get("teacher") || (teachers[0] && teachers[0].id) || "";
  const selected = teachers.find((t) => t.id === selectedId) || teachers[0] || null;
  const journal = selected ? (teachersData.journals || {})[selected.id] : null;
  const journalPages = resolveJournalPages(journal, selected?.name);

  const root = el("div", { class: "archivePage archiveTeachersPage" });

  const journalSec = el("section", { class: "archiveTeachersJournal" });
  journalSec.appendChild(el("h2", { class: "archiveTeachersJournalTitle", text: "藝術家教師日誌" }));

  const journalLayout = el("div", { class: "archiveTeachersJournalLayout" });
  journalLayout.appendChild(renderArchiveTeacherProfile(selected));
  journalLayout.appendChild(
    renderArchiveIssuuFlipbook(
      journalPages,
      `archive-journal-${year}-${selected?.id || "default"}`
    )
  );
  journalSec.appendChild(journalLayout);
  root.appendChild(journalSec);

  root.appendChild(renderArchiveTeacherPicker(teachers, selected, year, years, teachersData));

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
      text: teacher.bio || "簡介……（請在 archive.teachers.byYear 填入教師簡介）",
    })
  );
  return aside;
}

function teacherPickerHref(year, teacherId, teachersData) {
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
  return `#archive/teachers?${q.toString()}`;
}

function renderArchiveTeacherPicker(teachers, selected, year, years, teachersData) {
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
    track.appendChild(
      el(
        "button",
        {
          class: `archiveTeachersCarouselItem${isActive ? " archiveTeachersCarouselItem--active" : ""}`,
          type: "button",
          "aria-pressed": isActive ? "true" : "false",
          onclick: () => navigateFromHref(teacherPickerHref(year, t.id, teachersData)),
        },
        [
          el("img", {
            class: "archiveTeachersCarouselAvatar",
            src: t.avatar?.src || ARCHIVE_PLACEHOLDER_AVATAR,
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
      if (prev) navigateFromHref(teacherPickerHref(year, prev.id, teachersData));
    });
    nextBtn.addEventListener("click", () => {
      const next = list[Math.min(list.length - 1, selectedIndex + 1)];
      if (next) navigateFromHref(teacherPickerHref(year, next.id, teachersData));
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

  section.appendChild(renderArchiveTeacherTimeline(years, year, selected?.id, teachersData));

  window.requestAnimationFrame(() => {
    const active = track.querySelector(".archiveTeachersCarouselItem--active");
    if (active) {
      active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  });

  return section;
}

function renderArchiveTeacherTimeline(years, year, teacherId, teachersData) {
  const bar = el("div", { class: "archiveTeachersTimeline", role: "tablist", "aria-label": "年份選擇" });
  years.forEach((y) => {
    bar.appendChild(
      el(
        "a",
        {
          class: `archiveTeachersTimelineYear${y === year ? " archiveTeachersTimelineYear--active" : ""}`,
          href: teacherPickerHref(y, teacherId, teachersData),
          role: "tab",
          "aria-selected": y === year ? "true" : "false",
          text: y,
          onclick: (e) => {
            e.preventDefault();
            navigateFromHref(teacherPickerHref(y, teacherId, teachersData));
          },
        }
      )
    );
  });
  return bar;
}

function appendFlipPageContent(node, page, pageNo, total) {
  node.style.backgroundColor = page?.color || "#fff";
  if (page?.image?.src) {
    node.appendChild(
      el("img", {
        class: "flipPageImage",
        src: page.image.src,
        alt: page.image.alt || page.title || `日誌第 ${pageNo} 頁`,
        loading: "lazy",
      })
    );
  } else {
    if (page?.title) node.appendChild(el("div", { class: "bookTitle", text: page.title }));
    if (page?.body) node.appendChild(el("div", { class: "bookBody", text: page.body }));
  }
  node.appendChild(el("div", { class: "bookPageNo", text: `${pageNo} / ${total}` }));
}

function fillFlipPage(node, page, pageNo, total) {
  node.innerHTML = "";
  appendFlipPageContent(node, page, pageNo, total);
}

function fillFlipSheet(node, frontPage, frontPageNo, backPage, backPageNo, total) {
  node.innerHTML = "";
  const front = el("div", { class: "flipSheetFace flipSheetFace--front" });
  const back = el("div", { class: "flipSheetFace flipSheetFace--back" });
  appendFlipPageContent(front, frontPage, frontPageNo, total);
  if (backPage) {
    appendFlipPageContent(back, backPage, backPageNo, total);
  } else {
    back.style.backgroundColor = frontPage?.color || "#f4f1ea";
  }
  node.appendChild(front);
  node.appendChild(back);
}

function buildPlaceholderJournalPages(teacherName) {
  const name = teacherName || "藝術家教師";
  const colors = ["#FFE4E1", "#FFF8DC", "#E0FFE0", "#E0F7FF", "#F3E5FF", "#FFF0E6"];
  return colors.map((color, i) => ({
    title: `日誌第 ${i + 1} 頁`,
    date: "",
    color,
    body: `${name}的教學日誌第 ${i + 1} 頁。\n\n此為翻頁展示用占位文字。請在 content/site-content.json → archive.teachers.journals 填入正式日誌，或改用逐頁 JPG 圖片。`,
  }));
}

function resolveJournalPages(journal, teacherName) {
  const colors = ["#FFE4E1", "#FFF8DC", "#E0FFE0", "#E0F7FF", "#F3E5FF", "#FFF0E6"];
  const minPages = 6;
  const name = teacherName || "藝術家教師";
  const existing = Array.isArray(journal?.pages) ? journal.pages.filter(Boolean) : [];

  if (existing.length >= 2) return existing;

  if (!existing.length) return buildPlaceholderJournalPages(name);

  const pages = [];
  for (let i = 0; i < minPages; i += 1) {
    if (i < existing.length) {
      pages.push({
        ...existing[i],
        color: existing[i].color || colors[i % colors.length],
      });
      continue;
    }
    pages.push({
      title: `日誌第 ${i + 1} 頁`,
      color: colors[i % colors.length],
      body: `${name}的教學日誌第 ${i + 1} 頁。\n\n此為翻頁展示用占位文字。請在 content/site-content.json → archive.teachers.journals 填入正式日誌，或改用逐頁 JPG 圖片。`,
    });
  }
  return pages;
}

function renderArchiveIssuuFlipbook(pages, id) {
  const list = Array.isArray(pages) && pages.length ? pages : buildPlaceholderJournalPages();
  const wrap = el("div", { class: "archiveTeachersViewer" });
  const viewer = el("div", {
    class: "archiveJournalWrap archiveJournalWrap--issuu flipBookWrap",
    id: id || "archive-journal",
  });
  const pageCounter = el("span", { class: "archiveIssuuPageNo", text: "" });
  const toolbar = el("div", { class: "archiveIssuuToolbar" }, [
    el("span", { class: "archiveIssuuHint", text: "點擊左頁上一頁 · 點擊右頁下一頁 · 方向鍵亦可翻頁" }),
    pageCounter,
    el("button", {
      class: "btn btnGhost archiveIssuuZoomBtn",
      type: "button",
      text: "放大檢視",
      onclick: () => viewer.classList.toggle("archiveJournalWrap--zoomed"),
    }),
  ]);

  const book = el("div", {
    class: "flipBook archiveFlipBook archiveFlipBook--issuu",
    role: "group",
    "aria-label": "教師日誌",
    tabindex: "0",
  });
  const pageLeft = el("div", { class: "flipPage flipPageLeft" });
  const pageFront = el("div", { class: "flipPage flipPageFront flipPageRight" });
  const pageBack = el("div", { class: "flipPage flipPageBack flipPageRight" });
  const prevBtn = el("button", {
    class: "btn btnGhost archiveIssuuNavBtn",
    type: "button",
    text: "‹ 上一頁",
  });
  const nextBtn = el("button", {
    class: "btn archiveIssuuNavBtn",
    type: "button",
    text: "下一頁 ›",
  });
  let idx = 0;
  const FLIP_MS = 1100;
  const FLIP_ANGLE = "-180deg";

  const pageLabel = (pageIndex) => {
    const leftNo = pageIndex + 1;
    const rightNo = Math.min(list.length, pageIndex + 2);
    return leftNo === rightNo ? `${leftNo} / ${list.length}` : `${leftNo}–${rightNo} / ${list.length}`;
  };

  const sync = () => {
    const left = list[idx];
    const right = list[Math.min(list.length - 1, idx + 1)] || left;
    const under = list[Math.min(list.length - 1, idx + 2)] || right;
    fillFlipPage(pageLeft, left, idx + 1, list.length);
    fillFlipSheet(
      pageFront,
      right,
      Math.min(list.length, idx + 2),
      under,
      Math.min(list.length, idx + 3),
      list.length
    );
    fillFlipPage(pageBack, under, Math.min(list.length, idx + 3), list.length);
    book.style.backgroundColor = right?.color || "#f5f5f5";
    pageCounter.textContent = pageLabel(idx);
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx >= list.length - 1;
  };

  const resetPageFront = () => {
    pageFront.style.transition = "none";
    pageFront.style.transform = "translateZ(2px) rotateY(0deg)";
    pageFront.style.transformOrigin = "left center";
    void pageFront.offsetWidth;
    pageFront.style.removeProperty("transition");
    pageFront.style.removeProperty("transform");
    pageFront.style.removeProperty("transform-origin");
  };

  const flip = (dir) => {
    if (dir > 0 && idx >= list.length - 1) return;
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
      const newRight = list[Math.min(list.length - 1, idx + 1)] || list[idx];
      const oldRight = list[Math.min(list.length - 1, leavingIdx + 1)] || list[leavingIdx];
      fillFlipPage(pageLeft, list[idx], idx + 1, list.length);
      fillFlipSheet(
        pageFront,
        newRight,
        Math.min(list.length, idx + 2),
        oldRight,
        Math.min(list.length, leavingIdx + 2),
        list.length
      );
      fillFlipPage(pageBack, oldRight, Math.min(list.length, leavingIdx + 2), list.length);
      book.style.backgroundColor = newRight?.color || "#f5f5f5";
      pageFront.style.transition = "none";
      pageFront.style.transformOrigin = "left center";
      pageFront.style.transform = `translateZ(2px) rotateY(${FLIP_ANGLE})`;
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
      if (dir > 0) idx = Math.min(list.length - 1, idx + 1);
      sync();
      resetPageFront();
      book.classList.remove("isFlipping", "flipDirNext", "flipDirPrev");
    }, FLIP_MS);
  };

  book.addEventListener("click", (e) => {
    if (book.classList.contains("isFlipping")) return;
    const rect = book.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(1, rect.width);
    if (x < 0.5) flip(-1);
    else flip(1);
  });

  book.addEventListener("mousemove", (e) => {
    if (book.classList.contains("isFlipping")) return;
    const rect = book.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(1, rect.width);
    book.classList.toggle("clickZoneLeft", x < 0.5);
    book.classList.toggle("clickZoneRight", x >= 0.5);
  });
  book.addEventListener("mouseleave", () => {
    book.classList.remove("clickZoneLeft", "clickZoneRight");
  });

  book.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      flip(-1);
    } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      flip(1);
    }
  });

  prevBtn.addEventListener("click", () => flip(-1));
  nextBtn.addEventListener("click", () => flip(1));

  book.appendChild(pageLeft);
  book.appendChild(pageBack);
  book.appendChild(pageFront);
  sync();

  viewer.appendChild(book);
  viewer.appendChild(
    el("div", { class: "bookControls archiveIssuuControls" }, [prevBtn, nextBtn])
  );

  wrap.appendChild(toolbar);
  wrap.appendChild(viewer);
  return wrap;
}

function renderArchiveJournalFlipbook(pages, id) {
  const wrap = el("div", { class: "archiveJournalWrap flipBookWrap", id: id || "archive-journal" });
  const book = el("div", { class: "flipBook archiveFlipBook", role: "group", "aria-label": "教師日誌" });
  const pageFront = el("div", { class: "flipPage flipPageFront" });
  const pageBack = el("div", { class: "flipPage flipPageBack" });
  let idx = 0;
  const FLIP_MS = 1200;

  const renderPage = (node, p, showNo) => {
    fillFlipPage(node, p, showNo, pages.length);
  };

  const sync = () => {
    const p1 = pages[idx];
    const p2 = pages[Math.min(pages.length - 1, idx + 1)] || p1;
    renderPage(pageFront, p1, idx + 1);
    renderPage(pageBack, p2, Math.min(pages.length, idx + 2));
    book.style.backgroundColor = p2.color || "#fff";
  };

  const flip = (dir) => {
    if (dir > 0 && idx >= pages.length - 1) return;
    if (dir < 0 && idx <= 0) return;
    if (book.classList.contains("isFlipping")) return;
    book.classList.add(dir > 0 ? "flipDirNext" : "flipDirPrev", "isFlipping");
    window.setTimeout(() => {
      idx = Math.max(0, Math.min(pages.length - 1, idx + dir));
      sync();
      book.classList.remove("isFlipping", "flipDirNext", "flipDirPrev");
      pageFront.style.transform = "rotateY(0deg)";
    }, FLIP_MS);
  };

  book.addEventListener("click", (e) => {
    if (book.classList.contains("isFlipping")) return;
    const rect = book.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(1, rect.width);
    if (x < 0.46) flip(-1);
    else if (x > 0.54) flip(1);
  });

  book.appendChild(pageBack);
  book.appendChild(pageFront);
  sync();

  wrap.appendChild(book);
  wrap.appendChild(
    el("div", { class: "bookControls" }, [
      el("button", { class: "btn btnGhost", type: "button", text: "上一頁", onclick: () => flip(-1) }),
      el("button", { class: "btn", type: "button", text: "下一頁", onclick: () => flip(1) }),
    ])
  );
  return wrap;
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
      href: "#archive/collection",
      text: "← 返回典藏列表",
      onclick: (e) => {
        e.preventDefault();
        navigateFromHref("#archive/collection");
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
  const collection = archiveData().collection || {};
  const params = getHashQuery();
  const workId = (params.get("work") || "").trim();
  if (workId) {
    const work = findCollectionWork(workId);
    if (work) return renderArchiveCollectionDetail(work);
  }

  const root = el("div", { class: "archivePage archiveCollectionPage" });
  root.appendChild(el("h1", { class: "archivePageTitle", text: "典藏" }));
  if (collection.heading) root.appendChild(el("h2", { class: "archiveSubTitle", text: collection.heading }));
  if (collection.body) root.appendChild(el("p", { class: "archiveIntroBody", text: collection.body }));

  const items = Array.isArray(collection.items) ? collection.items : [];
  if (workId && !findCollectionWork(workId)) {
    root.appendChild(el("p", { class: "archiveIntroBody", text: "找不到這件典藏作品。" }));
  }

  if (items.length) {
    const grid = el("div", { class: "archiveWorkGrid archiveWorkGrid--collection" });
    items.forEach((item, index) => grid.appendChild(renderArchiveCollectionWorkCard(item, index)));
    root.appendChild(grid);
  }

  return root;
}

function renderArchiveResearch() {
  const research = archiveData().research || {};
  return renderArchivePlaceholderPage("研究", research.heading, research.body, research.items);
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
  const map = {
    years: "exhibitions",
    year: "exhibitions",
    practice: "practice",
    media: "media",
    index: "index",
  };
  return map[section] || section || "index";
}

function renderArchivePage(main, route) {
  let section = normalizeSection(route.section || "index");
  const params = getHashQuery();

  if (section === "year") {
    const year = params.get("year");
    navigateFromHref(`#archive/exhibitions${year ? `?year=${encodeURIComponent(year)}` : ""}`);
    return;
  }

  let content;
  let activeSubnav = section;

  switch (section) {
    case "index":
      content = renderArchiveHome();
      activeSubnav = "index";
      break;
    case "exhibitions":
      content = renderArchiveExhibitions();
      break;
    case "practice":
      content = renderArchivePractice();
      break;
    case "media":
      content = renderArchiveMedia();
      break;
    case "teachers":
      content = renderArchiveTeachers();
      break;
    case "bibliography":
      content = renderArchiveBibliography();
      break;
    case "collection":
      content = renderArchiveCollection();
      break;
    case "research":
      content = renderArchiveResearch();
      break;
    default:
      content = el("div");
  }

  main.innerHTML = "";
  const shell = wrapInnerPage(content, {
    activeNav: "archive",
    activeSubnav,
    showSubnav: true,
  });
  main.appendChild(shell);
  const innerContent = shell.querySelector(".innerContent");
  if (section === "index") {
    innerContent?.classList.add("innerContent--archiveHome");
  }
  if (section === "media") {
    innerContent?.classList.add("innerContent--archiveMedia");
  }
}
