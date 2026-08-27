import { createElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type InstagramFeedProps = { feedId?: string; className?: string; targetSelector?: string };

const DEFAULT_FEED_ID = String(import.meta.env.VITE_BEHOLD_FEED_ID || "PIuFXijv3PS3RnmyPeA2").trim();
const SCRIPT_SRC = "https://w.behold.so/widget.js";

export default function InstagramFeed({ feedId = DEFAULT_FEED_ID, className = "", targetSelector }: InstagramFeedProps) {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!targetSelector) return;
    const findTarget = () => document.querySelector(targetSelector);
    const currentTarget = findTarget();
    if (currentTarget) setTarget(currentTarget);
    const observer = new MutationObserver(() => {
      const nextTarget = findTarget();
      if (nextTarget) { setTarget(nextTarget); observer.disconnect(); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [targetSelector]);

  useEffect(() => {
    if (!target || !feedId) return;
    const legacyNodes = Array.from(target.children).slice(1)
      .filter((node) => node.tagName !== "BEHOLD-WIDGET" && !node.hasAttribute("data-behold-id") && !node.querySelector("behold-widget")) as HTMLElement[];
    legacyNodes.forEach((node) => node.classList.add("hidden"));
    return () => legacyNodes.forEach((node) => node.classList.remove("hidden"));
  }, [target, feedId]);

  useEffect(() => {
    if (!feedId) return;
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = SCRIPT_SRC;
    document.head.appendChild(script);
  }, [feedId]);

  if (!feedId && targetSelector) return null;
  if (!feedId) return <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">Configure o ID do feed Behold.</p>;

  const beholdWidget = createElement("behold-widget", { "feed-id": feedId });
  const content = <div className={`min-h-[280px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-sm ${className}`} aria-label="Feed do Instagram">{beholdWidget}</div>;
  return target ? createPortal(content, target) : content;
}
