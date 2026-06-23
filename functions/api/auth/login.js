// API Login Endpoint
// Path: /api/auth/login
import { jsonResponse, generateToken } from '../utils.js';
import bcrypt from 'bcryptjs';

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const body = await request.json();
    const { email, password } = body;

    // 1. Basic validation
    if (!email || !password) {
      return jsonResponse({ error: "Email and password are required." }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Fetch user from D1
    const { DB } = env;
    const user = await DB.prepare("SELECT * FROM users WHERE email = ? LIMIT 1")
      .bind(cleanEmail)
      .first();

    if (!user) {
      return jsonResponse({ error: "Invalid Gmail address or password." }, 401);
    }

    // 3. Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return jsonResponse({ error: "Invalid Gmail address or password." }, 401);
    }

    // 4. Generate Session Token (expires in 7 days)
    const sessionUser = {
      id: user.id,
      email: user.email
    };
    const token = await generateToken(sessionUser);

    // 5. Set HttpOnly Cookie for security
    const cookieString = `session_token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;

    return jsonResponse(
      { 
        message: "Logged in successfully.",
        user: sessionUser
      }, 
      200, 
      { "Set-Cookie": cookieString }
    );
  } catch (err) {
    return jsonResponse({ error: `Login failed: ${err.message}` }, 500);
  }
}
