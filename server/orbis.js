// Shared helpers for the Orbis purchase functions (Cloudflare Pages Functions).
// Settings, all entered by the owner in the Cloudflare dashboard, never in the code:
//   STRIPE_SECRET_KEY  the Stripe secret key (sk_test_… while testing, sk_live_… when selling)
//   PASS_SECRET        a long random text used to sign the passes
//   OWNER_CODE         the owner's personal code, which opens everything for free
//   PRICE_CENTS        optional, the price in euro cents (default 499)

export const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

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

// Codes look like ORB-7KQ4-M2XD: no 0/O or 1/I, easy to read and type.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newCode() {
  const b = crypto.getRandomValues(new Uint8Array(8));
  const s = Array.from(b, (x) => ALPHABET[x % 32]).join("");
  return "ORB-" + s.slice(0, 4) + "-" + s.slice(4);
}
export function cleanCode(code) {
  const s = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^ORB/, "");
  return s.length === 8 && [...s].every((c) => ALPHABET.includes(c)) ? "ORB-" + s.slice(0, 4) + "-" + s.slice(4) : null;
}

const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export async function makePass(env, who) {
  const payload = b64(new TextEncoder().encode(JSON.stringify({ v: 1, who, at: Date.now() })));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.PASS_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = b64(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return payload + "." + sig;
}

export function configured(env) { return !!(env.STRIPE_SECRET_KEY && env.PASS_SECRET); }
