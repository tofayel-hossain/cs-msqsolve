// API Posts List Endpoint
// Path: /api/posts
import { jsonResponse } from '../utils.js';

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const { DB } = env;

    // Fetch all published posts matching current or past time (drip-feed)
    const { results } = await DB.prepare(
      "SELECT id, category, year, title, slug, subject_code, subject, board, mcq_count, created_at, published_at FROM posts WHERE status = 'published' AND published_at <= datetime('now') ORDER BY published_at DESC"
    ).all();

    return jsonResponse({ posts: results || [] }, 200);
  } catch (err) {
    return jsonResponse({ error: `Failed to fetch posts: ${err.message}` }, 500);
  }
}
