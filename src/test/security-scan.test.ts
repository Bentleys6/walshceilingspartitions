/**
 * Automatic security scan, run by `npm test`, `npm run check`, the pre-push hook and GitHub.
 * Covers the "20 website security checks" that apply to a site with no backend:
 * secrets in code, committed .env files, risky HTML injection, debug leftovers and
 * source maps in the build. See .claude/skills/site-health-check for the full list.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");

// Files git tracks, plus anything new not yet committed.
function trackedFiles(): string[] {
  const out = execSync("git ls-files --cached --others --exclude-standard", {
    cwd: root,
    encoding: "utf8",
  });
  return out.split("\n").filter(Boolean);
}

const TEXT =
  /\.(ts|tsx|js|mjs|cjs|json|md|toml|ya?ml|html|css|txt|xml|sh)$|(^|\/)(_headers|\.gitignore)$/;

const SECRET_PATTERNS: [string, RegExp][] = [
  ["Stripe secret key", /sk_(live|test)_[0-9A-Za-z]{10,}/],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["Private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{30,}/],
  ["Slack token", /xox[abposr]-[0-9A-Za-z-]{10,}/],
  ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
  ["OpenAI / Anthropic key", /sk-(proj-|ant-)?[A-Za-z0-9_-]{30,}/],
  ["Supabase service role key", /service_role/],
  ["Hard-coded password", /(password|passwd|secret)\s*[:=]\s*["'][^"']{6,}["']/i],
];

describe("security scan", () => {
  const files = trackedFiles().filter((f) => TEXT.test(f) && !f.endsWith("bun.lock"));

  it("has no secret keys or passwords in the code", () => {
    const hits: string[] = [];
    for (const f of files) {
      if (f === "src/test/security-scan.test.ts") continue;
      const text = readFileSync(path.join(root, f), "utf8");
      for (const [name, re] of SECRET_PATTERNS) if (re.test(text)) hits.push(`${name} in ${f}`);
    }
    expect(hits).toEqual([]);
  });

  it("has no .env files committed", () => {
    expect(
      trackedFiles().filter((f) => /(^|\/)\.env(\.|$)/.test(f) || f.endsWith(".dev.vars")),
    ).toEqual([]);
  });

  it("doesn't inject raw HTML or run strings as code", () => {
    const hits: string[] = [];
    for (const f of files.filter(
      (f) => f.startsWith("src/") && /\.(ts|tsx)$/.test(f) && !f.includes("/test/"),
    )) {
      const text = readFileSync(path.join(root, f), "utf8");
      for (const re of [
        /dangerouslySetInnerHTML/,
        /\beval\s*\(/,
        /new Function\s*\(/,
        /\.innerHTML\s*=/,
        /document\.write\(/,
      ])
        if (re.test(text)) hits.push(`${re.source} in ${f}`);
    }
    expect(hits).toEqual([]);
  });

  it("has no debug leftovers in the site code", () => {
    const hits: string[] = [];
    for (const f of files.filter(
      (f) => f.startsWith("src/") && /\.(ts|tsx)$/.test(f) && !f.includes("/test/"),
    )) {
      const text = readFileSync(path.join(root, f), "utf8");
      if (/\bdebugger\b/.test(text) || /console\.log\(/.test(text)) hits.push(f);
    }
    expect(hits).toEqual([]);
  });

  it("doesn't publish source maps (they expose the original code)", () => {
    const dir = path.join(root, ".output/public");
    if (!existsSync(dir)) return; // only checked after a build
    const maps: string[] = [];
    const walk = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = path.join(d, n);
        if (statSync(p).isDirectory()) walk(p);
        else if (n.endsWith(".map")) maps.push(p);
      }
    };
    walk(dir);
    expect(maps).toEqual([]);
  });
});
