/* PWA-UPDATE:BEGIN */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  const workers = navigator.serviceWorker;
  let controller = workers.controller;

  // The new worker takes control after the complete offline edition is ready.
  // First installation also claims the page, but has no older edition to replace.
  workers.addEventListener("controllerchange", () => {
    const next = workers.controller;
    if (next && controller && next !== controller) $("update").hidden = false;
    if (next) controller = next;
  });
  $("update-go").onclick = () => location.reload();

  async function watchForUpdates() {
    let registration;
    try {
      registration = await workers.register("./sw.js", { updateViaCache: "none" });
    } catch {
      return;
    }
    const check = () => {
      if (registration.active && !registration.installing && navigator.onLine) {
        registration.update().catch(() => {});
      }
    };
    check();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") check();
    });
    window.addEventListener("online", check);
  }
  if (document.readyState === "complete") watchForUpdates();
  else window.addEventListener("load", watchForUpdates, { once: true });
}
/* PWA-UPDATE:END */
