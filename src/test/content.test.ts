import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { images } from "@/data/images";
import { services, homeCards } from "@/data/services";
import { workGroups } from "@/data/work";

const publicDir = path.resolve(__dirname, "../../public");
const fileFor = (src: string) => path.join(publicDir, src.replace(/^\//, ""));

describe("site content", () => {
  it("every image file referenced in images.ts exists", () => {
    for (const [key, img] of Object.entries(images)) {
      const files = [
        img.src,
        ...("srcSet" in img && img.srcSet
          ? img.srcSet.split(",").map((s) => s.trim().split(" ")[0]!)
          : []),
      ];
      for (const f of files) expect(existsSync(fileFor(f)), `${key}: ${f}`).toBe(true);
    }
  });

  it("keeps the old site's URLs, so Google rankings and links carry over", () => {
    expect(services.map((s) => s.slug)).toEqual([
      "ceilings",
      "partitions",
      "plastering",
      "tape-jointing",
    ]);
  });

  it("lists every page in the sitemap", () => {
    const sitemap = readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
    for (const p of [
      "/services",
      "/our-work",
      "/reviews",
      "/contact",
      ...services.map((s) => `/services/${s.slug}`),
    ]) {
      expect(sitemap).toContain(`walshceilingspartitions.co.uk${p}<`);
    }
  });

  it("has six homepage service cards and alt text on every photo", () => {
    expect(homeCards).toHaveLength(6);
    for (const c of homeCards) if (c.cardImage) expect(images[c.cardImage], c.id).toBeDefined();
    for (const img of Object.values(images)) expect(img.alt.length).toBeGreaterThan(10);
  });

  it("Our Work galleries only use known images", () => {
    for (const g of workGroups) for (const it of g.items) expect(images[it.image]).toBeDefined();
  });
});
