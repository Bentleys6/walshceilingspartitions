import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { images } from "@/data/images";
import { PhoneLink, WhatsAppLink } from "./ContactLinks";
import {
  ChevronIcon,
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "./Icons";
import { setupScrollReveal } from "@/lib/reveal";
import {
  captureLeadSource,
  getConsent,
  loadPixel,
  setConsent,
  trackPageView,
  trackingEnabled,
} from "@/lib/tracking";

const nav = [
  { to: "/our-work", label: "Our Work" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

function Logo({ white, className }: { white?: boolean; className: string }) {
  const img = white ? images.logoWhite : images.logoDark;
  return (
    <img src={img.src} alt={img.alt} width={img.width} height={img.height} className={className} />
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const linkCls =
    "px-4 py-2 text-[0.95rem] tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground";
  const activeCls = { className: "!text-foreground" };
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-offwhite/95 backdrop-blur supports-[backdrop-filter]:bg-offwhite/85">
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" aria-label={`${business.name} home`} className="shrink-0">
          <Logo className="h-9 w-auto md:h-12" />
        </Link>

        <nav aria-label="Main" className="hidden items-center lg:flex">
          <div className="group relative">
            <Link
              to="/services"
              className={`${linkCls} inline-flex items-center gap-1.5`}
              activeProps={activeCls}
            >
              Services <ChevronIcon dir="down" className="h-4 w-4" />
            </Link>
            <div className="invisible absolute left-0 top-full w-64 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="rounded-md border border-border bg-card p-2 shadow-lift">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="block rounded-sm px-3 py-2.5 text-[0.95rem] hover:bg-offwhite"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={activeCls}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <PhoneLink className="inline-flex items-center gap-2 text-[0.95rem] text-muted-foreground hover:text-foreground">
            <PhoneIcon className="h-4 w-4" /> {business.phoneDisplay}
          </PhoneLink>
          <Link to="/contact" hash="quote" className="btn btn-primary">
            Get Your Free Quote
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <PhoneLink
            ariaLabel={`Call ${business.phoneDisplay}`}
            className="flex h-11 w-11 items-center justify-center text-muted-foreground"
          >
            <PhoneIcon />
          </PhoneLink>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border bg-offwhite lg:hidden">
          <ul className="container-site py-4">
            <li>
              <Link to="/services" className="block py-2.5 font-heading text-2xl font-semibold">
                Services
              </Link>
              <ul className="mb-2 border-l border-border pl-4">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="block py-2 text-muted-foreground"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="block py-2.5 font-heading text-2xl font-semibold">
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pb-2 pt-4">
              <Link to="/contact" hash="quote" className="btn btn-primary w-full">
                Get Your Free Quote
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer({ onCookieSettings }: { onCookieSettings: () => void }) {
  const fl = "text-charcoal-foreground/75 transition-colors hover:text-charcoal-foreground";
  const { address } = business;
  return (
    <footer className="bg-charcoal text-charcoal-foreground">
      <div className="container-site grid gap-10 pb-12 pt-20 md:grid-cols-[1.5fr_1fr_0.7fr_1fr] md:pt-28">
        <div>
          <Logo white className="h-14 w-auto md:h-[5.5rem]" />
          <p className="mt-6 max-w-xs text-[0.95rem] text-charcoal-foreground/75">
            Ceilings, partitions and plastering. Based in {business.baseTown}, Hertfordshire.
            Available for projects nationwide.
          </p>
          <p className="mt-4 text-[0.95rem] text-charcoal-foreground/50">
            Trading since {business.established}
          </p>
        </div>
        <div>
          <h2 className="eyebrow mb-5 text-charcoal-foreground/80">Services</h2>
          <ul className="space-y-3 text-[0.95rem]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className={fl}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-5 text-charcoal-foreground/80">Pages</h2>
          <ul className="space-y-3 text-[0.95rem]">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className={fl}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/privacy-policy" className={fl}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-5 text-charcoal-foreground/80">Contact</h2>
          <ul className="space-y-3 text-[0.95rem]">
            <li>
              <PhoneLink className={`${fl} inline-flex items-center gap-2.5`}>
                <PhoneIcon className="h-4 w-4" /> {business.phoneDisplay}
              </PhoneLink>
            </li>
            <li>
              <WhatsAppLink className={`${fl} inline-flex items-center gap-2.5`}>
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </WhatsAppLink>
            </li>
            <li>
              <a
                href={`mailto:${business.email}`}
                className={`${fl} inline-flex items-center gap-2.5 break-all`}
              >
                <MailIcon className="h-4 w-4 shrink-0" /> {business.email}
              </a>
            </li>
            <li className="flex gap-2.5 text-charcoal-foreground/75">
              <PinIcon className="mt-1 h-4 w-4 shrink-0" />
              <address className="not-italic">
                {address.street}
                <br />
                {address.town} {address.postcode}
              </address>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site">
        <div className="flex flex-col gap-2 border-t border-charcoal-foreground/15 py-8 text-sm text-charcoal-foreground/50 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {business.legalName}. All rights reserved.
          </p>
          {trackingEnabled() && (
            <button
              type="button"
              onClick={onCookieSettings}
              className="text-left underline underline-offset-2 hover:text-charcoal-foreground"
            >
              Cookie settings
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid h-14 grid-cols-2 md:hidden">
      <PhoneLink className="flex items-center justify-center gap-2 bg-charcoal text-[0.95rem] font-medium text-charcoal-foreground">
        <PhoneIcon className="h-4 w-4" /> Call now
      </PhoneLink>
      <WhatsAppLink className="flex items-center justify-center gap-2 border-t border-border bg-offwhite text-[0.95rem] font-medium text-foreground">
        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
      </WhatsAppLink>
    </div>
  );
}

export function WhatsAppFab() {
  return (
    <WhatsAppLink
      ariaLabel="Message us on WhatsApp"
      className="animate-whatsapp-pulse fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-charcoal-foreground/20 bg-charcoal text-charcoal-foreground shadow-lift transition hover:bg-midgrey md:flex"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </WhatsAppLink>
  );
}

export function CookieBanner({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!trackingEnabled() || !open) return null;
  const choose = (v: "accepted" | "rejected") => {
    setConsent(v);
    if (v === "accepted") trackPageView();
    onClose();
  };
  return (
    <div
      role="dialog"
      aria-label="Cookie choice"
      className="fixed inset-x-0 bottom-14 z-50 p-3 md:bottom-0 md:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-md bg-card p-4 shadow-lift md:flex-row md:items-center md:gap-6">
        <p className="text-[15px]">
          We use cookies to see how our website and adverts perform.{" "}
          <Link to="/privacy-policy" className="link-brand">
            Privacy Policy
          </Link>
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-2 md:w-64">
          <button type="button" className="btn btn-primary" onClick={() => choose("accepted")}>
            Accept
          </button>
          <button
            type="button"
            className="btn border border-primary"
            onClick={() => choose("rejected")}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/** Scroll to top on route change, or to the #hash element. Fires PageView after consent. */
export function useRouteEffects() {
  const location = useLocation();
  const first = useRef(true);
  useEffect(() => {
    captureLeadSource();
  }, []);
  useEffect(() => {
    const hash = location.hash;
    let stopReveal = () => {};
    const t = window.setTimeout(() => {
      const el = hash ? document.getElementById(hash) : null;
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 88,
          behavior: first.current ? "auto" : "smooth",
        });
      } else if (!first.current) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      first.current = false;
      // After the scroll position is settled, so "below the fold" is measured on the new page.
      stopReveal = setupScrollReveal();
    }, 50);
    if (getConsent() === "accepted") {
      loadPixel();
      trackPageView();
    }
    return () => {
      window.clearTimeout(t);
      stopReveal();
    };
  }, [location.pathname, location.hash]);
}
