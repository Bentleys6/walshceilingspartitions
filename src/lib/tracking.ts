import { business } from "@/data/business";

const CONSENT_KEY = "walsh-cookie-consent";
type Consent = "accepted" | "rejected" | null;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

export const trackingEnabled = () => business.metaPixelId !== "";

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: "accepted" | "rejected") {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* ignore */
  }
  if (v === "accepted") loadPixel();
}

let loaded = false;
export function loadPixel() {
  if (!trackingEnabled() || loaded || typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;
  loaded = true;
  /* Meta Pixel base code */
  const n = function (...args: unknown[]) {
    const self = n as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
    if (self.callMethod) self.callMethod(...args);
    else self.queue.push(args);
  } as unknown as NonNullable<Window["fbq"]> & {
    push?: unknown;
    loaded?: boolean;
    version?: string;
  };
  if (!window.fbq) {
    window.fbq = n;
    window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  window.fbq("init", business.metaPixelId);
}

function fire(event: string, params?: Record<string, unknown>) {
  if (!trackingEnabled() || getConsent() !== "accepted") return;
  loadPixel();
  window.fbq?.("track", event, params);
}

export const trackPageView = () => fire("PageView");
export const trackContact = () => fire("Contact");

export function trackLeadIfSubmitted() {
  try {
    if (sessionStorage.getItem("leadSubmitted") === "1") {
      const name = sessionStorage.getItem("leadFormName") ?? undefined;
      if (trackingEnabled() && getConsent() === "accepted") fire("Lead", { content_name: name });
      sessionStorage.removeItem("leadSubmitted");
      sessionStorage.removeItem("leadFormName");
    }
  } catch {
    /* ignore */
  }
}

/* Lead source (UTM / fbclid) kept for the visit */
const SOURCE_KEY = "walsh-lead-source";
export function captureLeadSource() {
  try {
    if (sessionStorage.getItem(SOURCE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Record<string, string> = { landing_page: window.location.href };
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid"]) {
      const v = params.get(k);
      if (v) data[k] = v;
    }
    sessionStorage.setItem(SOURCE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getLeadSource(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(SOURCE_KEY) || "{}");
  } catch {
    return {};
  }
}
