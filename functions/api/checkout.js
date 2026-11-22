// POST /api/checkout { idToken, lang } after «Sign in with Google».
//   owner, or the account already paid → { pass }: everything opens at once;
//   otherwise → { url } of the Stripe payment page, tied to this Google account.
import { json, stripe, googleUser, isOwner, paidPayment, makePass, configured } from "../../server/orbis.js";

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "not ready" }, 503);
  let body = {};
  try { body = await request.json(); } catch (e) {}
  const user = await googleUser(env, body.idToken);
  if (!user) return json({ error: "sign in" }, 401);
  if (isOwner(env, user)) return json({ pass: await makePass(env, user.sub, true) });
  const it = body.lang !== "en", origin = new URL(request.url).origin;
  try {
    if (await paidPayment(env, user.sub)) return json({ pass: await makePass(env, user.sub) });
    const s = await stripe(env, "POST", "checkout/sessions", {
      mode: "payment",
      locale: it ? "it" : "en",
      customer_email: user.email,
      client_reference_id: user.sub,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": String(Number(env.PRICE_CENTS) || 499),
      "line_items[0][price_data][product_data][name]": "Orbis completo",
      "line_items[0][price_data][product_data][description]": it
        ? "Tutte le discese, tutte le lezioni e tutte le stanze del gioco. Pagamento unico, legato al tuo account Google."
        : "Every descent, every lesson and every room of the game. One payment, tied to your Google account.",
      "metadata[orbis_sub]": user.sub,
      "payment_intent_data[metadata][orbis_sub]": user.sub,
      "payment_intent_data[description]": "Orbis completo",
      "consent_collection[terms_of_service]": "required",
      "custom_text[terms_of_service_acceptance][message]": it
        ? `Accetto le [condizioni di vendita](${origin}/condizioni.html) e chiedo che Orbis completo si sblocchi subito: so che, una volta sbloccato, perdo il diritto di recesso di 14 giorni.`
        : `I accept the [terms of sale](${origin}/condizioni.html) and ask for Orbis complete to unlock right away: I understand that, once unlocked, I lose the 14-day right of withdrawal.`,
      success_url: origin + "/?sessione={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/#lezioni"
    });
    return json({ url: s.url });
  } catch (e) {
    return json({ error: "stripe" }, 502);
  }
}
