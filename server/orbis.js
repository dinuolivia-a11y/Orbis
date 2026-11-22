// Shared helpers for the Orbis purchase functions (Cloudflare Pages Functions).
// «Orbis completo» belongs to a Google account: whoever signs in with the account that paid
// gets it on every device; nothing can be passed on to others.
// Settings, all entered by the owner in the Cloudflare dashboard, never in the code:
//   STRIPE_SECRET_KEY  the Stripe secret key (sk_test_… while testing, sk_live_… when selling)
//   GOOGLE_CLIENT_ID   the «Sign in with Google» client id (…apps.googleusercontent.com)
//   PASS_SECRET        a long random text used to sign the passes
//   OWNER_EMAILS       the owner's Google email(s), comma separated: everything open, for free
//   PRICE_CENTS        optional, the price in euro cents (default 499)

export const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

export const configured = (env) => !!(env.STRIPE_SECRET_KEY && env.PASS_SECRET && env.GOOGLE_CLIENT_ID);

export async function stripe(env, method, path, params) {
  const body = params ? new URLSearchParams(params).toString() : undefined;
  const url = "https://api.stripe.com/v1/" + path + (method === "GET" && body ? "?" + body : "");
  const res = await fetch(url, {
    method,
    headers: { authorization: "Bearer " + env.STRIPE_SECRET_KEY, "content-type": "application/x-www-form-urlencoded", "stripe-version": "2024-06-20" },
    body: method === "GET" ? undefined : body
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data.error && data.error.message) || "Stripe error " + res.status);
  return data;
}

// Checks a Google sign-in token with Google and returns { sub, email } or null.
export async function googleUser(env, idToken) {
  if (typeof idToken !== "string" || idToken.length < 20 || idToken.length > 4096) return null;
  const res = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken));
  if (!res.ok) return null;
  const t = await res.json().catch(() => null);
  const issOk = t && (t.iss === "https://accounts.google.com" || t.iss === "accounts.google.com");
  if (!issOk || t.aud !== env.GOOGLE_CLIENT_ID || !/^\d{5,30}$/.test(t.sub || "") || Number(t.exp) * 1000 < Date.now()) return null;
  if (String(t.email_verified) !== "true") return null;
  return { sub: t.sub, email: String(t.email || "").toLowerCase() };
}

export const isOwner = (env, user) => !!user && String(env.OWNER_EMAILS || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean).includes(user.email);

// The succeeded payment of this Google account, if there is one.
export async function paidPayment(env, sub) {
  const r = await stripe(env, "GET", "payment_intents/search", { query: `metadata['orbis_sub']:'${sub}' AND status:'succeeded'`, limit: "1" });
  return r.data && r.data[0] || null;
}

const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export async function makePass(env, who, owner) {
  const payload = b64(new TextEncoder().encode(JSON.stringify({ v: 2, who, owner: !!owner, at: Date.now() })));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.PASS_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = b64(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return { t: payload + "." + sig, owner: !!owner };
}
