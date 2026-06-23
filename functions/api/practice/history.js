// API Practice History Endpoint (User Performance Dashboard Data)
// Path: /api/practice/history
import { jsonResponse, getSessionUser } from '../utils.js';

export async function onRequestGet(context) {
  try {
    const { env, request } = context;
    const { DB } = env;

    // 1. Verify Authentication
    const session = await getSessionUser(request);
    if (!session) {
      return jsonResponse({ error: "Unauthorized. Please log in." }, 401);
    }

    // 2. Query history with post titles from D1
    const { results } = await DB.prepare(`
      SELECT 
        s.id, 
        s.score, 
        s.total_questions, 
        s.time_spent, 
        s.created_at, 
        p.title as post_title,
        p.slug as post_slug,
        p.category as post_category
      FROM practice_sessions s
      JOIN posts p ON s.post_id = p.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `).bind(session.id).all();

    return jsonResponse({ history: results || [] }, 200);
  } catch (err) {
    return jsonResponse({ error: `Failed to fetch practice history: ${err.message}` }, 500);
  }
}
