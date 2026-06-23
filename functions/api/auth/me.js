// API Me Endpoint (Retrieve Current Authenticated Session)
// Path: /api/auth/me
import { jsonResponse, getSessionUser } from '../utils.js';

export async function onRequestGet(context) {
  try {
    const { request } = context;
    const session = await getSessionUser(request);
    
    if (!session) {
      return jsonResponse({ loggedIn: false }, 200);
    }
    
    return jsonResponse({
      loggedIn: true,
      user: {
        id: session.id,
        email: session.email
      }
    }, 200);
  } catch (err) {
    return jsonResponse({ loggedIn: false, error: err.message }, 500);
  }
}
