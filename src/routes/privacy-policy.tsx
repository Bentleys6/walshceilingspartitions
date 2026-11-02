import { createFileRoute } from "@tanstack/react-router";
import { business, pageTitle } from "@/data/business";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/site/Widgets";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    seo(
      pageTitle("Privacy Policy"),
      `How ${business.legalName}, Hoddesdon, collects and uses the details you send through this website.`,
      "/privacy-policy",
    ),
  component: Privacy,
});

function Privacy() {
  const { address } = business;
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <section className="bg-offwhite pb-24">
        <div className="container-site max-w-3xl space-y-10 text-lg [&_h2]:mb-3 [&_h2]:text-2xl">
          <div>
            <h2>Who we are</h2>
            <p>
              {business.legalName}, {address.street}, {address.town} {address.postcode}. Contact:{" "}
              {business.phoneDisplay} or {business.email}. We are responsible for the personal data
              collected through this website.
            </p>
          </div>
          <div>
            <h2>What we collect</h2>
            <p>The details you enter in our enquiry forms:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address (on some forms)</li>
              <li>The service you're interested in and your message</li>
            </ul>
            {business.metaPixelId && (
              <p className="mt-3">
                Only if you accept cookies, data collected by the Meta Pixel about how you use the
                site.
              </p>
            )}
          </div>
          <div>
            <h2>Why we use it</h2>
            <p>
              To respond to your enquiry and give you a quote. Lawful basis: our legitimate interest
              in replying to enquiries you send us.
            </p>
          </div>
          <div>
            <h2>How it's sent</h2>
            <p>Form submissions are delivered to us by email through Web3Forms.</p>
          </div>
          <div>
            <h2>Cookies and analytics</h2>
            {business.metaPixelId ? (
              <p>
                We use the Meta Pixel to measure how the site and our adverts perform. It only runs
                if you click Accept on the cookie banner. You can change your choice using the
                "Cookie settings" link in the footer.
              </p>
            ) : (
              <p>This website doesn't use advertising or tracking cookies.</p>
            )}
            {business.cloudflareAnalyticsToken && (
              <p className="mt-3">
                We use Cloudflare Web Analytics to count visits to each page. It does not use
                cookies or identify you.
              </p>
            )}
            <p className="mt-3">
              The map on our contact page is provided by Google Maps, which may set its own cookies.
            </p>
          </div>
          <div>
            <h2>How long we keep it</h2>
            <p>Up to 2 years after our last contact.</p>
          </div>
          <div>
            <h2>Your rights</h2>
            <p>
              You can ask to see, correct or delete your data by contacting us on the details above.
              You can complain to the Information Commissioner's Office at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="link-brand"
              >
                ico.org.uk
              </a>
              .
            </p>
          </div>
          <p className="text-muted-foreground">Last updated: November 2026.</p>
        </div>
      </section>
    </>
  );
}
