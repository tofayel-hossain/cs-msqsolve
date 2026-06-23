// API Post Detail Endpoint
// Path: /api/posts/detail
import { jsonResponse, getSessionUser } from '../utils.js';

export async function onRequestGet(context) {
  try {
    const { env, request } = context;
    const { DB } = env;

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") || "";
    const id = url.searchParams.get("id") || "";
    const mode = url.searchParams.get("mode") || "guest"; // 'guest' or 'practice'

    if (!slug && !id) {
      return jsonResponse({ error: "Slug or ID is required." }, 400);
    }

    // 1. Fetch post details from D1 (drip-feed filtered)
    let post;
    if (id) {
      post = await DB.prepare("SELECT * FROM posts WHERE id = ? AND status = 'published' AND published_at <= datetime('now') LIMIT 1").bind(id).first();
    } else {
      post = await DB.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published' AND published_at <= datetime('now') LIMIT 1").bind(slug).first();
    }

    if (!post) {
      return jsonResponse({ error: "MCQ set not found." }, 404);
    }

    // Parse JSON text fields from SQLite
    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(post.questions || "[]");
    } catch (e) {
      parsedQuestions = [];
    }

    let parsedAnswers = {};
    try {
      parsedAnswers = JSON.parse(post.answers || "{}");
    } catch (e) {
      parsedAnswers = {};
    }

    let parsedExplanations = [];
    try {
      parsedExplanations = JSON.parse(post.explanations || "[]");
    } catch (e) {
      parsedExplanations = [];
    }

    // 2. Handle Practice Mode (Authentication required, hide answers and explanations)
    if (mode === "practice") {
      const session = await getSessionUser(request);
      if (!session) {
        return jsonResponse({ error: "Unauthorized. Please sign up or log in to practice." }, 401);
      }

      // Return details WITHOUT answers and explanations
      return jsonResponse({
        id: post.id,
        category: post.category,
        year: post.year,
        title: post.title,
        slug: post.slug,
        subject_code: post.subject_code,
        subject: post.subject,
        board: post.board,
        mcq_count: post.mcq_count,
        questions: parsedQuestions,
        mode: "practice",
        isLoggedIn: true
      }, 200);
    }

    // 3. Guest Mode / Standard View (Answers and explanations are visible)
    return jsonResponse({
      id: post.id,
      category: post.category,
      year: post.year,
      title: post.title,
      slug: post.slug,
      subject_code: post.subject_code,
      subject: post.subject,
      board: post.board,
      mcq_count: post.mcq_count,
      questions: parsedQuestions,
      answers: parsedAnswers,
      explanations: parsedExplanations,
      mode: "guest"
    }, 200);
  } catch (err) {
    return jsonResponse({ error: `Failed to fetch MCQ detail: ${err.message}` }, 500);
  }
}
