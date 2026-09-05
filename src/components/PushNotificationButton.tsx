import { useEffect, useState } from "react";
import { getCurrentPushSubscription, subscribeToPush, unsubscribeFromPush } from "../services/pushNotifications";

export default function PushNotificationButton() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { void getCurrentPushSubscription().then((subscription) => setEnabled(Boolean(subscription))).catch(() => setEnabled(false)); }, []);

  const toggle = async () => {
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
    <button type="button" onClick={toggle} disabled={loading} className="rounded-lg p-2 text-gray-600 transition hover:bg-amber-50 hover:text-amber-800 disabled:cursor-wait disabled:opacity-70" aria-label={enabled ? "Desativar notificações" : "Ativar notificações"} title={enabled ? "Desativar notificações" : "Ativar notificações"}>
      <i className={enabled ? "bi-bell-fill text-amber-700" : "bi-bell"} />
    </button>
    {message && <p role="status" className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg">{message}</p>}
  </div>;
}
