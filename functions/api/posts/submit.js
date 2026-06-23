// API MCQ Submit Endpoint (Practice Mode Evaluation & Score Saving)
// Path: /api/posts/submit
import { jsonResponse, getSessionUser } from '../utils.js';

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const { DB } = env;

    // 1. Verify Authentication
    const session = await getSessionUser(request);
    if (!session) {
      return jsonResponse({ error: "Unauthorized. Please log in to submit your practice test." }, 401);
    }

    const body = await request.json();
    const { postId, selectedAnswers, timeSpent = 0, set = 'ka' } = body;

    if (!postId || !selectedAnswers) {
      return jsonResponse({ error: "Post ID and selected answers are required." }, 400);
    }

    // 2. Fetch the correct answers and explanations from database
    const post = await DB.prepare("SELECT answers, explanations, mcq_count FROM posts WHERE id = ? LIMIT 1")
      .bind(postId)
      .first();

    if (!post) {
      return jsonResponse({ error: "MCQ set not found." }, 404);
    }

    let correctAnswers = {};
    try {
      correctAnswers = JSON.parse(post.answers || "{}");
    } catch (e) {
      correctAnswers = {};
    }

    let explanations = [];
    try {
      explanations = JSON.parse(post.explanations || "[]");
    } catch (e) {
      explanations = [];
    }

    // Grab correct answers for the requested set (default 'ka')
    // Support legacy flat arrays in answers column
    let correctSetAnswers = [];
    if (correctAnswers[set]) {
      correctSetAnswers = correctAnswers[set];
    } else if (Array.isArray(correctAnswers)) {
      correctSetAnswers = correctAnswers;
    } else {
      correctSetAnswers = correctAnswers['ka'] || [];
    }

    const totalQuestions = post.mcq_count || correctSetAnswers.length;

    // 3. Grade answers
    let score = 0;
    const gradedResults = [];

    for (let i = 0; i < totalQuestions; i++) {
      const correctAns = correctSetAnswers[i] || "";
      const userAns = selectedAnswers[i] || "";
      const isCorrect = correctAns !== "" && correctAns.toLowerCase() === userAns.toLowerCase();
      
      if (isCorrect) {
        score++;
      }

      gradedResults.push({
        qIndex: i,
        userAnswer: userAns,
        correctAnswer: correctAns,
        isCorrect
      });
    }

    // 4. Save practice session to D1 database
    const answersJson = JSON.stringify(selectedAnswers);
    await DB.prepare(
      "INSERT INTO practice_sessions (user_id, post_id, score, total_questions, answers, time_spent) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(session.id, postId, score, totalQuestions, answersJson, timeSpent)
      .run();

    // 5. Return evaluation results, correct answers and explanations
    return jsonResponse({
      score,
      totalQuestions,
      gradedResults,
      correctAnswers: correctAnswers, // Return correct answer structures for explanation
      explanations: explanations,
      message: "Practice test submitted and recorded successfully!"
    }, 200);

  } catch (err) {
    return jsonResponse({ error: `Submission failed: ${err.message}` }, 500);
  }
}
