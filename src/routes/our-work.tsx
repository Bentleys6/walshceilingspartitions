import { createFileRoute, Link } from "@tanstack/react-router";
import { pageTitle } from "@/data/business";
import { workGroups } from "@/data/work";
import { seo } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Img } from "@/components/site/Img";
import { CtaBand, PageHeader } from "@/components/site/Widgets";

export const Route = createFileRoute("/our-work")({
  head: () => ({
    ...seo(
      pageTitle("Our Work"),
      "A selection of recent ceiling, partition and plastering work by Walsh Ceilings and Partitions. Lay-in grid, MF ceilings, plastering and tape and jointing — Hertfordshire-based, nationwide projects.",
      "/our-work",
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Our Work", path: "/our-work" }])),
      },
    ],
  }),
  component: OurWork,
});

function OurWork() {
  return (
    <>
      <PageHeader
        title="Our work"
        intro="A selection of recent ceiling, partition and plastering work across Hertfordshire and beyond."
      />
      <section className="bg-charcoal text-charcoal-foreground">
        <div className="container-site section-pad space-y-20">
          {workGroups.map((g) => (
            <div key={g.title}>
              <div className="flex items-baseline justify-between gap-4 border-b border-charcoal-foreground/15 pb-4">
                <h2 className="text-2xl md:text-[1.6rem]">{g.title}</h2>
                <Link
                  to="/services/$slug"
                  params={{ slug: g.serviceSlug }}
                  className="link-arrow shrink-0 text-charcoal-foreground/70"
                >
                  About this service <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((it) => (
                  <figure key={it.image}>
                    <Img
                      name={it.image}
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] w-full rounded-sm object-cover"
                    />
                    <figcaption className="mt-3 text-sm text-charcoal-foreground/55">
                      {it.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title="Got a project like this?" />
    </>
  );
}
