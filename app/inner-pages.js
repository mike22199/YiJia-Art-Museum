/* 內頁版面：header / subnav / footer / 典藏時間軸 / 展覽頁 */

function layoutAssets() {
  const layout = window.SITE_CONTENT?.layout || {};
  return {
    headerBg: layout.headerBg || "./assets/images/layout/header-bg.png",
    subnavBg: layout.subnavBg || "./assets/images/layout/subnav-bg.jpg",
    footerBg: layout.footerBg || "./assets/images/layout/footer-bg.jpg",
    logoBuilding: layout.logoBuilding || "./assets/images/layout/logo-building.png",
    logoTitle: layout.logoTitle || "./assets/images/home/LOGO.png",
    partnerLogos: "./assets/images/layout/partner-logo-new_V2.png",
    iconYoutube: layout.iconYoutube || "./assets/images/logo/youtube.png",
  };
}

function mainNavItems() {
  if (typeof archiveSubnavItems === "function") return archiveSubnavItems();
  return Array.isArray(window.SITE_CONTENT?.archiveSubnav) ? window.SITE_CONTENT.archiveSubnav : [];
}

function collectionSubnavItems() {
  return Array.isArray(window.SITE_CONTENT?.collectionSubnav)
    ? window.SITE_CONTENT.collectionSubnav
    : [
        { id: "exhibitions", label: "歷屆網站", href: "#archive/exhibitions" },
        { id: "photos", label: "照片紀錄", href: "#archive/photos" },
        { id: "videos", label: "動態影音紀錄", href: "#archive/videos" },
      ];
}

function innerNavLinkClass(baseClass, isActive) {
  return `${baseClass}${isActive ? ` ${baseClass}Active` : ""}`;
}

let innerChromeFitObserver = null;

function readUiScale() {
  const raw = getComputedStyle(document.body).getPropertyValue("--ui-scale").trim();
  const parsed = parseFloat(raw);
  if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  return (window.innerWidth / 1962) * 1.55;
}

function syncInnerChromeFit() {
  const page = document.querySelector(".innerPage");
  if (!page) return;

  const header = page.querySelector(".innerHeader");
  const brand = page.querySelector(".innerBrand");
  const aside = page.querySelector(".innerHeaderAside");
  const nav = page.querySelector(".innerNav");
  const footer = page.querySelector(".innerFooter");

  page.classList.remove("isNavCompact");
  page.style.setProperty("--chrome-nav-fit", "1");
  page.style.setProperty("--chrome-footer-fit", "1");
  aside?.style.removeProperty("max-width");

  if (header && brand && aside && nav) {
    const ui = readUiScale();
    const sidePad = 40 * ui;
    const designAsideW =
      (parseFloat(getComputedStyle(document.body).getPropertyValue("--header-aside-design-w")) || 720) * ui;
    const headerRect = header.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();
    const brandRight = brandRect.right - headerRect.left;
    const availableW = Math.max(140, headerRect.width - brandRight - sidePad - 12 * ui);
    const targetAsideW = Math.min(designAsideW, availableW);

    const measureNav = () => {
      const prevWrap = nav.style.flexWrap;
      nav.style.flexWrap = "nowrap";
      const needed = nav.scrollWidth;
      nav.style.flexWrap = prevWrap || "";
      return needed;
    };

    const needed = measureNav();
    const needsCompact = needed > targetAsideW || availableW < designAsideW - 4;

    if (needsCompact) {
      page.classList.add("isNavCompact");
      aside.style.maxWidth = `${availableW}px`;

      if (needed > availableW) {
        const fit = Math.max(0.62, availableW / needed);
        page.style.setProperty("--chrome-nav-fit", fit.toFixed(3));
      }
    }
  }

  if (footer) {
    const partners = footer.querySelector(".innerFooterPartners");
    const contact = footer.querySelector(".innerFooterContact");
    const social = footer.querySelector(".innerFooterSocial");
    if (partners && contact && social) {
      const pRect = partners.getBoundingClientRect();
      const cRect = contact.getBoundingClientRect();
      const sRect = social.getBoundingClientRect();
      if (cRect.left < pRect.right + 6 || cRect.right > sRect.left - 6) {
        const overlap = Math.max(pRect.right + 6 - cRect.left, cRect.right + 6 - sRect.left, 0);
        const fit = Math.max(0.72, 1 - overlap / Math.max(footer.clientWidth, 1));
        page.style.setProperty("--chrome-footer-fit", fit.toFixed(3));
      }
    }
  }
}

