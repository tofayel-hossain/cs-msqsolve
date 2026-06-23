import { jsonResponse } from '../utils.js';

const ADMIN_SECRET_KEY = "mcqsolve_admin_secret_key"; // Change in production

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const { DB } = env;

    const { results } = await DB.prepare("SELECT key, value FROM settings").all();
    
    // Map list to key-value object
    const settings = {};
    if (results) {
      for (const row of results) {
        settings[row.key] = row.value;
      }
    }

    return jsonResponse({ settings }, 200);
  } catch (err) {
    return jsonResponse({ error: `Failed to fetch settings: ${err.message}` }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const { DB } = env;

    // Check authorization key
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    
    if (token !== ADMIN_SECRET_KEY) {
      return jsonResponse({ error: "Unauthorized. Invalid Admin Key." }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const { meta_title, meta_description, meta_keywords, head_script } = body;

    // Batch update settings using SQLite INSERT OR REPLACE (UPSERT)
    const upsertStmt = DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    
    await DB.batch([
      upsertStmt.bind("meta_title", meta_title || ""),
      upsertStmt.bind("meta_description", meta_description || ""),
      upsertStmt.bind("meta_keywords", meta_keywords || ""),
      upsertStmt.bind("head_script", head_script || "")
    ]);

    return jsonResponse({ message: "Settings updated successfully!" }, 200);
  } catch (err) {
    return jsonResponse({ error: `Failed to save settings: ${err.message}` }, 500);
  }
}

// Handle preflight options requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}
