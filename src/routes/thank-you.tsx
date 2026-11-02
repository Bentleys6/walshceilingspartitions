import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { business, pageTitle } from "@/data/business";
import { seo } from "@/lib/seo";
import { trackLeadIfSubmitted } from "@/lib/tracking";
import { PhoneLink, WhatsAppLink } from "@/components/site/ContactLinks";
import { PhoneIcon, WhatsAppIcon } from "@/components/site/Icons";

export const Route = createFileRoute("/thank-you")({
  head: () =>
    seo(pageTitle("Thank You"), `Thanks for your enquiry to ${business.legalName}.`, "/thank-you", {
      noindex: true,
    }),
  component: ThankYou,
});

function ThankYou() {
  useEffect(() => {
    trackLeadIfSubmitted();
  }, []);
  return (
    <section className="bg-offwhite">
      <div className="container-site flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="max-w-2xl text-4xl md:text-6xl">Thanks — we've got your enquiry.</h1>
        <p className="mt-5 text-xl">{business.responsePromise} If it's urgent, give us a call.</p>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          Got drawings or photos of the job? Send them on WhatsApp so we can take a look.
        </p>
        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <WhatsAppLink className="btn btn-primary h-12">
            <WhatsAppIcon /> WhatsApp drawings or photos
          </WhatsAppLink>
          <PhoneLink className="btn h-12 border border-primary">
            <PhoneIcon /> Call {business.phoneDisplay}
          </PhoneLink>
        </div>
        <Link to="/" className="link-brand mt-8">
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
