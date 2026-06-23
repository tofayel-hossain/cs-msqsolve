// API Sign Up Endpoint
// Path: /api/auth/signup
import { jsonResponse, validateEmail } from '../utils.js';
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

    // 2. Strict Gmail validation
    if (!validateEmail(cleanEmail)) {
      return jsonResponse({ error: "Please enter a valid email address." }, 400);
    }

    if (!cleanEmail.endsWith("@gmail.com")) {
      return jsonResponse({ error: "Only Gmail accounts (@gmail.com) are allowed to sign up." }, 400);
    }

    // 3. Password strength check
    if (password.length < 6) {
      return jsonResponse({ error: "Password must be at least 6 characters long." }, 400);
    }

    // 4. Check for existing user in D1 Database
    const { DB } = env;
    const existingUser = await DB.prepare("SELECT id FROM users WHERE email = ? LIMIT 1")
      .bind(cleanEmail)
      .first();

    if (existingUser) {
      return jsonResponse({ error: "This Gmail account is already registered." }, 400);
    }

    // 5. Hash password synchronously (safe for serverless runtimes)
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // 6. Insert new user into database
    await DB.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
      .bind(cleanEmail, passwordHash)
      .run();

    return jsonResponse({ message: "Account created successfully. You can now login!" }, 201);
  } catch (err) {
    return jsonResponse({ error: `Signup failed: ${err.message}` }, 500);
  }
}
