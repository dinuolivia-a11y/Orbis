// Checks the purchase functions with a pretend Google and a pretend Stripe. Run: node server/test_functions.mjs
import { onRequestPost as checkout } from "../functions/api/checkout.js";
import { onRequestPost as unlock } from "../functions/api/unlock.js";
import { onRequestGet as config } from "../functions/api/config.js";
const env = { STRIPE_SECRET_KEY: "sk_test_x", PASS_SECRET: "s3cret", GOOGLE_CLIENT_ID: "123.apps.googleusercontent.com", OWNER_EMAILS: "owner@example.com, other@example.com" };
let fails = 0; const calls = [], claimed = new Set();
const ok = (name, c) => { console.log((c ? "PASS " : "FAIL ") + name); if (!c) fails++; };
const USERS = {
  "tok-paid-xxxxxxxxxxxxxxxx": { sub: "1111111", email: "paid@example.com" },
  "tok-new-xxxxxxxxxxxxxxxxx": { sub: "2222222", email: "new@example.com" },
  "tok-owner-xxxxxxxxxxxxxxx": { sub: "3333333", email: "Owner@example.com" },
  "tok-otherapp-xxxxxxxxxxxx": { sub: "4444444", email: "x@example.com", aud: "999.apps.googleusercontent.com" },
  "tok-unverified-xxxxxxxxxx": { sub: "5555555", email: "u@example.com", email_verified: "false" }
};
globalThis.fetch = async (url, init = {}) => {
  calls.push({ url, init });
  const r = (d, s = 200) => new Response(JSON.stringify(d), { status: s });
  if (url.startsWith("https://oauth2.googleapis.com/tokeninfo")) {
    const u = USERS[decodeURIComponent(url.split("id_token=")[1])];
    if (!u) return r({ error: "invalid" }, 400);
    return r({ iss: "https://accounts.google.com", aud: env.GOOGLE_CLIENT_ID, email_verified: "true", exp: String(Math.floor(Date.now() / 1000) + 3000), ...u });
  }
  if (url.includes("/payment_intents/search")) return r({ data: decodeURIComponent(url).includes("'1111111'") ? [{ id: "pi_paid" }] : [] });
  if (url.endsWith("/checkout/sessions") && init.method === "POST") return r({ url: "https://checkout.stripe.com/c/pay/cs_test_1" });
  if (url.includes("/checkout/sessions/cs_paid_abcdefghij")) return r({ payment_status: "paid", metadata: { orbis_sub: "2222222" }, payment_intent: { id: "pi_new", metadata: claimed.has("pi_new") ? { orbis_claimed: "x" } : {} } });
  if (url.includes("/checkout/sessions/cs_open_abcdefghij")) return r({ payment_status: "unpaid", metadata: { orbis_sub: "2222222" }, payment_intent: null });
  if (url.includes("/payment_intents/pi_new") && init.method === "POST") { claimed.add("pi_new"); return r({ id: "pi_new" }); }
  return r({ error: { message: "nope" } }, 400);
};
const post = (fn, body, e = env) => fn({ request: new Request("https://orbis.example/api/x", { method: "POST", body: JSON.stringify(body) }), env: e });

let res = await config({ env }); let j = await res.json();
ok("config gives the Google client id", j.ready && j.google === env.GOOGLE_CLIENT_ID);
res = await config({ env: {} }); j = await res.json();
ok("without settings the page knows it is not ready", !j.ready && !j.google);

res = await post(checkout, { lang: "it" });
ok("buying needs a Google sign-in", res.status === 401);
res = await post(checkout, { idToken: "tok-otherapp-xxxxxxxxxxxx" });
ok("a token made for another app is refused", res.status === 401);
res = await post(checkout, { idToken: "tok-unverified-xxxxxxxxxx" });
ok("an unverified email is refused", res.status === 401);

calls.length = 0;
res = await post(checkout, { idToken: "tok-new-xxxxxxxxxxxxxxxxx", lang: "it" }); j = await res.json();
const sent = new URLSearchParams(calls.find((c) => c.url.endsWith("/checkout/sessions")).init.body);
ok("a new account goes to the Stripe page", res.status === 200 && j.url.startsWith("https://checkout.stripe.com") && !j.pass);
ok("the payment is tied to the Google account", sent.get("payment_intent_data[metadata][orbis_sub]") === "2222222" && sent.get("metadata[orbis_sub]") === "2222222" && sent.get("customer_email") === "new@example.com");
ok("price 4,99 € and consent to terms and loss of withdrawal", sent.get("line_items[0][price_data][unit_amount]") === "499" && sent.get("consent_collection[terms_of_service]") === "required" && /recesso/.test(sent.get("custom_text[terms_of_service_acceptance][message]")));
ok("back to Orbis with the session", sent.get("success_url") === "https://orbis.example/?sessione={CHECKOUT_SESSION_ID}");
ok("the secret key goes only to Stripe", calls.filter((c) => c.init.headers && c.init.headers.authorization).every((c) => c.url.startsWith("https://api.stripe.com/")));

res = await post(checkout, { idToken: "tok-paid-xxxxxxxxxxxxxxxx" }); j = await res.json();
ok("an account that already paid opens at once, no second payment", res.status === 200 && j.pass && j.pass.t && !j.url);
res = await post(checkout, { idToken: "tok-owner-xxxxxxxxxxxxxxx" }); j = await res.json();
ok("the owner never pays", res.status === 200 && j.pass.owner === true && !j.url);

res = await post(unlock, { session: "cs_open_abcdefghij" });
ok("an unpaid session does not unlock", res.status === 404);
res = await post(unlock, { session: "cs_paid_abcdefghij" }); j = await res.json();
ok("back from Stripe it unlocks at once", res.status === 200 && !!j.pass.t);
res = await post(unlock, { session: "cs_paid_abcdefghij" });
ok("the same link does not work a second time (cannot be passed on)", res.status === 409);
res = await post(unlock, { idToken: "tok-paid-xxxxxxxxxxxxxxxx" }); j = await res.json();
ok("on another device, the account that paid opens everything", res.status === 200 && !!j.pass.t);
res = await post(unlock, { idToken: "tok-new-xxxxxxxxxxxxxxxxx" });
ok("an account that did not pay stays closed", res.status === 404);
res = await post(unlock, { idToken: "tok-owner-xxxxxxxxxxxxxxx" }, { ...env, OWNER_EMAILS: "" });
ok("with no owner set, nobody is owner", res.status === 404);
res = await post(unlock, { session: "cs_' OR 1" });
ok("odd session ids never reach Stripe", res.status === 401);
console.log(fails ? `FAILED ${fails}` : "ALL PASSED"); process.exit(fails ? 1 : 0);
