/* 推開自由門特展 — 互動體驗 P1–P14 */

(function () {
  const ASSET_BASE = "./assets/images/Freedom Door";

  const COLORS = [
    { hex: "#203D57", label: "Indigo dye" },
    { hex: "#357D77", label: "Myrtle green" },
    { hex: "#FBCB3E", label: "Bunglow" },
    { hex: "#912A2D", label: "Auburn" },
    { hex: "#F8E2B9", label: "Wheat" },
    { hex: "#BCBAAE", label: "Silver" },
    { hex: "#F0E1D1", label: "Almond" },
    { hex: "#B7410E", label: "Rust" },
    { hex: "#8E270E", label: "Sienna" },
    { hex: "#562114", label: "Caput mortuum" },
  ];

  const COPY = {
    p2Title: "【誰的房間，誰的自由？】",
    p2Body: [
      "「家」不只是居住的空間，更是承載記憶與情感的所在。",
      "對於在榮民之家生活數十年的榮民伯伯們來說，那一間間不大的房間，是他們真正能行使自由意志的私人領地——如何擺放一張照片、如何收納衣物、如何保存記憶，都由自己決定。",
      "讓我們一起推開自由門，探索伯伯們的房間內，裝載著什麼樣的自由？",
    ],
    p4: "一進門就看到了吧！",
    p5Title: "【操作說明】",
    p5Body: [
      "1. 本間房間有 3 個物件可供點擊，點擊後會呈現該物件的簡介。",
      "2. 簡介視窗下方為「進入共創空間」，邀請您留下自由的足跡。",
      "3. 頁面左上方為「返回走廊」，可選擇參觀其他房間。",
      "4. 頁面右上方為「結束參觀」，點擊後回到首頁。",
    ],
    hotspots: {
      wall: {
        name: "黃色牆壁",
        body: "這面牆的色彩，被人們稱為「金伯伯黃」。它承載著金伯伯的人生歷程——從韓戰到選擇來台灣，在漫長歲月中，這間房間是他真正能行使自由意志的空間。牆面的顏色，是他為自己生命留下的印記。",
      },
      guanyin: {
        name: "南海觀音",
        body: "在金伯伯的房間裡，一尊南海觀音被安放在普通冰箱上方的粉紅桌布上，旁邊擺著插著粉紅花朵的花瓶與神獸小塑像。信仰與日常起居交織在一起，成為生活裡安定的力量。",
      },
      clothes: {
        name: "自由的衣櫃",
        body: "金伯伯的衣櫃裡裝著各色服飾——橙色西裝、格子襯衫……選擇穿什麼，也是選擇如何面對世界、呈現自己的方式。每一次穿搭，都是他實踐自由的一種姿態。",
        cta: "進入「自由的衣櫃」",
      },
    },
    p10Title: "【操作說明】",
    p10Body: [
      "金伯伯的衣櫃中，裝載了自由的靈魂，",
      "他總是用獨特的配色與穿搭，展現出鮮明的個性。",
      "如果金伯伯活在現在的 21 世紀，他會如何展現獨特的時尚呢？",
      "請試著用你獨特的眼光，為金伯伯搭配出一套適合的穿搭吧！",
    ],
  };

  const HOTSPOTS = {
    wall: { left: "6%", top: "18%", width: "22%", height: "42%" },
    guanyin: { left: "38%", top: "28%", width: "14%", height: "24%" },
    clothes: { left: "62%", top: "14%", width: "16%", height: "38%" },
  };

  const DOOR_POSITIONS = [
    { left: "14%", top: "24%", width: "10%", height: "58%" },
    { left: "42%", top: "24%", width: "10%", height: "58%" },
    { left: "70%", top: "24%", width: "10%", height: "58%" },
  ];

  function defaultOutfit() {
    return { topStyle: 0, topColor: COLORS[4].hex, bottomColor: COLORS[0].hex };
  }

  function defaultDraft() {
    return { title: "", authorName: "", concept: "" };
  }

  function createFitScene(imageSrc, { corridor = false } = {}) {
    const scene = el("div", { class: `fdScene${corridor ? " fdScene--corridor" : ""}` });
    const frame = el("div", { class: `fdSceneFrame${corridor ? " fdSceneFrame--corridor" : ""}` });
    const img = el("img", { class: "fdSceneImg", src: imageSrc, alt: "", draggable: "false" });
    const overlay = el("div", { class: "fdSceneOverlay" });
    frame.appendChild(img);
    frame.appendChild(overlay);
    scene.appendChild(frame);
    return { scene, frame, img, overlay };
  }

  function hotspotStyle(rect) {
    return `left:${rect.left}; top:${rect.top}; width:${rect.width}; height:${rect.height}`;
  }

  function buildInfoPanel(state, key, { onClose, onEnterWardrobe } = {}) {
    const info = COPY.hotspots[key];
    const panel = el("aside", { class: "fdInfoPanel" }, [
      el("button", {
        class: "fdInfoClose",
        type: "button",
        text: "×",
        "aria-label": "關閉說明",
        onclick: (e) => {
          e.stopPropagation();
          onClose?.();
        },
      }),
      el("p", { class: "fdInfoLabel", text: "物件名稱" }),
      el("h3", { class: "fdInfoTitle", text: info.name }),
      el("p", { class: "fdInfoLabel", text: "介紹" }),
      el("p", { class: "fdInfoBody", text: info.body }),
      el("div", { class: "fdInfoPhotoPlaceholder", text: "參考照片（待提供）" }),
    ]);

    if (key === "clothes") {
      panel.appendChild(
        el("button", {
          class: "fdInfoCta",
          type: "button",
          text: info.cta,
          onclick: (e) => {
            e.stopPropagation();
            onEnterWardrobe?.();
          },
        })
      );
    }

    return panel;
  }

  function navigateHome() {
    if (typeof navigateFromHref === "function") navigateFromHref("#home");
    else location.hash = "#home";
  }

  function appendNav(stage, { leftLabel, leftAction, rightLabel, rightAction, centerLabel } = {}) {
    const nav = el("div", { class: "fdNav" });
    if (leftLabel) {
      nav.appendChild(
        el("button", { class: "fdNavBtn fdNavBtn--left", type: "button", text: leftLabel, onclick: leftAction })
      );
    }
    if (centerLabel) {
      nav.appendChild(el("span", { class: "fdNavCenter", text: centerLabel }));
    }
    if (rightLabel) {
      nav.appendChild(
        el("button", { class: "fdNavBtn fdNavBtn--right", type: "button", text: rightLabel, onclick: rightAction })
      );
    }
    stage.appendChild(nav);
  }

  function showModal(stage, { title, paragraphs, buttonLabel, onClose, showClose = true }) {
    const overlay = el("div", { class: "fdModalOverlay" });
    const box = el("div", { class: "fdModal" });
    if (showClose) {
      box.appendChild(
        el("button", {
          class: "fdModalClose",
          type: "button",
          text: "×",
          "aria-label": "關閉",
          onclick: () => {
            overlay.remove();
            onClose?.();
          },
        })
      );
    }
    if (title) box.appendChild(el("h2", { class: "fdModalTitle", text: title }));
    (paragraphs || []).forEach((p) => box.appendChild(el("p", { class: "fdModalText", text: p })));
    if (buttonLabel) {
      box.appendChild(
        el("button", {
          class: "fdModalAction",
          type: "button",
          text: buttonLabel,
          onclick: () => {
            overlay.remove();
            onClose?.();
          },
        })
      );
    }
    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay && showClose) {
        overlay.remove();
        onClose?.();
      }
    });
    stage.appendChild(overlay);
    return overlay;
  }

  function renderCharacterPreview(outfit, className = "fdCharacter") {
    const wrap = el("div", { class: className });
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 360");
    svg.setAttribute("class", "fdCharacterSvg");

    const baseParts = `
      <ellipse cx="100" cy="42" rx="28" ry="32" fill="#f0e1d1" stroke="#333" stroke-width="2"/>
      <rect x="72" y="72" width="56" height="18" rx="6" fill="#f0e1d1" stroke="#333" stroke-width="2"/>
      <path d="M70 90 Q100 120 130 90" fill="none" stroke="#333" stroke-width="1.5"/>
      <rect x="68" y="168" width="64" height="110" rx="6" fill="${outfit.bottomColor}" stroke="#333" stroke-width="2"/>
      <rect x="74" y="278" width="22" height="58" rx="4" fill="#333"/>
      <rect x="104" y="278" width="22" height="58" rx="4" fill="#333"/>
      <line x1="58" y1="118" x2="34" y2="190" stroke="#333" stroke-width="3"/>
      <line x1="142" y1="118" x2="166" y2="190" stroke="#333" stroke-width="3"/>
    `;

    if (outfit.topStyle === 0) {
      svg.innerHTML =
        baseParts +
        `<path d="M58 90 L142 90 L152 170 L48 170 Z" fill="${outfit.topColor}" stroke="#333" stroke-width="2"/>`;
    } else {
      svg.innerHTML = baseParts;
    }

    if (outfit.topStyle === 1) {
      const jacket = document.createElementNS("http://www.w3.org/2000/svg", "path");
      jacket.setAttribute("d", "M52 92 L148 92 L156 178 L44 178 Z");
      jacket.setAttribute("fill", outfit.topColor);
      jacket.setAttribute("stroke", "#333");
      jacket.setAttribute("stroke-width", "2");
      svg.appendChild(jacket);
    } else if (outfit.topStyle === 2) {
      const stripe = document.createElementNS("http://www.w3.org/2000/svg", "path");
      stripe.setAttribute("d", "M58 90 L142 90 L148 165 L52 165 Z");
      stripe.setAttribute("fill", outfit.topColor);
      stripe.setAttribute("stroke", "#333");
      stripe.setAttribute("stroke-width", "2");
      svg.appendChild(stripe);
      for (let i = 0; i < 5; i += 1) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(62 + i * 16));
        line.setAttribute("y1", "95");
        line.setAttribute("x2", String(58 + i * 16));
        line.setAttribute("y2", "160");
        line.setAttribute("stroke", "#fff");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("opacity", "0.45");
        svg.appendChild(line);
      }
    }
    wrap.appendChild(svg);
    return wrap;
  }

  function drawCharacterOnCanvas(ctx, outfit, offsetX, offsetY, scale) {
    const s = scale || 1;
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(s, s);

    ctx.fillStyle = "#f0e1d1";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(100, 42, 28, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    roundRect(ctx, 72, 72, 56, 18, 6);
    ctx.fill();
    ctx.stroke();

    if (outfit.topStyle === 1) {
      ctx.fillStyle = outfit.topColor;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(52, 92);
      ctx.lineTo(148, 92);
      ctx.lineTo(156, 178);
      ctx.lineTo(44, 178);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (outfit.topStyle === 2) {
      ctx.fillStyle = outfit.topColor;
      ctx.beginPath();
      ctx.moveTo(58, 90);
      ctx.lineTo(142, 90);
      ctx.lineTo(148, 165);
      ctx.lineTo(52, 165);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.moveTo(62 + i * 16, 95);
        ctx.lineTo(58 + i * 16, 160);
        ctx.stroke();
      }
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
    } else {
      ctx.fillStyle = outfit.topColor;
      ctx.beginPath();
      ctx.moveTo(58, 90);
      ctx.lineTo(142, 90);
      ctx.lineTo(152, 170);
      ctx.lineTo(48, 170);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(70, 90);
    ctx.quadraticCurveTo(100, 120, 130, 90);
    ctx.stroke();

    ctx.fillStyle = outfit.bottomColor;
    roundRect(ctx, 68, 168, 64, 110, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#333";
    roundRect(ctx, 74, 278, 22, 58, 4);
    ctx.fill();
    roundRect(ctx, 104, 278, 22, 58, 4);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(58, 118);
    ctx.lineTo(34, 190);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(142, 118);
    ctx.lineTo(166, 190);
    ctx.stroke();

    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      if (typeof canvas.toBlob === "function") {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("無法產生圖片檔"));
        }, "image/png");
        return;
      }
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const parts = dataUrl.split(",");
        const mime = parts[0].match(/:(.*?);/)[1];
        const binary = atob(parts[1]);
        const arr = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) arr[i] = binary.charCodeAt(i);
        resolve(new Blob([arr], { type: mime }));
      } catch (err) {
        reject(err);
      }
    });
  }

  async function exportCompositeImage(outfit, draft) {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("無法建立畫布");

    ctx.fillStyle = "#f8f4ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawCharacterOnCanvas(ctx, outfit, 160, 40, 2);

    ctx.fillStyle = "#222";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(draft.title || "未命名作品", 48, 620);
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#444";
    wrapText(ctx, draft.concept || "", 48, 670, 624, 34);
    if (draft.authorName) {
      ctx.fillStyle = "#777";
      ctx.font = "18px sans-serif";
      ctx.fillText(`作者：${draft.authorName}`, 48, 900);
    }

    return canvasToBlob(canvas);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = String(text).split("");
    let line = "";
    let cursorY = y;
    chars.forEach((ch, index) => {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, cursorY);
        line = ch;
        cursorY += lineHeight;
      } else {
        line = test;
      }
      if (index === chars.length - 1) ctx.fillText(line, x, cursorY);
    });
  }

  function renderFreedomDoorExperience() {
    const root = el("div", { class: "fdExperience" });
    const viewport = el("div", { class: "fdViewport" });
    const stage = el("div", { class: "fdStage" });
    viewport.appendChild(stage);
    root.appendChild(viewport);

    const state = {
      scene: "p1",
      corridorScroll: 0,
      activeHotspot: null,
      outfit: defaultOutfit(),
      draft: defaultDraft(),
      gallery: [],
      uploading: false,
      uploadMessage: "",
      lastSubmission: null,
      colorTarget: "top",
    };

    function redraw() {
      stage.innerHTML = "";
      stage.className = "fdStage";
      switch (state.scene) {
        case "p1":
          renderP1(stage, state, setScene);
          break;
        case "p3":
          renderP3(stage, state, setScene);
          break;
        case "p4":
          renderP4(stage, state, setScene);
          break;
        case "p5":
          renderP5(stage, state, setScene);
          break;
        case "p6":
          renderP6(stage, state, setScene, redraw);
          break;
        case "p11":
          renderP11(stage, state, setScene);
          break;
        case "p13":
          renderP13(stage, state, setScene);
          break;
        case "p14":
          renderP14(stage, state, setScene);
          break;
        default:
          renderP1(stage, state, setScene);
      }
    }

    function setScene(next) {
      state.scene = next;
      redraw();
    }

    redraw();
    return root;
  }

  function renderP1(stage, state, setScene) {
    const { scene } = createFitScene(`${ASSET_BASE}/p1.png`);
    stage.appendChild(scene);
    stage.appendChild(
      el("button", {
        class: "fdStartBtn",
        type: "button",
        text: "開始",
        onclick: () => {
          setScene("p3");
          requestAnimationFrame(() => {
            showModal(stage, {
              title: COPY.p2Title,
              paragraphs: COPY.p2Body,
              onClose: () => {},
            });
          });
        },
      })
    );
  }

  function getCorridorMaxScroll(stage) {
    const track = stage.querySelector(".fdCorridorTrack");
    const viewport = stage.closest(".fdViewport");
    if (!track || !viewport) return 0;
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  }

  function applyCorridorScroll(stage, state) {
    const track = stage.querySelector(".fdCorridorTrack");
    if (!track) return;
    const maxScroll = getCorridorMaxScroll(stage);
    state.corridorScroll = Math.max(0, Math.min(state.corridorScroll, maxScroll));
    track.style.transform = `translateX(-${state.corridorScroll}px)`;
  }

  function renderP3(stage, state, setScene) {
    const corridor = el("div", { class: "fdCorridor" });
    const track = el("div", { class: "fdCorridorTrack" });
    const { scene, overlay, img } = createFitScene(`${ASSET_BASE}/p3.png`, { corridor: true });

    DOOR_POSITIONS.forEach((door) => {
      overlay.appendChild(
        el("button", {
          class: "fdDoorHotspot",
          type: "button",
          "aria-label": "進入房間",
          style: hotspotStyle(door),
          onclick: (e) => {
            e.stopPropagation();
            setScene("p4");
          },
        })
      );
    });

    track.appendChild(scene);
    corridor.appendChild(track);
    stage.appendChild(corridor);

    img.addEventListener("load", () => applyCorridorScroll(stage, state));

    appendNav(stage, {
      rightLabel: "結束參觀回到首頁",
      rightAction: navigateHome,
    });

    const scrollBy = () => {
      const viewport = stage.closest(".fdViewport");
      return Math.max(220, (viewport?.clientWidth || 960) * 0.45);
    };

    stage.appendChild(
      el("button", {
        class: "fdArrow fdArrow--left",
        type: "button",
        text: "‹",
        "aria-label": "向左",
        onclick: () => {
          state.corridorScroll = Math.max(0, state.corridorScroll - scrollBy());
          applyCorridorScroll(stage, state);
        },
      })
    );
    stage.appendChild(
      el("button", {
        class: "fdArrow fdArrow--right",
        type: "button",
        text: "›",
        "aria-label": "向右",
        onclick: () => {
          state.corridorScroll = Math.min(getCorridorMaxScroll(stage), state.corridorScroll + scrollBy());
          applyCorridorScroll(stage, state);
        },
      })
    );

    requestAnimationFrame(() => applyCorridorScroll(stage, state));
  }

  function renderP4(stage, state, setScene) {
    const { scene } = createFitScene(`${ASSET_BASE}/p6.png`);
    scene.classList.add("fdScene--blur");
    stage.appendChild(scene);
    showModal(stage, {
      paragraphs: [COPY.p4],
      buttonLabel: "繼續",
      showClose: false,
      onClose: () => setScene("p5"),
    });
  }

  function renderP5(stage, state, setScene) {
    const { scene } = createFitScene(`${ASSET_BASE}/p6.png`);
    scene.classList.add("fdScene--blur");
    stage.appendChild(scene);
    showModal(stage, {
      title: COPY.p5Title,
      paragraphs: COPY.p5Body,
      buttonLabel: "開始探索",
      onClose: () => setScene("p6"),
    });
  }

  function renderP6(stage, state, setScene, redraw) {
    const room = el("div", { class: "fdRoomWrap" });
    const { scene, overlay } = createFitScene(`${ASSET_BASE}/p6.png`);
    const panelSlot = el("div", { class: "fdPanelSlot" });

    function syncPanel() {
      panelSlot.innerHTML = "";
      room.classList.toggle("fdRoomWrap--panelOpen", Boolean(state.activeHotspot));
      if (!state.activeHotspot) return;

      panelSlot.appendChild(
        buildInfoPanel(state, state.activeHotspot, {
          onClose: () => {
            state.activeHotspot = null;
            syncPanel();
          },
          onEnterWardrobe: () => {
            state.activeHotspot = null;
            setScene("p11");
            requestAnimationFrame(() => {
              showModal(stage, {
                title: COPY.p10Title,
                paragraphs: COPY.p10Body,
                onClose: () => {},
              });
            });
          },
        })
      );
    }

    Object.entries(HOTSPOTS).forEach(([key, rect]) => {
      overlay.appendChild(
        el("button", {
          class: `fdHotspot${state.activeHotspot === key ? " isActive" : ""}`,
          type: "button",
          "aria-label": COPY.hotspots[key].name,
          style: hotspotStyle(rect),
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            state.activeHotspot = state.activeHotspot === key ? null : key;
            syncPanel();
          },
        })
      );
    });

    room.appendChild(scene);
    room.appendChild(panelSlot);
    stage.appendChild(room);

    appendNav(stage, {
      leftLabel: "回到走廊",
      leftAction: () => {
        state.activeHotspot = null;
        setScene("p3");
      },
      centerLabel: "（金伯伯的房間）",
      rightLabel: "結束參觀回到首頁",
      rightAction: navigateHome,
    });

    syncPanel();
  }

  function renderP11(stage, state, setScene) {
    const layout = el("div", { class: "fdDressLayout" });
    const controls = el("div", { class: "fdDressControls" });
    const previewHost = el("div", { class: "fdDressPreview" });

    function activeColor() {
      return state.colorTarget === "top" ? state.outfit.topColor : state.outfit.bottomColor;
    }

    function updatePreview() {
      previewHost.innerHTML = "";
      previewHost.appendChild(renderCharacterPreview(state.outfit, "fdCharacter fdCharacter--dress"));
    }

    function syncStyleButtons() {
      styleButtons.forEach((btn, index) => {
        btn.classList.toggle("isActive", state.outfit.topStyle === index);
      });
    }

    function syncTargetButtons() {
      topTargetBtn.classList.toggle("isActive", state.colorTarget === "top");
      bottomTargetBtn.classList.toggle("isActive", state.colorTarget === "bottom");
    }

    function syncSwatches() {
      const current = activeColor().toLowerCase();
      swatchButtons.forEach((btn, index) => {
        btn.classList.toggle("isActive", COLORS[index].hex.toLowerCase() === current);
      });
    }

    function syncDressUi() {
      updatePreview();
      syncStyleButtons();
      syncTargetButtons();
      syncSwatches();
    }

    controls.appendChild(el("p", { class: "fdDressHint", text: "（共創區）（紙娃娃換裝）" }));

    const styles = el("div", { class: "fdStyleRow" });
    const styleButtons = ["款式 A", "款式 B", "款式 C"].map((label, index) =>
      el("button", {
        class: `fdStyleBtn${state.outfit.topStyle === index ? " isActive" : ""}`,
        type: "button",
        text: label,
        onclick: (e) => {
          e.stopPropagation();
          state.outfit.topStyle = index;
          syncDressUi();
        },
      })
    );
    styleButtons.forEach((btn) => styles.appendChild(btn));
    controls.appendChild(styles);

    const targetRow = el("div", { class: "fdColorTargetRow" });
    targetRow.appendChild(el("span", { class: "fdColorTargetLabel", text: "調色部位：" }));

    const topTargetBtn = el("button", {
      class: `fdColorTargetBtn${state.colorTarget === "top" ? " isActive" : ""}`,
      type: "button",
      text: "上衣",
      onclick: (e) => {
        e.stopPropagation();
        state.colorTarget = "top";
        syncTargetButtons();
        syncSwatches();
      },
    });
    const bottomTargetBtn = el("button", {
      class: `fdColorTargetBtn${state.colorTarget === "bottom" ? " isActive" : ""}`,
      type: "button",
      text: "下裝",
      onclick: (e) => {
        e.stopPropagation();
        state.colorTarget = "bottom";
        syncTargetButtons();
        syncSwatches();
      },
    });
    targetRow.appendChild(topTargetBtn);
    targetRow.appendChild(bottomTargetBtn);
    controls.appendChild(targetRow);

    const palette = el("div", { class: "fdPalette" });
    const swatchButtons = COLORS.map((color) =>
      el("button", {
        class: "fdSwatch",
        type: "button",
        style: `background:${color.hex}`,
        title: color.label,
        onclick: (e) => {
          e.stopPropagation();
          if (state.colorTarget === "top") state.outfit.topColor = color.hex;
          else state.outfit.bottomColor = color.hex;
          updatePreview();
          syncSwatches();
        },
      })
    );
    swatchButtons.forEach((btn) => palette.appendChild(btn));
    controls.appendChild(palette);

    layout.appendChild(controls);
    layout.appendChild(previewHost);
    stage.appendChild(layout);

    syncDressUi();

    appendNav(stage, {
      leftLabel: "回到房間",
      leftAction: () => setScene("p6"),
      rightLabel: "製作完成",
      rightAction: () => setScene("p13"),
    });
  }

  function renderP13(stage, state, setScene) {
    const layout = el("div", { class: "fdSubmitLayout" });
    layout.appendChild(renderCharacterPreview(state.outfit, "fdCharacter fdCharacter--submit"));

    const form = el("div", { class: "fdSubmitForm" });
    const titleInput = el("input", {
      class: "fdInput",
      type: "text",
      placeholder: "作品名稱",
      value: state.draft.title,
      oninput: (e) => {
        state.draft.title = e.target.value;
      },
    });
    const authorInput = el("input", {
      class: "fdInput",
      type: "text",
      placeholder: "作者名稱（選填）",
      value: state.draft.authorName,
      oninput: (e) => {
        state.draft.authorName = e.target.value;
      },
    });
    const conceptInput = el("textarea", {
      class: "fdTextarea",
      placeholder: "參與者輸入創作理念（限 50 字）",
      maxlength: "50",
      value: state.draft.concept,
      oninput: (e) => {
        state.draft.concept = e.target.value.slice(0, 50);
        counter.textContent = `${state.draft.concept.length} / 50`;
      },
    });
    const counter = el("div", { class: "fdCounter", text: `${state.draft.concept.length} / 50` });
    const status = el("div", { class: "fdUploadStatus", text: state.uploadMessage || "" });

    form.appendChild(titleInput);
    form.appendChild(authorInput);
    form.appendChild(conceptInput);
    form.appendChild(counter);
    form.appendChild(status);
    layout.appendChild(form);
    stage.appendChild(layout);

    const uploadBtn = el("button", {
      class: "fdNavBtn fdNavBtn--right",
      type: "button",
      text: state.uploading ? "上傳中…" : "上傳",
      onclick: async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (state.uploading) return;

        state.uploading = true;
        state.uploadMessage = "正在匯出並上傳…";
        uploadBtn.textContent = "上傳中…";
        uploadBtn.disabled = true;
        status.textContent = state.uploadMessage;

        try {
          const blob = await exportCompositeImage(state.outfit, state.draft);
          const api = window.FreedomDoorSanity;
          if (!api) throw new Error("Sanity 模組未載入");

          const result = await api.createSubmission({
            title: state.draft.title,
            authorName: state.draft.authorName,
            concept: state.draft.concept,
            imageBlob: blob,
            outfitData: state.outfit,
          });

          const previewUrl = await api.blobToPreviewUrl(blob);
          state.lastSubmission = {
            title: state.draft.title,
            authorName: state.draft.authorName,
            concept: state.draft.concept,
            imageUrl: previewUrl,
            mode: result.mode,
            message: result.message,
          };
          state.uploading = false;
          state.uploadMessage = result.message;
          setScene("p14");
        } catch (err) {
          console.error("推開自由門上傳失敗：", err);
          state.uploading = false;
          state.uploadMessage = `上傳失敗：${err?.message || err}`;
          uploadBtn.textContent = "上傳";
          uploadBtn.disabled = false;
          status.textContent = state.uploadMessage;
        }
      },
    });

    const nav = el("div", { class: "fdNav" }, [
      el("button", {
        class: "fdNavBtn fdNavBtn--left",
        type: "button",
        text: "返回製作",
        onclick: () => setScene("p11"),
      }),
      uploadBtn,
    ]);
    stage.appendChild(nav);
  }

  function renderP14(stage, state, setScene) {
    const body = el("div", { class: "fdGalleryBody" });
    body.appendChild(
      el("div", { class: "fdGalleryHeader" }, [
        el("h2", { text: "最近 30 位體驗者作品" }),
        el("p", {
          class: "fdGalleryNote",
          text: state.lastSubmission?.message || "僅顯示後台審核通過的作品。",
        }),
      ])
    );

    const grid = el("div", { class: "fdGalleryGrid" });
    const loading = el("div", { class: "fdGalleryLoading", text: "載入中…" });
    grid.appendChild(loading);
    body.appendChild(grid);
    stage.appendChild(body);

    if (state.lastSubmission?.imageUrl) {
      const own = el("section", { class: "fdGalleryOwn" }, [
        el("h3", { text: "您剛完成的作品" }),
        el("article", { class: "fdGalleryCard fdGalleryCard--own" }, [
          el("img", {
            class: "fdGalleryImg",
            src: state.lastSubmission.imageUrl,
            alt: state.lastSubmission.title || "我的作品",
          }),
          el("h3", { class: "fdGalleryTitle", text: state.lastSubmission.title || "未命名作品" }),
          state.lastSubmission.authorName
            ? el("p", { class: "fdGalleryAuthor", text: state.lastSubmission.authorName })
            : null,
          state.lastSubmission.concept
            ? el("p", { class: "fdGalleryConcept", text: state.lastSubmission.concept })
            : null,
          el("p", {
            class: "fdGalleryPendingNote",
            text:
              state.lastSubmission.mode === "sanity"
                ? "已送出，待後台審核通過後會公開顯示於下方作品牆。"
                : "已儲存於本機，待連線 Sanity 並審核後可公開顯示。",
          }),
        ]),
      ]);
      body.insertBefore(own, grid);
    }

    appendNav(stage, {
      leftLabel: "再玩一次",
      leftAction: () => {
        state.outfit = defaultOutfit();
        state.draft = defaultDraft();
        state.activeHotspot = null;
        state.uploadMessage = "";
        state.lastSubmission = null;
        setScene("p1");
      },
      rightLabel: "結束參觀回到首頁",
      rightAction: navigateHome,
    });

    const api = window.FreedomDoorSanity;
    if (!api) {
      loading.textContent = "無法載入作品牆模組。";
      return;
    }

    api
      .fetchApprovedSubmissions(30)
      .then((items) => {
        loading.remove();
        state.gallery = items;
        if (!items.length) {
          grid.appendChild(
            el("p", {
              class: "fdGalleryEmpty",
              text: state.lastSubmission ? "目前尚無其他已審核通過的公開作品。" : "尚無已審核通過的作品，歡迎搶先體驗！",
            })
          );
          return;
        }
        items.forEach((item) => {
          const card = el("article", { class: "fdGalleryCard" });
          if (item.imageUrl) {
            card.appendChild(el("img", { class: "fdGalleryImg", src: item.imageUrl, alt: item.title || "作品" }));
          } else {
            card.appendChild(el("div", { class: "fdGalleryImg fdGalleryImg--placeholder", text: "無預覽" }));
          }
          card.appendChild(el("h3", { class: "fdGalleryTitle", text: item.title || "未命名作品" }));
          if (item.authorName) card.appendChild(el("p", { class: "fdGalleryAuthor", text: item.authorName }));
          if (item.concept) card.appendChild(el("p", { class: "fdGalleryConcept", text: item.concept }));
          grid.appendChild(card);
        });
      })
      .catch((err) => {
        loading.remove();
        grid.appendChild(
          el("p", {
            class: "fdGalleryEmpty fdGalleryEmpty--error",
            text: err?.message || String(err),
          })
        );
      });
  }

  window.renderFreedomDoorExperience = renderFreedomDoorExperience;
})();
