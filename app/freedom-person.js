/* 成為自由人特展 — 心理測驗體驗 Q1–Q10 */

(function () {
  const LEGACY_2019_URL = "#";

  const HISTORY_TEXT = [
    "1953年，韓戰簽署停戰協定，聯軍將俘獲的戰俘，陸續送往釜山收容所。在收容所，聯軍依國際戰爭法與日內瓦公約規定，未將戰俘分別隔離，華籍與北韓戰俘是同居雜處的。後因華籍與韓籍衝突，而區分開來、分別管理，其後果則是華籍戰俘間又開始有親共反共的衝突。",
    "第四次戰役後，共軍人海戰術下，被聯軍俘獲的戰俘大增，釜山收容所營房不夠分配，而決定遷往巨濟島。1951年5月30日，移至巨濟島，華籍戰俘多被安置在七二與八六聯隊當中。此時，在戰俘營中發生反共與親共的爭執。1952年2月27日，美國在志願遣俘原則確立後，4月8日，透過甄別行動對戰俘進行分類，以便區別願遣返與不願遣返之戰俘，其中的反共戰俘約1萬4千餘人，他們堅決拒絕返回共產黨統治下的中國，決定來臺定居，是所謂「韓戰反共義士」。",
    "4月13日，甄別工作結束，通知遷往濟州島的莫瑟浦。最初他們被收容於釜山收容所，後遷往巨濟島，分為七二與八六聯隊，此時戰俘營發生反共與親共的爭執，約7,000人的親共戰俘屈居下風，因此將其安置於六二聯隊。約1萬4千人的反共戰俘，堅決反對返回共產黨統治下的中國，決定以「一顆心回臺灣，一條命滅共匪」的志願，選擇來臺定居，是所謂「韓戰反共義士」。",
  ];

  const Q1A_BODY = [
    "你可能去到中國或去到北韓，……",
    "1953年韓戰停戰後，部分戰俘選擇返回中國大陸或北韓，而非來臺。他們在返鄉後面臨政治審查、身分降級、監視與勞動改造等處境。",
  ];

  const Q1A_BULLETS = [
    "「被俘」本身被視為不光彩，這些戰俘受到政治審查與懷疑，部分人被降職、限制升遷，或是被安排至農村、工廠工作（中國）",
    "被送往礦區、偏遠地區，長期受到監視（北韓）",
    "不相信台灣前景，在說明期結束後決定返回中國，擔心家人遭報復（中國）",
  ];

  const QUESTIONS = {
    q1: {
      label: "Q1",
      text: "1953年，韓戰簽署停戰協定，你是一位在這場戰爭中的戰俘，受聯合國的甄別確認戰俘的遣返意願。你是否會以死抗拒回歸共產政權的嚴肅調查。",
      options: [
        { text: "是，我寧死拒絕共產陣營。", next: "q2" },
        { text: "否，我只想活著。", next: "q1a" },
      ],
      layout: "row",
    },
    q2: {
      label: "Q2",
      context:
        "1954年1月23日，你搭船到基隆港來到臺灣，總統夫人蔣宋美齡代表總統在碼頭上迎接你們，來到臺灣，你們不再是被俘虜的戰俘，而是光榮的反共義士。來到臺灣，你剛開始去到了桃園楊梅，受中華民國政府的安排進行思想改造，經歷一番波折，最後來到白雞山的忠義山莊。剛開始有些不習慣，但漸漸地在這片山林找到生活的秩序……",
      text: "在這生活一陣子，生活漸漸找回規律，雖然這裡不是你的家，但也漸漸的習慣了，雖然偶爾還是會想念遠在中國的家人，某一天清晨在榮民之家醒來，你最想做的第一件事是什麼？",
      options: [
        { text: "坐下來，安靜地寫幾個字，讓心定下來", next: "q3" },
        { text: "去廚房，準備早餐，讓味道把大家喚醒", next: "q3" },
        { text: "查一查今天有沒有什麼地方可以去，早點出門", next: "q3" },
      ],
    },
    q3: {
      label: "Q3",
      text: "戰爭結束後，來到臺灣，進到陌生環境的你，將如何展開新的生活？",
      options: [
        { text: "找尋新的職業，想就此擺脫軍人身份", next: "q4" },
        { text: "受政府安排，進到三峽榮民之家", next: "q4" },
        { text: "得到唸書的機會，希望繼續學習", next: "q4" },
      ],
    },
    q4: {
      label: "Q4",
      text: "來到臺灣一段時間，不知道還有沒有回去家鄉的可能，在想念家鄉的時候，你會怎麼做？",
      options: [
        { text: "佈置好自己喜歡的空間，讓環境散佈著熟悉的感受", score: "jin", next: "q5" },
        { text: "哼起從前聽過的歌，唱著唱著就舒坦了", score: "pan", next: "q5" },
        { text: "復刻家鄉料理，手在忙，心就沒那麼空了", score: "ma", next: "q5" },
      ],
    },
    q5: {
      label: "Q5",
      text: "當有陌生人來到三峽榮民之家，想要藉由我們更加認識韓戰歷史，在與陌生人交流的時候，你會如何與對方建立感情？",
      options: [
        { text: "送他一幅親手寫的字，讓對方記得你", score: "jin", next: "q6" },
        { text: "請他吃點自己做的東西，吃了就是朋友", score: "ma", next: "q6" },
        { text: "邀他一起出去走走，路上就熟了", score: "pan", next: "q6" },
      ],
    },
    q6: {
      label: "Q6",
      text: "在日復一日的生活中，一個自由的下午，你最可能做什麼？",
      options: [
        { text: "找一件新的事情學，哪怕笨手笨腳也想試試", score: "ma", next: "q7" },
        { text: "一個人出門晃，沒有目的地，走到哪算哪", score: "pan", next: "q7" },
        { text: "做一件讓自己覺得「好看」的事，寫字、畫畫、整理儀容", score: "jin", next: "q7" },
      ],
    },
    q7: {
      label: "Q7",
      text: "如果你能留給後人一樣東西，你希望是什麼？",
      options: [
        { text: "一套帥氣的服裝，讓大家感覺你一直都在", score: "jin", next: "q8" },
        { text: "一首常唱的歌曲音檔，在想起你們時可以聽聽你的歌聲", score: "pan", next: "q8" },
        { text: "一道拿手料理的食譜，讓他們可以復刻這個味道", score: "ma", next: "q8" },
      ],
    },
    q8: {
      label: "Q8",
      text: "你和他人的關係，通常是？",
      options: [
        { text: "話不多，但會用做的東西表示心意", score: "ma", next: "q9" },
        { text: "各走各的路，但偶爾同行一段", score: "pan", next: "q9" },
        { text: "在意對方，也在意自己怎麼出現在對方面前", score: "jin", next: "q9" },
      ],
    },
    q9: {
      label: "Q9",
      text: "面對主流社會價值觀，當你的意志無法被貫徹時，你會？",
      options: [
        { text: "不聲張，但也不放棄，繼續做", score: "ma", next: "q10" },
        { text: "反正我也不太在意別人怎麼說，走就走了", score: "pan", next: "q10" },
        { text: "我有我自己的標準，那才是真的美", score: "jin", next: "q10" },
      ],
    },
    q10: {
      label: "Q10",
      text: "哪一種生活方式最接近你的生活態度？",
      options: [
        { text: "在熟悉的地方，慢慢把一件事做好", score: "ma", next: "submission" },
        { text: "在陌生的街上，一個人走，反而自在", score: "pan", next: "submission" },
        { text: "在別人看不懂的地方，找到屬於自己的神聖感", score: "jin", next: "submission" },
      ],
    },
  };

  const RESULTS = {
    ma: {
      key: "ma",
      title: "沉默裡的堅守",
      subtitle: "你有馬伯伯的韌性",
      body: "你不擅長說，但你擅長留下來。情緒藏著，行動卻一直在。學攝影、做花捲，陪著一個計劃走得最久——不是因為不在乎，而是你用時間和身體說「我在這裡」。這種韌性，安靜，但很難被折斷。",
      story:
        "馬伯伯在義家藝館的陪伴下開始學習攝影，是計劃合作最久的伯伯。他情緒隱晦，但那份喜歡，藏在每一個留下來的選擇裡。",
      tags: ["用行動說話", "時間是最深的承諾", "情感藏在細節裡"],
      bars: { ma: 80, pan: 10, jin: 10 },
      barLabels: { ma: "沉默堅守", pan: "移動自由", jin: "越界美感" },
    },
    pan: {
      key: "pan",
      title: "移動中的自由",
      subtitle: "你有潘伯伯的韌性",
      body: "你用移動對抗孤單，用出走換取呼吸的空間。你不一定熱鬧，但你知道怎麼在陌生的街上找到節奏。獨處對你而言不是冷漠，而是屬於自己的自由。",
      story: "潘伯伯曾是船員，來台後常在西門町一個人走走。他把移動當成生活的方式，也在陌生的城市裡，找到屬於自己的節奏。",
      tags: ["移動是一種自由", "獨處是一種選擇", "在陌生裡找到自在"],
      bars: { ma: 10, pan: 80, jin: 10 },
      barLabels: { ma: "沉默堅守", pan: "移動自由", jin: "越界美感" },
    },
    jin: {
      key: "jin",
      title: "越界而生的美感",
      subtitle: "你有金伯伯的韌性",
      body: "你用自己的美感標準生活，那比別人的眼光更重要。書法、線條、宗教的虔誠，都是你抵抗規矩與偏見的方式。你在意，而且你願意為那份在意付出。",
      story: "金伯伯在意穿著與儀容，也用心寫字、作畫。他把信仰與日常交織在一起，在看似受限的生活裡，仍堅持屬於自己的美與秩序。",
      tags: ["用美感抵抗規矩", "在意，是一種勇氣", "跨越界線，溫柔而堅定"],
      bars: { ma: 10, pan: 10, jin: 80 },
      barLabels: { ma: "沉默堅守", pan: "移動自由", jin: "越界美感" },
    },
  };

  const BUBBLE_LAYOUT = [
    { left: "6%", top: "8%" },
    { left: "38%", top: "4%" },
    { left: "68%", top: "12%" },
    { left: "12%", top: "38%" },
    { left: "52%", top: "32%" },
    { left: "24%", top: "62%" },
    { left: "60%", top: "58%" },
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
    if (!key || !scores[key]) return;
    scores[key] += 1;
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
    return RESULTS[best] || RESULTS.ma;
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

  function openFacebookShare(resultKey) {
    const target = encodeURIComponent(sharePageUrl(resultKey));
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${target}`,
      "facebook-share",
      "width=620,height=540,noopener,noreferrer"
    );
  }

  async function copyShareText(text, statusEl) {
    try {
      await navigator.clipboard.writeText(text);
      if (statusEl) statusEl.textContent = "已複製分享文字";
    } catch {
      if (statusEl) statusEl.textContent = "無法複製，請手動選取文字";
    }
  }

  function buildShareText(result) {
    return [
      `我剛完成了「成為自由人」心理測驗，結果是「${result.title}」——${result.subtitle}。`,
      result.body,
      `一起來測測你的自由韌性：${sharePageUrl(result.key)}`,
    ].join("\n\n");
  }

  function showModal(root, text) {
    const overlay = el("div", { class: "fpModalOverlay" });
    const box = el("div", { class: "fpModal" });
    box.appendChild(
      el("button", {
        class: "fpModalClose",
        type: "button",
        text: "×",
        "aria-label": "關閉",
        onclick: () => overlay.remove(),
      })
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
    const stage = el("div", { class: "fpStage" });
    root.appendChild(stage);

    const state = {
      scene: "intro",
      scores: defaultScores(),
      submissionAnswer: "",
      gallery: [],
      galleryLoading: false,
      galleryError: "",
      result: null,
    };

    function restart() {
      state.scene = "intro";
      state.scores = defaultScores();
      state.submissionAnswer = "";
      state.gallery = [];
      state.galleryLoading = false;
      state.galleryError = "";
      state.result = null;
      redraw();
    }

    function goScene(next) {
      state.scene = next;
      redraw();
    }

    function recordOption(option) {
      if (option.score) addScore(state.scores, option.score);
      goScene(option.next);
    }

    function renderIntro() {
      stage.appendChild(el("h1", { class: "fpTitle", text: "成為自由人" }));
      stage.appendChild(
        el("div", { class: "fpIntroBox" }, [
          el("p", {
            class: "fpIntroLead",
            text: "你的體質帶有什麼「自由韌性」？從韓戰反共義士的伯伯出發，找到屬於你的生命韌性。",
          }),
        ])
      );
      stage.appendChild(
        el("div", { class: "fpActions" }, [
          el("button", {
            class: "fpPrimaryBtn",
            type: "button",
            text: "我準備好了",
            onclick: () => goScene("history"),
          }),
        ])
      );
    }

    function renderHistory() {
      stage.appendChild(
        el("div", { class: "fpHistoryBox" }, HISTORY_TEXT.map((p) => el("p", { text: p })))
      );
      stage.appendChild(
        el("div", { class: "fpActions" }, [
          el("button", {
            class: "fpPrimaryBtn",
            type: "button",
            text: "點擊開始",
            onclick: () => goScene("q1"),
          }),
        ])
      );
    }

    function renderQuestion(key) {
      const q = QUESTIONS[key];
      if (!q) return;
      stage.appendChild(el("div", { class: "fpQuestionLabel", text: q.label }));
      const boxChildren = [];
      if (q.context) boxChildren.push(el("p", { class: "fpQuestionContext", text: q.context }));
      boxChildren.push(el("p", { class: "fpQuestionText", text: q.text }));
      stage.appendChild(el("div", { class: "fpQuestionBox" }, boxChildren));

      const optionsWrap = el("div", { class: "fpOptions" });
      const isRow = q.layout === "row" && q.options.length === 2;
      if (isRow) {
        const row = el("div", { class: "fpOptionRow" });
        q.options.forEach((opt) => {
          row.appendChild(
            el("button", {
              class: "fpOptionBtn",
              type: "button",
              text: opt.text,
              onclick: () => recordOption(opt),
            })
          );
        });
        optionsWrap.appendChild(row);
      } else {
        q.options.forEach((opt) => {
          optionsWrap.appendChild(
            el("button", {
              class: "fpOptionBtn",
              type: "button",
              text: opt.text,
              onclick: () => recordOption(opt),
            })
          );
        });
      }
      stage.appendChild(optionsWrap);
    }

    function renderQ1a() {
      stage.appendChild(el("div", { class: "fpQuestionLabel", text: "Q1A" }));
      const box = el("div", { class: "fpQuestionBox" });
      box.appendChild(el("h2", { class: "fpQ1aTitle", text: Q1A_BODY[0] }));
      box.appendChild(el("p", { text: Q1A_BODY[1] }));
      box.appendChild(
        el("div", {
          class: "fpDiscussNote",
          text: "提出討論：回中國會發生什麼事？（如何描述…）",
        })
      );
      box.appendChild(
        el("ul", { class: "fpBulletList" }, Q1A_BULLETS.map((item) => el("li", { text: item })))
      );
      stage.appendChild(box);
      stage.appendChild(renderEndNav(restart));
    }

    function renderSubmission() {
      stage.appendChild(el("h1", { class: "fpTitle", text: "自由徵稿" }));
      const box = el("div", { class: "fpSubmissionBox" });
      box.appendChild(
        el("p", {
          class: "fpSubmissionPrompt",
          text: "反共義士們終其一生，或許未曾真正理解或體驗自由。在受限制、受規訓的生活中，他們可能透過手作、旅行、打扮自己等方式，為日常保留一點屬於自己的空間。當你面對生活中的不自由或壓迫，自己無法完全按照心意生活時，你會用什麼方式，讓自己重新找回一點自由或平衡？（用一句話）",
        })
      );
      const textarea = el("textarea", {
        class: "fpTextarea",
        placeholder: "回答框：",
        value: state.submissionAnswer,
        oninput: (e) => {
          state.submissionAnswer = e.target.value;
        },
      });
      box.appendChild(textarea);
      const statusEl = el("div", { class: "fpStatus", text: "" });
      box.appendChild(statusEl);
      stage.appendChild(box);

      async function proceedToGallery({ skip = false } = {}) {
        statusEl.textContent = "";
        if (!skip && state.submissionAnswer.trim()) {
          const api = window.FreedomPersonSanity;
          if (api?.createSubmission) {
            try {
              statusEl.textContent = "送出中…";
              const res = await api.createSubmission({ answer: state.submissionAnswer.trim() });
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

      stage.appendChild(
        el("div", { class: "fpActions fpActions--stack" }, [
          el("button", {
            class: "fpSecondaryBtn",
            type: "button",
            text: "略過",
            onclick: () => proceedToGallery({ skip: true }),
          }),
          el("button", {
            class: "fpPrimaryBtn",
            type: "button",
            text: "點擊送出",
            onclick: () => proceedToGallery({ skip: false }),
          }),
        ])
      );
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
      stage.appendChild(el("h1", { class: "fpGalleryTitle", text: "點看看大家的自由徵稿" }));
      const wall = el("div", { class: "fpGalleryWall" });

      if (state.galleryLoading) {
        wall.appendChild(el("p", { class: "fpGalleryEmpty", text: "載入中…" }));
      } else if (state.galleryError) {
        wall.appendChild(el("p", { class: "fpGalleryEmpty", text: state.galleryError }));
      } else if (!state.gallery.length) {
        wall.appendChild(el("p", { class: "fpGalleryEmpty", text: "尚無通過審核的徵稿，歡迎成為第一位。" }));
      } else {
        state.gallery.forEach((item, index) => {
          const layout = BUBBLE_LAYOUT[index % BUBBLE_LAYOUT.length];
          const full = String(item.answer || "").trim();
          wall.appendChild(
            el("button", {
              class: "fpBubble",
              type: "button",
              text: truncateText(full),
              title: full,
              style: `left:${layout.left};top:${layout.top}`,
              onclick: () => showModal(root, full),
            })
          );
        });
      }

      stage.appendChild(wall);
      stage.appendChild(
        el("div", { class: "fpActions" }, [
          el("button", {
            class: "fpPrimaryBtn",
            type: "button",
            text: "查看你的自由韌性結果",
            onclick: () => {
              if (!state.result) state.result = pickResult(state.scores);
              goScene("result");
            },
          }),
        ])
      );
    }

    function renderResult() {
      const result = state.result || pickResult(state.scores);
      state.result = result;

      stage.appendChild(el("h1", { class: "fpTitle", text: "你是屬於哪一種自由韌性？" }));
      const card = el("div", { class: "fpResultCard" });
      card.appendChild(el("h2", { class: "fpResultHeading", text: result.title }));
      card.appendChild(el("p", { class: "fpResultSub", text: result.subtitle }));
      card.appendChild(el("p", { class: "fpResultBody", text: result.body }));
      card.appendChild(el("p", { class: "fpResultStory", text: result.story }));
      card.appendChild(el("div", { class: "fpTags" }, result.tags.map((tag) => el("span", { class: "fpTag", text: tag }))));

      const bars = el("div", { class: "fpBars" });
      ["ma", "pan", "jin"].forEach((key) => {
        const pct = result.bars[key];
        bars.appendChild(
          el("div", { class: "fpBarRow" }, [
            el("span", { text: result.barLabels[key] }),
            el("div", { class: "fpBarTrack" }, [
              el("div", {
                class: `fpBarFill fpBarFill--${key}`,
                style: `width:${pct}%`,
              }),
            ]),
            el("span", { text: `${pct}%` }),
          ])
        );
      });
      card.appendChild(bars);

      const shareText = buildShareText(result);
      const shareStatus = el("div", { class: "fpShareStatus", text: "" });
      const shareBox = el("div", { class: "fpShare" }, [
        el("h3", { class: "fpShareTitle", text: "分享給朋友" }),
        el("div", { class: "fpShareBox", text: shareText }),
        el("div", { class: "fpShareActions" }, [
          el("button", {
            class: "fpSecondaryBtn fpShareBtn--facebook",
            type: "button",
            text: "Facebook",
            onclick: () => openFacebookShare(result.key),
          }),
          el("button", {
            class: "fpSecondaryBtn",
            type: "button",
            text: "複製貼到 IG",
            onclick: () => copyShareText(shareText, shareStatus),
          }),
          el("button", {
            class: "fpSecondaryBtn",
            type: "button",
            text: "複製文字",
            onclick: () => copyShareText(shareText, shareStatus),
          }),
        ]),
        shareStatus,
      ]);
      card.appendChild(shareBox);
      stage.appendChild(card);
      stage.appendChild(renderEndNav(restart));
    }

    function redraw() {
      stage.innerHTML = "";
      switch (state.scene) {
        case "intro":
          renderIntro();
          break;
        case "history":
          renderHistory();
          break;
        case "q1a":
          renderQ1a();
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    redraw();
    return root;
  }

  window.renderFreedomPersonExperience = renderFreedomPersonExperience;
})();
