import { createFileRoute, Link } from "@tanstack/react-router";
import { pageTitle } from "@/data/business";
import { services } from "@/data/services";
import { seo } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { ImageCarousel, PageHeader } from "@/components/site/Widgets";

export const Route = createFileRoute("/services/")({
  head: () => ({
    ...seo(
      pageTitle("Services"),
      "Ceilings, partitions, plastering and tape and jointing services. MF ceilings, lay-in grid ceilings, metal and timber stud partitions. Based in Hoddesdon, Hertfordshire — projects nationwide.",
      "/services",
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Services", path: "/services" }])),
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHeader
        title="Services"
        intro="Ceilings, partitions, plastering and tape and jointing — across Hertfordshire and on projects nationwide."
      />
      <section className="bg-offwhite">
        <div className="container-site grid gap-x-6 gap-y-14 pb-24 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <article key={s.slug} className="flex flex-col">
              <h2 className="text-2xl md:text-[1.7rem]">
                <Link to="/services/$slug" params={{ slug: s.slug }}>
                  {s.name}
                </Link>
              </h2>
              <ImageCarousel
                images={s.cardImages}
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                className="mt-5 overflow-hidden rounded-sm"
              />
              <p className="mt-6 flex-1 text-[0.95rem] text-muted-foreground">{s.summary}</p>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="btn btn-primary mt-6 h-12 px-4 text-[0.9rem]"
              >
                {s.quoteLabel} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
