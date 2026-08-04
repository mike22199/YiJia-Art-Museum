/* 成為自由人特展 — 心理測驗體驗 Q1–Q10 */

(function () {
  const LEGACY_2019_URL = "#";
  const CONCEPT_BG = "./assets/images/成為自由人/成為自由人片頭.jpg";
  const CONCEPT_LOGO = "./assets/images/Freedom Door/理念頁LOGO.png?v=20260803ak";
  const QUES_BG = "./assets/images/成為自由人/BG_Ques.png";

  const INTRO_LEAD = "你的體質帶有什麼「自由韌性」？";
  const INTRO_BODY = "從韓戰反共義士的伯伯出發，找到屬於你的生命韌性。";

  const HISTORY_TEXT = [
    "1953年，韓戰簽署停戰協定，聯軍將俘獲的戰俘，陸續送往釜山收容所。在收容所，聯軍依國際戰爭法與日內瓦公約規定，未將戰俘分別隔離，華籍與北韓戰俘是同居雜處的。後因華籍與韓籍衝突，而區分開來、分別管理，其後果則是華籍戰俘間又開始有親共反共的衝突。第四次戰役後，共軍人海戰術下，被聯軍俘獲的戰俘大增，釜山收容所營房不夠分配，而決定遷往巨濟島。1951年5月30日，移至巨濟島，華籍戰俘多被安置在七二與八六聯隊當中。此時，在戰俘營中發生反共與親共的爭執。",
    "1952年2月27日，美國在志願遣俘原則確立後，4月8日，透過甄別行動對戰俘進行分類，以便區別願遣返與不願遣返之戰俘，其中的反共戰俘約1萬4千餘人，他們堅決拒絕返回共產黨統治下的中國，決定來臺定居，是所謂「韓戰反共義士」。4月13日，甄別工作結束，通知遷往濟州島的莫瑟浦。最初他們被收容於釜山收容所，後遷往巨濟島，分為七二與八六聯隊，此時戰俘營發生反共與親共的爭執，約7,000人的親共戰俘屈居下風，因此將其安置於六二聯隊。約1萬4千人的反共戰俘，堅決反對返回共產黨統治下的中國，決定以「一顆心回臺灣，一條命滅共匪」的志願，選擇來臺定居，是所謂「韓戰反共義士」…",
  ];

  function getConceptAssets() {
    const about = window.SITE_CONTENT?.exhibitions?.["exhibition-right"]?.about || {};
    return {
      bannerSrc: about.banner?.src || CONCEPT_BG,
      logoSrc: about.logo?.src || CONCEPT_LOGO,
      logoAlt: about.logo?.alt || "義家藝館",
    };
  }

  function renderConceptFrame({ lead, heading, paragraphs, compact, nextLabel, onNext }) {
    const { bannerSrc, logoSrc, logoAlt } = getConceptAssets();
    const textChildren = [];
    if (lead) textChildren.push(el("p", { class: "aboutConceptLead", text: lead }));
    if (heading) textChildren.push(el("h1", { class: "aboutConceptHeading", text: heading }));
    (paragraphs || []).forEach((text) => {
      const body = String(text || "").trim();
      if (body) textChildren.push(el("p", { class: "aboutConceptParagraph", text: body }));
    });

    return el("div", { class: "aboutPage aboutPage--concept" }, [
      el(
        "div",
        {
          class: "exhibitionWindow aboutConceptStage",
          "aria-label": "特展視窗",
        },
        [
          el("img", {
            class: "aboutConceptBg",
            src: bannerSrc,
            alt: "",
            "aria-hidden": "true",
            loading: "eager",
          }),
          el("div", { class: "aboutConceptDim", "aria-hidden": "true" }),
          el("img", {
            class: "aboutConceptLogo",
            src: logoSrc,
            alt: logoAlt,
            loading: "eager",
          }),
          el(
            "div",
            {
              class: compact
                ? "aboutConceptContent aboutConceptContent--compact"
                : "aboutConceptContent",
            },
            textChildren
          ),
          el(
            "button",
            {
              class: "aboutConceptNext",
              type: "button",
              text: nextLabel || "Next ▶",
              onclick: onNext,
            }
          ),
        ]
      ),
    ]);
  }

  /** 自動縮小字級，讓區塊內文一次看完（不需上下捲動） */
  function fitTextInBox(box, { minScale = 0.42, maxScale = 1 } = {}) {
    if (!box) return;
    const cs = getComputedStyle(box);
    if (cs.display === "none" || box.clientHeight < 4) return;

    box.style.overflow = "hidden";
    let lo = minScale;
    let hi = maxScale;
    let best = minScale;
    // 二分搜：找仍能完整放入的最大縮放
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      box.style.setProperty("--fp-fit", String(mid));
      void box.offsetHeight;
      const fits =
        box.scrollHeight <= box.clientHeight + 1 &&
        box.scrollWidth <= box.clientWidth + 1;
      if (fits) {
        best = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    box.style.setProperty("--fp-fit", String(Math.round(best * 1000) / 1000));
  }

  function scheduleFitText(rootEl) {
    const run = () => {
      rootEl
        ?.querySelectorAll?.(
          ".fpQuesPaper, .fpQ1NoCopy, .aboutConceptContent, .fpSubmitCopy"
        )
        ?.forEach((box) => fitTextInBox(box));
    };
    const kick = () => requestAnimationFrame(() => requestAnimationFrame(run));
    if (document.fonts?.ready) {
      document.fonts.ready.then(kick).catch(kick);
    } else {
      kick();
    }
  }

  window.FIFI_fitExhibitionText = scheduleFitText;

  /** Q1–Q9 共用特展視窗＋BG_Ques；art 圖層在下，LOGO 蓋在 PNG 上 */
  function renderQuestionFrame({ artSrc, showLogo = true, children }) {
    const { logoSrc, logoAlt } = getConceptAssets();
    const layers = [
      el("img", {
        class: "aboutConceptBg",
        src: QUES_BG,
        alt: "",
        "aria-hidden": "true",
        loading: "eager",
      }),
    ];
    if (artSrc) {
      layers.push(
        el("img", {
          class: "fpQuesArt",
          src: artSrc,
          alt: "",
          "aria-hidden": "true",
          loading: "eager",
        })
      );
    }
    layers.push(el("div", { class: "fpQuesUi" }, children || []));
    // LOGO 最後掛上，確保蓋在 PNG 圖層前面
    if (showLogo !== false) {
      layers.push(
        el("img", {
          class: "aboutConceptLogo fpQuesLogo",
          src: logoSrc,
          alt: logoAlt,
          loading: "eager",
        })
      );
    }
    return el("div", { class: "aboutPage aboutPage--concept" }, [
      el(
        "div",
        {
          class: "exhibitionWindow aboutConceptStage fpQuesStage",
          "aria-label": "特展視窗",
        },
        layers
      ),
    ]);
  }
  const Q1_NO_LEAD = "你可能去到中國或北韓......";
  const Q1_NO_BODY = [
    "韓戰停戰後，並非所有被俘的中國與北韓戰俘都來到臺灣，許多人在戰爭結束後走向截然不同的人生。1953年停戰協定簽署後，部分戰俘選擇返回中國大陸，其中一些戰俘原先曾表達反共立場，卻因擔憂家人遭受牽連，同時對臺灣前景缺乏信心，或希望重返故鄉，而在遣返說明期結束前改變決定。返國後，他們雖未被視為叛逃者，但仍須接受政治審查與思想改造；不少人失去原有軍職，被安排至工廠、農村或地方單位工作。文化大革命期間，部分曾被俘者更被貼上「投降分子」或「叛徒」標籤，再度遭受批鬥與監控。",
    "而去到北韓的戰俘處境同樣艱難。由於當局對曾被俘者抱持懷疑態度，許多人被遷往煤礦、山區農場等偏遠地區從事勞動，並被納入長期監視體系，其本人及後代在教育、職業與居住選擇上都受到限制。對這些未能來臺的戰俘而言，戰爭的結束並不代表苦難的終止，而是在中國與北韓不同的政治環境下，展開另一段充滿壓力與不確定性的漫長人生。",
  ];

  const QUESTIONS = {
    q1: {
      label: "Q1",
      art: "./assets/images/成為自由人/Q1.png",
      labelInArt: true,
      text: "1953年，韓戰簽署停戰協定，你是一位在這場戰爭中的戰俘，受聯合國的甄別確認戰俘的遣返願。你是否會以死抗拒回歸共產政權的嚴肅調查？",
      options: [
        { text: "是，我寧死拒絕共產陣營", next: "q2" },
        { text: "否，我只想活著", next: "q1no" },
      ],
    },
    q2: {
      label: "Q2",
      art: "./assets/images/成為自由人/Q2.png",
      labelInArt: true,
      paperTall: true,
      context:
        "1954年1月23日，你搭船到基隆港來到臺灣，總統夫人蔣宋美齡代表總統在碼頭上迎接你們，來到臺灣，你們不再是被俘虜的戰俘，而是光榮的反共義士。來到臺灣，你剛開始受中華民國政府的安排去到了桃園楊梅，經歷一番波折，最後來到白雞山的忠義山莊。剛開始有些不習慣，但漸漸地在這片山林找到生活的秩序…",
      text: "在這生活一陣子，生活漸漸找回規律，雖然這裡不是你的家，但也漸漸的習慣了，雖然偶爾還是會想念遠在中國的家人，某一天清晨在榮民之家醒來，你最想做的第一件事是什麼？",
      options: [
        { text: "坐下來，安靜地寫幾個字，讓心定下來", next: "q3" },
        { text: "去廚房，準備早餐，讓味道把大家喚醒", next: "q3" },
        { text: "查一查今天有沒有什麼地方可以去，早點出門", next: "q3" },
      ],
    },
    q3: {
      label: "Q3",
      art: "./assets/images/成為自由人/Q3.png",
      labelInArt: true,
      text: "戰爭結束後，來到臺灣，進到陌生環境的你，將如何展開新的生活？",
      options: [
        { text: "找尋新的職業，想就此擺脫軍人身份", next: "q4" },
        { text: "受政府安排，進到三峽榮民之家", next: "q4" },
        { text: "得到唸書的機會，希望繼續學習", next: "q4" },
      ],
    },
    q4: {
      label: "Q4",
      art: "./assets/images/成為自由人/Q4.png",
      labelInArt: true,
      text: "當有陌生人來到三峽榮民之家，想要藉由我們更加認識韓戰歷史，在與陌生人交流的時候，你會如何與對方建立感情？",
      options: [
        { text: "送他一幅親手寫的字，讓對方記得你", score: "ma", next: "q5" },
        { text: "請他吃點自己做的東西，吃了就是朋友", score: "pan", next: "q5" },
        { text: "邀他一起出去走走，路上就熟了", score: "jin", next: "q5" },
      ],
    },
    q5: {
      label: "Q5",
      art: "./assets/images/成為自由人/Q5.png",
      labelInArt: true,
      text: "在日復一日的生活中，一個自由的下午，你最可能做什麼？",
      options: [
        { text: "找一件新的事情學，哪怕笨手笨腳也想試試", score: "ma", next: "q6" },
        { text: "一個人出門晃，沒有目的地，走到哪算哪", score: "pan", next: "q6" },
        { text: "做讓自己覺得「好看」的事，寫字、畫畫、整理儀容", score: "jin", next: "q6" },
      ],
    },
    q6: {
      label: "Q6",
      art: "./assets/images/成為自由人/Q6.png",
      labelInArt: true,
      text: "如果你能留給後人一樣東西，你希望是什麼？",
      options: [
        { text: "一套帥氣的服裝，讓大家感覺你一直都在", score: "ma", next: "q7" },
        { text: "一首常唱的歌曲音檔，在想起你們時可以聽", score: "pan", next: "q7" },
        { text: "一道拿手料理的食譜，讓他們可以復刻這個味道", score: "jin", next: "q7" },
      ],
    },
    q7: {
      label: "Q7",
      art: "./assets/images/成為自由人/Q7.png",
      labelInArt: true,
      text: "你和他人的關係，通常是？",
      options: [
        { text: "話不多，但會用做的東西表示心意", score: "ma", next: "q8" },
        { text: "各走各的路，但偶爾同行一段", score: "pan", next: "q8" },
        { text: "在意對方，也在意自己怎麼出現在對方面前", score: "jin", next: "q8" },
      ],
    },
    q8: {
      label: "Q8",
      art: "./assets/images/成為自由人/Q8.png",
      labelInArt: true,
      text: "面對主流社會價值觀，當你的意志無法被貫徹時，你會？",
      options: [
        { text: "不聲張，但也不放棄，繼續做", score: "ma", next: "q9" },
        { text: "反正我也不太在意別人怎麼說，走就走了", score: "pan", next: "q9" },
        { text: "我有我自己的標準，那才是真的美", score: "jin", next: "q9" },
      ],
    },
    q9: {
      label: "Q9",
      art: "./assets/images/成為自由人/Q9.png",
      labelInArt: true,
      text: "哪一種生活方式最接近你的生活態度？",
      options: [
        { text: "在熟悉的地方，慢慢把一件事做好", score: "ma", next: "submission" },
        { text: "在陌生的街上，一個人走，反而自在", score: "pan", next: "submission" },
        { text: "在別人看不懂的地方，找到屬於自己的神聖感", score: "jin", next: "submission" },
      ],
    },
  };

  const SUBMIT_ART = "./assets/images/成為自由人/Text.png";
  const RESULT_ART = {
    jin: "./assets/images/成為自由人/KIM_New.png",
    pan: "./assets/images/成為自由人/PAM_New.png",
    ma: "./assets/images/成為自由人/MA_new.png",
  };
  const SUBMIT_MAX_LEN = 50;

  const RESULTS = {
    ma: {
      key: "ma",
      name: "馬伯伯",
      title: "沉默裡的堅守",
      subtitle: "你有馬伯伯的韌性",
      body: "你不擅長說，但你擅長留下來。情緒藏著，行動卻一直在。學攝影、做花捲，陪著一個計劃走得最久——不是因為不在乎，而是你用時間和身體說「我在這裡」。這種韌性，安靜，但很難被折斷。",
      story:
        "馬伯伯在義家藝館的陪伴下開始學習攝影，是計劃合作最久的伯伯。他情緒隱晦，但那份喜歡，藏在每一個留下來的選擇裡。",
      tags: ["用行動說話", "時間是最深的承諾", "情感藏在細節裡"],
      barLabels: { ma: "沉默堅守", pan: "移動自由", jin: "越界美感" },
    },
    pan: {
      key: "pan",
      name: "潘伯伯",
      title: "移動中的自由",
      subtitle: "你有潘伯伯的韌性",
      body: "你用移動對抗孤獨。搭最早的公車出門，一個人去湯姆熊、去紅包場聽歌，下午再回來——不是逃跑，是知道自己需要什麼。獨來獨往不是冷漠，是你找到了一種屬於自己的節奏，在世界裡自在穿行。",
      story:
        "潘伯伯是船員，去過很多國家。每天搭最早的公車離開榮家，下午回來吃飯。他去西門町玩湯姆熊、聽紅包場，最後也逝於西門町——那是他自己的地方。",
      tags: ["移動是一種自由", "獨處是一種選擇", "在陌生裡找到自在"],
      barLabels: { ma: "沉默堅守", pan: "移動自由", jin: "越界美感" },
    },
    jin: {
      key: "jin",
      name: "金伯伯",
      title: "越界而生的美感",
      subtitle: "你有金伯伯的韌性",
      body: "你活在自己的美學標準裡，那個標準比社會的眼光更重要。書法、線描、天主教的美感敬拜觀音、不在意世俗眼光的婚姻——金伯伯的韌性是溫柔的越界，用美對抗規矩，用在乎對抗偏見。",
      story:
        "金伯伯在意的穿著，會寫書法與線描填色，用天主教的美感在敬拜觀音。和早逝的母親感情深厚，那份對美的執著，或許從那裡就種下了。",
      tags: ["用美感抵抗規矩", "在意，是一種勇氣跨越界線", "溫柔而堅定"],
      barLabels: { ma: "沉默堅守", pan: "移動自由", jin: "越界美感" },
    },
  };

  /** 統計長條：100% 時佔特展視窗寬度％（可在 CSS 對齊後微調） */
  const CHART_BAR_FULL_WIDTH = 12;

  const GALLERY_LAYOUT = [
    { left: "6%", top: "16%", rotate: "-4deg", w: "22%" },
    { left: "32%", top: "12%", rotate: "3deg", w: "24%" },
    { left: "62%", top: "15%", rotate: "-2deg", w: "22%" },
    { left: "10%", top: "42%", rotate: "2deg", w: "24%" },
    { left: "40%", top: "40%", rotate: "-3deg", w: "23%" },
    { left: "68%", top: "44%", rotate: "4deg", w: "22%" },
    { left: "22%", top: "64%", rotate: "-1deg", w: "24%" },
    { left: "52%", top: "62%", rotate: "2deg", w: "26%" },
  ];

  function navigateHome() {
    if (typeof navigateFromHref === "function") navigateFromHref("#home");
    else location.hash = "#home";
  }

  function navigateHref(href) {
    if (typeof navigateFromHref === "function") navigateFromHref(href);
    else location.hash = href.replace(/^#/, "#");
  }

  function defaultScores() {
    return { ma: 0, pan: 0, jin: 0 };
  }

  function addScore(scores, key) {
    if (!key || !(key in scores)) return;
    scores[key] += 1;
  }

  /** 依 Q4–Q9（之後可擴到 Q2–Q9）得分換算百分比 */
  function computeBars(scores) {
    const ma = Number(scores?.ma || 0);
    const pan = Number(scores?.pan || 0);
    const jin = Number(scores?.jin || 0);
    const total = ma + pan + jin;
    if (!total) return { ma: 34, pan: 33, jin: 33 };
    return {
      ma: Math.round((ma / total) * 100),
      pan: Math.round((pan / total) * 100),
      jin: Math.round((jin / total) * 100),
    };
  }

  function pickResult(scores) {
    const order = ["ma", "pan", "jin"];
    let best = "ma";
    let bestScore = -1;
    order.forEach((key) => {
      const val = scores[key] || 0;
      if (val > bestScore) {
        bestScore = val;
        best = key;
      }
    });
    const base = RESULTS[best] || RESULTS.ma;
    return { ...base, bars: computeBars(scores) };
  }

  /** 只疊長條＋％；標籤已在底圖上 */
  function buildScoreChart(bars) {
    const fullW = CHART_BAR_FULL_WIDTH;
    const nodes = [];

    ["ma", "pan", "jin"].forEach((key) => {
      const pct = Math.max(0, Math.min(100, Number(bars[key] || 0)));

      if (pct >= 18) {
        const barW = Math.max((pct / 100) * fullW, 2);
        nodes.push(
          el("div", {
            class: `fpChartBar fpChartBar--${key}`,
            style: `width:${barW}%`,
            "aria-hidden": "true",
          })
        );
      } else {
        nodes.push(
          el("div", {
            class: `fpChartOrb fpChartOrb--${key}${pct <= 0 ? " fpChartOrb--empty" : ""}`,
            "aria-hidden": "true",
          })
        );
      }

      nodes.push(
        el("span", {
          class: `fpChartPct fpChartPct--${key}`,
          text: `${pct}%`,
        })
      );
    });

    return el("div", { class: "fpChartLayer", "aria-label": "自由韌性統計" }, nodes);
  }

  function truncateText(text, max = 36) {
    const raw = String(text || "").trim();
    if (raw.length <= max) return raw;
    return `${raw.slice(0, max)}…`;
  }

  function sitePublicOrigin() {
    const configured = String(window.SITE_PUBLIC_URL || window.SITE_CONTENT?.site?.publicUrl || "").trim();
    if (configured) return configured.replace(/\/$/, "");
    const path = window.location.pathname.replace(/[^/]*$/, "");
    return `${window.location.origin}${path}`.replace(/\/$/, "") || window.location.origin;
  }

  function sharePageUrl(resultKey) {
    return `${sitePublicOrigin()}/share/${resultKey}.html`;
  }

  function openFacebookShare(resultKey, result, statusEl) {
    const url = sharePageUrl(resultKey);
    const quote = buildShareText(result || { key: resultKey, title: "", subtitle: "", body: "" });

    // 行動裝置：系統分享可直接帶上文案＋網址
    if (typeof navigator.share === "function" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || "")) {
      navigator
        .share({
          title: `${result?.title || "成為自由人"}｜義家藝館`,
          text: quote,
          url,
        })
        .then(() => {
          if (statusEl) statusEl.textContent = "已開啟系統分享";
        })
        .catch(() => {
          // 使用者取消或不支援時改走 Facebook 對話框
          openFacebookSharerDialog(url, quote, statusEl);
        });
      return;
    }

    openFacebookSharerDialog(url, quote, statusEl);
  }

  function openFacebookSharerDialog(url, quote, statusEl) {
    // 先複製：多數情況下 Facebook 不會自動貼上，使用者可在分享框 Ctrl+V / ⌘V
    copyShareText(quote, null).then((ok) => {
      if (statusEl) {
        statusEl.textContent = ok
          ? "已開啟 Facebook；文案已複製，請在分享框按 Ctrl+V（Mac：⌘V）貼上"
          : "已開啟 Facebook；若沒有文案請回結果頁按「複製文字」";
      }
    });

    // quote 參數：部分地區／帳號仍會預填到貼文（Facebook 不保證）
    const sharer = new URL("https://www.facebook.com/sharer/sharer.php");
    sharer.searchParams.set("u", url);
    sharer.searchParams.set("quote", quote);
    window.open(sharer.toString(), "facebook-share", "width=620,height=540,noopener,noreferrer");
  }

  async function copyShareText(text, statusEl) {
    try {
      await navigator.clipboard.writeText(text);
      if (statusEl) statusEl.textContent = "已複製分享文字";
      return true;
    } catch {
      if (statusEl) statusEl.textContent = "無法複製，請手動選取文字";
      return false;
    }
  }

  function buildShareText(result) {
    return [
      `我剛完成了「成為自由人」心理測驗，結果是「${result.title}」——${result.subtitle}。`,
      result.body || "",
      `一起來測測你的自由韌性：${sharePageUrl(result.key)}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  function showModal(root, text) {
    const overlay = el("div", { class: "fpModalOverlay sitePopupOverlay" });
    const box = el("div", { class: "fpModal sitePopupPanel" });
    box.appendChild(
      el(
        "button",
        {
          class: "fpModalClose sitePopupClose",
          type: "button",
          "aria-label": "關閉",
          onclick: () => overlay.remove(),
        },
        [
          el("img", {
            class: "sitePopupCloseIcon",
            src: "./assets/images/PopUp_Cross.png",
            alt: "",
            "aria-hidden": "true",
          }),
        ]
      )
    );
    box.appendChild(el("p", { class: "fpModalBody", text: String(text || "") }));
    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
    root.appendChild(overlay);
  }

  function renderActionsRow(buttons) {
    return el("div", { class: "fpNavRow" }, buttons);
  }

  function renderEndNav(restart) {
    return renderActionsRow([
      el("button", { class: "fpNavBtn", type: "button", text: "再測一次", onclick: restart }),
      el("button", { class: "fpNavBtn", type: "button", text: "回首頁", onclick: navigateHome }),
      el("button", {
        class: "fpNavBtn",
        type: "button",
        text: "推開自由門",
        onclick: () => navigateHref("#exhibition-left/experience"),
      }),
      el("button", {
        class: "fpNavBtn",
        type: "button",
        text: "2019成為一個人網站",
        onclick: () => {
          if (LEGACY_2019_URL && LEGACY_2019_URL !== "#") window.open(LEGACY_2019_URL, "_blank", "noopener");
        },
      }),
    ]);
  }

  function renderFreedomPersonExperience() {
    const root = el("div", { class: "fpExperience" });
    let stage = el("div", { class: "fpStage" });
    root.appendChild(stage);

    const state = {
      scene: "intro",
      scores: defaultScores(),
      selectedOption: null,
      submissionAnswer: "",
      gallery: [],
      galleryLoading: false,
      galleryError: "",
      result: null,
    };

    function restart() {
      state.scene = "intro";
      state.scores = defaultScores();
      state.selectedOption = null;
      state.submissionAnswer = "";
      state.gallery = [];
      state.galleryLoading = false;
      state.galleryError = "";
      state.result = null;
      redraw();
    }

    function goScene(next) {
      state.scene = next;
      state.selectedOption = null;
      redraw();
    }

    function recordOption(option) {
      if (option.score) addScore(state.scores, option.score);
      goScene(option.next);
    }

    function prepareQuizStage() {
      root.className = "fpExperience";
      root.innerHTML = "";
      stage = el("div", { class: "fpStage" });
      root.appendChild(stage);
      return stage;
    }

    let fitObserver = null;
    function observeFitStage() {
      const stageEl = root.querySelector(".fpQuesStage, .aboutConceptStage");
      if (!stageEl) return;
      if (!fitObserver) {
        fitObserver = new ResizeObserver(() => scheduleFitText(root));
      }
      fitObserver.disconnect();
      fitObserver.observe(stageEl);
    }

    function renderIntro() {
      root.className = "fpExperience fpExperience--concept";
      root.innerHTML = "";
      root.appendChild(
        renderConceptFrame({
          lead: INTRO_LEAD,
          paragraphs: [INTRO_BODY],
          compact: true,
          nextLabel: "Next ▶",
          onNext: () => goScene("history"),
        })
      );
      scheduleFitText(root);
    }

    function renderHistory() {
      root.className = "fpExperience fpExperience--concept";
      root.innerHTML = "";
      root.appendChild(
        renderConceptFrame({
          paragraphs: HISTORY_TEXT,
          nextLabel: "Next ▶",
          onNext: () => goScene("q1"),
        })
      );
      scheduleFitText(root);
    }

    function renderQuestion(key) {
      const q = QUESTIONS[key];
      if (!q) return;

      const confirmSelected = () => {
        if (!state.selectedOption) return;
        recordOption(state.selectedOption);
      };

      const choices = el("div", { class: "fpQuesChoices" });
      q.options.forEach((opt) => {
        const selected = state.selectedOption === opt;
        choices.appendChild(
          el("button", {
            class: selected ? "fpQuesChoice fpQuesChoice--selected" : "fpQuesChoice",
            type: "button",
            text: opt.text,
            onclick: () => {
              state.selectedOption = opt;
              redraw();
            },
          })
        );
      });

      const uiChildren = [];
      if (!q.labelInArt && q.label) {
        uiChildren.push(el("div", { class: "fpQuesLabel", text: q.label }));
      }
      uiChildren.push(
        el("div", { class: q.paperTall ? "fpQuesPaper fpQuesPaper--tall" : "fpQuesPaper" }, [
          q.context ? el("p", { class: "fpQuesPaperContext", text: q.context }) : null,
          el("p", { class: "fpQuesPaperText", text: q.text }),
        ]),
        choices,
        el("button", {
          class: state.selectedOption
            ? "aboutConceptNext"
            : "aboutConceptNext aboutConceptNext--disabled",
          type: "button",
          text: "Next ▶",
          onclick: confirmSelected,
        })
      );

      root.className = "fpExperience fpExperience--concept";
      root.innerHTML = "";
      root.appendChild(
        renderQuestionFrame({
          artSrc: q.art,
          showLogo: true,
          children: uiChildren,
        })
      );
      scheduleFitText(root);
    }

    function renderQ1No() {
      root.className = "fpExperience fpExperience--concept";
      root.innerHTML = "";
      root.appendChild(
        renderQuestionFrame({
          artSrc: "./assets/images/成為自由人/Q1_no.png",
          showLogo: true,
          children: [
            el("div", { class: "fpQ1NoCopy" }, [
              el("p", { class: "fpQ1NoLead", text: Q1_NO_LEAD }),
              ...Q1_NO_BODY.map((p) => el("p", { class: "fpQ1NoBody", text: p })),
            ]),
            el("button", {
              class: "aboutConceptNext aboutConceptNext--wide",
              type: "button",
              text: "如果人生可以重來 IF... ▶",
              onclick: () => restart(),
            }),
          ],
        })
      );
      scheduleFitText(root);
    }

    function renderSubmission() {
      const promptA =
        "反共義士們終其一生，或許未曾真正理解或體驗自由。在受限制、受規訓的生活中，他們可能透過手作、旅行、打扮自己等方式，為日常保留一點屬於自己的空間。";
      const promptB =
        "當你面對生活中的不自由或壓迫，自己無法完全按照心意生活時，你會用什麼方式，讓自己重新找回一點自由或平衡？";

      const counter = el("div", {
        class: "fpSubmitCount",
        text: `${Math.min(state.submissionAnswer.length, SUBMIT_MAX_LEN)}/${SUBMIT_MAX_LEN}字`,
      });
      const statusEl = el("div", { class: "fpSubmitStatus", text: "" });
      const textarea = el("textarea", {
        class: "fpSubmitInput",
        placeholder: "在此輸入......",
        maxlength: String(SUBMIT_MAX_LEN),
        value: state.submissionAnswer.slice(0, SUBMIT_MAX_LEN),
        oninput: (e) => {
          const next = String(e.target.value || "").slice(0, SUBMIT_MAX_LEN);
          state.submissionAnswer = next;
          e.target.value = next;
          counter.textContent = `${next.length}/${SUBMIT_MAX_LEN}字`;
        },
      });

      async function proceedToGallery({ skip = false } = {}) {
        statusEl.textContent = "";
        if (!skip && state.submissionAnswer.trim()) {
          const api = window.FreedomPersonSanity;
          if (api?.createSubmission) {
            try {
              statusEl.textContent = "送出中…";
              const res = await api.createSubmission({
                answer: state.submissionAnswer.trim(),
              });
              statusEl.textContent = res.message || "已送出";
            } catch (err) {
              statusEl.textContent = err?.message || "送出失敗";
              return;
            }
          }
        }
        state.result = pickResult(state.scores);
        goScene("gallery");
        loadGallery();
      }

      root.className = "fpExperience fpExperience--concept";
      root.innerHTML = "";
      root.appendChild(
        renderQuestionFrame({
          artSrc: SUBMIT_ART,
          showLogo: false,
          children: [
            el("div", { class: "fpSubmitCopy" }, [
              el("p", { class: "fpSubmitPrompt", text: promptA }),
              el("p", { class: "fpSubmitPrompt", text: promptB }),
            ]),
            el("div", { class: "fpSubmitBox" }, [textarea, counter]),
            statusEl,
            el("div", { class: "fpSubmitActions" }, [
              el("button", {
                class: "fpSubmitBtn",
                type: "button",
                text: "略過",
                onclick: () => proceedToGallery({ skip: true }),
              }),
              el("button", {
                class: "fpSubmitBtn",
                type: "button",
                text: "發佈",
                onclick: () => proceedToGallery({ skip: false }),
              }),
            ]),
          ],
        })
      );
      scheduleFitText(root);
    }

    async function loadGallery() {
      if (state.galleryLoading) return;
      state.galleryLoading = true;
      state.galleryError = "";
      const api = window.FreedomPersonSanity;
      try {
        state.gallery = api?.fetchApprovedSubmissions ? await api.fetchApprovedSubmissions(24) : [];
      } catch (err) {
        state.galleryError = err?.message || "讀取徵稿失敗";
        state.gallery = [];
      } finally {
        state.galleryLoading = false;
        if (state.scene === "gallery") redraw();
      }
    }

    function renderGallery() {
      const wall = el("div", { class: "fpWallBoard" });

      if (state.galleryLoading) {
        wall.appendChild(el("p", { class: "fpWallEmpty", text: "載入中…" }));
      } else if (state.galleryError) {
        wall.appendChild(el("p", { class: "fpWallEmpty", text: state.galleryError }));
      } else if (!state.gallery.length) {
        wall.appendChild(
          el("p", {
            class: "fpWallEmpty",
            text: "尚無通過審核的徵稿，歡迎成為第一位。",
          })
        );
      } else {
        state.gallery.forEach((item, index) => {
          const layout = GALLERY_LAYOUT[index % GALLERY_LAYOUT.length];
          const full = String(item.answer || "").trim();
          wall.appendChild(
            el("button", {
              class: "fpWallCard",
              type: "button",
              title: full,
              style: `left:${layout.left};top:${layout.top};width:${layout.w};transform:rotate(${layout.rotate})`,
              onclick: () => showModal(root, full),
            }, [
              el("span", { class: "fpWallCardText", text: truncateText(full, 42) }),
            ])
          );
        });
      }

      root.className = "fpExperience fpExperience--concept";
      root.innerHTML = "";
      root.appendChild(
        renderQuestionFrame({
          artSrc: SUBMIT_ART,
          showLogo: false,
          children: [
            el("h1", { class: "fpWallTitle", text: "點看看大家的自由徵稿" }),
            wall,
            el("button", {
              class: "fpSubmitBtn fpWallNext",
              type: "button",
              text: "查看你的自由韌性結果 ▶",
              onclick: () => {
                if (!state.result) state.result = pickResult(state.scores);
                goScene("result");
              },
            }),
          ],
        })
      );
    }

    function renderResult() {
      const result = state.result || pickResult(state.scores);
      state.result = result;
      const bars = result.bars || computeBars(state.scores);
      const artSrc = RESULT_ART[result.key] || RESULT_ART.ma;
      const shareText = buildShareText(result);
      const shareStatus = el("div", { class: "fpResultShareStatus", text: "" });

      root.className = "fpExperience fpExperience--concept";
      root.innerHTML = "";
      root.appendChild(
        renderQuestionFrame({
          artSrc,
          showLogo: false,
          children: [
            el("div", { class: "fpResultUi" }, [
              buildScoreChart(bars),
              el("button", {
                class: "fpResultShareBtn fpResultShareBtn--fb",
                type: "button",
                text: "Facebook",
                onclick: () => openFacebookShare(result.key, result, shareStatus),
              }),
              el("button", {
                class: "fpResultShareBtn fpResultShareBtn--copy",
                type: "button",
                text: "複製文字",
                onclick: () => copyShareText(shareText, shareStatus),
              }),
              el("button", {
                class: "fpResultShareBtn fpResultShareBtn--retry",
                type: "button",
                text: "再測一次",
                onclick: restart,
              }),
              shareStatus,
            ]),
          ],
        })
      );
    }

    function redraw() {
      const scrollY = window.scrollY;
      switch (state.scene) {
        case "intro":
          renderIntro();
          break;
        case "history":
          renderHistory();
          break;
        case "q1no":
          renderQ1No();
          break;
        case "submission":
          renderSubmission();
          break;
        case "gallery":
          renderGallery();
          break;
        case "result":
          renderResult();
          break;
        default:
          if (String(state.scene).startsWith("q")) renderQuestion(state.scene);
          else renderIntro();
      }
      // 換場景時維持目前滾動位置（特展視窗對齊畫面）
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        observeFitStage();
        scheduleFitText(root);
      });
    }

    redraw();
    return root;
  }

  window.renderFreedomPersonExperience = renderFreedomPersonExperience;
})();
