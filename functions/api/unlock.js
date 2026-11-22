// POST /api/unlock
//   { session: "cs_…" }  coming back from Stripe: unlocks at once, only the first time
//                        (the payment is then marked as claimed, so the link is useless to others);
//   { idToken }          signing in with Google on any device: unlocks if that account paid.
import { json, stripe, googleUser, isOwner, paidPayment, makePass, configured } from "../../server/orbis.js";

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "not ready" }, 503);
  let body = {};
  try { body = await request.json(); } catch (e) {}
  try {
    if (typeof body.session === "string" && /^cs_[A-Za-z0-9_]{10,200}$/.test(body.session)) {
      const s = await stripe(env, "GET", "checkout/sessions/" + body.session, { "expand[]": "payment_intent" });
      const pi = s.payment_intent, sub = s.metadata && s.metadata.orbis_sub;
      if (s.payment_status !== "paid" || !pi || !sub) return json({ error: "not paid" }, 404);
      if (pi.metadata && pi.metadata.orbis_claimed) return json({ error: "sign in" }, 409);
      await stripe(env, "POST", "payment_intents/" + pi.id, { "metadata[orbis_claimed]": new Date().toISOString() });
      return json({ pass: await makePass(env, sub) });
    }
    const user = await googleUser(env, body.idToken);
    if (!user) return json({ error: "sign in" }, 401);
    if (isOwner(env, user)) return json({ pass: await makePass(env, user.sub, true) });
    if (await paidPayment(env, user.sub)) return json({ pass: await makePass(env, user.sub) });
    return json({ error: "not paid" }, 404);
  } catch (e) {
    return json({ error: "stripe" }, 502);
  }
}
