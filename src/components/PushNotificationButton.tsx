import { useEffect, useState } from "react";
import { subscribeToPush } from "../services/pushNotifications";

export default function PushNotificationButton() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { if ("Notification" in window) setEnabled(Notification.permission === "granted"); }, []);
  const enable = async () => { setLoading(true); setMessage(""); try { await subscribeToPush(); setEnabled(true); setMessage("Notificações ativadas."); } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível ativar as notificações."); } finally { setLoading(false); } };
  return <div className="relative"><button type="button" onClick={enable} disabled={loading || enabled} className="rounded-lg p-2 text-gray-600 transition hover:bg-amber-50 hover:text-amber-800 disabled:cursor-default disabled:opacity-70" aria-label={enabled ? "Notificações ativadas" : "Ativar notificações"} title={enabled ? "Notificações ativadas" : "Ativar notificações"}><i className={enabled ? "bi-bell-fill text-amber-700" : "bi-bell"} /></button>{message && <p role="status" className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg">{message}</p>}</div>;
}
