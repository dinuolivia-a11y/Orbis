// GET /api/config → what the page needs to show the Google button (the client id is public).
import { json, configured } from "../../server/orbis.js";
export async function onRequestGet({ env }) {
  return json({ ready: configured(env), google: configured(env) ? env.GOOGLE_CLIENT_ID : null });
}
