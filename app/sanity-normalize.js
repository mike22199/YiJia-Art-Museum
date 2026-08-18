/**
 * 將 Sanity 文件轉成前端使用的 SITE_CONTENT 格式
 */
(function () {
  function sanityImageUrl(image) {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (image.src) return image.src;
    const ref = image.asset?._ref || image._ref;
    if (ref && typeof ref === "string" && ref.startsWith("image-")) {
      const [, id, dimensions, ext] =
        ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/) || [];
      if (id && ext) {
        const projectId = window.SANITY_PROJECT_ID || "";
        const dataset = window.SANITY_DATASET || "production";
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
      }
    }
    if (image.asset?.url) return image.asset.url;
    return null;
  }

  function toImageObj(image, altFallback) {
    const src = sanityImageUrl(image);
    if (!src) return null;
    const alt = image?.alt || altFallback || "";
    return { src, alt };
  }

  function defaultLayout(id) {
    if (id === "website") return "split";
    if (id === "practice") return "banner";
    if (id === "media") return "video";
    if (id === "journal") return "books";
    return "split";
  }

  function mapIntroSection(sec) {
    if (!sec) return null;
    const id = sec.id || "website";
    const out = {
      id,
      title: sec.title || "",
      heading: sec.heading || "",
      body: sec.body || "",
      layout: sec.layout || defaultLayout(id),
    };
    if (sec.subtitleEn) out.subtitleEn = sec.subtitleEn;
    if (sec.caption) out.caption = sec.caption;
    const img = toImageObj(sec.image, sec.title);
    if (img) out.image = img;
    if (id === "journal" && Array.isArray(sec.books)) {
      out.books = sec.books.map((b) => ({
        title: b.title || "",
        href: b.href || "#archive/research",
        image: toImageObj(b.cover, b.title) || {
          src: "./assets/images/placeholder-book.svg",
          alt: b.title || "日誌",
        },
      }));
    }
    return out;
  }

  function mapTimelineEntry(entry) {
    const out = {
      year: entry.year || "",
      links: Array.isArray(entry.links) ? entry.links : [],
    };
    if (entry.imagePosition) out.imagePosition = entry.imagePosition;
    const img = toImageObj(entry.timelineImage, entry.year);
    if (img) out.image = img;
    return out;
  }

  function mapYearDetail(item) {
    if (!item) return null;
    const key = item.yearKey || item.year || "";
    const poster = toImageObj(item.poster, item.title);
    const introSections = (Array.isArray(item.introSections) ? item.introSections : [])
      .map(mapIntroSection)
      .filter(Boolean);
    return {
      key,
      value: {
        year: item.year || key,
        title: item.title || "",
        subtitle: item.subtitle || "",
        poster: poster || undefined,
        introSections,
      },
    };
  }

  function mapExhibition(entry, fallbackId) {
    if (!entry) return null;
    return {
      id: entry.id || fallbackId,
      doorLabel: entry.doorLabel || "開幕展",
      yearDetailId: entry.yearDetailId || "",
      about: {
        heading: entry.aboutHeading || "關於展覽",
        blocks: (Array.isArray(entry.aboutBlocks) ? entry.aboutBlocks : []).map((b) => ({
          body: b.body || "",
        })),
      },
    };
  }

  function mapArchiveCarouselSlide(slide) {
    if (!slide) return null;
    const image = toImageObj(slide.image, slide.title);
    return {
      title: slide.title || "",
      caption: slide.caption || "",
      image: image || undefined,
    };
  }

  function mapArchiveMediaItem(item) {
    if (!item) return null;
    const image = toImageObj(item.image, item.title);
    const out = {
      title: item.title || "",
      caption: item.caption || "",
      keywords: item.keywords || "",
      image: image || undefined,
    };
    if (item.youtubeUrl) {
      out.youtubeUrl = item.youtubeUrl;
      out.type = "video";
    }
    return out;
  }

  function mapArchiveMediaSection(section, sectionKey = "photos") {
    if (!section || typeof section !== "object") return null;
    const byYear = {};
    const years = [];
    const defaultPerPage = sectionKey === "videos" ? 4 : 8;

    if (Array.isArray(section.yearPacks)) {
      for (const pack of section.yearPacks) {
        const year = String(pack?.year || "").trim();
        if (!year) continue;
        years.push(year);
        byYear[year] = {
          overview: pack.overview || "",
          items: (Array.isArray(pack.items) ? pack.items : [])
            .map(mapArchiveMediaItem)
            .filter(Boolean),
        };
      }
    }

    return {
      years,
      perPage: section.perPage || defaultPerPage,
      featuredCarousel: (Array.isArray(section.featuredCarousel) ? section.featuredCarousel : [])
        .map(mapArchiveCarouselSlide)
        .filter(Boolean),
      byYear,
    };
  }

  function mapResearchJournalPage(page) {
    if (!page) return null;
    const image = toImageObj(page.image, page.title);
    const out = {
      title: page.title || "",
      body: page.body || "",
    };
    if (page.date) out.date = page.date;
    if (page.color) out.color = page.color;
    if (image) out.image = image;
    return out;
  }

  function mapArchiveResearch(section) {
    if (!section || typeof section !== "object") return null;

    const bookshelfImage = toImageObj(section.bookshelfImage, "書櫃");
    const research = {
      heading: section.heading || "研究",
      journalTitle: section.journalTitle || "藝術家教師日誌",
      bookshelf: {
        heading: section.bookshelfHeading || "書櫃典藏",
        caption: section.bookshelfCaption || "",
        image: bookshelfImage || {
          src: "./assets/images/Journal/Book-shelf.png",
          alt: "書櫃",
        },
        accessTitle: section.bookshelfAccessTitle || "索取閱讀權限",
        accessMessage:
          section.bookshelfAccessMessage || "若是要閱讀，請與網頁負責人要求存取權。",
        lockedBooks: Array.isArray(section.bookshelfLockedBooks)
          ? section.bookshelfLockedBooks
          : [],
      },
    };

    const teachers = {
      years: [],
      byYear: {},
      journals: {},
    };

    if (Array.isArray(section.yearPacks)) {
      for (const pack of section.yearPacks) {
        const year = String(pack?.year || "").trim();
        if (!year) continue;
        teachers.years.push(year);

        const yearTeachers = Array.isArray(pack.teachers) ? pack.teachers : [];
        teachers.byYear[year] = {
          title: `${year}年藝術家教師`,
          teachers: yearTeachers.map((t) => ({
            id: t.id || "",
            name: t.name || "",
          })),
        };

        const journalList = Array.isArray(pack.journals) ? pack.journals : [];
        for (const journal of journalList) {
          const teacherId = String(journal?.teacherId || "").trim();
          if (!teacherId) continue;
          const mappedJournal = {
            pages: (Array.isArray(journal.pages) ? journal.pages : [])
              .map(mapResearchJournalPage)
              .filter(Boolean),
          };
          const youtubeUrl = String(journal.youtubeUrl || journal.videoUrl || journal.video?.youtubeUrl || "").trim();
          const videoTitle = String(journal.videoTitle || journal.video?.title || "").trim();
          if (youtubeUrl) {
            mappedJournal.video = {
              youtubeUrl,
              title: videoTitle,
            };
          }
          teachers.journals[teacherId] = mappedJournal;
        }
      }
    }

    if (teachers.years.length) {
      teachers.defaultYear = teachers.years[teachers.years.length - 1];
    }

    return { research, teachers };
  }

  function mapArchiveResourceItem(item) {
    if (!item) return null;
    const out = {
      title: item.title || "",
      author: item.author || "",
      year: item.year || "",
      description: item.description || "",
    };
    if (item.href) out.href = item.href;
    if (item.linkLabel) out.linkLabel = item.linkLabel;
    if (item.preview) out.preview = item.preview;
    if (item.previewLabel) out.previewLabel = item.previewLabel;
    const cover = toImageObj(item.cover, item.title);
    if (cover) out.cover = cover;
    return out;
  }

  function mapArchiveResourceCategory(category) {
    if (!category) return null;
    return {
      id: category.id || category.title || "category",
      title: category.title || "",
      items: (Array.isArray(category.items) ? category.items : [])
        .map(mapArchiveResourceItem)
        .filter(Boolean),
    };
  }

  function mapArchiveLearningSection(section) {
    if (!section || typeof section !== "object") return null;
    return {
      heading: section.heading || "學習資源",
      intro: section.intro || "",
      categories: (Array.isArray(section.categories) ? section.categories : [])
        .map(mapArchiveResourceCategory)
        .filter(Boolean),
    };
  }

  function mapArchiveBibliographySection(section) {
    if (!section || typeof section !== "object") return null;
    const categories = (Array.isArray(section.categories) ? section.categories : [])
      .map(mapArchiveResourceCategory)
      .filter(Boolean);
    return {
      bibliographySection: {
        heading: section.heading || "延伸閱讀",
      },
      bibliographyCategories: categories,
    };
  }

  function mapArchiveTeachersSection(section) {
    if (!section || typeof section !== "object") return null;
    const byYear = {};
    const yearsFromPacks = [];

    if (Array.isArray(section.yearPacks)) {
      for (const pack of section.yearPacks) {
        const year = String(pack?.year || "").trim();
        if (!year) continue;
        yearsFromPacks.push(year);
        byYear[year] = {
          title: pack.title || `${year}年藝術家教師`,
          teachers: (Array.isArray(pack.teachers) ? pack.teachers : []).map((t) => {
            const avatar = toImageObj(t.avatar, t.name);
            return {
              id: t.id || "",
              name: t.name || "",
              summary: t.summary || "",
              bio: t.bio || "",
              avatar: avatar || undefined,
            };
          }),
        };
      }
    }

    const years =
      Array.isArray(section.years) && section.years.length
        ? section.years.map((y) => String(y).trim()).filter(Boolean)
        : yearsFromPacks;

    if (!years.length && !Object.keys(byYear).length) return null;

    return {
      years,
      defaultYear: section.defaultYear || years[years.length - 1] || "2026",
      byYear,
    };
  }

  function mergeTeacherLists(existingList, incomingList) {
    const byId = new Map();
    (Array.isArray(existingList) ? existingList : []).forEach((t) => {
      if (t?.id) byId.set(t.id, { ...t });
    });
    (Array.isArray(incomingList) ? incomingList : []).forEach((t) => {
      if (!t?.id) return;
      const prev = byId.get(t.id) || {};
      byId.set(t.id, {
        ...prev,
        ...t,
        summary: t.summary || prev.summary || "",
        bio: t.bio || prev.bio || "",
        avatar: t.avatar || prev.avatar,
      });
    });
    return Array.from(byId.values());
  }

  window.normalizeSanitySiteContent = function normalizeSanitySiteContent(doc, fallback) {
    const base = fallback && typeof fallback === "object" ? structuredClone(fallback) : {};

  // 首頁底圖／圖層／熱區：若 technicalJson 有帶也不覆寫本機 fallback（由 loadSiteContent 再保險一次）
  if (doc.technicalJson) {
      try {
        const tech = JSON.parse(doc.technicalJson);
        const {
          homeLayers: _hl,
          homeZones: _hz,
          homeIntro: _hi,
          homeImage: _hm,
          ...rest
        } = tech;
        Object.assign(base, rest);
      } catch (e) {
        console.warn("technicalJson 解析失敗", e);
      }
    }

    base.site = base.site || {};
    if (doc.siteTitle) base.site.title = doc.siteTitle;
    if (doc.siteSubtitle !== undefined) base.site.subtitle = doc.siteSubtitle;
    base.site.footer = base.site.footer || {};
    if (doc.footerAddress) base.site.footer.address = doc.footerAddress;
    if (doc.footerPhone) base.site.footer.phone = doc.footerPhone;
    if (doc.footerFax) base.site.footer.fax = doc.footerFax;
    if (doc.footerEmail) base.site.footer.email = doc.footerEmail;
    base.site.footer.social = base.site.footer.social || {};
    const youtube = String(doc.footerYoutube || "").trim();
    if (youtube && !/^https?:\/\/(www\.)?youtube\.com\/?$/i.test(youtube)) {
      base.site.footer.social.youtube = youtube;
    }
    delete base.site.footer.social.facebook;

    const homeImg = toImageObj(doc.homeImage, "首頁");
    if (homeImg) base.homeImage = homeImg.src;

    base.classics = base.classics || {};
    if (Array.isArray(doc.timelineRows)) {
      base.classics.timelineRows = doc.timelineRows.map((row) => ({
        entries: (row.entries || []).map(mapTimelineEntry),
      }));
    }

    if (Array.isArray(doc.yearDetailsList)) {
      base.classics.yearDetails = base.classics.yearDetails || {};
      for (const item of doc.yearDetailsList) {
        const mapped = mapYearDetail(item);
        if (mapped?.key) base.classics.yearDetails[mapped.key] = mapped.value;
      }
    }

    base.exhibitions = base.exhibitions || {};
    const left = mapExhibition(doc.exhibitionLeft, "exhibition-left");
    const right = mapExhibition(doc.exhibitionRight, "exhibition-right");
    if (left) base.exhibitions["exhibition-left"] = left;
    if (right) base.exhibitions["exhibition-right"] = right;

    base.archive = base.archive || {};
    const photos = mapArchiveMediaSection(doc.archivePhotos, "photos");
    if (photos) base.archive.photos = photos;
    const videos = mapArchiveMediaSection(doc.archiveVideos, "videos");
    if (videos) base.archive.videos = videos;

    const teachersMapped = mapArchiveTeachersSection(doc.archiveTeachers);
    if (teachersMapped) {
      base.archive.teachers = base.archive.teachers || {};
      const existing = base.archive.teachers;
      if (teachersMapped.years?.length) existing.years = teachersMapped.years;
      if (teachersMapped.defaultYear) existing.defaultYear = teachersMapped.defaultYear;
      existing.byYear = existing.byYear || {};
      Object.entries(teachersMapped.byYear || {}).forEach(([year, pack]) => {
        const prev = existing.byYear[year] || {};
        existing.byYear[year] = {
          title: pack.title || prev.title || `${year}年藝術家教師`,
          teachers: mergeTeacherLists(prev.teachers, pack.teachers),
        };
      });
    }

    const researchMapped = mapArchiveResearch(doc.archiveResearch);
    if (researchMapped) {
      base.archive.research = researchMapped.research;
      if (researchMapped.teachers?.years?.length) {
        base.archive.teachers = base.archive.teachers || {};
        const existing = base.archive.teachers;
        // 研究區 yearPacks 主要帶日誌；教師簡介以 archiveTeachers 為主，這裡只補 id/name
        Object.entries(researchMapped.teachers.byYear || {}).forEach(([year, pack]) => {
          const prev = (existing.byYear || {})[year] || {};
          existing.byYear = existing.byYear || {};
          existing.byYear[year] = {
            title: prev.title || pack.title || `${year}年藝術家教師`,
            teachers: mergeTeacherLists(prev.teachers, pack.teachers),
          };
        });
        existing.journals = {
          ...(existing.journals || {}),
          ...researchMapped.teachers.journals,
        };
      }
    }

    const learningMapped = mapArchiveLearningSection(doc.archiveLearningResources);
    if (learningMapped) {
      base.archive.learningResources = learningMapped;
    }

    const bibliographyMapped = mapArchiveBibliographySection(doc.archiveBibliography);
    if (bibliographyMapped) {
      if (bibliographyMapped.bibliographySection) {
        base.archive.bibliographySection = bibliographyMapped.bibliographySection;
      }
      if (Array.isArray(bibliographyMapped.bibliographyCategories)) {
        base.archive.bibliographyCategories = bibliographyMapped.bibliographyCategories;
      }
    }

    return base;
  };
})();
