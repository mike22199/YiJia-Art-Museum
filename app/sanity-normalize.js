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
      const [, id, ext] = ref.match(/^image-([a-f0-9]+)-(\w+)$/) || [];
      if (id && ext) {
        const projectId = window.SANITY_PROJECT_ID || "";
        const dataset = window.SANITY_DATASET || "production";
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${ext}`;
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
        href: b.href || "#research/book",
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

  window.normalizeSanitySiteContent = function normalizeSanitySiteContent(doc, fallback) {
    const base = fallback && typeof fallback === "object" ? structuredClone(fallback) : {};

    if (doc.technicalJson) {
      try {
        const tech = JSON.parse(doc.technicalJson);
        Object.assign(base, tech);
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
    if (doc.footerYoutube) base.site.footer.social.youtube = doc.footerYoutube;
    if (doc.footerFacebook) base.site.footer.social.facebook = doc.footerFacebook;

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

    return base;
  };
})();
