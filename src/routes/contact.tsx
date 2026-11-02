import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { business, pageTitle } from "@/data/business";
import { seo } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { PhoneLink, WhatsAppLink } from "@/components/site/ContactLinks";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/site/Icons";
import { QuoteForm } from "@/components/site/QuoteForm";
import { PageHeader } from "@/components/site/Widgets";

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...seo(
      pageTitle("Contact"),
      `Contact Walsh Ceilings and Partitions in Hoddesdon. Call ${business.phoneDisplay}, WhatsApp, or send an enquiry for ceilings, partitions and plastering. Hertfordshire-based, nationwide projects.`,
      "/contact",
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Contact", path: "/contact" }])),
      },
    ],
  }),
  component: Contact,
});

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`;
const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(business.mapsQuery)}&output=embed`;

function Contact() {
  const { address } = business;
  const [showMap, setShowMap] = useState(false);
  const card =
    "flex gap-4 rounded-sm border border-border bg-card p-5 transition-colors hover:border-foreground/40";
  const label = "text-[0.95rem] text-muted-foreground";
  const value = "mt-0.5 text-[1.05rem] font-medium";
  return (
    <>
      <PageHeader
        title="Contact Walsh Ceilings and Partitions"
        intro="Call, message us on WhatsApp, or send your details below and we'll get back to you."
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <PhoneLink className={card}>
            <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <span className={`block ${label}`}>Phone</span>
              <span className={`block ${value}`}>{business.phoneDisplay}</span>
            </span>
          </PhoneLink>
          <a href={`mailto:${business.email}`} className={card}>
            <MailIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <span className="min-w-0">
              <span className={`block ${label}`}>Email</span>
              <span className="mt-0.5 block text-[0.95rem] font-medium [overflow-wrap:anywhere]">
                {business.email}
              </span>
            </span>
          </a>
          <WhatsAppLink className={card}>
            <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <span className={`block ${label}`}>WhatsApp</span>
              <span className={`block ${value}`}>Message us</span>
            </span>
          </WhatsAppLink>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={card}>
            <PinIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <span className={`block ${label}`}>Address</span>
              <span className={`block ${value}`}>
                {address.street},<br />
                {address.town}, {address.postcode}
              </span>
            </span>
          </a>
        </div>
        <p className="mt-8 max-w-4xl text-[0.95rem] text-muted-foreground">
          {business.areaSummary} Call anytime — we'll get back to you.
        </p>
      </PageHeader>

      <section className="bg-charcoal text-charcoal-foreground">
        <div className="container-site section-pad grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <QuoteForm
            name="Contact page"
            title="Send us your enquiry"
            submitLabel="Send your enquiry"
            messageLabel="Message"
            variant="dark"
            withEmail
          />
          <div>
            <h2 className="text-2xl md:text-[1.75rem]">Where we're based</h2>
            <div className="mt-6 aspect-[4/3] overflow-hidden rounded-sm bg-midgrey lg:aspect-auto lg:h-[460px]">
              {showMap ? (
                <iframe
                  title={`Map showing ${address.street}, ${address.town}`}
                  src={mapEmbed}
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              ) : (
                // Google Maps is ~2MB, so it only loads when someone asks for it.
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center transition-colors hover:bg-charcoal-foreground/5"
                >
                  <PinIcon className="h-8 w-8" />
                  <span className="text-lg font-medium">
                    {address.street}, {address.town} {address.postcode}
                  </span>
                  <span className="btn btn-light mt-2">Show map</span>
                </button>
              )}
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow mt-4 text-charcoal-foreground/70"
            >
              Open in Google Maps <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
