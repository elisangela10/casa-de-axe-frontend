import { useEffect, useState } from "react";
import { getCurrentPushSubscription, subscribeToPush, unsubscribeFromPush } from "../services/pushNotifications";

export default function PushNotificationButton() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const browserSupported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
    setSupported(browserSupported);
    setPermissionDenied(browserSupported && Notification.permission === "denied");
    if (browserSupported) void getCurrentPushSubscription().then((subscription) => setEnabled(Boolean(subscription))).catch(() => setEnabled(false));
  }, []);

  const toggle = async () => {
    if (!supported) { setMessage("Este navegador não oferece suporte a notificações Push."); return; }
    if (permissionDenied) { setMessage("Libere as notificações nas configurações do navegador para ativá-las."); return; }
    setLoading(true);
    setMessage("");
    try {
      if (enabled) {
        await unsubscribeFromPush();
        setEnabled(false);
        setMessage("Notificações desativadas.");
      } else {
        await subscribeToPush();
        setEnabled(true);
        setMessage("Notificações ativadas.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível alterar as notificações.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="relative">
    <button type="button" onClick={toggle} disabled={loading || !supported || permissionDenied} aria-pressed={enabled} className="rounded-lg p-2 text-gray-600 transition hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-70" aria-label={enabled ? "Desativar notificações" : "Ativar notificações"} title={permissionDenied ? "Libere as notificações nas configurações do navegador" : enabled ? "Desativar notificações" : "Ativar notificações"}>
      <i className={enabled ? "bi-bell-fill text-amber-700" : "bi-bell text-gray-400"} />
    </button>
    {message && <p role="status" className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg">{message}</p>}
  </div>;
}
