import { useEffect, useState } from "react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function InstallPwaButton() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone;
    setInstalled(Boolean(standalone));
    const handleInstallAvailable = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const handleInstalled = () => { setInstalled(true); setInstallEvent(null); };
    window.addEventListener("beforeinstallprompt", handleInstallAvailable);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed) return null;

  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const install = async () => {
    if (installEvent) {
      await installEvent.prompt();
      await installEvent.userChoice;
      setInstallEvent(null);
      return;
    }
    if (isIos) setShowIosHelp(true);
  };

  return <>
    <button type="button" onClick={install} className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-amber-800 px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-amber-900" aria-label="Instalar aplicativo da Casa">
      <i className="bi-phone" /> Instalar aplicativo
    </button>
    {showIosHelp && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Como instalar no iPhone">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-bold text-stone-900">Instalar no iPhone</h2><p className="mt-2 text-sm leading-6 text-stone-600">Toque em <strong>Compartilhar</strong> no Safari e escolha <strong>Adicionar à Tela de Início</strong>.</p><button type="button" onClick={() => setShowIosHelp(false)} className="mt-5 w-full rounded-xl bg-amber-800 px-4 py-3 font-semibold text-white">Entendi</button></div>
    </div>}
  </>;
}
