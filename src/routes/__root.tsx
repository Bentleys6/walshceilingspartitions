import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { images } from "@/data/images";
import { business } from "@/data/business";
import { services } from "@/data/services";
import {
  CookieBanner,
  Footer,
  Header,
  MobileActionBar,
  WhatsAppFab,
  useRouteEffects,
} from "@/components/site/Layout";
import { PhoneLink } from "@/components/site/ContactLinks";
import { getConsent, trackingEnabled } from "@/lib/tracking";

function NotFoundComponent() {
  return (
    <section className="bg-offwhite">
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl md:text-5xl">Sorry, that page doesn't exist.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Call us on <PhoneLink className="link-brand" /> or head back to the homepage.
        </p>
        <Link to="/" className="btn btn-primary mt-8">
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">This page didn't load</h1>
        <p className="mt-2 text-muted-foreground">
          Please try again, or call {business.phoneDisplay}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn border border-primary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const site = business.siteUrl.replace(/\/$/, "");
const localBusiness: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${site}/#business`,
  name: business.legalName,
  alternateName: business.name,
  description:
    "Ceilings and plastering contractor based in Hoddesdon, trading since 2014. MF ceilings, lay-in grid ceilings, metal and timber stud partitions, plastering, and tape and jointing.",
  url: site,
  logo: site + images.logoDark.src,
  image: site + images.share.src,
  telephone: business.phoneTel,
  email: business.email,
  foundingDate: String(business.established),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.town,
    addressRegion: business.address.county,
    postalCode: business.address.postcode,
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Hertfordshire" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Ceilings, partitions and plastering",
    itemListElement: services.flatMap((s) =>
      s.subServices.map((sub) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: sub.name,
          url: `${site}/services/${s.slug}#${sub.id}`,
        },
      })),
    ),
  },
};
const socialLinks = Object.values(business.social).filter(Boolean);
if (socialLinks.length) localBusiness["sameAs"] = socialLinks;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1C1B19" },
      { property: "og:site_name", content: business.legalName },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(localBusiness) },
      // Cloudflare Web Analytics: cookie-free visitor stats, only once a token is set.
      ...(business.cloudflareAnalyticsToken
        ? [
            {
              src: "https://static.cloudflareinsights.com/beacon.min.js",
              defer: true,
              "data-cf-beacon": JSON.stringify({ token: business.cloudflareAnalyticsToken }),
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [cookieOpen, setCookieOpen] = useState(false);
  useRouteEffects();
  useEffect(() => {
    if (trackingEnabled() && getConsent() === null) setCookieOpen(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main>
        <Outlet />
      </main>
      <div className="pb-14 md:pb-0">
        <Footer onCookieSettings={() => setCookieOpen(true)} />
      </div>
      <MobileActionBar />
      <WhatsAppFab />
      <CookieBanner open={cookieOpen} onClose={() => setCookieOpen(false)} />
    </QueryClientProvider>
  );
}
