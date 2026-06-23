// API Logout Endpoint
// Path: /api/auth/logout
import { jsonResponse } from '../utils.js';

export async function onRequestPost(context) {
  // Clear the session cookie by setting its expiration to the past
  const cookieString = `session_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure`;
  return jsonResponse({ message: "Logged out successfully." }, 200, { "Set-Cookie": cookieString });
}
