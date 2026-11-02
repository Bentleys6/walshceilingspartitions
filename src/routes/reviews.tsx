import { createFileRoute } from "@tanstack/react-router";
import { business, pageTitle } from "@/data/business";
import { seo } from "@/lib/seo";
import { QuoteForm } from "@/components/site/QuoteForm";
import { PageHeader } from "@/components/site/Widgets";

export const Route = createFileRoute("/reviews")({
  head: () =>
    seo(
      pageTitle("Reviews"),
      "Reviews for Walsh Ceilings and Partitions. Hertfordshire-based contractor working nationwide. If you've worked with us, leave us a Google review.",
      "/reviews",
    ),
  component: Reviews,
});

function Reviews() {
  return (
    <>
      <PageHeader
        title="Reviews"
        intro="We're building our collection of reviews as projects complete. If you've worked with us, we'd appreciate a review on Google."
      >
        <a
          href={business.googleReviewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-8 h-12"
        >
          Leave us a Google review
        </a>
      </PageHeader>
      <section className="bg-charcoal">
        <div className="container-site section-pad">
          <div className="max-w-xl">
            <QuoteForm
              name="Reviews page"
              title="Looking for a quote instead?"
              intro="Send your details and we'll get back to you with a price."
              submitLabel="Send your enquiry"
              messageLabel="Message"
              variant="dark"
              withEmail
            />
          </div>
        </div>
      </section>
    </>
  );
}
