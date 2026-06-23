// Cloudflare Pages Functions - API Helpers & JWT Authentication
// Uses native Web Crypto API for maximum performance and compatibility with Cloudflare Workers.

const JWT_SECRET = "mcqsolve_secret_key_change_me_in_production";

// Helper to encode to base64url
function base64urlEncode(str) {
  const base64 = btoa(str);
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Helper to decode from base64url
function base64urlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Generate JWT Token using Web Crypto
export async function generateToken(payload) {
  const encoder = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  
  const encodedSignature = base64urlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );
  
  return `${data}.${encodedSignature}`;
}

// Verify JWT Token using Web Crypto
export async function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    
    const binarySignature = new Uint8Array(
      base64urlDecode(signature).split('').map(c => c.charCodeAt(0))
    );
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      binarySignature,
      encoder.encode(data)
    );
    
    if (!isValid) return null;
    
    return JSON.parse(base64urlDecode(payload));
  } catch (err) {
    return null;
  }
}

// Get Session User from Request
export async function getSessionUser(request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=").map(c => c.trim());
    if (key) acc[key] = value;
    return acc;
  }, {});
  
  const token = cookies["session_token"];
  if (!token) return null;
  
  return await verifyToken(token);
}

// Standard JSON Response Headers
export const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Cookie",
  "Access-Control-Allow-Credentials": "true"
};

// Response Helpers
export function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...headers }
  });
}

// Password validation regex
export function validateEmail(email) {
  // Simple check for gmail or standard email addresses
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}
