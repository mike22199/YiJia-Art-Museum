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
        { id: "collection", label: "典藏", href: "#archive/collection" },
        { id: "research", label: "研究", href: "#archive/research" },
        { id: "performances", label: "最新展演", href: "#archive/performances" },
        { id: "teachers", label: "藝術家教師", href: "#archive/teachers" },
        { id: "bibliography", label: "延伸閱讀", href: "#archive/bibliography" },
      ];
}

const ARCHIVE_COLLECTION_SUBSECTIONS = new Set(["exhibitions", "photos", "videos"]);

function renderArchiveBackToCollection(label = "返回典藏") {
  return el("nav", { class: "archiveCollectionNav", "aria-label": "典藏導覽" }, [
    el("a", {
      class: "archiveCollectionBack",
      href: "#archive/collection",
      text: `← ${label}`,
      onclick: (e) => {
        e.preventDefault();
        navigateFromHref("#archive/collection");
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
      title: staticImagesPreview.title || "靜態影像",
      moreHref: staticImagesPreview.moreHref || "#archive/photos",
      moreLabel: staticImagesPreview.moreLabel || "了解更多＞",
      items:
        Array.isArray(staticImagesPreview.items) && staticImagesPreview.items.length
          ? staticImagesPreview.items
          : legacy.featuredMedia || [],
    },
    dynamicImagesPreview: {
      title: dynamicImagesPreview.title || "動態影像",
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

function renderArchiveExhibitions() {
  const items = resolvePastExhibitionsList();
  const root = el("div", { class: "archivePage archiveExhibitionsPage" });
  root.appendChild(renderArchiveBackToCollection());
  root.appendChild(el("h1", { class: "archivePageTitle", text: "歷屆展覽" }));

  const list = el("div", { class: "archiveExhibitionBannerList" });
  items.forEach((item, index) => list.appendChild(renderArchiveExhibitionBanner(item, index)));
  root.appendChild(list);

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
  const mediaType = options.mediaType || "all";
  const pageTitle = options.pageTitle || "影音";
  const recordTitleSuffix = mediaType === "photo" ? "靜態影像" : mediaType === "video" ? "動態影像" : "";
  const captionLabel = mediaType === "video" ? "影片說明" : "內容說明";
  const baseHref = options.baseHref || "#archive/media";

  const media = archiveData().media || {};
  const years = Array.isArray(media.years) ? media.years : ["2025"];
  const params = getHashQuery();
  const year = params.get("year") || years[0] || "2025";
  const query = (params.get("q") || "").trim().toLowerCase();
  const yearPack = resolveMediaYearPack(media, year);
  const typeItems = resolveMediaItemsByType(media, year, mediaType);
  const featured =
    Array.isArray(media.featuredCarousel) && media.featuredCarousel.length
      ? media.featuredCarousel.filter((slide) => {
          if (mediaType === "photo") return !archiveMediaItemIsVideo(slide);
          if (mediaType === "video") return archiveMediaItemIsVideo(slide);
          return true;
        })
      : typeItems.slice(0, 5);

  const root = el("div", { class: "archivePage archiveMediaPage" });
  root.appendChild(renderArchiveBackToCollection());
  root.appendChild(el("h1", { class: "archivePageTitle", text: pageTitle }));
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
    navigateFromHref(`${baseHref}?${q.toString()}`);
  };

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilters();
  });
  yearSel.addEventListener("change", applyFilters);

  filters.appendChild(el("div", { class: "archiveFiltersMediaLeft" }, [yearSel, searchInput]));
  root.appendChild(filters);

  const filtered = typeItems.filter((item) => {
    if (!query) return true;
    const hay = `${item.title || ""} ${item.caption || ""}`.toLowerCase();
    return hay.includes(query);
  });

  const recordSec = el("section", { class: "archiveMediaRecord" });
  const recordTitle = recordTitleSuffix
    ? `${year} ${recordTitleSuffix}`
    : yearPack.title;
  recordSec.appendChild(el("h2", { class: "archiveMediaRecordTitle", text: recordTitle }));

  const layout = el("div", { class: "archiveMediaRecordLayout" });
  const grid = el("div", { class: "archiveMediaGallery" });

  const overviewBox = el("div", { class: "archiveMediaSidebarBox archiveMediaSidebarBox--overview" }, [
    el("h3", { class: "archiveMediaSidebarLabel", text: "田野踏查概述" }),
    el("p", {
      class: "archiveMediaSidebarText",
      text: yearPack.overview || "",
    }),
  ]);
  const captionBody = el("div", { class: "archiveMediaSidebarBody" }, [
    el("p", { class: "archiveMediaSidebarText", text: "點選左側縮圖以檢視說明。" }),
  ]);
  const captionBox = el("div", { class: "archiveMediaSidebarBox archiveMediaSidebarBox--caption" }, [
    el("h3", { class: "archiveMediaSidebarLabel", text: captionLabel }),
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

function renderArchivePhotos() {
  return renderArchiveMediaPage({
    mediaType: "photo",
    pageTitle: "靜態影像",
    baseHref: "#archive/photos",
  });
}

function renderArchiveVideos() {
  return renderArchiveMediaPage({
    mediaType: "video",
    pageTitle: "動態影像",
    baseHref: "#archive/videos",
  });
}

function renderArchiveMedia() {
  return renderArchiveMediaPage({
    mediaType: "all",
    pageTitle: "影音",
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
  const meta = bibliographyMetaLine(book);

  const textChildren = [
    el("h2", { class: "archiveBibliographyTitle", text: book.title || "" }),
    meta ? el("p", { class: "archiveBibliographyMeta", text: meta }) : null,
    book.description ? el("p", { class: "archiveBibliographyDesc", text: book.description }) : null,
    isInteractive
      ? el("span", { class: "archiveBibliographyAction", text: `${action.label} ›` })
      : null,
  ];

  const inner = [
    el("div", { class: "archiveBibliographyCover" }, [
      el("img", {
        src: bibliographyBookCoverSrc(book, index),
        alt: book.cover?.alt || book.title || `書籍 ${index + 1}`,
        loading: "lazy",
      }),
    ]),
    el("div", { class: "archiveBibliographyText" }, textChildren),
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

function renderArchiveBibliography() {
  const data = archiveData();
  const configured = Array.isArray(data.bibliography) ? data.bibliography : [];
  const legacy = Array.isArray(window.SITE_CONTENT?.research?.bibliography)
    ? window.SITE_CONTENT.research.bibliography
    : [];
  const items = configured.length
    ? configured
    : legacy.map((book) => ({
        title: book.title,
        author: book.author,
        year: book.year,
        description: book.note || book.description || "",
        href: book.href || book.link,
        preview: book.preview || book.file,
        cover: book.cover,
      }));

  const root = el("div", { class: "archivePage archiveBibliographyPage" });
  const section = data.bibliographySection || {};
  root.appendChild(el("h1", { class: "archivePageTitle", text: section.heading || "延伸閱讀" }));
  if (section.body) {
    root.appendChild(el("p", { class: "archiveIntroBody", text: section.body }));
  }

  const list = el("div", { class: "archiveBibliographyList" });
  items.forEach((book, i) => list.appendChild(renderArchiveBibliographyItem(book, i)));
  root.appendChild(list);
  return root;
}

function performanceBannerPlaceholderSrc(label, color, sublabel = "") {
  const safeLabel = String(label || "").trim() || "展演";
  const subTag = sublabel
    ? `<text x='960' y='310' text-anchor='middle' fill='rgba(255,255,255,.85)' font-family='sans-serif' font-size='28'>${sublabel}</text>`
    : "";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 540'><rect width='1920' height='540' fill='${color}'/><text x='960' y='270' text-anchor='middle' fill='#fff' font-family='sans-serif' font-size='48' font-weight='700'>${safeLabel}</text>${subTag}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function performanceBannerImageSrc(banner, index = 0) {
  const src = banner?.image?.src || "";
  if (src && !archiveIsPlaceholderImage(src)) return src;
  const title = String(banner?.title || `展演 ${index + 1}`).trim();
  const label = title.length > 12 ? `${title.slice(0, 11)}…` : title;
  const color = ARCHIVE_TEACHER_AVATAR_COLORS[index % ARCHIVE_TEACHER_AVATAR_COLORS.length];
  return performanceBannerPlaceholderSrc(label, color, "最新展演");
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

function renderArchivePerformanceBanner(banner, index) {
  const href = banner.href || "#home/index";
  const imgSrc = performanceBannerImageSrc(banner, index);
  const imgAlt = banner.image?.alt || banner.title || "最新展演";

  return el(
    "a",
    {
      class: "archivePerformanceBanner",
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
      el("img", {
        class: "archivePerformanceBannerImg",
        src: imgSrc,
        alt: imgAlt,
        loading: index === 0 ? "eager" : "lazy",
      }),
      banner.title
        ? el("div", { class: "archivePerformanceBannerOverlay" }, [
            el("span", { class: "archivePerformanceBannerTitle", text: banner.title }),
          ])
        : null,
    ]
  );
}

function renderArchivePerformances() {
  const performances = archiveData().performances || {};
  const banners = resolvePerformanceBanners().slice(0, 2);

  const root = el("div", { class: "archivePerformancesPage" });
  if (performances.heading) {
    root.appendChild(el("h1", { class: "archivePageTitle archivePerformancesTitle", text: performances.heading }));
  }
  if (performances.body) {
    root.appendChild(el("p", { class: "archiveIntroBody archivePerformancesIntro", text: performances.body }));
  }

  const list = el("div", { class: "archivePerformancesList" });
  banners.forEach((banner, index) => {
    list.appendChild(renderArchivePerformanceBanner(banner, index));
  });
  root.appendChild(list);

  return root;
}

function teacherSummaryText(teacher) {
  const summary = String(teacher?.summary || "").trim();
  if (summary) return summary;
  const bio = String(teacher?.bio || "").trim();
  if (!bio) return "藝術家教師簡介文字。";
  return bio.length > 48 ? `${bio.slice(0, 47)}…` : bio;
}

function teacherDetailText(teacher) {
  return String(teacher?.detail || teacher?.bio || teacher?.summary || "").trim() || "尚無詳細介紹。";
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
  const pages = Array.isArray(journal?.pages) ? journal.pages.filter(Boolean) : [];
  if (pages.length >= 2) return pages;
  return buildPlaceholderJournalPages(journal?.artist || journal?.title || "藝術家");
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
  }${options.preview ? " archiveModalPanel--preview" : ""}`;
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

function renderResearchBookshelf(bookshelf = {}) {
  const image = bookshelf.image || {};
  const imgSrc = image.src || "./assets/images/bookshelf.svg";
  const lockedBooks = Array.isArray(bookshelf.lockedBooks) ? bookshelf.lockedBooks : [];

  const stage = el("div", { class: "archiveResearchBookshelfStage" }, [
    el("img", {
      class: "archiveResearchBookshelfImg",
      src: imgSrc,
      alt: image.alt || "書櫃",
      loading: "lazy",
    }),
    el(
      "div",
      { class: "archiveResearchBookshelfHotspots", "aria-label": "書櫃書本" },
      lockedBooks.map((book) => {
        const hs = book.hotspot || {};
        return el("button", {
          class: "archiveResearchBookshelfHotspot",
          type: "button",
          style: typeof zoneHotspotStyle === "function" ? zoneHotspotStyle(hs) : "",
          "aria-label": book.label || "書本",
          title: book.label || "書本",
          onclick: () => openResearchAccessModal(bookshelf),
        });
      })
    ),
  ]);

  return el("section", { class: "archiveResearchBookshelf" }, [
    el("h2", { class: "archiveResearchBookshelfTitle", text: bookshelf.heading || "書櫃典藏" }),
    bookshelf.caption
      ? el("p", { class: "archiveResearchBookshelfCaption", text: bookshelf.caption })
      : null,
    stage,
  ]);
}

function renderArchiveResearch() {
  const research = archiveData().research || {};
  const journals = resolveResearchJournals();
  const displayJournals = journals.slice(0, 8);
  while (displayJournals.length < 8) {
    const index = displayJournals.length;
    displayJournals.push({
      id: `journal-placeholder-${index + 1}`,
      title: `藝術家日誌 ${index + 1}`,
      artist: `藝術家 ${index + 1}`,
      pages: [],
    });
  }

  const root = el("div", { class: "archivePage archiveResearchPage" });
  if (research.heading) {
    root.appendChild(el("h1", { class: "archivePageTitle", text: research.heading }));
  } else {
    root.appendChild(el("h1", { class: "archivePageTitle", text: "研究" }));
  }
  if (research.body) {
    root.appendChild(el("p", { class: "archiveIntroBody archiveResearchIntro", text: research.body }));
  }

  const grid = el("div", { class: "archiveResearchBookGrid" });
  displayJournals.forEach((journal, index) => {
    grid.appendChild(renderResearchBookCard(journal, index));
  });
  root.appendChild(el("section", { class: "archiveResearchLibrary" }, [grid]));

  root.appendChild(renderResearchBookshelf(research.bookshelf || {}));

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
  const map = {
    years: "exhibitions",
    year: "exhibitions",
    practice: "collection",
    media: "photos",
    index: "collection",
  };
  return map[section] || section || "collection";
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
    navigateFromHref(`#archive/collection${q}`);
    return;
  }

  if (section === "practice" || section === "media") {
    const raw = (location.hash || "").replace(/^#/, "");
    const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
    const target = section === "media" ? "videos" : "collection";
    navigateFromHref(`#archive/${target}${q}`);
    return;
  }

  let content;
  let activeSubnav = section;
  let contentClass = "";

  switch (section) {
    case "collection":
      content = renderArchiveCollection();
      activeSubnav = "collection";
      if (!params.get("work")) contentClass = "innerContent--archiveHome";
      break;
    case "exhibitions":
      content = renderArchiveExhibitions();
      activeSubnav = "collection";
      break;
    case "photos":
      content = renderArchivePhotos();
      activeSubnav = "collection";
      contentClass = "innerContent--archiveMedia";
      break;
    case "videos":
      content = renderArchiveVideos();
      activeSubnav = "collection";
      contentClass = "innerContent--archiveMedia";
      break;
    case "teachers":
      content = renderArchiveTeachers();
      break;
    case "bibliography":
      content = renderArchiveBibliography();
      break;
    case "research":
      content = renderArchiveResearch();
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
    activeNav: "archive",
    activeSubnav,
    showSubnav: true,
  });
  main.appendChild(shell);
  if (contentClass) {
    shell.querySelector(".innerContent")?.classList.add(contentClass);
  }
}