function scheduleInnerChromeFit() {
  requestAnimationFrame(() => requestAnimationFrame(syncInnerChromeFit));
}

function bindInnerChromeFit(page) {
  if (innerChromeFitObserver) {
    innerChromeFitObserver.disconnect();
    innerChromeFitObserver = null;
  }

  scheduleInnerChromeFit();

  if (typeof ResizeObserver === "undefined" || !page) return;

  innerChromeFitObserver = new ResizeObserver(() => scheduleInnerChromeFit());
  innerChromeFitObserver.observe(page);
  const header = page.querySelector(".innerHeader");
  const footer = page.querySelector(".innerFooter");
  if (header) innerChromeFitObserver.observe(header);
  if (footer) innerChromeFitObserver.observe(footer);
}

function ensureInnerChromeFitListeners() {
  if (ensureInnerChromeFitListeners.bound) return;
  ensureInnerChromeFitListeners.bound = true;
  const run = () => scheduleInnerChromeFit();
  window.addEventListener("resize", run, { passive: true });
  window.addEventListener("orientationchange", run, { passive: true });
  const vv = window.visualViewport;
  if (vv) vv.addEventListener("resize", run, { passive: true });
}

function renderSiteHeader(activeNavId) {
  const site = window.SITE_CONTENT?.site || {};
  const assets = layoutAssets();
  const logo = site.headerLogo || {};
  const navItems = mainNavItems();
  const buildingSrc = logo.building || assets.logoBuilding;
  const titleSrc = logo.title || assets.logoTitle;

  const navChildren = navItems.map((item) =>
    el(
      "a",
      {
        class: innerNavLinkClass("innerNavItem", item.id === activeNavId),
        href: item.href || `#archive/${item.id}`,
        onclick: (e) => {
          e.preventDefault();
          navigateFromHref(item.href || `#archive/${item.id}`);
        },
      },
      [item.label || item.id]
    )
  );

  return el("header", { class: "innerHeader", "aria-label": "site header" }, [
    el("img", {
      class: "innerHeaderBgImg",
      src: assets.headerBg,
      alt: "",
      decoding: "async",
      width: 1962,
      height: 424,
    }),
    el("div", { class: "innerHeaderInner" }, [
      el(
        "a",
        {
          class: "innerBrand",
          href: "#home/index",
          onclick: (e) => {
            e.preventDefault();
            setRoute("home", "index");
          },
        },
        [
          buildingSrc
            ? el("img", {
                class: "innerBrandBuilding",
                src: buildingSrc,
                alt: "",
                "aria-hidden": "true",
              })
            : null,
          titleSrc
            ? el("img", {
                class: "innerBrandTitleImg",
                src: titleSrc,
                alt: logo.alt || site.title || "義家藝館",
              })
            : el("div", { class: "innerBrandText" }, [
                el("div", { class: "innerBrandTitle", text: site.title || "義家藝館" }),
                el("div", { class: "innerBrandSub", text: site.subtitle || "" }),
              ]),
        ]
      ),
      el("div", { class: "innerHeaderAside" }, [
        el("nav", {
          class: `innerNav${navItems.length >= 6 ? " innerNav--compact" : ""}`,
          "aria-label": "主選單",
        }, navChildren),
      ]),
    ]),
  ]);
}

function renderSiteSubnav(activeSectionId) {
  const items = collectionSubnavItems();
  const assets = layoutAssets();
  const subChildren = [];

  items.forEach((item, i) => {
    if (i > 0) subChildren.push(el("span", { class: "innerSubnavSep", text: "|", "aria-hidden": "true" }));
    subChildren.push(
      el(
        "a",
        {
          class: innerNavLinkClass("innerSubnavItem", item.id === activeSectionId),
          href: item.href || `#archive/${item.id}`,
          onclick: (e) => {
            e.preventDefault();
            navigateFromHref(item.href || `#archive/${item.id}`);
          },
        },
        [item.label || item.id]
      )
    );
  });

  return el("nav", { class: "innerSubnav", "aria-label": "典藏子選單" }, [
    el("div", {
      class: "innerSubnavBg",
      style: { backgroundImage: `url("${assets.subnavBg}")` },
      "aria-hidden": "true",
    }),
    el("div", { class: "innerSubnavInner" }, subChildren),
  ]);
}

