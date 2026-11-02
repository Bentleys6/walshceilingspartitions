import { business } from "@/data/business";
import { images } from "@/data/images";

/** Per-page head tags. Canonical/og:url only once business.siteUrl is set. */
export function seo(
  title: string,
  description: string,
  path: string,
  extra: { noindex?: boolean } = {},
) {
  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  const links: Record<string, string>[] = [];
  if (business.siteUrl) {
    const url = business.siteUrl.replace(/\/$/, "") + path;
    meta.push({ property: "og:url", content: url });
    const image = business.siteUrl.replace(/\/$/, "") + images.share.src;
    meta.push({ property: "og:image", content: image });
    meta.push({ property: "og:image:width", content: "1200" });
    meta.push({ property: "og:image:height", content: "630" });
    meta.push({ property: "og:image:alt", content: images.share.alt });
    meta.push({ name: "twitter:image", content: image });
    links.push({ rel: "canonical", href: url });
  }
  if (extra.noindex) meta.push({ name: "robots", content: "noindex" });
  return { meta, links };
}
