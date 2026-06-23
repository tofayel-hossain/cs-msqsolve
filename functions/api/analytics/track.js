import { jsonResponse } from '../utils.js';

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const { DB } = env;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const { path } = body;
    if (!path) {
      return jsonResponse({ error: "Path parameter is required" }, 400);
    }

    const userAgent = request.headers.get("User-Agent") || "Unknown";

    await DB.prepare("INSERT INTO site_visits (path, user_agent) VALUES (?, ?)")
      .bind(path, userAgent)
      .run();

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    return jsonResponse({ error: `Tracking failed: ${err.message}` }, 500);
  }
}

// Handle preflight options requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}
