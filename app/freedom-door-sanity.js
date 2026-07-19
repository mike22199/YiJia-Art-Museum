/* 推開自由門特展 — Sanity 讀寫（需設定 SANITY_PROJECT_ID 與 SANITY_WRITE_TOKEN） */

(function () {
  const LOCAL_KEY = "FIFI_FREEDOM_DOOR_SUBMISSIONS";

  function projectId() {
    return String(window.SANITY_PROJECT_ID || "").trim();
  }

  function dataset() {
    return String(window.SANITY_DATASET || "production").trim();
  }

  function writeToken() {
    return String(window.SANITY_WRITE_TOKEN || "").trim();
  }

  function canWrite() {
    return Boolean(projectId() && writeToken());
  }

  function canRead() {
    return Boolean(projectId());
  }

  async function querySanity(groq) {
    const encoded = encodeURIComponent(groq);
    const ds = dataset();
    const pid = projectId();
    const hosts = [`${pid}.apicdn.sanity.io`, `${pid}.api.sanity.io`];
    let lastError = null;

    for (const host of hosts) {
      try {
        const url = `https://${host}/v1/data/query/${ds}?query=${encoded}`;
        const res = await fetch(url, { cache: "no-store", mode: "cors" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        return payload.result;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Sanity query failed");
  }

  async function mutateSanity(mutations) {
    const url = `https://${projectId()}.api.sanity.io/v1/data/mutate/${dataset()}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${writeToken()}`,
      },
      body: JSON.stringify({ mutations }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Sanity mutate failed: HTTP ${res.status} ${detail}`);
    }
    return res.json();
  }

  async function uploadImageBlob(blob) {
    const url = `https://${projectId()}.api.sanity.io/v1/assets/images/${dataset()}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": blob.type || "image/png",
        Authorization: `Bearer ${writeToken()}`,
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`Sanity image upload failed: HTTP ${res.status}`);
    const payload = await res.json();
    const doc = payload.document || payload;
    const ref = doc._id;
    const dimensions = doc.metadata?.dimensions;
    return {
      _type: "image",
      asset: { _type: "reference", _ref: ref },
      ...(dimensions ? { alt: "推開自由門體驗作品" } : {}),
    };
  }

  function loadLocalSubmissions() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveLocalSubmission(entry) {
    const list = loadLocalSubmissions();
    list.unshift(entry);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 200)));
    return entry;
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function blobToPreviewUrl(blob) {
    if (!blob) return "";
    return blobToDataUrl(blob);
  }

  async function createSubmission({ title, authorName, concept, imageBlob, outfitData }) {
    const base = {
      title: String(title || "").trim(),
      authorName: String(authorName || "").trim(),
      concept: String(concept || "").trim(),
      outfitData: JSON.stringify(outfitData || {}),
      status: "pending",
    };

    if (canWrite()) {
      const imageField = imageBlob ? await uploadImageBlob(imageBlob) : undefined;
      const doc = {
        _type: "freedomDoorSubmission",
        ...base,
        ...(imageField ? { image: imageField } : {}),
      };
      await mutateSanity([{ create: doc }]);
      return { ok: true, mode: "sanity", message: "已上傳，待後台審核後會顯示於作品牆。" };
    }

    const dataUrl = imageBlob ? await blobToDataUrl(imageBlob) : "";
    try {
      saveLocalSubmission({
        id: `local-${Date.now()}`,
        ...base,
        imageUrl: dataUrl,
        status: "pending",
      });
    } catch (err) {
      console.warn("本機儲存失敗：", err);
      throw new Error("無法寫入本機儲存，請確認瀏覽器允許 localStorage");
    }
    return {
      ok: true,
      mode: "local",
      message: "已儲存於本機（尚未連線 Sanity 後台，審核功能需設定 SANITY_WRITE_TOKEN）。",
    };
  }

  async function fetchApprovedSubmissions(limit = 30) {
    const items = [];

    if (canRead()) {
      try {
        const groq = `*[_type == "freedomDoorSubmission" && status == "approved"] | order(_createdAt desc)[0...${limit}]{
          _id,
          title,
          authorName,
          concept,
          "imageUrl": image.asset->url,
          _createdAt
        }`;
        const result = await querySanity(groq);
        if (Array.isArray(result)) {
          result.forEach((row) => {
            items.push({
              id: row._id,
              title: row.title || "",
              authorName: row.authorName || "",
              concept: row.concept || "",
              imageUrl: row.imageUrl || "",
              createdAt: row._createdAt || "",
              source: "sanity",
            });
          });
        }
      } catch (err) {
        console.warn("讀取 Sanity 作品牆失敗：", err);
        const origin = window.location.origin || "你的網站網址";
        throw new Error(
          `無法從 Sanity 讀取作品（${err?.message || err}）。請到 sanity.io/manage → API → CORS origins 加入 ${origin}，並勾選 Allow credentials。若用 Live Server，也請加入 http://127.0.0.1:5500。`
        );
      }
    }

    if (items.length < limit) {
      const localApproved = loadLocalSubmissions()
        .filter((row) => row.status === "approved")
        .slice(0, limit - items.length);
      localApproved.forEach((row) => {
        items.push({
          id: row.id,
          title: row.title || "",
          authorName: row.authorName || "",
          concept: row.concept || "",
          imageUrl: row.imageUrl || "",
          createdAt: row.createdAt || "",
          source: "local",
        });
      });
    }

    return items.slice(0, limit);
  }

  window.FreedomDoorSanity = {
    canWrite,
    canRead,
    createSubmission,
    fetchApprovedSubmissions,
    blobToPreviewUrl,
  };
})();
