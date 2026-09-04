export type SocialNetwork = "youtube" | "instagram" | "facebook" | "tiktok" | "other";

export function getSocialLinkInfo(value?: string): { network: SocialNetwork; icon: string; label: string; color: string } {
  let hostname = "";
  try {
    hostname = new URL(value || "").hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return { network: "other", icon: "bi-link-45deg", label: "Abrir link", color: "hover:text-amber-700" };
  }
  const isDomain = (domain: string) => hostname === domain || hostname.endsWith(`.${domain}`);
  if (isDomain("youtube.com") || hostname === "youtu.be") return { network: "youtube", icon: "bi-youtube", label: "YouTube", color: "hover:text-red-600" };
  if (isDomain("instagram.com")) return { network: "instagram", icon: "bi-instagram", label: "Instagram", color: "hover:text-pink-600" };
  if (isDomain("facebook.com") || hostname === "fb.watch") return { network: "facebook", icon: "bi-facebook", label: "Facebook", color: "hover:text-blue-600" };
  if (isDomain("tiktok.com")) return { network: "tiktok", icon: "bi-tiktok", label: "TikTok", color: "hover:text-gray-950" };
  return { network: "other", icon: "bi-link-45deg", label: "Abrir link", color: "hover:text-amber-700" };
}
