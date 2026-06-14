/* 內頁版面：header / subnav / footer / 典藏時間軸 / 展覽頁 */

function renderSiteHeader(activeNavId) {
  const site = window.SITE_CONTENT?.site || {};
  const navItems = Array.isArray(site.headerNav) ? site.headerNav : [
    { id: "co-create", label: "共創", href: "#co-create/text" },
    { id: "classics", label: "典藏", href: "#classics/years" },
    { id: "research", label: "研究", href: "#research/book" },
  ];
  const logo = site.headerLogo || site.logo || {};

  const navChildren = [];
  navItems.forEach((item, i) => {
    if (i > 0) navChildren.push(el("span", { class: "innerNavSep", text: "|", "aria-hidden": "true" }));
    navChildren.push(
      el(
        "a",
        {
          class: `innerNavItem${item.id === activeNavId ? " innerNavItemActive" : ""}`,
          href: item.href || `#${item.id}/text`,
          onclick: (e) => {
            e.preventDefault();
            navigateFromHref(item.href || `#${item.id}/text`);
          },
        },
        [item.label || item.id]
      )
    );
  });

  return el("header", { class: "innerHeader", "aria-label": "site header" }, [
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
          logo.src
            ? el("img", { class: "innerBrandImg", src: logo.src, alt: logo.alt || site.title || "logo" })
            : null,
          el("div", { class: "innerBrandText" }, [
            el("div", { class: "innerBrandTitle", text: site.title || "義家藝館" }),
            el("div", { class: "innerBrandSub", text: site.subtitle || "" }),
          ]),
        ]
      ),
      el("nav", { class: "innerNav", "aria-label": "主選單" }, navChildren),
      el(
        "button",
        {
          class: "innerSearchBtn",
          type: "button",
          "aria-label": "搜尋",
          text: "搜尋",
        }
      ),
    ]),
    el("div", { class: "innerTornEdge", "aria-hidden": "true" }),
  ]);
}

function renderSiteSubnav(activeSectionId) {
  const items =
    typeof archiveSubnavItems === "function"
      ? archiveSubnavItems()
      : Array.isArray(window.SITE_CONTENT?.archiveSubnav)
        ? window.SITE_CONTENT.archiveSubnav
        : Array.isArray(window.SITE_CONTENT?.classicsSubnav)
          ? window.SITE_CONTENT.classicsSubnav
          : [
              { id: "collection", label: "典藏", href: "#archive/collection" },
              { id: "research", label: "研究", href: "#archive/research" },
              { id: "performances", label: "最新展演", href: "#archive/performances" },
              { id: "teachers", label: "藝術家教師", href: "#archive/teachers" },
              { id: "bibliography", label: "延伸閱讀", href: "#archive/bibliography" },
            ];

  const subChildren = [];
  items.forEach((item, i) => {
    if (i > 0) subChildren.push(el("span", { class: "innerSubnavSep", text: "|", "aria-hidden": "true" }));
    subChildren.push(
      el(
        "a",
        {
          class: `innerSubnavItem${item.id === activeSectionId ? " innerSubnavItemActive" : ""}`,
          href: item.href || `#classics/${item.id}`,
          onclick: (e) => {
            e.preventDefault();
            navigateFromHref(item.href || `#classics/${item.id}`);
          },
        },
        [item.label || item.id]
      )
    );
  });

  return el("nav", { class: "innerSubnav", "aria-label": "檔案庫子選單" }, subChildren);
}