const DEFAULT_YOUTUBE_HREF = "https://www.youtube.com/@義家藝館WhenaHomeBecomesaM";

function footerYoutubeHref(raw) {
  const url = String(raw || "").trim();
  if (!url || /^https?:\/\/(www\.)?youtube\.com\/?$/i.test(url)) {
    return DEFAULT_YOUTUBE_HREF;
  }
  return url;
}

function renderSiteFooter() {
  const footer = window.SITE_CONTENT?.site?.footer || {};
  const social = footer.social || {};
  const youtubeHref = footerYoutubeHref(social.youtube);
  const assets = layoutAssets();
  const addressZh = footer.addressZh || footer.address || "";
  const addressEn = footer.addressEn || "";

  return el("footer", { class: "innerFooter" }, [
    el("div", { class: "innerFooterBgWrap", "aria-hidden": "true" }, [
      el("img", {
        class: "innerFooterBgImg",
        src: assets.footerBg,
        alt: "",
        decoding: "async",
        width: 1962,
        height: 418,
      }),
    ]),
    el("div", { class: "innerFooterInner" }, [
      assets.partnerLogos
        ? el("div", { class: "innerFooterPartners" }, [
            el("img", {
              class: "innerFooterPartnersImg",
              src: assets.partnerLogos,
              alt: "合作單位",
              loading: "lazy",
            }),
          ])
        : null,
      el("div", { class: "innerFooterContact" }, [
        addressZh ? el("div", { text: addressZh }) : null,
        addressEn ? el("div", { text: addressEn }) : null,
        footer.phone ? el("div", { text: `電話:${footer.phone}` }) : null,
        footer.fax ? el("div", { text: `傳真:${footer.fax}` }) : null,
        footer.email ? el("div", { text: `E-mail:${footer.email}` }) : null,
      ]),
      el("div", { class: "innerFooterSocial" }, [
        el("a", {
          class: "innerSocialLink",
          href: youtubeHref,
          target: "_blank",
          rel: "noreferrer",
          "aria-label": "YouTube",
        }, [el("img", { src: assets.iconYoutube, alt: "", "aria-hidden": "true" })]),
      ]),
    ]),
  ]);
}

function wrapInnerPage(contentEl, { activeNav = "", activeSubnav = "", showSubnav = false } = {}) {
  const shell = el("div", { class: "innerPage" }, [
    renderSiteHeader(activeNav),
    showSubnav ? renderSiteSubnav(activeSubnav) : null,
    el("div", { class: "innerContent" }, [contentEl]),
    renderSiteFooter(),
  ]);
  ensureInnerChromeFitListeners();
  queueMicrotask(() => {
    const run = () => {
      if (shell.isConnected) bindInnerChromeFit(shell);
      else requestAnimationFrame(run);
    };
    run();
  });
  return shell;
}

function pastExhibitionsData() {
  return window.SITE_CONTENT?.archive?.pastExhibitions || {};
}

function resolvePastWebsiteHref(year) {
  const past = pastExhibitionsData();
  const configured = past.byYear?.[year];
  const legacyItem = Array.isArray(past.items)
    ? past.items.find((item) => {
        const itemYear = String(item.year || "").trim();
        if (itemYear === String(year)) return true;
        return String(item.title || "").startsWith(String(year));
      })
    : null;
  return configured?.href || configured?.website || legacyItem?.href || "";
}

function pastWebsiteImageYears() {
  const past = pastExhibitionsData();
  if (Array.isArray(past.imageYears)) return past.imageYears.map(String);
  return ["2027-2026", "2023", "2022", "2021", "2020", "2019", "2018", "2016"];
}

