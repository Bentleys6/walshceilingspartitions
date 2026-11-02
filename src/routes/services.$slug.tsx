import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageTitle } from "@/data/business";
import { getService } from "@/data/services";
import { seo } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Img } from "@/components/site/Img";
import { QuoteForm } from "@/components/site/QuoteForm";
import { FaqList, PageHeader } from "@/components/site/Widgets";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ params }) => {
    const s = getService(params.slug);
    if (!s) return {};
    return {
      ...seo(pageTitle(s.title), s.metaDescription, `/services/${s.slug}`),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Services", path: "/services" },
              { name: s.name, path: `/services/${s.slug}` },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(faqSchema(s.faqs)) },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const s = getService(slug)!;

  return (
    <>
      <PageHeader title={s.name} intro={s.intro} />

      {s.subServices.map((sub, i) => {
        const dark = i % 2 === 1;
        return (
          <section
            key={sub.id}
            id={sub.id}
            className={dark ? "bg-charcoal text-charcoal-foreground" : "bg-offwhite"}
          >
            <div className={`container-site ${i === 0 ? "pb-20 md:pb-28" : "section-pad"}`}>
              <div
                className={`grid items-start gap-10 md:gap-12 ${sub.image ? "md:grid-cols-2" : "max-w-3xl"}`}
              >
                {sub.image && (
                  <div className={dark ? "md:order-2" : ""}>
                    <Img
                      name={sub.image}
                      eager={i === 0}
                      sizes="(min-width: 768px) 580px, 100vw"
                      className="aspect-[16/9] w-full rounded-sm object-cover"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl md:text-[1.75rem]">{sub.name}</h2>
                  <p
                    className={`mt-5 text-[1.05rem] leading-relaxed ${dark ? "text-charcoal-foreground/75" : "text-muted-foreground"}`}
                  >
                    {sub.body}
                  </p>
                  <h3 className="mt-7 font-sans text-[0.95rem] font-semibold tracking-normal">
                    What's involved
                  </h3>
                  <ul
                    className={`mt-3 space-y-1.5 text-[0.95rem] ${dark ? "text-charcoal-foreground/65" : "text-muted-foreground"}`}
                  >
                    {sub.involved.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {sub.gallery && (
                <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                  {sub.gallery.map((g) => (
                    <Img
                      key={g}
                      name={g}
                      sizes="(min-width: 768px) 280px, 50vw"
                      className="aspect-[4/3] w-full rounded-sm object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section
        className={
          s.subServices.length % 2 === 1 ? "bg-charcoal text-charcoal-foreground" : "bg-offwhite"
        }
      >
        <div className="container-site section-pad grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <h2 className="text-3xl md:text-[2.2rem]">{s.name} questions</h2>
          <FaqList faqs={s.faqs} dark={s.subServices.length % 2 === 1} />
        </div>
      </section>

      <section className="border-t border-charcoal-foreground/10 bg-charcoal">
        <div className="container-site section-pad">
          <div className="mx-auto max-w-xl">
            <QuoteForm
              name={`${s.name} page`}
              context={`/services/${s.slug}`}
              title={s.quoteLabel}
              submitLabel="Request a survey"
              variant="dark"
              selectLabel={s.formTypeLabel}
              selectOptions={s.formTypes ?? []}
            />
          </div>
        </div>
      </section>
    </>
  );
}