function renderSiteFooter() {
  const footer = window.SITE_CONTENT?.site?.footer || {};
  const social = footer.social || {};

  return el("footer", { class: "innerFooter" }, [
    el("div", { class: "innerFooterInner" }, [
      el("div", { class: "innerFooterContact" }, [
        footer.address ? el("div", { text: footer.address }) : null,
        footer.phone ? el("div", { text: `電話 ${footer.phone}` }) : null,
        footer.fax ? el("div", { text: `傳真 ${footer.fax}` }) : null,
        footer.email ? el("div", { text: footer.email }) : null,
      ]),
      el("div", { class: "innerFooterSocial" }, [
        social.youtube
          ? el("a", { class: "innerSocialLink", href: social.youtube, target: "_blank", rel: "noreferrer", "aria-label": "YouTube", text: "YT" })
          : null,
        social.facebook
          ? el("a", { class: "innerSocialLink", href: social.facebook, target: "_blank", rel: "noreferrer", "aria-label": "Facebook", text: "FB" })
          : null,
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
  return shell;
}

function renderTimelineEntry(entry) {
  const links = Array.isArray(entry.links) ? entry.links : [];
  const image = entry.image;
  const imagePosition = entry.imagePosition === "above" ? "above" : "below";
  const year = entry.year || "";
  const detailHref = yearIntroHref(year);

  const imageInner = image?.src
    ? el("img", { src: image.src, alt: image.alt || year || "artwork", loading: "lazy" })
    : null;

  const imageEl =
    imageInner
      ? el(
          "a",
          {
            class: "timelineArt timelineArtLink",
            href: detailHref,
            "aria-label": `${year} 年度介紹`,
            onclick: (e) => {
              e.preventDefault();
              navigateFromHref(detailHref);
            },
          },
          [imageInner]
        )
      : null;

  const yearEl = el(
    "a",
    {
      class: "timelineYear timelineYearLink",
      href: detailHref,
      text: year,
      onclick: (e) => {
        e.preventDefault();
        navigateFromHref(detailHref);
      },
    }
  );
  const dotEl = el("div", { class: "timelineDot", "aria-hidden": "true" });
  const linksEl = el(
    "ul",
    { class: "timelineLinks" },
    links.map((link) =>
      el("li", {}, [
        el(
          "a",
          {
            href: link.href || detailHref,
            onclick: (e) => {
              if (String(link.href || "").startsWith("#")) {
                e.preventDefault();
                navigateFromHref(link.href);
              }
            },
          },
          [link.label || "連結"]
        ),
      ])
    )
  );

  const stack = el("div", { class: `timelineStack timelineStack--${imagePosition}` }, [
    imagePosition === "above" ? imageEl : null,
    yearEl,
    dotEl,
    linksEl,
    imagePosition === "below" ? imageEl : null,
  ]);

  return el("div", { class: "timelineEntry" }, [stack]);
}

function renderClassicsTimeline() {
  const data = window.SITE_CONTENT?.classics || {};
  const rows = Array.isArray(data.timelineRows) ? data.timelineRows : [];

  const content = el("div", { class: "timelinePage" });
  for (const row of rows) {
    const entries = Array.isArray(row.entries) ? row.entries : [];
    const rowEl = el("div", { class: "timelineRow" }, [
      el("div", { class: "timelineLine", "aria-hidden": "true" }),
      el(
        "div",
        { class: `timelineGrid timelineGrid--${Math.min(4, Math.max(1, entries.length))}` },
        entries.map((entry) => renderTimelineEntry(entry))
      ),
    ]);
    content.appendChild(rowEl);
  }
  return content;
}

function buildIntroSectionsFromLegacy(detail) {
  if (Array.isArray(detail.introSections) && detail.introSections.length) {
    return detail.introSections;
  }
  const bookImg = "./assets/images/placeholder-book.svg";
  const sections = [];
  if (detail.banner?.title || detail.poster?.src) {
    sections.push({
      id: "website",
      title: "網站",
      heading: detail.banner?.title || detail.title,
      body: detail.banner?.subtitle || detail.subtitle,
      image: detail.poster,
      layout: "split",
    });
  }
  if (detail.banner) {
    sections.push({
      id: "practice",
      title: "藝術實踐",
      heading: detail.banner.title,
      body: detail.banner.subtitle,
      subtitleEn: detail.banner.subtitleEn,
      image: detail.banner.image,
      layout: "banner",
    });
  }
  if (detail.video) {
    sections.push({
      id: "media",
      title: "影音",
      heading: detail.video.heading || "影音紀錄",
      body: detail.video.body,
      caption: detail.video.title,
      image: detail.video.cover,
      youtubeId: detail.video.youtubeId,
      layout: "video",
    });
  }
  const carousel = Array.isArray(detail.journalCarousel) ? detail.journalCarousel : [];
  sections.push({
    id: "journal",
    title: "藝術家教師日誌",
    body: "駐校藝術家教師的教學觀察與創作筆記。",
    layout: "books",
    books: carousel.length
      ? carousel.map((item, i) => ({
          title: item.name || `日誌 ${i + 1}`,
          href: "#research/book",
          image: item.image || { src: bookImg, alt: "教師日誌" },
        }))
      : [{ title: "教師日誌", href: "#research/book", image: { src: bookImg, alt: "教師日誌" } }],
  });
  return sections;
}

function renderIntroSectionBlock(section) {
  const layout = section.layout || "split";
  const sectionEl = el("section", {
    class: `yearIntroSection yearIntroSection--${layout}`,
    id: `intro-${section.id || "block"}`,
  });

  sectionEl.appendChild(el("h2", { class: "yearSectionTitle", text: section.title || "" }));

  if (layout === "split") {
    sectionEl.appendChild(
      el("div", { class: "yearIntroSplit" }, [
        section.image?.src
          ? el("div", { class: "yearIntroSplitImg" }, [
              el("img", { src: section.image.src, alt: section.image.alt || "", loading: "lazy" }),
            ])
          : null,
        el("div", { class: "yearIntroSplitText" }, [
          section.heading ? el("h3", { class: "yearIntroHeading", text: section.heading }) : null,
          section.body ? el("p", { class: "yearIntroBody", text: section.body }) : null,
        ]),
      ])
    );
  } else if (layout === "banner") {
    sectionEl.appendChild(
      el("div", { class: "yearBanner" }, [
        el("div", { class: "yearBannerText" }, [
          el("div", { class: "yearBannerTitle", text: section.heading || "" }),
          el("div", { class: "yearBannerSub", text: section.body || "" }),
          section.subtitleEn ? el("div", { class: "yearBannerSubEn", text: section.subtitleEn }) : null,
        ]),
        section.image?.src
          ? el("div", { class: "yearBannerImg" }, [
              el("img", { src: section.image.src, alt: section.image.alt || "", loading: "lazy" }),
            ])
          : null,
      ])
    );
  } else if (layout === "video") {
    const inner = el("div", { class: "yearVideoInner" }, [
      section.image?.src
        ? el("div", { class: "yearVideoCover" }, [
            el("img", { src: section.image.src, alt: section.image.alt || "", loading: "lazy" }),
          ])
        : null,
      section.body ? el("div", { class: "yearVideoBody", text: section.body }) : null,
    ]);
    if (section.youtubeId) {
      inner.appendChild(
        el("iframe", {
          class: "yearVideoFrame",
          src: `https://www.youtube.com/embed/${encodeURIComponent(section.youtubeId)}`,
          title: section.heading || "Video",
          frameborder: "0",
          allowfullscreen: "true",
        })
      );
    }
    sectionEl.appendChild(el("div", { class: "yearVideo" }, [inner]));
    if (section.caption) sectionEl.appendChild(el("div", { class: "yearVideoCaption", text: section.caption }));
  } else if (layout === "books") {
    if (section.body) sectionEl.appendChild(el("p", { class: "yearIntroBody yearIntroBody--lead", text: section.body }));
    const books = Array.isArray(section.books) ? section.books : [];
    const track = el("div", { class: "bookCarouselTrack" });
    books.forEach((book) => {
      track.appendChild(
        el(
          "a",
          {
            class: "bookCarouselItem",
            href: book.href || "#research/book",
            onclick: (e) => {
              if (String(book.href || "").startsWith("#")) {
                e.preventDefault();
                navigateFromHref(book.href);
              }
            },
          },
          [
            el("img", {
              src: book.image?.src || "./assets/images/placeholder-book.svg",
              alt: book.image?.alt || book.title || "日誌",
              loading: "lazy",
            }),
            book.title ? el("span", { class: "bookCarouselLabel", text: book.title }) : null,
          ]
        )
      );
    });
    const viewport = el("div", { class: "bookCarouselViewport" }, [track]);
    const prev = el("button", { class: "bookCarouselBtn bookCarouselBtnPrev", type: "button", text: "‹", "aria-label": "上一組" });
    const next = el("button", { class: "bookCarouselBtn bookCarouselBtnNext", type: "button", text: "›", "aria-label": "下一組" });
    prev.addEventListener("click", () => {
      viewport.scrollBy({ left: -220, behavior: "smooth" });
    });
    next.addEventListener("click", () => {
      viewport.scrollBy({ left: 220, behavior: "smooth" });
    });
    sectionEl.appendChild(el("div", { class: "bookCarousel" }, [prev, viewport, next]));
  }

  return sectionEl;
}

function scrollToIntroSection() {
  const target = getHashQuery().get("section");
  if (!target) return;
  requestAnimationFrame(() => {
    document.getElementById(`intro-${target}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderYearDetailPage(detail) {
  const root = el("div", { class: "yearDetailPage" });

  root.appendChild(
    el("div", { class: "yearDetailBack" }, [
      el("button", {
        class: "yearBackBtn",
        type: "button",
        text: "← 返回歷年網站",
        onclick: () => setRoute("classics", "years"),
      }),
    ])
  );

  if (detail.poster?.src || detail.title) {
    root.appendChild(
      el("section", { class: "yearHero" }, [
        detail.poster?.src
          ? el("div", { class: "yearHeroPoster" }, [
              el("img", { src: detail.poster.src, alt: detail.poster.alt || detail.title || "", loading: "lazy" }),
            ])
          : el("div"),
        el("div", { class: "yearHeroText" }, [
          el("h1", { class: "yearHeroTitle", text: detail.title || "" }),
          el("p", { class: "yearHeroSub", text: detail.subtitle || "" }),
        ]),
      ])
    );
  }

  const sections = buildIntroSectionsFromLegacy(detail);
  const nav = el("nav", { class: "yearIntroNav", "aria-label": "本年度介紹" });
  sections.forEach((sec) => {
    nav.appendChild(
      el(
        "a",
        {
          class: "yearIntroNavItem",
          href: yearIntroHref(detail.year || getHashQuery().get("year") || "", sec.id),
          text: sec.title || sec.id,
          onclick: (e) => {
            e.preventDefault();
            navigateFromHref(yearIntroHref(detail.year || getHashQuery().get("year") || "", sec.id));
            scrollToIntroSection();
          },
        }
      )
    );
  });
  root.appendChild(nav);

  sections.forEach((sec) => root.appendChild(renderIntroSectionBlock(sec)));

  return root;
}

function renderExhibitionAboutPage(exhibition) {
  const about = exhibition.about || {};
  const blocks = Array.isArray(about.blocks) ? about.blocks : [];
  const site = window.SITE_CONTENT?.site || {};
  const logo = site.logo || {};

  const textCol = el("div", { class: "aboutTextCol" }, [
    el("h1", { class: "aboutHeading", text: about.heading || "關於展覽" }),
    ...blocks.map((b) => el("p", { class: "aboutParagraph", text: b.body || "" })),
  ]);

  const doorLabel = exhibition.doorLabel || "開幕展";
  const detailId = exhibition.yearDetailId || "";
  const doorHref = detailId ? yearIntroHref(detailId) : "#home/index";

  return el("div", { class: "aboutPage" }, [
    el("div", { class: "aboutLayout" }, [
      el("div", { class: "aboutLogoCol" }, [
        logo.src ? el("img", { class: "aboutLogo", src: logo.src, alt: logo.alt || site.title || "" }) : null,
        el("div", { class: "aboutLogoSub", text: site.subtitle || "" }),
      ]),
      textCol,
    ]),
    el(
      "a",
      {
        class: "aboutDoorLink",
        href: doorHref,
        onclick: (e) => {
          e.preventDefault();
          navigateFromHref(doorHref);
        },
      },
      [el("span", { class: "aboutDoorIcon", "aria-hidden": "true" }), el("span", { text: doorLabel })]
    ),
  ]);
}

function renderClassicsPage(main, route) {
  const data = window.SITE_CONTENT?.classics || {};
  const section = normalizeSection(route.section || "years");
  const params = getHashQuery();
  let content;
  let subnav = section;

  if (section === "years") {
    content = renderClassicsTimeline();
  } else if (section === "year") {
    const yearKey = params.get("year") || "2021";
    const detail = (data.yearDetails || {})[yearKey] || (data.yearDetails || {})["2021"];
    content = detail ? renderYearDetailPage(detail) : el("div");
    subnav = "years";
  } else if (section === "practice") {
    const yearKey = params.get("year") || "2021";
    navigateFromHref(yearIntroHref(yearKey));
    return;
  } else if (section === "media") {
    const yearKey = params.get("year") || "2021";
    navigateFromHref(yearIntroHref(yearKey, "media"));
    return;
  } else {
    content = el("div");
  }

  main.innerHTML = "";
  main.appendChild(
    wrapInnerPage(content, {
      activeNav: "classics",
      activeSubnav: subnav,
      showSubnav: true,
    })
  );

  if (section === "year") scrollToIntroSection();
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
  if (section === "about") {
    content = renderExhibitionAboutPage(exhibition);
  } else {
    content = renderExhibitionAboutPage(exhibition);
  }

  main.innerHTML = "";
  main.appendChild(wrapInnerPage(content, { activeNav: "" }));
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

function renderResearchPage(main, route) {
  const container = el("div");
  renderResearch(container, route);
  const pageEl = container.firstChild;
  if (pageEl) {
    pageEl.querySelector(".backRow")?.remove();
    pageEl.querySelector(".hero")?.remove();
    main.innerHTML = "";
    main.appendChild(wrapInnerPage(pageEl, { activeNav: "research" }));
  }
}