function pastWebsiteTimelineKeys() {
  const past = pastExhibitionsData();
  if (Array.isArray(past.timeline) && past.timeline.length) {
    return past.timeline.map((y) => String(y).trim()).filter(Boolean);
  }
  if (Array.isArray(past.rows) && past.rows.length) {
    return past.rows.flatMap((row) => (Array.isArray(row) ? row : [])).map((y) => String(y).trim()).filter(Boolean);
  }
  return ["2027-2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
}

function resolvePastWebsiteBanner(yearKey, configured, legacyItem) {
  const shouldShowImage = pastWebsiteImageYears().includes(String(yearKey));
  if (!shouldShowImage && !(configured?.banner?.src || configured?.image?.src)) return null;

  const configuredBanner = configured?.banner || configured?.image;

  return (
    (configuredBanner?.src && !String(configuredBanner.src).includes("placeholder")
      ? configuredBanner
      : null) ||
    (legacyItem?.image?.src && !String(legacyItem.image.src).includes("placeholder")
      ? legacyItem.image
      : null) ||
    configuredBanner ||
    null
  );
}

function buildPastWebsiteVerticalEntry(yearKey) {
  const past = pastExhibitionsData();
  const configured = past.byYear?.[yearKey] || {};
  const legacyItem = Array.isArray(past.items)
    ? past.items.find((item) => {
        const itemYear = String(item.year || "").trim();
        if (itemYear === String(yearKey)) return true;
        return String(item.title || "").startsWith(String(yearKey));
      })
    : null;
  const href = resolvePastWebsiteHref(yearKey);
  const yearLabel = configured.yearLabel || configured.label || yearKey;
  const empty = configured.empty === true;
  const markerOnly = configured.markerOnly === true || empty;
  const modal = configured.modal || null;
  const title = String(configured.title || "").trim();
  const subtitle = String(configured.subtitle || "").trim();
  const subtitleEn = String(configured.subtitleEn || "").trim();
  const image = empty || markerOnly ? null : resolvePastWebsiteBanner(yearKey, configured, legacyItem);
  const hasCopy = Boolean(title || subtitle || subtitleEn);
  const hasFeature = !empty && !markerOnly && Boolean(image || hasCopy || modal);

  return {
    year: String(yearKey),
    yearLabel,
    empty,
    markerOnly,
    hasFeature,
    image,
    title,
    subtitle,
    subtitleEn,
    modal,
    href,
  };
}

function timelineExternalLinkAttrs(href) {
  const isExternal = href && !String(href).startsWith("#");
  return {
    href: href || "#",
    target: isExternal ? "_blank" : undefined,
    rel: isExternal ? "noopener noreferrer" : undefined,
    onclick: isExternal
      ? undefined
      : (e) => {
          e.preventDefault();
          navigateFromHref(href);
        },
  };
}

function openPastWebsiteModalFromEntry(modalData) {
  if (typeof openPastWebsiteModal === "function") openPastWebsiteModal(modalData);
}

function pastWebsiteActivateEntry(entry) {
  if (entry?.modal) {
    openPastWebsiteModalFromEntry(entry.modal);
    return;
  }
  if (entry?.href) {
    const attrs = timelineExternalLinkAttrs(entry.href);
    if (attrs.target === "_blank") {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      navigateFromHref(entry.href);
    }
  }
}

function renderPastWebsiteTitleBlock(entry) {
  if (!entry.title && !entry.subtitle && !entry.subtitleEn) return null;
  return el("div", { class: "pastWebsitesTitleBlock" }, [
    entry.title ? el("p", { class: "pastWebsitesTitleZh", text: entry.title }) : null,
    entry.subtitle ? el("p", { class: "pastWebsitesTitleSub", text: entry.subtitle }) : null,
    entry.subtitleEn ? el("p", { class: "pastWebsitesTitleEn", text: entry.subtitleEn }) : null,
  ]);
}

function renderPastWebsiteArt(entry) {
  if (!entry.image?.src) return null;
  const img = el("img", {
    class: "pastWebsitesArtImg",
    src: entry.image.src,
    alt: entry.image.alt || entry.yearLabel || "歷屆網站",
    loading: "lazy",
  });

  if (entry.modal || entry.href) {
    return el(
      "button",
      {
        class: "pastWebsitesArtButton",
        type: "button",
        "aria-label": `${entry.yearLabel} 歷屆網站`,
        onclick: () => pastWebsiteActivateEntry(entry),
      },
      [img]
    );
  }

  return el("div", { class: "pastWebsitesArt" }, [img]);
}

function renderPastWebsiteSideContent(entry, kind) {
  if (kind === "art") return renderPastWebsiteArt(entry);
  if (kind === "title") {
    const block = renderPastWebsiteTitleBlock(entry);
    if (!block) return null;
    if (entry.modal || entry.href) {
      return el(
        "button",
        {
          class: "pastWebsitesTitleButton",
          type: "button",
          "aria-label": `${entry.yearLabel} ${entry.title || "歷屆網站"}`,
          onclick: () => pastWebsiteActivateEntry(entry),
        },
        [block]
      );
    }
    return block;
  }
  return null;
}

function parsePastWebsiteYearParts(yearLabel) {
  const raw = String(yearLabel || "").trim();
  const rangeMatch = raw.match(/^(\d{4})\s*[-–]\s*(\d{4})$/);
  if (rangeMatch) {
    const primary = rangeMatch[1];
    const secondary = rangeMatch[2];
    return {
      type: "range",
      century: primary.slice(0, 2),
      yearShort: primary.slice(2),
      rangeSuffix: `- ${secondary}`,
    };
  }
  const singleMatch = raw.match(/^(\d{4})$/);
  if (singleMatch) {
    const year = singleMatch[1];
    return {
      type: "single",
      century: year.slice(0, 2),
      yearShort: year.slice(2),
    };
  }
  return { type: "plain", label: raw };
}

function renderPastWebsiteYearStackLines(entry) {
  const parts = parsePastWebsiteYearParts(entry.yearLabel || entry.year);
  if (parts.type === "plain") {
    return [el("span", { class: "pastWebsitesYearLine", text: parts.label })];
  }
  const lines = [
    el("span", { class: "pastWebsitesYearLine pastWebsitesYearLine--century", text: parts.century }),
    el("span", { class: "pastWebsitesYearLine pastWebsitesYearLine--short", text: parts.yearShort }),
  ];
  if (parts.rangeSuffix) {
    lines.push(
      el("span", { class: "pastWebsitesYearLine pastWebsitesYearLine--range", text: parts.rangeSuffix })
    );
  }
  return lines;
}

function renderPastWebsiteYearControl(entry, variant, yearAlign = "center") {
  const label = entry.yearLabel || entry.year;
  const interactive = Boolean(entry.modal || entry.href);

  if (variant === "marker") {
    const markerClass = `pastWebsitesMarkerYear${interactive ? " pastWebsitesYearButton" : ""}`;
    const markerAttrs = {
      class: markerClass,
      text: label,
      "aria-label": entry.modal ? `${label} 網站簡介` : `${label}`,
    };
    if (interactive) {
      return el("button", {
        ...markerAttrs,
        type: "button",
        onclick: () => pastWebsiteActivateEntry(entry),
      });
    }
    return el("span", markerAttrs);
  }

  const alignClass =
    yearAlign === "left"
      ? " pastWebsitesYearStack--alignLeft"
      : yearAlign === "right"
        ? " pastWebsitesYearStack--alignRight"
        : "";
  const stackClass = `pastWebsitesYearStack${alignClass}${interactive ? " pastWebsitesYearButton" : ""}`;
  const stackChildren = renderPastWebsiteYearStackLines(entry);
  if (interactive) {
    return el(
      "button",
      {
        class: stackClass,
        type: "button",
        "aria-label": entry.modal ? `${label} 網站簡介` : `${label} 歷屆網站`,
        onclick: () => pastWebsiteActivateEntry(entry),
      },
      stackChildren
    );
  }
  return el("div", { class: stackClass, "aria-label": label }, stackChildren);
}

function renderPastWebsiteVerticalEntry(entry, imageOnLeft) {
  if (entry.empty || entry.markerOnly || !entry.hasFeature) {
    return el("div", {
      class: "pastWebsitesEntry pastWebsitesEntry--marker",
      "data-year": entry.year,
    }, [
      el("div", { class: "pastWebsitesSide pastWebsitesSide--left", "aria-hidden": "true" }),
      el("div", { class: "pastWebsitesYearCol pastWebsitesYearCol--marker" }, [
        el("span", { class: "pastWebsitesMarkerDash", "aria-hidden": "true" }),
      ]),
      el("div", { class: "pastWebsitesSide pastWebsitesSide--right pastWebsitesSide--markerLabel" }, [
        renderPastWebsiteYearControl(entry, "marker"),
      ]),
    ]);
  }

  const art = renderPastWebsiteSideContent(entry, "art");
  const title = renderPastWebsiteSideContent(entry, "title");
  // 圖片在左 → 紅軸年份靠右；圖片在右 → 紅軸年份靠左
  const yearAlign = imageOnLeft ? "right" : "left";
  const leftKind = imageOnLeft ? "art" : "title";
  const rightKind = imageOnLeft ? "title" : "art";

  return el(
    "div",
    {
      class: `pastWebsitesEntry pastWebsitesEntry--feature pastWebsitesEntry--${
        imageOnLeft ? "imageLeft" : "imageRight"
      } pastWebsitesEntry--yearAlign${yearAlign === "left" ? "Left" : "Right"}`,
      "data-year": entry.year,
    },
    [
      el(
        "div",
        { class: "pastWebsitesSide pastWebsitesSide--left" },
        leftKind === "art" ? (art ? [art] : []) : title ? [title] : []
      ),
      el(
        "div",
        {
          class: `pastWebsitesYearCol pastWebsitesYearCol--align${
            yearAlign === "left" ? "Left" : "Right"
          }`,
        },
        [renderPastWebsiteYearControl(entry, "large", yearAlign)]
      ),
      el(
        "div",
        { class: "pastWebsitesSide pastWebsitesSide--right" },
        rightKind === "art" ? (art ? [art] : []) : title ? [title] : []
      ),
    ]
  );
}

function renderPastWebsitesVerticalTimeline() {
  const keys = pastWebsiteTimelineKeys();
  const root = el("div", {
    class: "pastWebsitesTimeline",
    "aria-label": "歷屆網站時間軸",
  });
  root.appendChild(el("div", { class: "pastWebsitesSpine", "aria-hidden": "true" }));

  let featureIndex = 0;
  for (const key of keys) {
    const entry = buildPastWebsiteVerticalEntry(key);
    if (!entry.year) continue;
    const imageOnLeft = featureIndex % 2 === 0;
    if (entry.hasFeature) featureIndex += 1;
    root.appendChild(renderPastWebsiteVerticalEntry(entry, imageOnLeft));
  }

  return root;
}

function renderExhibitionAboutPage(exhibition, exhibitionId = "exhibition-left") {
  const about = exhibition.about || {};
  const blocks = Array.isArray(about.blocks) ? about.blocks : [];
  const banner = about.banner || exhibition.banner || null;
  const logo = about.logo || {
    src: "./assets/images/Freedom Door/理念頁LOGO.png?v=20260803ak",
    alt: "義家藝館",
  };
  const startButton = about.startButton || {
    src: "./assets/images/Freedom Door/Start.png",
    alt: "開始 START",
  };
  const leadTitle =
    String(about.leadTitle || "").trim() ||
    String(blocks[0]?.body || "").trim();
  const bodyBlocks =
    about.leadTitle || !blocks[0]?.body
      ? blocks
      : blocks.slice(1);
  const nextLabel = String(startButton.label || "").trim();
  const useTextNext = Boolean(nextLabel) || !startButton.src;

  const textChildren = [];
  if (leadTitle) {
    textChildren.push(el("p", { class: "aboutConceptLead", text: leadTitle }));
  }
  const heading = String(about.heading || "").trim();
  if (heading) {
    textChildren.push(
      el("h1", { class: "aboutConceptHeading", text: heading })
    );
  }
  bodyBlocks.forEach((b) => {
    const text = String(b?.body || "").trim();
    if (text) {
      textChildren.push(
        el("p", {
          class: "aboutConceptParagraph fpConceptBody",
          text,
        })
      );
    }
  });

  const nextControl = el(
    "a",
    {
      class: useTextNext ? "aboutConceptNext" : "aboutConceptStart",
      href: `#${exhibitionId}/experience`,
      "aria-label": startButton.alt || nextLabel || "開始",
      onclick: (e) => {
        e.preventDefault();
        window.__preserveExhibitionScrollY = window.scrollY;
        navigateFromHref(`#${exhibitionId}/experience`);
      },
    },
    useTextNext
      ? [nextLabel || "Next ▶"]
      : [
          el("img", {
            class: "aboutConceptStartImg",
            src: startButton.src,
            alt: startButton.alt || "開始 START",
          }),
        ]
  );

  return el("div", {
    class:
      exhibitionId === "exhibition-right"
        ? "aboutPage aboutPage--concept aboutPage--freeman"
        : "aboutPage aboutPage--concept",
  }, [
    el(
      "div",
      {
        class: "exhibitionWindow aboutConceptStage",
        "aria-label": "特展視窗",
      },
      [
        banner?.src
          ? el("img", {
              class: "aboutConceptBg",
              src: banner.src,
              alt: "",
              "aria-hidden": "true",
              loading: "eager",
            })
          : el("div", { class: "aboutConceptBg aboutConceptBg--fallback" }),
        el("div", { class: "aboutConceptDim", "aria-hidden": "true" }),
        logo?.src
          ? el("img", {
              class: "aboutConceptLogo",
              src: logo.src,
              alt: logo.alt || "義家藝館",
              loading: "eager",
            })
          : null,
        el("div", { class: "aboutConceptContent" }, textChildren),
        nextControl,
      ]
    ),
  ]);
}

function renderExhibitionPage(main, route) {
  const id = route.id || "exhibition-left";
  const section = normalizeSection(route.section || "about");
  const exhibition = (window.SITE_CONTENT?.exhibitions || {})[id];

  if (!exhibition) {
    main.innerHTML = "";
    main.appendChild(wrapInnerPage(el("div", { class: "muted", text: "找不到展覽內容。" }), { activeNav: "" }));
    return;
  }

  let content;
  if (section === "experience" && id === "exhibition-left" && typeof renderFreedomDoorExperience === "function") {
    content = renderFreedomDoorExperience();
  } else if (section === "experience" && id === "exhibition-right" && typeof renderFreedomPersonExperience === "function") {
    content = renderFreedomPersonExperience();
  } else if (section === "about") {
    content = renderExhibitionAboutPage(exhibition, id);
  } else {
    content = renderExhibitionAboutPage(exhibition, id);
  }

  const exhibitionChrome = {
    activeNav: "performances",
    showSubnav: false,
  };

  main.innerHTML = "";
  main.appendChild(wrapInnerPage(content, exhibitionChrome));

  if (typeof window.__preserveExhibitionScrollY === "number") {
    const y = window.__preserveExhibitionScrollY;
    window.__preserveExhibitionScrollY = null;
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  }

  if (typeof window.FIFI_fitExhibitionText === "function") {
    window.FIFI_fitExhibitionText(main);
  }
}

function renderCoCreatePage(main) {
  const page = window.SITE_CONTENT?.pages?.["co-create"] || { title: "共創" };
  const panel = el("div", { class: "innerPanel" });
  panel.appendChild(el("h1", { class: "innerPageTitle", text: page.title || "共創" }));
  panel.appendChild(el("p", { class: "innerPageIntro", text: page.hero?.caption || "在此留下文字與投稿。" }));

  const nameEl = el("input", { id: "cc_name", type: "text", placeholder: "匿名 / 名字" });
  const titleEl = el("input", { id: "cc_title", type: "text", placeholder: "標題" });
  const bodyEl = el("textarea", { id: "cc_body", placeholder: "在這裡輸入投稿文字……" });
  const statusEl = el("div", { id: "cc_status", class: "muted", text: "" });

  panel.appendChild(
    el("div", { class: "composer" }, [
      el("div", { class: "field" }, [el("label", { text: "Name" }), nameEl]),
      el("div", { class: "field" }, [el("label", { text: "Title" }), titleEl]),
      el("div", { class: "field", style: "grid-column: 1 / -1" }, [el("label", { text: "Text" }), bodyEl]),
      el("div", { class: "actions" }, [
        statusEl,
        el("button", {
          class: "btn btnGhost",
          type: "button",
          text: "Clear",
          onclick: () => {
            localStorage.removeItem("FIFI_CO_CREATE_DRAFT");
            nameEl.value = "";
            titleEl.value = "";
            bodyEl.value = "";
          },
        }),
        el("button", {
          class: "btn",
          type: "button",
          text: "Save draft",
          onclick: () => {
            localStorage.setItem(
              "FIFI_CO_CREATE_DRAFT",
              JSON.stringify({
                name: nameEl.value,
                title: titleEl.value,
                body: bodyEl.value,
                savedAt: new Date().toISOString(),
              })
            );
            statusEl.textContent = "已儲存草稿。";
          },
        }),
      ]),
    ])
  );

  main.innerHTML = "";
  main.appendChild(wrapInnerPage(panel, { activeNav: "co-create" }));
}

function renderResearchPage(main) {
  navigateFromHref("#archive/research");
}
