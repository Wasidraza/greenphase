import crypto from "crypto";

let cached = { token: null, expiresAt: 0 };

const AUTH_BASE = process.env.PHONEPE_AUTH_BASE || "https://api-preprod.phonepe.com/apis/identity-manager";
const AUTH_URL = `${AUTH_BASE}/v1/oauth/token`;

async function phonepeFetchToken() {
  if (cached.token && Date.now() < cached.expiresAt) return cached.token;

  const body = new URLSearchParams({
    client_id: process.env.PHONEPE_CLIENT_ID || "",
    client_secret: process.env.PHONEPE_CLIENT_SECRET || "",
    grant_type: "client_credentials",
  });

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: body.toString(),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("PhonePe token fetch failed: " + txt);
  }
  const data = await res.json();
  cached.token = data.access_token;
  // expires_in seconds; subtract small buffer
  cached.expiresAt = Date.now() + ((data.expires_in || 3600) - 30) * 1000;
  return cached.token;
}

// Expose for imports by other server routes
export { phonepeFetchToken };
export async function GET() {
  try {
    const token = await phonepeFetchToken();
    return new Response(JSON.stringify({ token }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
