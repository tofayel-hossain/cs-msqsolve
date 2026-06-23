import { jsonResponse } from '../utils.js';
import bcrypt from 'bcryptjs';

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

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const { userId, newPassword } = body;
    if (!userId || !newPassword) {
      return jsonResponse({ error: "User ID and new password are required." }, 400);
    }

    if (newPassword.length < 6) {
      return jsonResponse({ error: "Password must be at least 6 characters long." }, 400);
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    // Update user password in D1
    const result = await DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .bind(passwordHash, userId)
      .run();

    if (result.meta && result.meta.changes === 0) {
      return jsonResponse({ error: "User not found." }, 404);
    }

    return jsonResponse({ message: "Password updated successfully!" }, 200);
  } catch (err) {
    return jsonResponse({ error: `Password update failed: ${err.message}` }, 500);
  }
}
