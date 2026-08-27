/* 推開自由門特展 — 互動體驗 P1–P14 */

(function () {
  const ASSET_BASE = "./assets/images/Freedom Door";
  const WARDROBE_BASE = `${ASSET_BASE}/wardrobe`;
  const ROOM_BASE = `${ASSET_BASE}/房間物件`;
  const ROOM_LAYERS = [
    "背景.png",
    "窗戶.png",
    "日曆.png",
    "年曆1.png",
    "年曆2.png",
    "獎狀.png",
    "南海觀音像.png",
    "藤椅.png",
    "衣服.png",
    "前景.png",
  ];
  const ROOM_FRONT = "Front.PNG";
  const HALLWAY_SRC = `${ASSET_BASE}/Hallway_New.PNG`;
  const ENTRY_AUDIO_SRC = `${ASSET_BASE}/金伯伯錄音檔.mp3`;
  /** 之後換成提供的圖檔即可，例如 `${ASSET_BASE}/音效圖示.png` */
  const ENTRY_AUDIO_ICON = "";
  const HANG_FRAME_SRC = `${WARDROBE_BASE}/hang/竿子與衣架.PNG`;

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
      "當你/妳回到自己的房間時，你/妳如何呈現最真實的自己？\n當你/妳在一個房間住了30年，這個空間會有哪些東西？",
      "對於經歷過戰火與流離的義士們來說，房外的世界充滿了身不由己與無可奈何，\n而當他們回到只屬於自己的私密空間裡，才真正掌握了自己的自由：\n如何擺放一張照片、如何收納一件衣物、如何安放一段不為人知的回憶。\n在成為「歷史名詞」之前，他們首先是一個具備獨特個性的人。",
      "讓我們一起推開自由門，探索義士們的房間內，裝載著什麼樣的自由？",
    ],
    p4: "「一進門就看到了吧！」",
    p4Ma: "「就是這樣子呀！」",
    p4Pan: "「有一支國語歌，鴨綠江之夜」",
    p5Title: "【操作說明】",
    p5Body: [
      "本房間有3個物件可供點擊，\n點擊後會顯示該物件的簡介，\n請移動滑鼠游標來探索房間吧！",
    ],
    endTitle: "【結語】",
    endBody: [
      "自由，其實從未遠去。",
      "經歷過時代巨浪與流離歲月的義士們，無法選擇自己降生於何種年代、被迫踏上哪條道路；但在這方屬於自己的房間裡，物品的堆疊與空間的佈置，都是他們對抗命運巨浪、一次又一次實踐自由意志的證明，他們用最平凡的日常，奪回了對生命的詮釋權。",
    ],
    doorComingSoonTitle: "【房間籌備中】",
    doorComingSoonBody: [
      "這扇門後的房間還在製作中。",
      "請先參觀其他已開放的房間。",
    ],
    hotspots: {
      wall: {
        name: "黃色牆壁",
        body: "在金伯伯的房間中，牆壁漆滿了專屬於他的「金伯伯黃色」，對於一個歷經韓戰、反共、選擇來臺的人，他的一生有多少選擇是真正屬於自己的？當一個人身處無法掌控自身命運的時代中，戰爭決定了他何去何從，歷史決定了他的身份定位，而這個小小的房間，或許是少數完全屬於自己，能真正實踐自由意志的空間。",
        photo: `${ASSET_BASE}/黃色牆壁.png`,
        photoAlt: "金伯伯房間黃色牆壁",
      },
      guanyin: {
        name: "南海觀音",
        body: [
          "冰箱上方鋪著粉紅桌巾，半透明的南海觀音供奉其間，兩側花瓶盛開著鮮豔粉花。這不是嚴肅的神壇，而是金元奎最平凡日常中的精神寄託。",
          "感念軍旅生涯中幾次生死交關，皆憑藉逝去母親與觀音菩薩的夢中意象平安度過，這個在寢室一角營造出的信仰空間，不僅連結了他對母親的思念，更體現了他的生活美學。",
          "在時代的風浪過後，他於這方小天地裡安放神聖與記憶，展現了最溫柔而堅定的自由意志。",
        ],
        photo: `${ASSET_BASE}/南海觀音像2.png`,
        photoAlt: "冰箱上的南海觀音",
      },
      clothes: {
        name: "自由的衣櫃",
        body: "金伯伯的衣櫃裡有各式各樣的衣服，亮橘色的西裝內搭、格紋狀的素色襯衫、繽紛長襪、畫家帽……，金伯伯總是對自己的穿搭很有想法。人們每天都需要穿衣服，選擇穿什麼，就是選擇以什麼樣的姿態面對這世界，同時也是透過衣著選擇，告訴大家自己是誰。",
        photo: `${ASSET_BASE}/自由的衣櫃.jpg`,
        photoAlt: "金伯伯的穿搭",
        cta: "進入「自由的衣櫃」",
      },
    },
    p10Title: "【操作說明】",
    p10Body: [
      "金元奎的衣櫃中，裝載了自由的靈魂，\n他總是用獨特的配色與穿搭，展現出鮮明的個性。\n如果金元奎走入我們的生活，他會如何展現獨特的時尚呢？\n請試著用你/妳獨特的眼光，\n為他搭配出一套適合出門逛街的穿搭吧！",
    ],
  };

  const HOTSPOTS = {
    // 窗戶下方正方形熱區（黃牆）
    wall: { left: "17.5%", top: "50.5%", width: "16.5%", height: "15.3%" },
    guanyin: { left: "51.8%", top: "36.6%", width: "4.2%", height: "13.9%" },
    clothes: { left: "62.3%", top: "0%", width: "37.7%", height: "56.8%" },
  };

  const DOOR_POSITIONS = [
    { left: "3.6%", top: "10.8%", width: "18.8%", height: "74.2%" },
    { left: "40.8%", top: "10.8%", width: "18.8%", height: "74.2%" },
    { left: "78.3%", top: "10.8%", width: "18.8%", height: "74.2%" },
  ];

  const MA_ROOM_BASE = `${ASSET_BASE}/房間物件_馬`;
  const MA_PHOTO_STORY_URL =
    "https://vartmuseum.wixsite.com/vartmuseum/story?pgid=jfl1hc37-c15902cd-7cac-4c16-a43b-2147d4905baa";

  const ROOMS = {
    jin: {
      id: "jin",
      layerBase: ROOM_BASE,
      layers: ROOM_LAYERS,
      front: ROOM_FRONT,
      audio: ENTRY_AUDIO_SRC,
      slogan: () => COPY.p4,
      hotspots: HOTSPOTS,
      items: () => COPY.hotspots,
      hasWardrobe: true,
    },
    ma: {
      id: "ma",
      layerBase: MA_ROOM_BASE,
      layers: ["背景.png", "中景.png", "電鍋.png", "花椒葉粉末與調味料.png", "黑白攝影.png"],
      front: "前景.png",
      audio: `${ASSET_BASE}/馬世敬錄音檔.mp3`,
      slogan: () => COPY.p4Ma,
      hasWardrobe: false,
      hotspots: {
        cooker: { left: "43.5%", top: "52%", width: "10.2%", height: "15%", hintLeft: "55%" },
        photos: { left: "0.5%", top: "11%", width: "22%", height: "17.5%" },
        spices: { left: "39.9%", top: "66.9%", width: "5.7%", height: "5.3%" },
      },
      items: () => ({
        cooker: {
          name: "電鍋",
          body: [
            "電鍋裡升騰起的不只是蒸氣，更是跨越歲月與地理邊界的家鄉味道。",
            "對馬世敬而言，揉製饅頭與花捲的動作，是深植於肌肉的身體記憶。當來自甘肅與臺灣的食材在麵團中重新混合，電鍋便成了這私密空間裡，安放鄉愁與意志的地方。",
            "在無法掌控命運的時代裡，舌尖是唯一能忠實保留歸屬感的場所。在這個小小的房間裡，決定今天要在電鍋裡蒸出什麼味道、如何重新定義「家鄉」，正是他最深刻的自由實踐。",
          ],
          youtubeUrl: "https://youtu.be/Ca4fU34VzKs",
        },
        photos: {
          name: "黑白攝影",
          body: [
            "用衣架懸掛起來的相框與黑白照片，記錄著義士們在榮家生活的身體軌跡與日常隨筆。",
            "衣架原本用於收納日常衣物，如今卻成了展示個人視野的載體；鏡頭則替代了言語，捕捉下漫遊與行走間的獨到視野。被戰爭與時代定義了半生的他們，在此刻拿起相機，重新奪回了「觀看」與「紀錄」的主導權。",
            "照片裡微小的日常觀察，不再是歷史大敘事下的背景，而是他們在這個空間裡，用自己的眼睛定義世界、自由探索生活的最真實證明。",
          ],
          linkUrl: MA_PHOTO_STORY_URL,
          linkLabel: "查看《走出自己的路》X《攝影記事》",
        },
        spices: {
          name: "花椒葉粉末與調味料",
          body: [
            "透明夾鏈袋裡密封著的綠色粉末，是馬世敬探親時從甘肅老家花椒樹上摘下、曬乾並親手磨成的花椒葉粉。",
            "從甘肅到新疆天山，再跨越海峽回到臺灣，這包花椒葉跟隨他踏過萬里旅程。雖然最終沒能來得及將它揉入花捲，但它早已超越了調味料的本質。",
            "這包花椒葉粉末靜靜地躺在房間的一角，被封存的草木香氣，凝固了對家鄉最真切的念想。",
          ],
        },
      }),
    },
    pan: {
      id: "pan",
      layerBase: `${ASSET_BASE}/房間物件_潘`,
      layers: ["背景.png", "收音機.png"],
      front: "前景.png",
      top: ["遊樂場彩券.png"],
      audio: `${ASSET_BASE}/潘海波錄音檔.mp3`,
      slogan: () => COPY.p4Pan,
      hasWardrobe: false,
      hotspots: {
        radio: { left: "64.7%", top: "43.3%", width: "8%", height: "9.7%" },
        tickets: { left: "80.7%", top: "76%", width: "12.3%", height: "10.3%" },
      },
      items: () => ({
        radio: {
          name: "收音機",
          body: [
            "一首全臺灣幾乎已無人知曉的《鴨綠江之夜》，卻深刻烙印在潘海波的記憶深處，隨他跨越海峽、渡過漫長歲月。",
            "在與研究生的參與式藝術實踐中，重現了他高唱這首歌的姿態——「我寂寞的靈魂，朝夕相望在遙遠地方」。歌詞裡的孤寂，與榮家中形單影隻的身影交疊，讓這段歷史的迴響久久不散。",
            "收音機不僅是接收外界聲音的工具，更是安放思念的介面。在無法重來的時代洪流後，能獨自在房裡按下播放鍵，讓心中的旋律自由流淌，是他對自身靈魂最深沉的陪伴與對話。",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=zkdRux-rhaw",
        },
        tickets: {
          name: "遊樂場彩票",
          body: [
            "一張張從西門町湯姆熊集得的彩票，記錄著潘海波走出榮家、漫遊城市的日常足跡。",
            "即使年歲漸長，他仍習慣獨自搭上公車，穿梭在熱鬧喧囂的街頭。在霓虹閃爍與電子音效交織的遊樂場裡，他不是教科書上的韓戰反共義士，而是一位單純享受遊戲樂趣的資深玩家。",
            "這些彩票不僅是娛樂的留痕，更是他跨越時代禁錮的證明。推開房門、踏上公車，在熙熙攘攘的西門町裡選擇屬於自己的快樂，是他最隨心所欲、最當下的自由實踐。",
          ],
          photo: `${ASSET_BASE}/遊樂場彩券圖片.jpg`,
          photoAlt: "遊樂場彩票",
        },
      }),
    },
  };

  function getActiveRoom(state) {
    return ROOMS[state?.roomId] || ROOMS.jin;
  }

  function youtubeEmbedSrc(url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    try {
      const parsed = new URL(raw);
      if (parsed.hostname.includes("youtu.be")) {
        const id = parsed.pathname.replace(/^\//, "").split("/")[0];
        return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : "";
      }
      if (parsed.hostname.includes("youtube.com")) {
        const embedMatch = parsed.pathname.match(/^\/embed\/([^/]+)/);
        if (embedMatch?.[1]) return `https://www.youtube.com/embed/${encodeURIComponent(embedMatch[1])}`;
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : "";
      }
    } catch {
      return "";
    }
    return "";
  }

  let roomWallHitDataPromise = null;

  function isBackgroundWallPixel(r, g, b, a) {
    if (a < 180) return false;
    // 灰階水磨石地板：RGB 接近
    const span = Math.max(r, g, b) - Math.min(r, g, b);
    if (span < 18) return false;
    // 奶油黃牆：R/G 高、B 明顯較低
    return r > 165 && g > 145 && b < 205 && r >= g - 8 && g > b + 12;
  }

  function prepareRoomWallHitData() {
    if (roomWallHitDataPromise) return roomWallHitDataPromise;
    roomWallHitDataPromise = (async () => {
      const bgImg = await loadImage(`${ROOM_BASE}/背景.png`);
      const width = bgImg.naturalWidth;
      const height = bgImg.naturalHeight;
      const bgCanvas = document.createElement("canvas");
      bgCanvas.width = width;
      bgCanvas.height = height;
      const bgCtx = bgCanvas.getContext("2d", { willReadFrequently: true });
      bgCtx.drawImage(bgImg, 0, 0);

      const occCanvas = document.createElement("canvas");
      occCanvas.width = width;
      occCanvas.height = height;
      const occCtx = occCanvas.getContext("2d", { willReadFrequently: true });
      for (let i = 1; i < ROOM_LAYERS.length; i += 1) {
        const layerImg = await loadImage(`${ROOM_BASE}/${ROOM_LAYERS[i]}`);
        occCtx.drawImage(layerImg, 0, 0);
      }

      return { width, height, bgCtx, occCtx };
    })().catch((err) => {
      roomWallHitDataPromise = null;
      throw err;
    });
    return roomWallHitDataPromise;
  }

  function clientToRoomImagePoint(frame, clientX, clientY, naturalW, naturalH) {
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = Math.floor(((clientX - rect.left) / rect.width) * naturalW);
    const y = Math.floor(((clientY - rect.top) / rect.height) * naturalH);
    if (x < 0 || y < 0 || x >= naturalW || y >= naturalH) return null;
    return { x, y };
  }

  function isExposedWallAt(hitData, x, y) {
    const bg = hitData.bgCtx.getImageData(x, y, 1, 1).data;
    if (!isBackgroundWallPixel(bg[0], bg[1], bg[2], bg[3])) return false;
    const occ = hitData.occCtx.getImageData(x, y, 1, 1).data;
    return occ[3] <= 28;
  }

  function defaultOutfit() {
    return {
      hatOn: true,
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
    if (outfit.hatOn !== false) {
      layers.push({ src: layerSrc("hat", outfit.hatColor), key: "hat" });
    }
    return layers;
  }

  function applyColorToTarget(outfit, target, colorId) {
    const id = Math.max(1, Math.min(10, colorId));
    switch (target) {
      case "hat":
        outfit.hatColor = id;
        outfit.hatOn = true;
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
        if (state.colorTarget === "hat" && outfit.hatOn !== false) {
          outfit.hatOn = false;
        } else {
          outfit.hatOn = true;
          state.colorTarget = "hat";
        }
        break;
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

  function createRoomScene({ blur = false, room } = {}) {
    const config = room || ROOMS.jin;
    const layerBase = config.layerBase || ROOM_BASE;
    const layers = Array.isArray(config.layers) ? config.layers : ROOM_LAYERS;
    const front = config.front || "";
    const topLayers = Array.isArray(config.top) ? config.top : config.top ? [config.top] : [];
    const scene = el("div", {
      class: `fdScene fdScene--room${blur ? " fdScene--blur" : ""}`,
    });
    const frame = el("div", { class: "fdSceneFrame fdSceneFrame--room" });
    const overlay = el("div", { class: "fdSceneOverlay" });

    layers.forEach((fileName, index) => {
      frame.appendChild(
        el("img", {
          class: `fdRoomLayer${index === 0 ? " fdRoomLayer--base" : ""}`,
          src: `${layerBase}/${fileName}`,
          alt: "",
          draggable: "false",
          "aria-hidden": "true",
          style: `z-index:${index + 1}`,
        })
      );
    });

    frame.appendChild(overlay);
    if (front) {
      frame.appendChild(
        el("img", {
          class: "fdRoomLayer fdRoomLayer--front",
          src: `${layerBase}/${front}`,
          alt: "",
          draggable: "false",
          "aria-hidden": "true",
        })
      );
    }
    topLayers.forEach((fileName) => {
      frame.appendChild(
        el("img", {
          class: "fdRoomLayer fdRoomLayer--top",
          src: `${layerBase}/${fileName}`,
          alt: "",
          draggable: "false",
          "aria-hidden": "true",
        })
      );
    });
    scene.appendChild(frame);
    return { scene, frame, overlay };
  }

  function hotspotStyle(rect) {
    return `left:${rect.left}; top:${rect.top}; width:${rect.width}; height:${rect.height}`;
  }

  function buildHotspotHint(rect = {}) {
    const left = rect.hintLeft || "50%";
    const top = rect.hintTop || "50%";
    return el("span", {
      class: "fdHotspotHint",
      "aria-hidden": "true",
      style: `left:${left};top:${top}`,
    }, [
      el("span", { class: "fdHotspotHintArrow" }),
    ]);
  }

  function buildInfoPanel(state, key, { onClose, onEnterWardrobe, items } = {}) {
    const catalog = items || COPY.hotspots;
    const info = catalog[key];
    if (!info) return el("aside", { class: "fdInfoPanel" });
    const panel = el("aside", { class: `fdInfoPanel fdInfoPanel--${key}${key === "clothes" ? " fdInfoPanel--wardrobe" : ""}` }, [
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
      el("h3", { class: "fdInfoTitle", text: info.name }),
    ]);
    const bodies = Array.isArray(info.body) ? info.body : [info.body];
    bodies.forEach((text) => {
      const body = String(text || "").trim();
      if (body) panel.appendChild(el("p", { class: "fdInfoBody", text: body }));
    });

    if (info.photo) {
      panel.appendChild(
        el("figure", { class: "fdInfoPhoto" }, [
          el("img", {
            class: "fdInfoPhotoImg",
            src: info.photo,
            alt: info.photoAlt || info.name || "參考照片",
            loading: "lazy",
          }),
        ])
      );
    }

    const embedSrc = youtubeEmbedSrc(info.youtubeUrl);
    if (embedSrc) {
      panel.appendChild(
        el("div", { class: "fdInfoVideo" }, [
          el("iframe", {
            class: "fdInfoVideoFrame",
            src: embedSrc,
            title: `${info.name || "物件"}影片`,
            loading: "lazy",
            referrerpolicy: "strict-origin-when-cross-origin",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "true",
          }),
        ])
      );
    } else if (info.youtubePending) {
      panel.appendChild(el("div", { class: "fdInfoVideo fdInfoVideo--pending", text: "影片即將上架" }));
    }

    if (info.linkUrl) {
      panel.appendChild(
        el("a", {
          class: "fdInfoLink",
          href: info.linkUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          text: info.linkLabel || "查看相關介紹",
        })
      );
    }

    if (key === "clothes" && info.cta) {
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

  function navigateToFreeman() {
    if (typeof navigateFromHref === "function") navigateFromHref("#exhibition-right/about");
    else location.hash = "#exhibition-right/about";
  }

  function getEndingAssets() {
    const about = window.SITE_CONTENT?.exhibitions?.["exhibition-left"]?.about || {};
    return {
      bannerSrc: about.banner?.src || `${ASSET_BASE}/橫式banner_高斯模糊.png`,
      logoSrc: about.logo?.src || `${ASSET_BASE}/理念頁LOGO.png?v=20260803ak`,
      logoAlt: about.logo?.alt || "義家藝館",
    };
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

  function createEntryAudio() {
    const audioEl = el("audio", {
      class: "fdModalAudio",
      preload: "auto",
    });
    audioEl.controls = false;
    audioEl.loop = false;
    audioEl.playsInline = true;
    let source = ENTRY_AUDIO_SRC;

    function stop() {
      audioEl.pause();
      try {
        audioEl.currentTime = 0;
      } catch {
        /* ignore */
      }
    }

    function setSource(src) {
      const next = String(src || "").trim() || ENTRY_AUDIO_SRC;
      if (source === next) return;
      stop();
      source = next;
      audioEl.src = source;
    }

    function play() {
      if (audioEl.getAttribute("src") !== source) {
        audioEl.src = source;
      }
      try {
        audioEl.currentTime = 0;
      } catch {
        /* ignore */
      }
      const tryPlay = () => audioEl.play().catch(() => {});
      if (audioEl.readyState >= 2) tryPlay();
      else audioEl.addEventListener("canplay", tryPlay, { once: true });
    }

    return { el: audioEl, play, stop, setSource };
  }

  function buildAudioIconGraphic() {
    if (ENTRY_AUDIO_ICON) {
      return el("img", {
        class: "fdAudioIconImg",
        src: ENTRY_AUDIO_ICON,
        alt: "",
        "aria-hidden": "true",
      });
    }
    return el("span", {
      class: "fdAudioIconFallback",
      html: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9.5v5h3.2L12 18.8V5.2L7.2 9.5H4z" fill="currentColor"/><path d="M15.35 8.4a4.6 4.6 0 0 1 0 7.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17.9 6.2a8 8 0 0 1 0 11.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    });
  }

  function buildEntryAudioButton(entryAudio, { className = "fdAudioBtn", label = "播放語音" } = {}) {
    const btn = el(
      "button",
      {
        class: className,
        type: "button",
        "aria-label": label,
        title: label,
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          entryAudio.play();
        },
      },
      [buildAudioIconGraphic()]
    );
    return btn;
  }

  function showModal(stage, { title, paragraphs, buttonLabel, onClose, showClose = true, extra, variant } = {}) {
    const overlay = el("div", { class: "fdModalOverlay sitePopupOverlay" });
    const box = el("div", {
      class: `fdModal sitePopupPanel${variant ? ` fdModal--${variant}` : ""}`,
    });

    function closeModal() {
      overlay.remove();
      onClose?.();
    }

    if (showClose) {
      box.appendChild(
        el(
          "button",
          {
            class: "fdModalClose sitePopupClose",
            type: "button",
            "aria-label": "關閉",
            onclick: () => closeModal(),
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
    }
    if (title) box.appendChild(el("h2", { class: "fdModalTitle", text: title }));
    (paragraphs || []).forEach((p) => box.appendChild(el("p", { class: "fdModalText", text: p })));
    if (extra) {
      box.appendChild(
        el("div", { class: "fdModalExtra" }, Array.isArray(extra) ? extra : [extra])
      );
    }
    if (buttonLabel) {
      box.appendChild(
        el("button", {
          class: "fdModalAction",
          type: "button",
          text: buttonLabel,
          onclick: () => closeModal(),
        })
      );
    }
    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay && showClose) closeModal();
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

    const entryAudio = createEntryAudio();
    viewport.appendChild(entryAudio.el);

    const state = {
      scene: "p1",
      roomId: "jin",
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
          renderP4(stage, state, setScene, entryAudio);
          break;
        case "p5":
          renderP5(stage, state, setScene);
          break;
        case "p6":
          renderP6(stage, state, setScene, redraw, entryAudio);
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
        case "end":
          renderEnding(stage);
          break;
        default:
          renderP1(stage, state, setScene);
      }
    }

    function setScene(next) {
      if (next === "p3" || next === "p1" || next === "end") entryAudio.stop();
      state.scene = next;
      redraw();
    }

    redraw();
    return root;
  }

  function renderEnding(stage) {
    const { bannerSrc, logoSrc, logoAlt } = getEndingAssets();
    stage.classList.add("fdStage--end");

    stage.appendChild(
      el("img", {
        class: "aboutConceptBg",
        src: bannerSrc,
        alt: "",
        "aria-hidden": "true",
      })
    );
    stage.appendChild(el("div", { class: "aboutConceptDim", "aria-hidden": "true" }));
    stage.appendChild(
      el("img", {
        class: "aboutConceptLogo",
        src: logoSrc,
        alt: logoAlt,
      })
    );
    stage.appendChild(
      el(
        "div",
        { class: "aboutConceptContent fdEndContent" },
        [
          el("h1", { class: "aboutConceptLead fdEndTitle", text: COPY.endTitle }),
          ...COPY.endBody.map((line) =>
            el("p", { class: "aboutConceptParagraph fpConceptBody", text: line })
          ),
        ]
      )
    );
    appendNav(stage, {
      leftLabel: "回到首頁",
      leftAction: navigateHome,
      rightLabel: "前往「成為自由人」",
      rightAction: navigateToFreeman,
      variant: "end",
    });
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
    const { scene, overlay, img } = createFitScene(HALLWAY_SRC, { corridor: true });

    DOOR_POSITIONS.forEach((door, index) => {
      const roomId = index === 0 ? "ma" : index === 1 ? "jin" : "pan";
      overlay.appendChild(
        el("button", {
          class: "fdDoorHotspot",
          type: "button",
          "aria-label": roomId ? "進入房間" : "房間籌備中",
          style: hotspotStyle(door),
          onclick: (e) => {
            e.stopPropagation();
            if (roomId) {
              state.roomId = roomId;
              state.activeHotspot = null;
              setScene("p4");
              return;
            }
            showModal(stage, {
              title: COPY.doorComingSoonTitle,
              paragraphs: COPY.doorComingSoonBody,
            });
          },
        })
      );
    });

    track.appendChild(scene);
    corridor.appendChild(track);
    stage.appendChild(corridor);

    img.addEventListener("load", () => applyCorridorScroll(stage, state));

    appendNav(stage, {
      rightLabel: "結束參觀",
      rightAction: () => setScene("end"),
    });

    const scrollBy = () => {
      const viewport = stage.closest(".fdViewport");
      return Math.max(220, (viewport?.clientWidth || 960) * 0.45);
    };

    stage.appendChild(
      el(
        "button",
        {
          class: "fdArrow fdArrow--left",
          type: "button",
          "aria-label": "向左",
          onclick: () => {
            state.corridorScroll = Math.max(0, state.corridorScroll - scrollBy());
            applyCorridorScroll(stage, state);
          },
        },
        [el("span", { class: "fdArrowIcon", "aria-hidden": "true" })]
      )
    );
    stage.appendChild(
      el(
        "button",
        {
          class: "fdArrow fdArrow--right",
          type: "button",
          "aria-label": "向右",
          onclick: () => {
            state.corridorScroll = Math.min(getCorridorMaxScroll(stage), state.corridorScroll + scrollBy());
            applyCorridorScroll(stage, state);
          },
        },
        [el("span", { class: "fdArrowIcon", "aria-hidden": "true" })]
      )
    );

    requestAnimationFrame(() => applyCorridorScroll(stage, state));
  }

  function renderP4(stage, state, setScene, entryAudio) {
    const room = getActiveRoom(state);
    entryAudio?.setSource?.(room.audio);
    const { scene } = createRoomScene({ blur: true, room });
    stage.appendChild(scene);
    showModal(stage, {
      paragraphs: [room.slogan()],
      buttonLabel: "繼續",
      showClose: false,
      variant: "slogan",
      extra: [
        buildEntryAudioButton(entryAudio, {
          className: "fdAudioBtn fdAudioBtn--modal",
          label: "播放語音",
        }),
      ],
      onClose: () => setScene("p5"),
    });
  }

  function renderP5(stage, state, setScene) {
    const room = getActiveRoom(state);
    const { scene } = createRoomScene({ blur: true, room });
    stage.appendChild(scene);
    showModal(stage, {
      title: COPY.p5Title,
      paragraphs: COPY.p5Body,
      buttonLabel: "開始探索",
      onClose: () => setScene("p6"),
    });
  }

  function renderP6(stage, state, setScene, redraw, entryAudio) {
    const room = getActiveRoom(state);
    const items = typeof room.items === "function" ? room.items() : room.items;
    const hotspots = room.hotspots || HOTSPOTS;
    entryAudio?.setSource?.(room.audio);
    const wrap = el("div", { class: "fdRoomWrap" });
    const { scene, overlay } = createRoomScene({ room });
    const panelSlot = el("div", { class: "fdPanelSlot" });
    void redraw;

    function syncPanel() {
      panelSlot.innerHTML = "";
      wrap.classList.toggle("fdRoomWrap--panelOpen", Boolean(state.activeHotspot));
      if (!state.activeHotspot) return;

      const activeRect = hotspots[state.activeHotspot] || {};
      const itemKey = activeRect.item || state.activeHotspot;
      panelSlot.appendChild(
        buildInfoPanel(state, itemKey, {
          items,
          onClose: () => {
            state.activeHotspot = null;
            syncPanel();
          },
          onEnterWardrobe: room.hasWardrobe
            ? () => {
                state.activeHotspot = null;
                setScene("p11");
                requestAnimationFrame(() => {
                  showModal(stage, {
                    title: COPY.p10Title,
                    paragraphs: COPY.p10Body,
                    onClose: () => {},
                  });
                });
              }
            : undefined,
        })
      );
    }

    function toggleHotspot(key) {
      state.activeHotspot = state.activeHotspot === key ? null : key;
      syncPanel();
    }

    Object.entries(hotspots).forEach(([key, rect]) => {
      const itemKey = rect.item || key;
      overlay.appendChild(
        el(
          "button",
          {
            class: `fdHotspot${state.activeHotspot === key ? " isActive" : ""}${itemKey === "spices" || itemKey === "tickets" ? " fdHotspot--front" : ""}`,
            type: "button",
            "aria-label": items[itemKey]?.name || key,
            style: hotspotStyle(rect),
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleHotspot(key);
            },
          },
          [buildHotspotHint(rect)]
        )
      );
    });

    wrap.appendChild(scene);
    wrap.appendChild(panelSlot);
    stage.appendChild(wrap);

    appendNav(stage, {
      leftLabel: "回到走廊",
      leftAction: () => {
        state.activeHotspot = null;
        setScene("p3");
      },
      rightLabel: "結束參觀",
      rightAction: () => setScene("end"),
    });

    if (entryAudio) {
      stage.appendChild(
        buildEntryAudioButton(entryAudio, {
          className: "fdAudioBtn fdAudioBtn--room",
          label: "再次播放語音",
        })
      );
    }

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
    if (key === "hat") {
      selected = outfit.hatOn !== false;
      targeted = colorTarget === "hat";
    } else if (key === "socks" || key === "shoes") {
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
    if (typeof state.outfit.hatOn !== "boolean") state.outfit.hatOn = true;
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
          src: name === "frame" ? HANG_FRAME_SRC : `${WARDROBE_BASE}/hang/${name}.png`,
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
      targetNote.innerHTML =
        `點衣櫃選衣物，再點房屋調色盤換色<br>（目前：${colorTargetLabel(state.colorTarget)}）。<br>西裝外套／背心可再次點選以脫下外衣。<br>帽子可再次點選以拿下。`;
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
        title: "選擇帽子",
        buildBody(api) {
          function stepPick() {
            api.setTitle("選擇帽子", "可選擇戴帽子或不戴");
            api.body.innerHTML = "";
            const row = el("div", { class: "fdMobileHangRow fdMobileHangRow--hat" });
            row.appendChild(
              createHangChoiceButton("hat", {
                selected: state.outfit.hatOn !== false,
                onClick: () => {
                  state.outfit.hatOn = true;
                  state.colorTarget = "hat";
                  refreshPreview();
                  stepColor();
                },
              })
            );
            row.appendChild(
              el("button", {
                class: `fdMobileHangBtn fdMobileHangBtn--text${state.outfit.hatOn === false ? " isActive" : ""}`,
                type: "button",
                text: "不戴帽子",
                onclick: () => {
                  state.outfit.hatOn = false;
                  refreshPreview();
                  api.close();
                },
              })
            );
            api.body.appendChild(row);
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
            renderPaletteStep(api, "hat", {
              title: "帽子顏色",
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
            api.setTitle("選擇外搭", "可選西裝外套或背心；若要改為不穿外衣，請選「不要外搭」");
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
      placeholder: "歡迎留下你/妳的想法。",
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
          text: state.lastSubmission?.message || "最新體驗作品會即時公開，可於後台刪除。",
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
              ? "已公開顯示於下方作品牆。"
              : "已儲存於本機。連線投稿後即可公開顯示。",
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
            text: "結束參觀",
            onclick: () => setScene("end"),
          }),
        ])
      );
    } else {
      appendNav(stage, {
        leftLabel: "再玩一次",
        leftAction: replay,
        rightLabel: "結束參觀",
        rightAction: () => setScene("end"),
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
              text: state.lastSubmission ? "目前尚無其他公開作品。" : "尚無公開作品，歡迎搶先體驗！",
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
