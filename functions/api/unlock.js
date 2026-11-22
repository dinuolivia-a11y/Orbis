// POST /api/unlock with
//   { session: "cs_…" }  coming back from Stripe: unlocks at once if the payment went through;
//   { code: "ORB-…" }    on another device: the buyer's code, or the owner's code.
// Answers { pass, code, owner } or 404.
import { json, stripe, cleanCode, makePass, configured } from "../../server/orbis.js";

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "not ready" }, 503);
  let body = {};
  try { body = await request.json(); } catch (e) {}

  if (env.OWNER_CODE && typeof body.code === "string" && body.code.trim().toUpperCase() === env.OWNER_CODE.trim().toUpperCase()) {
    return json({ pass: { t: await makePass(env, "owner"), owner: true }, owner: true });
  }

  try {
    if (typeof body.session === "string" && /^cs_[A-Za-z0-9_]+$/.test(body.session)) {
      const s = await stripe(env, "GET", "checkout/sessions/" + body.session);
      if (s.payment_status === "paid" && s.metadata && s.metadata.orbis_code) {
        const code = s.metadata.orbis_code;
        return json({ pass: { t: await makePass(env, code), code }, code });
      }
      return json({ error: "not paid" }, 404);
    }
    const code = cleanCode(body.code);
    if (code) {
      const r = await stripe(env, "GET", "payment_intents/search", { query: `metadata['orbis_code']:'${code}' AND status:'succeeded'`, limit: "1" });
      if (r.data && r.data.length) return json({ pass: { t: await makePass(env, code), code }, code });
    }
  } catch (e) {
    return json({ error: "stripe" }, 502);
  }
  return json({ error: "unknown code" }, 404);
}
