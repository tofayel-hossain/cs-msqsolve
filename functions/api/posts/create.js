// API Admin Post Create / Update Endpoint
// Path: /api/posts/create
import { jsonResponse } from '../utils.js';

const ADMIN_SECRET_KEY = "mcqsolve_admin_secret_key"; // Change in production

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

    const body = await request.json();
    const { 
      id,
      category, 
      year, 
      title, 
      slug, 
      subject_code = "", 
      subject = "", 
      board = "General", 
      mcq_count = 40, 
      questions, // Object/Array JSON
      answers, // Object JSON (e.g. { ka: [...], kha: [...] })
      explanations = "[]", // Object/Array JSON
      status = "published"
    } = body;

    if (!category || !year || !title || !slug || !questions || !answers) {
      return jsonResponse({ error: "Missing required fields: category, year, title, slug, questions, answers" }, 400);
    }

    const questionsStr = typeof questions === 'string' ? questions : JSON.stringify(questions);
    const answersStr = typeof answers === 'string' ? answers : JSON.stringify(answers);
    const explanationsStr = typeof explanations === 'string' ? explanations : JSON.stringify(explanations);

    if (id) {
      // Update existing post
      await DB.prepare(`
        UPDATE posts 
        SET category = ?, year = ?, title = ?, slug = ?, subject_code = ?, subject = ?, board = ?, mcq_count = ?, questions = ?, answers = ?, explanations = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(category, year, title, slug, subject_code, subject, board, mcq_count, questionsStr, answersStr, explanationsStr, status, id)
      .run();

      return jsonResponse({ message: "MCQ set updated successfully!", id }, 200);
    } else {
      // Insert new post
      const info = await DB.prepare(`
        INSERT INTO posts (category, year, title, slug, subject_code, subject, board, mcq_count, questions, answers, explanations, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(category, year, title, slug, subject_code, subject, board, mcq_count, questionsStr, answersStr, explanationsStr, status)
      .run();

      return jsonResponse({ message: "MCQ set created successfully!", id: info.meta.last_row_id }, 201);
    }
  } catch (err) {
    return jsonResponse({ error: `Admin action failed: ${err.message}` }, 500);
  }
}
