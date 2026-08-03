/* 推開自由門特展 — 互動體驗 P1–P14 */

(function () {
  const ASSET_BASE = "./assets/images/Freedom Door";
  const WARDROBE_BASE = `${ASSET_BASE}/wardrobe`;

  /** 調色盤色塊參考色（對應 PNG 編號 1–10） */
  const PALETTE_SWATCHES = [
    { id: 1, r: 249, g: 243, b: 226, label: "米白" },
    { id: 2, r: 190, g: 25, b: 35, label: "紅" },
    { id: 3, r: 255, g: 200, b: 110, label: "橙" },
    { id: 4, r: 235, g: 195, b: 95, label: "黃" },
    { id: 5, r: 180, g: 210, b: 215, label: "淺藍" },
    { id: 6, r: 85, g: 135, b: 130, label: "青綠" },
    { id: 7, r: 120, g: 40, b: 35, label: "酒紅" },
    { id: 8, r: 45, g: 65, b: 95, label: "深藍" },
    { id: 9, r: 70, g: 80, b: 130, label: "藍紫" },
    { id: 10, r: 200, g: 198, b: 186, label: "灰" },
  ];

  const LAYER_DIRS = {
    hat: "hat",
    socks: "socks",
    shoes: "shoes",
    turtleneck: "turtleneck",
    patternShirt: "pattern-shirt",
    vestShirt: "vest-shirt",
    vest: "vest",
    jacket: "jacket",
    suitPants: "suit-pants",
    croppedPants: "cropped-pants",
  };

  /** 衣櫃懸掛區可點擊範圍（相對 3840×2160 畫布百分比） */
  const HANG_HITS = [
    { key: "hat", label: "帽子", left: 55.5, top: 7.5, width: 8, height: 10 },
    { key: "socks", label: "襪子", left: 55.5, top: 19.5, width: 8, height: 12 },
    { key: "shoes", label: "鞋子", left: 55.2, top: 32.5, width: 8.5, height: 11 },
    { key: "turtleneck", label: "高領毛衣", left: 63.5, top: 9, width: 10.5, height: 32 },
    { key: "patternShirt", label: "花紋襯衫", left: 72.2, top: 8.5, width: 10, height: 32 },
    { key: "vestShirt", label: "背心加襯衫", left: 80, top: 8.5, width: 11, height: 32 },
    { key: "suitPants", label: "西裝褲", left: 55.2, top: 46, width: 9.5, height: 42 },
    { key: "croppedPants", label: "七分褲", left: 62.2, top: 46, width: 9.5, height: 40 },
    { key: "jacket", label: "西裝外套", left: 71.8, top: 47.5, width: 12, height: 34 },
    { key: "vest", label: "背心", left: 82, top: 48, width: 11, height: 30 },
  ];

  const HANG_IMGS = [
    "frame",
    "hat",
    "socks",
    "shoes",
    "turtleneck",
    "pattern-shirt",
    "vest-shirt",
    "suit-pants",
    "cropped-pants",
    "jacket",
    "vest",
  ];

  const MISSING_COLORS = {
    jacket: new Set([2]),
  };

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
    return {
      hatColor: 7,
      socksColor: 1,
      shoesColor: 1,
      inner: "vestShirt",
      innerColor: 2,
      jacketOn: true,
      jacketColor: 8,
      vestOn: false,
      vestColor: 1,
      bottom: "suitPants",
      bottomColor: 8,
    };
  }

  function defaultDraft() {
    return { title: "", authorName: "", concept: "" };
  }

  function resolveColorId(kind, colorId) {
    let id = Math.max(1, Math.min(10, Number(colorId) || 1));
    const missing = MISSING_COLORS[kind];
    if (missing && missing.has(id)) {
      for (const delta of [1, -1, 2, -2, 3, -3]) {
        const next = id + delta;
        if (next >= 1 && next <= 10 && !missing.has(next)) return next;
      }
      return 1;
    }
    return id;
  }

  function layerSrc(kind, colorId) {
    const dir = LAYER_DIRS[kind];
    const id = resolveColorId(kind, colorId);
    return `${WARDROBE_BASE}/${dir}/${id}.png`;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`無法載入圖片：${src}`));
      img.src = src;
    });
  }

  function nearestPaletteId(r, g, b) {
    let best = 1;
    let bestDist = Infinity;
    PALETTE_SWATCHES.forEach((sw) => {
      const dr = r - sw.r;
      const dg = g - sw.g;
      const db = b - sw.b;
      const dist = dr * dr + dg * dg + db * db;
      if (dist < bestDist) {
        bestDist = dist;
        best = sw.id;
      }
    });
    return best;
  }

  /** 人物在 3840×2160 畫布上的裁切範圍（不含場景背景） */
  const CHAR_CROP = { x: 660, y: 90, w: 760, h: 2040 };
  const CHAR_EXPORT_WIDTH = 520;

  function getOutfitLayers(outfit) {
    const layers = [
      { src: `${WARDROBE_BASE}/base.png`, key: "base" },
      { src: layerSrc("socks", outfit.socksColor), key: "socks" },
      { src: layerSrc("shoes", outfit.shoesColor), key: "shoes" },
      // 長褲／七分褲在襪與鞋之上，才能遮住襪口與部分鞋面
      { src: layerSrc(outfit.bottom, outfit.bottomColor), key: "bottom" },
      { src: layerSrc(outfit.inner, outfit.innerColor), key: "inner" },
    ];
    if (outfit.vestOn) {
      layers.push({ src: layerSrc("vest", outfit.vestColor), key: "vest" });
    }
    if (outfit.jacketOn) {
      layers.push({ src: layerSrc("jacket", outfit.jacketColor), key: "jacket" });
    }
    layers.push({ src: layerSrc("hat", outfit.hatColor), key: "hat" });
    return layers;
  }

  function applyColorToTarget(outfit, target, colorId) {
    const id = Math.max(1, Math.min(10, colorId));
    switch (target) {
      case "hat":
        outfit.hatColor = id;
        break;
      case "socks":
        outfit.socksColor = id;
        break;
      case "shoes":
        outfit.shoesColor = id;
        break;
      case "inner":
        outfit.innerColor = id;
        break;
      case "bottom":
        outfit.bottomColor = id;
        break;
      case "jacket":
        outfit.jacketColor = resolveColorId("jacket", id);
        outfit.jacketOn = true;
        break;
      case "vest":
        outfit.vestColor = id;
        outfit.vestOn = true;
        break;
      default:
        break;
    }
  }

  function handleHangSelect(outfit, key, state) {
    switch (key) {
      case "hat":
      case "socks":
      case "shoes":
        state.colorTarget = key;
        break;
      case "turtleneck":
      case "patternShirt":
      case "vestShirt":
        outfit.inner = key;
        state.colorTarget = "inner";
        // 內搭改為背心加襯衫時，關閉外搭背心避免重疊
        if (key === "vestShirt") outfit.vestOn = false;
        break;
      case "suitPants":
      case "croppedPants":
        outfit.bottom = key;
        state.colorTarget = "bottom";
        break;
      case "jacket":
        if (state.colorTarget === "jacket" && outfit.jacketOn) {
          outfit.jacketOn = false;
        } else {
          outfit.jacketOn = true;
          state.colorTarget = "jacket";
        }
        break;
      case "vest":
        // 花紋襯衫上可再疊背心；其他內搭同樣以背心外搭
        if (state.colorTarget === "vest" && outfit.vestOn) {
          outfit.vestOn = false;
        } else {
          outfit.vestOn = true;
          state.colorTarget = "vest";
        }
        break;
      default:
        break;
    }
  }

  function colorTargetLabel(target) {
    const map = {
      hat: "帽子",
      socks: "襪子",
      shoes: "鞋子",
      inner: "內搭上衣",
      bottom: "下裝",
      jacket: "西裝外套",
      vest: "背心",
    };
    return map[target] || "衣物";
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
    const panel = el("aside", { class: `fdInfoPanel${key === "clothes" ? " fdInfoPanel--wardrobe" : ""}` }, [
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

    panel.appendChild(el("div", { class: "fdInfoPhotoPlaceholder", text: "參考照片（待提供）" }));

    return panel;
  }

  function navigateHome() {
    if (typeof navigateFromHref === "function") navigateFromHref("#home");
    else location.hash = "#home";
  }

  function appendNav(stage, { leftLabel, leftAction, rightLabel, rightAction, centerLabel, variant } = {}) {
    const nav = el("div", { class: `fdNav${variant ? ` fdNav--${variant}` : ""}` });
    if (leftLabel) {
      nav.appendChild(
        el("button", {
          class: `fdNavBtn fdNavBtn--left${variant ? ` fdNavBtn--${variant}` : ""}`,
          type: "button",
          text: leftLabel,
          onclick: leftAction,
        })
      );
    }
    if (centerLabel) {
      nav.appendChild(el("span", { class: "fdNavCenter", text: centerLabel }));
    }
    if (rightLabel) {
      nav.appendChild(
        el("button", {
          class: `fdNavBtn fdNavBtn--right${variant ? ` fdNavBtn--${variant}` : ""}`,
          type: "button",
          text: rightLabel,
          onclick: rightAction,
        })
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
    const stack = el("div", { class: "fdAvatarStack" });
    getOutfitLayers(outfit).forEach((layer) => {
      stack.appendChild(
        el("img", {
          class: "fdAvatarLayer",
          src: layer.src,
          alt: "",
          draggable: "false",
          "data-layer": layer.key,
        })
      );
    });
    wrap.appendChild(stack);
    return wrap;
  }

  /** 以裁切後人物 PNG 預覽，避免 CSS 裁切造成變形 */
  function renderCroppedCharacterPreview(outfit, className = "fdCharacter fdCharacter--submit") {
    const wrap = el("div", { class: className });
    const img = el("img", {
      class: "fdCroppedPreviewImg",
      alt: "穿搭預覽",
      draggable: "false",
    });
    wrap.appendChild(img);
    let objectUrl = "";
    exportCompositeImage(outfit)
      .then((blob) => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = URL.createObjectURL(blob);
        img.src = objectUrl;
      })
      .catch((err) => {
        console.warn(err);
        wrap.replaceWith(renderCharacterPreview(outfit, className));
      });
    wrap.addEventListener(
      "fd-revoke-preview",
      () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      },
      { once: true }
    );
    return wrap;
  }

  function isFdMobile() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  const HANG_IMG_BY_KEY = {
    hat: "hat",
    socks: "socks",
    shoes: "shoes",
    turtleneck: "turtleneck",
    patternShirt: "pattern-shirt",
    vestShirt: "vest-shirt",
    suitPants: "suit-pants",
    croppedPants: "cropped-pants",
    jacket: "jacket",
    vest: "vest",
  };

  const MOBILE_HANG_GROUPS = [
    {
      title: "配件（點選後調色）",
      keys: ["hat", "socks", "shoes"],
    },
    {
      title: "內搭（三選一）",
      keys: ["turtleneck", "patternShirt", "vestShirt"],
    },
    {
      title: "下裝",
      keys: ["suitPants", "croppedPants"],
    },
    {
      title: "外搭（可開關）",
      keys: ["jacket", "vest"],
    },
  ];

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

  async function exportCompositeImage(outfit) {
    const full = document.createElement("canvas");
    full.width = 3840;
    full.height = 2160;
    const fullCtx = full.getContext("2d");
    if (!fullCtx) throw new Error("無法建立畫布");

    const layers = getOutfitLayers(outfit);
    for (const layer of layers) {
      try {
        const img = await loadImage(layer.src);
        fullCtx.drawImage(img, 0, 0, full.width, full.height);
      } catch (err) {
        console.warn(err);
      }
    }

    const outW = CHAR_EXPORT_WIDTH;
    const outH = Math.round((CHAR_CROP.h / CHAR_CROP.w) * outW);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("無法建立畫布");

    ctx.clearRect(0, 0, outW, outH);
    ctx.drawImage(
      full,
      CHAR_CROP.x,
      CHAR_CROP.y,
      CHAR_CROP.w,
      CHAR_CROP.h,
      0,
      0,
      outW,
      outH
    );

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
      colorTarget: "inner",
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

  function createPaletteWidget(state, onColorPicked) {
    const paletteWrap = el("div", { class: "fdPaletteFloat" });
    const paletteHint = el("div", {
      class: "fdPaletteHint",
      text: `調色：${colorTargetLabel(state.colorTarget)}`,
    });
    const paletteBox = el("div", { class: "fdPaletteBox" });
    const paletteImg = el("img", {
      class: "fdPaletteImg",
      src: `${WARDROBE_BASE}/palette-crop.png`,
      alt: "調色盤",
      draggable: "false",
    });
    paletteBox.appendChild(paletteImg);
    paletteWrap.appendChild(paletteHint);
    paletteWrap.appendChild(paletteBox);

    let paletteMap = null;
    function preparePaletteMap() {
      if (!paletteImg.naturalWidth) return;
      const c = document.createElement("canvas");
      c.width = paletteImg.naturalWidth;
      c.height = paletteImg.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(paletteImg, 0, 0);
      paletteMap = { canvas: c, ctx };
    }

    function onPaletteClick(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!paletteMap) preparePaletteMap();
      if (!paletteMap) return;
      const rect = paletteImg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.floor(((e.clientX - rect.left) / rect.width) * paletteMap.canvas.width);
      const y = Math.floor(((e.clientY - rect.top) / rect.height) * paletteMap.canvas.height);
      if (x < 0 || y < 0 || x >= paletteMap.canvas.width || y >= paletteMap.canvas.height) return;
      const pixel = paletteMap.ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] < 40) return;
      if (pixel[0] < 35 && pixel[1] < 35 && pixel[2] < 35) return;
      onColorPicked(nearestPaletteId(pixel[0], pixel[1], pixel[2]));
    }

    paletteBox.addEventListener("click", onPaletteClick);
    paletteImg.addEventListener("load", preparePaletteMap);
    if (paletteImg.complete) preparePaletteMap();

    return {
      root: paletteWrap,
      setHint(text) {
        paletteHint.textContent = text;
      },
    };
  }

  function syncHangButtonState(btn, key, outfit, colorTarget) {
    let selected = false;
    let targeted = false;
    if (key === "hat" || key === "socks" || key === "shoes") {
      targeted = colorTarget === key;
      selected = targeted;
    } else if (key === "turtleneck" || key === "patternShirt" || key === "vestShirt") {
      selected = outfit.inner === key;
      targeted = selected && colorTarget === "inner";
    } else if (key === "suitPants" || key === "croppedPants") {
      selected = outfit.bottom === key;
      targeted = selected && colorTarget === "bottom";
    } else if (key === "jacket") {
      selected = outfit.jacketOn;
      targeted = colorTarget === "jacket";
    } else if (key === "vest") {
      selected = outfit.vestOn;
      targeted = colorTarget === "vest";
    }
    btn.classList.toggle("isActive", selected);
    btn.classList.toggle("isColorTarget", targeted);
  }

  function renderP11(stage, state, setScene) {
    if (!state.outfit || typeof state.outfit.inner !== "string") {
      state.outfit = defaultOutfit();
    }
    if (!state.colorTarget) state.colorTarget = "inner";

    const mobile = isFdMobile();
    stage.classList.toggle("fdStage--dressMobile", mobile);

    if (mobile) {
      renderP11Mobile(stage, state, setScene);
      return;
    }

    const scene = el("div", { class: "fdDressScene" });
    const frame = el("div", { class: "fdDressFrame" });

    frame.appendChild(
      el("img", {
        class: "fdDressLayer fdDressLayer--bg",
        src: `${WARDROBE_BASE}/bg.png`,
        alt: "",
        draggable: "false",
      })
    );

    const avatarHost = el("div", { class: "fdDressAvatarHost" });
    frame.appendChild(avatarHost);

    HANG_IMGS.forEach((name) => {
      frame.appendChild(
        el("img", {
          class: "fdDressLayer fdDressLayer--hang",
          src: `${WARDROBE_BASE}/hang/${name}.png`,
          alt: "",
          draggable: "false",
          "data-hang": name,
        })
      );
    });

    const hitLayer = el("div", { class: "fdHangHitLayer" });
    const hitButtons = {};
    HANG_HITS.forEach((hit) => {
      const btn = el("button", {
        class: "fdHangHit",
        type: "button",
        "aria-label": hit.label,
        title: hit.label,
        style: `left:${hit.left}%;top:${hit.top}%;width:${hit.width}%;height:${hit.height}%`,
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleHangSelect(state.outfit, hit.key, state);
          syncDressUi();
        },
      });
      hitButtons[hit.key] = btn;
      hitLayer.appendChild(btn);
    });
    frame.appendChild(hitLayer);

    const palette = createPaletteWidget(state, (colorId) => {
      applyColorToTarget(state.outfit, state.colorTarget, colorId);
      syncDressUi();
    });
    frame.appendChild(palette.root);

    const targetNote = el("div", { class: "fdDressTargetNote" });
    frame.appendChild(targetNote);
    scene.appendChild(frame);
    stage.appendChild(scene);

    function syncDressUi() {
      avatarHost.innerHTML = "";
      getOutfitLayers(state.outfit).forEach((layer) => {
        avatarHost.appendChild(
          el("img", {
            class: "fdDressLayer fdDressLayer--avatar",
            src: layer.src,
            alt: "",
            draggable: "false",
            "data-layer": layer.key,
          })
        );
      });
      palette.setHint(`調色：${colorTargetLabel(state.colorTarget)}`);
      targetNote.textContent = `點衣櫃選衣物，再點房屋調色盤換色（目前：${colorTargetLabel(state.colorTarget)}）`;
      Object.keys(hitButtons).forEach((key) => {
        syncHangButtonState(hitButtons[key], key, state.outfit, state.colorTarget);
      });
    }

    syncDressUi();

    appendNav(stage, {
      leftLabel: "回到房間",
      leftAction: () => setScene("p6"),
      rightLabel: "製作完成",
      rightAction: () => setScene("p13"),
      variant: "dress",
    });
  }

  function createHangChoiceButton(key, { selected, onClick }) {
    const hit = HANG_HITS.find((h) => h.key === key);
    const imgKey = HANG_IMG_BY_KEY[key];
    const btn = el("button", {
      class: `fdMobileHangBtn${selected ? " isActive" : ""}`,
      type: "button",
      "aria-label": hit?.label || key,
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(key);
      },
    });
    const thumb = el("div", { class: "fdMobileHangThumb" });
    if (hit && imgKey) {
      thumb.appendChild(
        el("img", {
          class: "fdMobileHangThumbImg",
          src: `${WARDROBE_BASE}/hang/${imgKey}.png`,
          alt: "",
          draggable: "false",
          style: [
            `width:${(100 / hit.width) * 100}%`,
            `height:${(100 / hit.height) * 100}%`,
            `left:${(-hit.left / hit.width) * 100}%`,
            `top:${(-hit.top / hit.height) * 100}%`,
          ].join(";"),
        })
      );
    }
    btn.appendChild(thumb);
    btn.appendChild(el("span", { class: "fdMobileHangLabel", text: hit?.label || key }));
    return btn;
  }

  function openMobileSheet(stage, { title, subtitle, buildBody, onClose }) {
    const overlay = el("div", { class: "fdMobileSheetOverlay" });
    const sheet = el("div", { class: "fdMobileSheet" });
    const header = el("div", { class: "fdMobileSheetHeader" }, [
      el("div", { class: "fdMobileSheetTitles" }, [
        el("h3", { class: "fdMobileSheetTitle", text: title || "" }),
        subtitle ? el("p", { class: "fdMobileSheetSub", text: subtitle }) : null,
      ]),
      el("button", {
        class: "fdMobileSheetClose",
        type: "button",
        text: "×",
        "aria-label": "關閉",
        onclick: () => close(),
      }),
    ]);
    const body = el("div", { class: "fdMobileSheetBody" });
    const footer = el("div", { class: "fdMobileSheetFooter" });
    sheet.appendChild(header);
    sheet.appendChild(body);
    sheet.appendChild(footer);
    overlay.appendChild(sheet);
    stage.appendChild(overlay);

    function close() {
      overlay.remove();
      onClose?.();
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    const api = {
      overlay,
      sheet,
      body,
      footer,
      setTitle(next, nextSub) {
        header.querySelector(".fdMobileSheetTitle").textContent = next || "";
        const sub = header.querySelector(".fdMobileSheetSub");
        if (nextSub) {
          if (sub) sub.textContent = nextSub;
          else header.querySelector(".fdMobileSheetTitles").appendChild(el("p", { class: "fdMobileSheetSub", text: nextSub }));
        } else if (sub) sub.remove();
      },
      setFooter(nodes) {
        footer.innerHTML = "";
        (nodes || []).forEach((node) => {
          if (node) footer.appendChild(node);
        });
      },
      close,
    };

    buildBody?.(api);
    return api;
  }

  function renderP11Mobile(stage, state, setScene) {
    const root = el("div", { class: "fdDressMobile fdDressMobile--tap" });
    const tip = el("p", {
      class: "fdDressMobileTip",
      text: "點人物身體部位來換裝：帽子／上衣／下裝／鞋襪",
    });

    const previewWrap = el("div", { class: "fdDressMobileStage" });
    const previewFrame = el("div", { class: "fdDressMobilePreviewFrame" });
    const previewHost = el("div", { class: "fdDressMobilePreview fdDressMobilePreview--full" });
    const zones = el("div", { class: "fdDressMobileZones" });

    // 依人物裁切 PNG（CHAR_CROP）中各衣物範圍設定熱區（可用 tools/freedom-door-mobile-zones.html 微調）
    const BODY_ZONES = [
      { id: "hat", label: "帽子", top: "1.4%", height: "5.6%", left: "25.9%", width: "33.7%" },
      { id: "top", label: "上衣", top: "17.8%", height: "30.9%", left: "8.9%", width: "78.3%" },
      { id: "bottom", label: "下裝", top: "50.2%", height: "37.7%", left: "21.9%", width: "55%" },
      { id: "feet", label: "鞋襪", top: "91.2%", height: "6.4%", left: "20.6%", width: "67%" },
    ];

    BODY_ZONES.forEach((zone) => {
      zones.appendChild(
        el("button", {
          class: "fdDressMobileZone",
          type: "button",
          "aria-label": zone.label,
          title: zone.label,
          style: `top:${zone.top};height:${zone.height};left:${zone.left};width:${zone.width}`,
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
            openZoneFlow(zone.id);
          },
        })
      );
    });

    previewFrame.appendChild(previewHost);
    previewFrame.appendChild(zones);
    previewWrap.appendChild(previewFrame);

    const actions = el("div", { class: "fdDressMobileActions" }, [
      el("button", {
        class: "fdMobileActionBtn fdMobileActionBtn--ghost",
        type: "button",
        text: "回到房間",
        onclick: () => setScene("p6"),
      }),
      el("button", {
        class: "fdMobileActionBtn fdMobileActionBtn--primary",
        type: "button",
        text: "製作完成",
        onclick: () => setScene("p13"),
      }),
    ]);

    root.appendChild(tip);
    root.appendChild(previewWrap);
    root.appendChild(actions);
    stage.appendChild(root);

    let previewUrl = "";
    let previewTimer = 0;

    function refreshPreview() {
      window.clearTimeout(previewTimer);
      previewTimer = window.setTimeout(() => {
        exportCompositeImage(state.outfit)
          .then((blob) => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            previewUrl = URL.createObjectURL(blob);
            previewHost.innerHTML = "";
            previewHost.appendChild(
              el("img", {
                class: "fdDressMobilePreviewImg",
                src: previewUrl,
                alt: "穿搭預覽",
                draggable: "false",
              })
            );
          })
          .catch((err) => console.warn(err));
      }, 40);
    }

    function renderOptionRow(keys, isSelected, onPick) {
      const row = el("div", { class: "fdMobileHangRow" });
      keys.forEach((key) => {
        row.appendChild(
          createHangChoiceButton(key, {
            selected: isSelected(key),
            onClick: onPick,
          })
        );
      });
      return row;
    }

    function renderPaletteStep(api, target, { title, subtitle, doneLabel, onDone }) {
      state.colorTarget = target;
      api.setTitle(title, subtitle || "點房屋色塊換色");
      api.body.innerHTML = "";
      const palette = createPaletteWidget(state, (colorId) => {
        applyColorToTarget(state.outfit, target, colorId);
        refreshPreview();
      });
      palette.root.classList.add("fdPaletteFloat--sheet");
      palette.setHint(`調色：${colorTargetLabel(target)}`);
      api.body.appendChild(palette.root);
      api.setFooter([
        el("button", {
          class: "fdMobileActionBtn fdMobileActionBtn--primary",
          type: "button",
          text: doneLabel || "完成",
          onclick: () => onDone?.(),
        }),
      ]);
    }

    function openHatFlow() {
      openMobileSheet(stage, {
        title: "帽子顏色",
        buildBody(api) {
          renderPaletteStep(api, "hat", {
            title: "帽子顏色",
            doneLabel: "完成",
            onDone: () => api.close(),
          });
        },
        onClose: refreshPreview,
      });
    }

    function openTopFlow() {
      openMobileSheet(stage, {
        title: "選擇內搭",
        buildBody(api) {
          function stepInner() {
            api.setTitle("選擇內搭", "三選一");
            api.body.innerHTML = "";
            api.body.appendChild(
              renderOptionRow(["turtleneck", "patternShirt", "vestShirt"], (key) => state.outfit.inner === key, (key) => {
                state.outfit.inner = key;
                if (key === "vestShirt") state.outfit.vestOn = false;
                state.colorTarget = "inner";
                refreshPreview();
                stepInnerColor();
              })
            );
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "關閉",
                onclick: () => api.close(),
              }),
            ]);
          }

          function stepInnerColor() {
            renderPaletteStep(api, "inner", {
              title: "內搭顏色",
              doneLabel: "下一步：外搭",
              onDone: () => stepOuter(),
            });
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "上一步",
                onclick: () => stepInner(),
              }),
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--primary",
                type: "button",
                text: "下一步：外搭",
                onclick: () => stepOuter(),
              }),
            ]);
          }

          function stepOuter() {
            api.setTitle("選擇外搭", "可選擇不要外搭");
            api.body.innerHTML = "";
            const row = el("div", { class: "fdMobileHangRow fdMobileHangRow--outer" });
            [
              { key: "jacket", label: "西裝外套" },
              { key: "vest", label: "背心" },
              { key: "none", label: "不要外搭" },
            ].forEach((opt) => {
              let selected = false;
              if (opt.key === "none") selected = !state.outfit.jacketOn && !state.outfit.vestOn;
              else if (opt.key === "jacket") selected = state.outfit.jacketOn;
              else if (opt.key === "vest") selected = state.outfit.vestOn;

              if (opt.key === "none") {
                const btn = el("button", {
                  class: `fdMobileHangBtn fdMobileHangBtn--text${selected ? " isActive" : ""}`,
                  type: "button",
                  text: "不要外搭",
                  onclick: () => {
                    state.outfit.jacketOn = false;
                    state.outfit.vestOn = false;
                    refreshPreview();
                    api.close();
                  },
                });
                row.appendChild(btn);
                return;
              }

              row.appendChild(
                createHangChoiceButton(opt.key, {
                  selected,
                  onClick: (key) => {
                    if (key === "jacket") {
                      state.outfit.jacketOn = true;
                      state.outfit.vestOn = false;
                      state.colorTarget = "jacket";
                    } else {
                      state.outfit.vestOn = true;
                      state.outfit.jacketOn = false;
                      state.colorTarget = "vest";
                    }
                    refreshPreview();
                    stepOuterColor(key);
                  },
                })
              );
            });
            api.body.appendChild(row);
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "上一步",
                onclick: () => stepInnerColor(),
              }),
            ]);
          }

          function stepOuterColor(kind) {
            renderPaletteStep(api, kind, {
              title: kind === "jacket" ? "外套顏色" : "背心顏色",
              doneLabel: "完成",
              onDone: () => api.close(),
            });
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "上一步",
                onclick: () => stepOuter(),
              }),
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--primary",
                type: "button",
                text: "完成",
                onclick: () => api.close(),
              }),
            ]);
          }

          stepInner();
        },
        onClose: refreshPreview,
      });
    }

    function openBottomFlow() {
      openMobileSheet(stage, {
        title: "選擇下裝",
        buildBody(api) {
          function stepPick() {
            api.setTitle("選擇下裝", "二選一");
            api.body.innerHTML = "";
            api.body.appendChild(
              renderOptionRow(["suitPants", "croppedPants"], (key) => state.outfit.bottom === key, (key) => {
                state.outfit.bottom = key;
                state.colorTarget = "bottom";
                refreshPreview();
                stepColor();
              })
            );
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "關閉",
                onclick: () => api.close(),
              }),
            ]);
          }

          function stepColor() {
            renderPaletteStep(api, "bottom", {
              title: "下裝顏色",
              doneLabel: "完成",
              onDone: () => api.close(),
            });
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "上一步",
                onclick: () => stepPick(),
              }),
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--primary",
                type: "button",
                text: "完成",
                onclick: () => api.close(),
              }),
            ]);
          }

          stepPick();
        },
        onClose: refreshPreview,
      });
    }

    function openFeetFlow() {
      openMobileSheet(stage, {
        title: "鞋襪顏色",
        buildBody(api) {
          function stepSocks() {
            renderPaletteStep(api, "socks", {
              title: "襪子顏色",
              doneLabel: "下一步：鞋子",
              onDone: () => stepShoes(),
            });
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "關閉",
                onclick: () => api.close(),
              }),
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--primary",
                type: "button",
                text: "下一步：鞋子",
                onclick: () => stepShoes(),
              }),
            ]);
          }

          function stepShoes() {
            renderPaletteStep(api, "shoes", {
              title: "鞋子顏色",
              doneLabel: "完成",
              onDone: () => api.close(),
            });
            api.setFooter([
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--ghost",
                type: "button",
                text: "上一步",
                onclick: () => stepSocks(),
              }),
              el("button", {
                class: "fdMobileActionBtn fdMobileActionBtn--primary",
                type: "button",
                text: "完成",
                onclick: () => api.close(),
              }),
            ]);
          }

          stepSocks();
        },
        onClose: refreshPreview,
      });
    }

    function openZoneFlow(zoneId) {
      if (zoneId === "hat") openHatFlow();
      else if (zoneId === "top") openTopFlow();
      else if (zoneId === "bottom") openBottomFlow();
      else openFeetFlow();
    }

    refreshPreview();
  }
  function renderP13(stage, state, setScene) {
    const mobile = isFdMobile();
    stage.classList.toggle("fdStage--submitMobile", mobile);

    const layout = el("div", { class: `fdSubmitLayout${mobile ? " fdSubmitLayout--mobile" : ""}` });
    layout.appendChild(renderCroppedCharacterPreview(state.outfit, "fdCharacter fdCharacter--submit"));

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
      class: mobile ? "fdMobileActionBtn fdMobileActionBtn--primary" : "fdNavBtn fdNavBtn--right",
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
          const blob = await exportCompositeImage(state.outfit);
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

    if (mobile) {
      stage.appendChild(
        el("div", { class: "fdDressMobileActions fdSubmitMobileActions" }, [
          el("button", {
            class: "fdMobileActionBtn fdMobileActionBtn--ghost",
            type: "button",
            text: "返回製作",
            onclick: () => setScene("p11"),
          }),
          uploadBtn,
        ])
      );
    } else {
      stage.appendChild(
        el("div", { class: "fdNav" }, [
          el("button", {
            class: "fdNavBtn fdNavBtn--left",
            type: "button",
            text: "返回製作",
            onclick: () => setScene("p11"),
          }),
          uploadBtn,
        ])
      );
    }
  }

  function buildGalleryCard(item, { own = false, pendingNote = "" } = {}) {
    const card = el("article", { class: `fdGalleryCard${own ? " fdGalleryCard--own" : ""}` });
    if (item.imageUrl) {
      card.appendChild(
        el("img", {
          class: "fdGalleryImg",
          src: item.imageUrl,
          alt: item.title || "作品",
        })
      );
    } else {
      card.appendChild(el("div", { class: "fdGalleryImg fdGalleryImg--placeholder", text: "無預覽" }));
    }

    const meta = el("div", { class: "fdGalleryMeta" });
    meta.appendChild(el("h3", { class: "fdGalleryTitle", text: item.title || "未命名作品" }));
    if (item.authorName) {
      meta.appendChild(el("p", { class: "fdGalleryAuthor", text: `作者｜${item.authorName}` }));
    }
    if (item.concept) {
      meta.appendChild(el("p", { class: "fdGalleryConcept", text: item.concept }));
    }
    if (pendingNote) {
      meta.appendChild(el("p", { class: "fdGalleryPendingNote", text: pendingNote }));
    }
    card.appendChild(meta);
    return card;
  }

  function renderP14(stage, state, setScene) {
    const mobile = isFdMobile();
    stage.classList.toggle("fdStage--galleryMobile", mobile);

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
        buildGalleryCard(state.lastSubmission, {
          own: true,
          pendingNote:
            state.lastSubmission.mode === "sanity"
              ? "已送出，待後台審核通過後會公開顯示於下方作品牆。"
              : "已儲存於本機，待連線 Sanity 並審核後可公開顯示。",
        }),
      ]);
      body.insertBefore(own, grid);
    }

    const replay = () => {
      state.outfit = defaultOutfit();
      state.draft = defaultDraft();
      state.activeHotspot = null;
      state.uploadMessage = "";
      state.lastSubmission = null;
      setScene("p1");
    };

    if (mobile) {
      stage.appendChild(
        el("div", { class: "fdDressMobileActions fdGalleryMobileActions" }, [
          el("button", {
            class: "fdMobileActionBtn fdMobileActionBtn--ghost",
            type: "button",
            text: "再玩一次",
            onclick: replay,
          }),
          el("button", {
            class: "fdMobileActionBtn fdMobileActionBtn--primary",
            type: "button",
            text: "回首頁",
            onclick: navigateHome,
          }),
        ])
      );
    } else {
      appendNav(stage, {
        leftLabel: "再玩一次",
        leftAction: replay,
        rightLabel: "結束參觀回到首頁",
        rightAction: navigateHome,
      });
    }

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
          grid.appendChild(buildGalleryCard(item));
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
