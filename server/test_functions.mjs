// Checks the purchase functions with a pretend Stripe. Run: node server/test_functions.mjs
import { onRequestPost as checkout } from "../functions/api/checkout.js";
import { onRequestPost as unlock } from "../functions/api/unlock.js";
import { cleanCode, newCode } from "./orbis.js";
const env = { STRIPE_SECRET_KEY: "sk_test_x", PASS_SECRET: "s3cret", OWNER_CODE: "olivia-stella" };
const calls = []; let fails = 0;
const ok = (name, c) => { console.log((c ? "PASS " : "FAIL ") + name); if (!c) fails++; };
const CODE = "ORB-7KQ4-M2XD";
globalThis.fetch = async (url, init) => {
  calls.push({ url, init });
  const r = (d, s = 200) => new Response(JSON.stringify(d), { status: s });
  if (url.endsWith("/checkout/sessions")) return r({ url: "https://checkout.stripe.com/c/pay/cs_test_1" });
  if (url.includes("/checkout/sessions/cs_paid")) return r({ payment_status: "paid", metadata: { orbis_code: CODE } });
  if (url.includes("/checkout/sessions/cs_open")) return r({ payment_status: "unpaid", metadata: { orbis_code: CODE } });
  if (url.includes("/payment_intents/search")) return r({ data: decodeURIComponent(url).includes(CODE) ? [{ id: "pi_1" }] : [] });
  return r({ error: { message: "nope" } }, 400);
};
const post = (fn, body, e = env) => fn({ request: new Request("https://orbis.example/api/x", { method: "POST", body: JSON.stringify(body) }), env: e });

let res = await post(checkout, { lang: "it" });
ok("checkout answers with the Stripe page", res.status === 200 && (await res.json()).url.startsWith("https://checkout.stripe.com"));
const sent = new URLSearchParams(calls[0].init.body);
ok("price is 4,99 € by default", sent.get("line_items[0][price_data][unit_amount]") === "499" && sent.get("line_items[0][price_data][currency]") === "eur");
ok("asks to accept the terms and the loss of withdrawal", sent.get("consent_collection[terms_of_service]") === "required" && /recesso/.test(sent.get("custom_text[terms_of_service_acceptance][message]")));
ok("the code is saved on the payment and in its description", cleanCode(sent.get("payment_intent_data[metadata][orbis_code]")) && sent.get("payment_intent_data[description]").includes(sent.get("metadata[orbis_code]")));
ok("comes back to Orbis with the session", sent.get("success_url") === "https://orbis.example/?sessione={CHECKOUT_SESSION_ID}");
ok("the secret key goes only to Stripe", calls[0].url.startsWith("https://api.stripe.com/") && calls[0].init.headers.authorization === "Bearer sk_test_x");

res = await post(unlock, { session: "cs_paid" }); let j = await res.json();
ok("a paid session unlocks at once and gives the code", res.status === 200 && j.pass.t.includes(".") && j.code === CODE);
res = await post(unlock, { session: "cs_open" });
ok("an unpaid session does not unlock", res.status === 404);
res = await post(unlock, { code: "orb 7kq4 m2xd" }); j = await res.json();
ok("the code works on another device, however it is typed", res.status === 200 && j.code === CODE);
res = await post(unlock, { code: "ORB-AAAA-BBBB" });
ok("an unknown code does not unlock", res.status === 404);
res = await post(unlock, { code: "ORB-AAAA-BBB'" });
ok("odd characters never reach Stripe", res.status === 404 && !calls.at(-1).url.includes("'BBB'"));
res = await post(unlock, { code: "Olivia-Stella " }); j = await res.json();
ok("the owner code opens everything", res.status === 200 && j.owner === true && j.pass.owner === true);
res = await post(unlock, { code: "olivia-stella" }, { ...env, OWNER_CODE: "" });
ok("no owner code set means no owner pass", res.status === 404);
res = await post(checkout, {}, {});
ok("without settings it says not ready", res.status === 503);
ok("new codes are valid", Array.from({ length: 50 }, newCode).every((c) => cleanCode(c) === c));
console.log(fails ? `FAILED ${fails}` : "ALL PASSED"); process.exit(fails ? 1 : 0);
