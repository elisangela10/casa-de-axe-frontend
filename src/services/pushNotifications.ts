import api from "./api";

function decodeVapidKey(value: string): Uint8Array {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const raw = window.atob((value + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
}

export async function subscribeToPush(): Promise<PushSubscription> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("Este navegador não oferece suporte a notificações Push.");
  if (await Notification.requestPermission() !== "granted") throw new Error("Permissão para notificações não concedida.");
  const registration = await navigator.serviceWorker.ready;
  const { data } = await api.get<{ publicKey: string }>("/Notificacoes/public-key");
  if (!data.publicKey) throw new Error("Chave pública de notificações não configurada.");
  const existing = await registration.pushManager.getSubscription();
  const subscription = existing || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeVapidKey(data.publicKey) });
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) throw new Error("Inscrição Push inválida.");
  await api.post("/Notificacoes/inscricao", { endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth }, userAgent: navigator.userAgent });
  return subscription;
}

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}
