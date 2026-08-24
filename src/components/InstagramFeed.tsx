import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type InstagramFeedProps = {
  feedId?: string;
  className?: string;
  targetSelector?: string;
};

const DEFAULT_FEED_ID = String(import.meta.env.VITE_BEHOLD_FEED_ID || "G0YuxFIQ3sjEBD23Fppk").trim();
const SCRIPT_SRC = "https://w.behold.so/widget.js";

export default function InstagramFeed({ feedId = DEFAULT_FEED_ID, className = "", targetSelector }: InstagramFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!targetSelector) return;
    const findTarget = () => document.querySelector(targetSelector);
    const currentTarget = findTarget();
    if (currentTarget) setTarget(currentTarget);
    const observer = new MutationObserver(() => {
      const nextTarget = findTarget();
      if (nextTarget) {
        setTarget(nextTarget);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [targetSelector]);

  useEffect(() => {
    if (!feedId || !target) return;
    const legacyFeed = target.querySelector<HTMLElement>(":scope > .grid");
    legacyFeed?.classList.add("hidden");
    return () => legacyFeed?.classList.remove("hidden");
  }, [feedId, target]);

  useEffect(() => {
    if (!feedId || !containerRef.current) return;

    containerRef.current.setAttribute("data-behold-id", feedId);

    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = SCRIPT_SRC;
      document.head.appendChild(script);
    }

    return () => containerRef.current?.removeAttribute("data-behold-id");
  }, [feedId]);

  if (!feedId && targetSelector) return null;
  if (!feedId) {
    return <div className={`rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center ${className}`}><i className="bi-instagram mb-3 block text-3xl text-amber-800" /><p className="text-stone-600">Configure o ID do feed Behold para exibir as publicações.</p></div>;
  }

  const widget = <div ref={containerRef} className={`min-h-[280px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-sm ${className}`} aria-label="Feed do Instagram" />;
  return target ? createPortal(widget, target) : widget;
}
