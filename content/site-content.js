window.SITE_CONTENT = {
  site: {
    title: "FILE Holder Archive",
    subtitle: "一個以記憶為線索的數位收藏",
    description:
      "這裡收存的是一些細小而真實的東西：照片背面的字、收據、口述片段、未完成的信。主題可能靠近韓戰，但我們更想留下的是人的溫度，而不是事件的聲量。",
    footerNote:
      "每個主題都像一個資料夾：你可以從年代進入，也可以從影像或日誌切入。某些段落不求完整，只求被好好放置。",
    logo: {
      src: "https://dummyimage.com/480x160/111316/e2c7a2.png&text=ARCHIVE",
      alt: "Archive logo",
    },
  },

  homeShowcase: {
    title: "Featured / 精選",
    intro:
      "有些材料適合先被看見：它們不一定最重要，但足夠讓人停下來，願意多讀一行、多看一眼。",
    images: [
      {
        src:
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
        alt: "筆與紙",
        note: "手寫文字與紙張質感。",
      },
      {
        src:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
        alt: "書架與資料",
        note: "像檔案館的安靜角落。",
      },
      {
        src:
          "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1600&q=80",
        alt: "分類卡",
        note: "編目與索引的感覺。",
      },
      {
        src:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
        alt: "光影與紙張",
        note: "讓畫面保持溫和。",
      },
    ],
    blocks: [
      {
        heading: "寫作口吻",
        body:
          "我們偏好用日常的角度靠近嚴肅：一張合照、一段口述、一道菜的名字。語氣保持克制，但不要冰冷。",
      },
      {
        heading: "檔案卡",
        body:
          "日期｜地點｜來源｜摘要｜關鍵字\n我們用這種簡單的格式，讓每份材料都能被找回，也讓讀者知道它從哪裡來、為什麼被留下。",
      },
    ],
  },

  nav: [
    {
      title: "Menu",
      items: [{ type: "page", id: "about", label: "About" }],
    },
    {
      title: "Places",
      items: [
        {
          type: "node",
          id: "anchorage",
          label: "Anchorage, Alaska (US)",
          children: [
            { type: "section", parentId: "anchorage", section: "images", label: "Images (Anchorage)" },
            { type: "section", parentId: "anchorage", section: "diary", label: "Diary / Diario" },
            { type: "section", parentId: "anchorage", section: "tramitologia", label: "Tramitología" },
            { type: "section", parentId: "anchorage", section: "discussion", label: "Discussion / Conversación" },
          ],
        },
        {
          type: "node",
          id: "vancouver",
          label: "Vancouver (Canada)",
          children: [
            { type: "section", parentId: "vancouver", section: "images", label: "Images (Vancouver)" },
            { type: "section", parentId: "vancouver", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "vancouver", section: "diary", label: "Diary / Diario" },
            { type: "section", parentId: "vancouver", section: "tramitologia", label: "Tramitología" },
          ],
        },
        {
          type: "node",
          id: "portland",
          label: "Portland, Oregon (US)",
          children: [
            { type: "section", parentId: "portland", section: "images", label: "Images (Portland)" },
            { type: "section", parentId: "portland", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "portland", section: "diary", label: "Diary / Diario" },
            { type: "section", parentId: "portland", section: "interview", label: "Interview" },
          ],
        },
        {
          type: "node",
          id: "calgary",
          label: "Calgary (Canada)",
          children: [
            { type: "section", parentId: "calgary", section: "images", label: "Images (Calgary)" },
            { type: "section", parentId: "calgary", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "calgary", section: "diary", label: "Diary" },
          ],
        },
        {
          type: "node",
          id: "chicago",
          label: "Chicago, Illinois (US)",
          children: [
            { type: "section", parentId: "chicago", section: "images", label: "Images (Chicago)" },
            { type: "section", parentId: "chicago", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "chicago", section: "diary", label: "Diary" },
          ],
        },
        {
          type: "node",
          id: "austin",
          label: "Austin, Texas (US)",
          children: [
            { type: "section", parentId: "austin", section: "diary", label: "Diary" },
            { type: "section", parentId: "austin", section: "tramitologia", label: "Tramitología" },
          ],
        },
        {
          type: "node",
          id: "tempe",
          label: "Tempe, Arizona (US)",
          children: [
            { type: "section", parentId: "tempe", section: "images", label: "Images (Tempe)" },
            { type: "section", parentId: "tempe", section: "diary", label: "Diary" },
          ],
        },
        {
          type: "node",
          id: "san-francisco",
          label: "San Francisco, California (US)",
          children: [
            { type: "section", parentId: "san-francisco", section: "images", label: "Images (San Francisco)" },
            { type: "section", parentId: "san-francisco", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "san-francisco", section: "diary", label: "Diary" },
          ],
        },
        {
          type: "node",
          id: "los-angeles",
          label: "Los Angeles, California (US)",
          children: [
            { type: "section", parentId: "los-angeles", section: "images", label: "Images (Los Angeles)" },
            { type: "section", parentId: "los-angeles", section: "diary", label: "Diary" },
            { type: "section", parentId: "los-angeles", section: "presentation", label: "Presentation" },
          ],
        },
        {
          type: "node",
          id: "mexico-city",
          label: "Mexico DF (Mexico)",
          children: [
            { type: "section", parentId: "mexico-city", section: "images", label: "Images (Mexico DF)" },
            { type: "section", parentId: "mexico-city", section: "address", label: "Address / Discurso" },
          ],
        },
        {
          type: "node",
          id: "puebla",
          label: "Puebla (Mexico)",
          children: [
            { type: "section", parentId: "puebla", section: "images", label: "Images (Puebla)" },
            { type: "section", parentId: "puebla", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "puebla", section: "diary", label: "Diary" },
            { type: "section", parentId: "puebla", section: "report", label: "Informe de Puebla" },
          ],
        },
        {
          type: "node",
          id: "merida",
          label: "Merida (Mexico)",
          children: [
            { type: "section", parentId: "merida", section: "images", label: "Images (Merida)" },
            { type: "section", parentId: "merida", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "merida", section: "diary", label: "Diary" },
            { type: "section", parentId: "merida", section: "tramitologia", label: "Tramitología" },
          ],
        },
        {
          type: "node",
          id: "guatemala-city",
          label: "Ciudad de Guatemala (Guatemala)",
          children: [
            { type: "section", parentId: "guatemala-city", section: "images", label: "Images (Guatemala)" },
            { type: "section", parentId: "guatemala-city", section: "address", label: "Address / Discurso" },
            { type: "section", parentId: "guatemala-city", section: "diary", label: "Diary" },
            { type: "section", parentId: "guatemala-city", section: "tramitologia", label: "Tramitología" },
          ],
        },
        {
          type: "node",
          id: "san-salvador",
          label: "San Salvador (El Salvador)",
          children: [{ type: "section", parentId: "san-salvador", section: "diary", label: "Diary" }],
        },
        {
          type: "node",
          id: "panama-city",
          label: "Ciudad de Panamá (Panamá)",
          children: [
            { type: "section", parentId: "panama-city", section: "diary", label: "Diary" },
            { type: "section", parentId: "panama-city", section: "tramitologia", label: "Tramitología" },
          ],
        },
        {
          type: "node",
          id: "buenos-aires",
          label: "Buenos Aires (Argentina)",
          children: [{ type: "section", parentId: "buenos-aires", section: "diary", label: "Diary" }],
        },
        {
          type: "node",
          id: "santiago",
          label: "Santiago de Chile (Chile)",
          children: [{ type: "section", parentId: "santiago", section: "diary", label: "Diary" }],
        },
      ],
    },
    {
      title: "Articles and texts",
      items: [
        { type: "page", id: "articles", label: "Articles and texts" },
        { type: "page", id: "suite", label: "Suite Panamericana" },
      ],
    },
  ],

  pages: {
    about: {
      title: "About",
      hero: {
        image:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1600&q=80",
        caption: "以溫柔的光線整理沉重的材料。",
      },
      sections: {
        text: {
          blocks: [
            {
              heading: "一個溫和的檔案館",
              body:
                "這不是完整的歷史敘事，而是一座小小的抽屜櫃。有人把一句話寫在照片背面，有人把地址寫錯了一個字母，有人把一段記憶留在沉默裡——我們把它們收起來，讓它們仍能被讀到。",
            },
            {
              heading: "編目方式",
              body:
                "每個主題都有幾種入口：年代、相片記錄、文字內容、日誌。它們不是互相取代，而是互相照亮：同一段時間，可能在照片裡很安靜，在日誌裡很喧嘩。",
            },
          ],
        },
        images: {
          images: [
            {
              src:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
              alt: "紙張與光影",
              note: "像文件一樣被細心翻閱。",
            },
            {
              src:
                "https://images.unsplash.com/photo-1520697222867-7f4c7a7f2c7f?auto=format&fit=crop&w=1600&q=80",
              alt: "老照片的質感",
              note: "讓影像保持呼吸感。",
            },
          ],
        },
        diary: {
          diarySeed: [
            {
              date: "1951-01-07",
              title: "一封未寄出的信",
              body:
                "把天氣寫進信裡，彷彿就能把人留在近處。今天的風很冷，但廚房裡的水蒸氣很暖。",
              tags: ["letters", "home"],
            },
          ],
        },
      },
      defaultSection: "text",
    },

    articles: {
      title: "Articles and texts",
      hero: {
        image:
          "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1600&q=80",
        caption: "文字像索引卡，把人帶回上下文。",
      },
      sections: {
        text: {
          blocks: [
            {
              heading: "收錄",
              body:
                "這裡收錄較長的文字：訪談逐字、研究筆記、報章剪貼的節錄。它們不一定要得出結論，有時只要把來源寫清楚，就已經足夠誠實。",
            },
          ],
        },
      },
      defaultSection: "text",
    },

    suite: {
      title: "Suite",
      hero: {
        image:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
        caption: "將材料以系列方式呈現。",
      },
      sections: {
        text: {
          blocks: [
            {
              heading: "系列頁",
              body:
                "這個頁面可以作為系列介紹、索引或作品集入口。",
            },
          ],
        },
      },
      defaultSection: "text",
    },
  },

  records: {
    anchorage: {
      title: "Anchorage, Alaska (US)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
        caption: "把冰冷的風，寫成可以被擁抱的句子。",
      },
      sections: {
        images: {
          images: [
            {
              src:
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
              alt: "風景",
              note: "不以衝突為主體，讓讀者先有呼吸空間。",
            },
          ],
        },
        diary: {
          diarySeed: [
            {
              date: "1951-02-03",
              title: "早晨的熱茶",
              body:
                "我把杯子放在窗邊，讓它先暖一暖。有人說天氣像新聞一樣冷，但其實只要把手放在杯壁上，就能知道今天還可以被照顧。",
              tags: ["morning", "home"],
            },
          ],
        },
        tramitologia: {
          blocks: [
            {
              heading: "Tramitología（流程／手續）",
              body:
                "這裡可以放：文件編號、移動路徑、收件與發件、日期與註記。用冷靜的格式記錄，但用溫柔的語氣描述人。",
            },
          ],
        },
        discussion: {
          blocks: [
            {
              heading: "Discussion",
              body:
                "你可以在此整理對談摘要、問題清單、訪談片段，或讀者回饋。",
            },
          ],
        },
      },
      defaultSection: "images",
    },

    vancouver: {
      title: "Vancouver (Canada)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1600&q=80",
        caption: "在遠方的城市，仍能把名字唸得很近。",
      },
      sections: {
        images: { images: [] },
        address: {
          blocks: [
            {
              heading: "Address / Discurso",
              body:
                "這裡放演說稿、公開信、致詞。建議加上：場合、聽眾、日期，以及你希望讀者帶走的一句話。",
            },
          ],
        },
        diary: { diarySeed: [] },
        tramitologia: { blocks: [] },
      },
      defaultSection: "address",
    },

    portland: {
      title: "Portland, Oregon (US)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1520975958225-9d4e6d04b0a5?auto=format&fit=crop&w=1600&q=80",
        caption: "把訪談當作『可被保存的相遇』。",
      },
      sections: {
        images: { images: [] },
        address: { blocks: [] },
        diary: { diarySeed: [] },
        interview: {
          blocks: [
            {
              heading: "Interview",
              body:
                "把訪談做成：問題（Q）/ 回答（A）/ 摘要 / 關鍵字。若內容較沉重，可在開頭加入閱讀提醒與溫和的收束段落。",
            },
          ],
        },
      },
      defaultSection: "interview",
    },

    calgary: {
      title: "Calgary (Canada)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1600&q=80",
        caption: "一張卡片，足夠放下一段長路。",
      },
      sections: {
        images: { images: [] },
        address: {
          blocks: [
            { heading: "Address", body: "那天的話很短，但語氣很輕，像把重的東西先放下。"},
          ],
        },
        diary: { diarySeed: [] },
      },
      defaultSection: "address",
    },

    chicago: {
      title: "Chicago, Illinois (US)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
        caption: "城市的噪音裡，也會藏著一段很安靜的記錄。",
      },
      sections: {
        images: { images: [] },
        address: { blocks: [{ heading: "Discurso", body: "我們把話說得慢一點，讓每個名字都有位置。" }] },
        diary: { diarySeed: [] },
      },
      defaultSection: "diary",
    },

    austin: {
      title: "Austin, Texas (US)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
        caption: "先把手續寫清楚，再把心情寫乾淨。",
      },
      sections: {
        diary: { diarySeed: [] },
        tramitologia: { blocks: [{ heading: "Tramitología", body: "編號、日期、移動路徑；像把物件放回抽屜，也像把人放回語境。" }] },
      },
      defaultSection: "tramitologia",
    },

    tempe: {
      title: "Tempe, Arizona (US)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
        caption: "有些照片不需要解釋，只要被保存。",
      },
      sections: {
        images: { images: [] },
        diary: { diarySeed: [] },
      },
      defaultSection: "images",
    },

    "san-francisco": {
      title: "San Francisco, California (US)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1520975958225-9d4e6d04b0a5?auto=format&fit=crop&w=1600&q=80",
        caption: "把線索收進口袋裡，走到下一頁。",
      },
      sections: {
        images: { images: [] },
        address: { blocks: [{ heading: "Address", body: "謝謝你把話說完，也謝謝你在說不完的地方停住。" }] },
        diary: { diarySeed: [] },
      },
      defaultSection: "images",
    },

    "los-angeles": {
      title: "Los Angeles, California (US)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
        caption: "展示不是宣告，是邀請。",
      },
      sections: {
        images: { images: [] },
        diary: { diarySeed: [] },
        presentation: { blocks: [{ heading: "Presentation", body: "一張桌子、一盞燈、一些紙；讓材料自己說話。" }] },
      },
      defaultSection: "presentation",
    },

    "mexico-city": {
      title: "Mexico DF (Mexico)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80",
        caption: "歷史很大，但入口可以很小。",
      },
      sections: {
        images: { images: [] },
        address: { blocks: [{ heading: "Discurso", body: "我們談的是人如何相遇，而不是事件如何發生。" }] },
      },
      defaultSection: "address",
    },

    puebla: {
      title: "Puebla (Mexico)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1520697222867-7f4c7a7f2c7f?auto=format&fit=crop&w=1600&q=80",
        caption: "報告與日誌並排：一個求準確，一個求誠實。",
      },
      sections: {
        images: { images: [] },
        address: { blocks: [{ heading: "Address", body: "把句子寫得能被帶走，像把麵包切成能分享的大小。" }] },
        diary: { diarySeed: [] },
        report: { blocks: [{ heading: "Informe", body: "短報告：今日新增三件材料，兩件未能確認來源；保留空白以待補記。" }] },
      },
      defaultSection: "report",
    },

    merida: {
      title: "Merida (Mexico)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=1600&q=80",
        caption: "把路途寫成清單，把思念寫成句子。",
      },
      sections: {
        images: { images: [] },
        address: { blocks: [{ heading: "Discurso", body: "今天我們把語氣放低一些，讓聽的人能靠近。" }] },
        diary: { diarySeed: [] },
        tramitologia: { blocks: [{ heading: "Tramitología", body: "收件、轉交、歸檔。每一步都像把材料放回它該在的位置。" }] },
      },
      defaultSection: "tramitologia",
    },

    "guatemala-city": {
      title: "Ciudad de Guatemala (Guatemala)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=1600&q=80",
        caption: "在紙張邊緣留下的字，往往最誠實。",
      },
      sections: {
        images: { images: [] },
        address: { blocks: [{ heading: "Address", body: "請把你記得的那一幕說出來，不必完整，只要真。" }] },
        diary: { diarySeed: [] },
        tramitologia: { blocks: [{ heading: "Tramitología", body: "材料尚未齊全，因此保留：缺失欄位、未知日期、未核對來源。" }] },
      },
      defaultSection: "diary",
    },

    "san-salvador": {
      title: "San Salvador (El Salvador)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
        caption: "日誌像口袋：放得下小東西，也放得下沉默。",
      },
      sections: { diary: { diarySeed: [] } },
      defaultSection: "diary",
    },

    "panama-city": {
      title: "Ciudad de Panamá (Panamá)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1600&q=80",
        caption: "把手續寫清楚，是一種溫柔的負責。",
      },
      sections: {
        diary: { diarySeed: [] },
        tramitologia: { blocks: [{ heading: "Tramitología", body: "備註：部分材料以口述補記；日期以『約』標示，不強迫精準。" }] },
      },
      defaultSection: "diary",
    },

    "buenos-aires": {
      title: "Buenos Aires (Argentina)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
        caption: "遠方的城市也能成為抽屜的一格。",
      },
      sections: { diary: { diarySeed: [] } },
      defaultSection: "diary",
    },

    santiago: {
      title: "Santiago de Chile (Chile)",
      hero: {
        image:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1600&q=80",
        caption: "把材料照顧好，故事就會慢慢長出來。",
      },
      sections: { diary: { diarySeed: [] } },
      defaultSection: "diary",
    },
  },
};

