/**
 * 義家藝館 — Sanity 投稿代理
 *
 * POST /submit/freedom-door   multipart: title, authorName, concept, outfitData, image
 * POST /submit/freedom-person application/json: { answer }
 * GET  /health
 */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_ANSWER_CHARS = 2000;
const MAX_CONCEPT_CHARS = 200;

function parseAllowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(origin, env) {
  const allowed = parseAllowedOrigins(env);
  const ok =
    origin &&
    (allowed.includes(origin) ||
      allowed.includes("*") ||
      // 本機開發常見 port
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));

  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (ok) headers["Access-Control-Allow-Origin"] = origin;
  return { ok: Boolean(ok), headers };
}

function json(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function requireConfig(env) {
  const projectId = String(env.SANITY_PROJECT_ID || "").trim();
  const dataset = String(env.SANITY_DATASET || "production").trim();
  const token = String(env.SANITY_WRITE_TOKEN || "").trim();
  if (!projectId || !token) {
    throw new Error("Worker 未設定 SANITY_PROJECT_ID 或 SANITY_WRITE_TOKEN");
  }
  return { projectId, dataset, token };
}

async function uploadImage(env, bytes, contentType) {
  const { projectId, dataset, token } = requireConfig(env);
  const url = `https://${projectId}.api.sanity.io/v1/assets/images/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType || "image/png",
    },
    body: bytes,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`圖片上傳失敗：HTTP ${res.status} ${detail.slice(0, 200)}`);
  }
  const payload = await res.json();
  const doc = payload.document || payload;
  if (!doc?._id) throw new Error("圖片上傳成功但未取得 asset id");
  return {
    _type: "image",
    asset: { _type: "reference", _ref: doc._id },
  };
}

async function mutateCreate(env, doc) {
  const { projectId, dataset, token } = requireConfig(env);
  const url = `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Sanity 寫入失敗：HTTP ${res.status} ${detail.slice(0, 300)}`);
  }
  return res.json();
}

async function handleFreedomDoor(request, env) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return { status: 400, body: { ok: false, error: "請使用 multipart/form-data" } };
  }

  const form = await request.formData();
  const title = String(form.get("title") || "").trim();
  const authorName = String(form.get("authorName") || "").trim();
  const concept = String(form.get("concept") || "").trim();
  const outfitData = String(form.get("outfitData") || "").trim();
  const image = form.get("image");

  if (!title) return { status: 400, body: { ok: false, error: "請填寫作品名稱" } };
  if (concept.length > MAX_CONCEPT_CHARS) {
    return { status: 400, body: { ok: false, error: `創作理念請勿超過 ${MAX_CONCEPT_CHARS} 字` } };
  }

  let imageField;
  if (image && typeof image === "object" && typeof image.arrayBuffer === "function") {
    const buf = await image.arrayBuffer();
    if (buf.byteLength > MAX_IMAGE_BYTES) {
      return { status: 400, body: { ok: false, error: "圖片過大，請壓縮後再試（上限 8MB）" } };
    }
    if (buf.byteLength > 0) {
      imageField = await uploadImage(env, buf, image.type || "image/png");
    }
  }

  await mutateCreate(env, {
    _type: "freedomDoorSubmission",
    title,
    authorName,
    concept,
    outfitData,
    status: "approved",
    ...(imageField ? { image: imageField } : {}),
  });

  return {
    status: 200,
    body: {
      ok: true,
      mode: "sanity",
      message: "已上傳，作品已公開於作品牆。",
    },
  };
}

async function handleFreedomPerson(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return { status: 400, body: { ok: false, error: "請傳送 JSON" } };
  }

  const answer = String(payload?.answer || "").trim();
  if (!answer) return { status: 400, body: { ok: false, error: "請輸入回答" } };
  if (answer.length > MAX_ANSWER_CHARS) {
    return { status: 400, body: { ok: false, error: `回答請勿超過 ${MAX_ANSWER_CHARS} 字` } };
  }

  await mutateCreate(env, {
    _type: "freedomPersonSubmission",
    answer,
    status: "approved",
  });

  return {
    status: 200,
    body: {
      ok: true,
      mode: "sanity",
      message: "已送出，回答已公開於徵稿牆。",
    },
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const { ok: originOk, headers: cors } = corsHeaders(origin, env);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (origin && !originOk) {
        return json({ ok: false, error: "Origin 未允許" }, 403);
      }
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json(
        {
          ok: true,
          hasProjectId: Boolean(String(env.SANITY_PROJECT_ID || "").trim()),
          hasToken: Boolean(String(env.SANITY_WRITE_TOKEN || "").trim()),
        },
        200,
        cors
      );
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, cors);
    }

    if (origin && !originOk) {
      return json(
        {
          ok: false,
          error: `Origin 未允許：${origin}。請在 Worker 的 ALLOWED_ORIGINS 加入此網域。`,
        },
        403,
        cors
      );
    }

    try {
      let result;
      if (url.pathname === "/submit/freedom-door") {
        result = await handleFreedomDoor(request, env);
      } else if (url.pathname === "/submit/freedom-person") {
        result = await handleFreedomPerson(request, env);
      } else {
        return json({ ok: false, error: "Not found" }, 404, cors);
      }
      return json(result.body, result.status, cors);
    } catch (err) {
      return json(
        { ok: false, error: err?.message || String(err) },
        500,
        cors
      );
    }
  },
};
