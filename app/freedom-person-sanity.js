/* 成為自由人特展 — 自由徵稿 Sanity 讀寫 */

(function () {
  const LOCAL_KEY = "FIFI_FREEDOM_PERSON_SUBMISSIONS";

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

  async function createSubmission({ answer }) {
    const text = String(answer || "").trim();
    if (!text) throw new Error("請輸入回答");

    const base = { answer: text, status: "pending" };

    if (canWrite()) {
      await mutateSanity([{ create: { _type: "freedomPersonSubmission", ...base } }]);
      return { ok: true, mode: "sanity", message: "已送出，待後台審核後會顯示於徵稿牆。" };
    }

    saveLocalSubmission({
      id: `local-${Date.now()}`,
      ...base,
      createdAt: new Date().toISOString(),
    });
    return {
      ok: true,
      mode: "local",
      message: "已儲存於本機（尚未連線 Sanity 後台）。",
    };
  }

  async function fetchApprovedSubmissions(limit = 40) {
    const items = [];

    if (canRead()) {
      try {
        const groq = `*[_type == "freedomPersonSubmission" && status == "approved"] | order(_createdAt desc)[0...${limit}]{
          _id,
          answer,
          _createdAt
        }`;
        const result = await querySanity(groq);
        if (Array.isArray(result)) {
          result.forEach((row) => {
            items.push({
              id: row._id,
              answer: row.answer || "",
              createdAt: row._createdAt || "",
              source: "sanity",
            });
          });
        }
      } catch (err) {
        console.warn("讀取 Sanity 徵稿牆失敗：", err);
      }
    }

    if (items.length < limit) {
      loadLocalSubmissions()
        .filter((row) => row.status === "approved" || row.status === "pending")
        .slice(0, limit - items.length)
        .forEach((row) => {
          items.push({
            id: row.id,
            answer: row.answer || "",
            createdAt: row.createdAt || "",
            source: "local",
          });
        });
    }

    return items.slice(0, limit);
  }

  window.FreedomPersonSanity = {
    canWrite,
    canRead,
    createSubmission,
    fetchApprovedSubmissions,
  };
})();
