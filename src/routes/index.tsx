import { createFileRoute, Link } from "@tanstack/react-router";
import { business } from "@/data/business";
import { images } from "@/data/images";
import { homeCards } from "@/data/services";
import { recentWork } from "@/data/work";
import { homeFaqs } from "@/data/faqs";
import { seo } from "@/lib/seo";
import { Img } from "@/components/site/Img";
import { QuoteForm } from "@/components/site/QuoteForm";
import { PhoneLink } from "@/components/site/ContactLinks";
import { PhoneIcon } from "@/components/site/Icons";
import { CtaBand, FaqList } from "@/components/site/Widgets";
import { faqSchema } from "@/lib/schema";

export const Route = createFileRoute("/")({
  head: () => {
    const h = seo(
      `${business.legalName} — Ceilings, partitions and plastering, Hertfordshire and nationwide`,
      "Hoddesdon-based ceilings and plastering contractor since 2014. MF ceilings, lay-in grid ceilings, metal and timber stud partitions, plastering, and tape and jointing. Covers Hertfordshire and projects nationwide.",
      "/",
    );
    return {
      ...h,
      // Start downloading the hero photo straight away (it's the largest thing on screen).
      links: [
        ...h.links,
        {
          rel: "preload",
          as: "image",
          href: images.layInHospitalCorridor.src,
          imageSrcSet: images.layInHospitalCorridor.srcSet,
          imageSizes: "100vw",
          fetchPriority: "high",
        },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema(homeFaqs)) }],
    };
  },
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-charcoal text-charcoal-foreground">
        <Img
          name="layInHospitalCorridor"
          eager
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
        <div className="container-site grid items-center gap-10 py-14 md:py-16 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <h1 className="text-[2.15rem] leading-[1.12] md:text-[3.6rem] md:leading-[1.1]">
              Ceilings, partitions and plastering — Hertfordshire and nationwide.
            </h1>
            <p className="mt-6 text-lg text-charcoal-foreground/90">
              Based in {business.baseTown}. Trading since {business.established}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="btn btn-primary h-11">
                Request a free quote <span aria-hidden="true">→</span>
              </a>
              <PhoneLink className="btn btn-outline-light h-11 lg:hidden">
                <PhoneIcon className="h-4 w-4" /> Call {business.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
          <QuoteForm
            name="Homepage hero"
            title="Get a free quote"
            submitLabel="Request a free quote"
            variant="card"
          />
        </div>
      </section>

      {/* About */}
      <section className="bg-charcoal text-charcoal-foreground">
        <div className="container-site section-pad grid gap-12 md:grid-cols-[1.6fr_1fr] md:gap-24">
          <p className="text-lg leading-relaxed text-charcoal-foreground/80">
            {business.legalName} has been fitting ceilings, partitions and plaster finishes since{" "}
            {business.established}. We work on MF and lay-in grid ceiling systems, metal and timber
            stud partitions, plastering, and tape and jointing, for contractors, developers and
            private clients. Based in {business.baseTown}, we cover Hertfordshire and the
            surrounding area as standard, and take on projects further afield across the country
            where the job calls for it.
          </p>
          <dl className="flex gap-12 md:flex-col md:gap-10">
            <div>
              <dt className="sr-only">Established</dt>
              <dd className="font-heading text-3xl font-bold md:text-5xl">
                {business.established}
              </dd>
              <dd className="mt-1 text-[0.95rem] text-charcoal-foreground/60">— established</dd>
            </div>
            <div>
              <dt className="sr-only">Service area</dt>
              <dd className="font-heading text-3xl font-bold md:text-5xl">Nationwide</dd>
              <dd className="mt-1 text-[0.95rem] text-charcoal-foreground/60">— service area</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-offwhite">
        <div className="container-site section-pad">
          <h2 className="text-3xl md:text-[2.4rem]">What we do</h2>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {homeCards.map((c) => (
              <article key={c.id}>
                <Link
                  to="/services/$slug"
                  params={{ slug: c.slug }}
                  hash={c.id}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Img
                    name={c.cardImage ?? c.image}
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/3] w-full rounded-sm object-cover"
                  />
                </Link>
                <h3 className="mt-5 text-xl">{c.title}</h3>
                <p className="mt-2 text-[0.95rem] text-muted-foreground">{c.summary}</p>
                <Link
                  to="/services/$slug"
                  params={{ slug: c.slug }}
                  hash={c.id}
                  className="link-arrow mt-3"
                >
                  {c.linkLabel} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent work */}
      <section className="bg-charcoal text-charcoal-foreground">
        <div className="section-pad">
          <div className="container-site">
            <h2 className="text-3xl md:text-[2.4rem]">Recent work</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4" data-no-reveal>
            {recentWork.map((w) => (
              <figure key={w.image} className="relative">
                <Img
                  name={w.image}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="sr-only">{w.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className="container-site mt-8">
            <Link to="/our-work" className="btn btn-light">
              See more of our work <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-offwhite">
        <div className="container-site section-pad grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <h2 className="text-3xl md:text-[2.4rem]">Common questions</h2>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <CtaBand
        title="Get a price on your project."
        intro="Send a few details and we'll come back to you with a quote."
      />
    </>
  );
}
