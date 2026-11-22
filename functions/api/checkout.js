// POST /api/checkout → { url } of a Stripe Checkout page for «Orbis completo».
// Each purchase gets its own code, saved on the payment and written in its description,
// so the buyer can open Orbis on other devices too.
import { json, stripe, newCode, configured } from "../../server/orbis.js";

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "not ready" }, 503);
  let lang = "it";
  try { lang = (await request.json()).lang === "en" ? "en" : "it"; } catch (e) {}
  const origin = new URL(request.url).origin, code = newCode(), it = lang === "it";
  const params = {
    mode: "payment",
    locale: lang,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(Number(env.PRICE_CENTS) || 499),
    "line_items[0][price_data][product_data][name]": "Orbis completo",
    "line_items[0][price_data][product_data][description]": it
      ? "Tutte le discese, tutte le lezioni e tutte le stanze del gioco. Pagamento unico."
      : "Every descent, every lesson and every room of the game. One payment.",
    "payment_intent_data[metadata][orbis_code]": code,
    "payment_intent_data[description]": (it ? "Orbis completo · codice per gli altri dispositivi: " : "Orbis complete · code for your other devices: ") + code,
    "metadata[orbis_code]": code,
    "consent_collection[terms_of_service]": "required",
    "custom_text[terms_of_service_acceptance][message]": it
      ? `Accetto le [condizioni di vendita](${origin}/condizioni.html) e chiedo che Orbis completo si sblocchi subito: so che, una volta sbloccato, perdo il diritto di recesso di 14 giorni.`
      : `I accept the [terms of sale](${origin}/condizioni.html) and ask for Orbis complete to unlock right away: I understand that, once unlocked, I lose the 14-day right of withdrawal.`,
    success_url: origin + "/?sessione={CHECKOUT_SESSION_ID}",
    cancel_url: origin + "/#lezioni"
  };
  try {
    const s = await stripe(env, "POST", "checkout/sessions", params);
    return json({ url: s.url });
  } catch (e) {
    return json({ error: "checkout" }, 502);
  }
}
