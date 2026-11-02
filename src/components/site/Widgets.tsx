import { Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import type { ImageKey } from "@/data/images";
import { Img } from "./Img";
import { ChevronIcon } from "./Icons";

/** Light page intro used at the top of every inner page. */
export function PageHeader({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-offwhite">
      <div className="container-site pb-16 pt-16 md:pb-28 md:pt-28">
        <h1 className="max-w-4xl text-[2.6rem] leading-[1.05] md:text-6xl">{title}</h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{intro}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/** Charcoal call-to-action band. */
export function CtaBand({
  title,
  intro,
  label = "Start your project",
}: {
  title: string;
  intro?: string;
  label?: string;
}) {
  return (
    <section className="border-t border-charcoal-foreground/10 bg-charcoal text-charcoal-foreground">
      <div className="container-site section-pad text-center">
        <h2 className="text-3xl md:text-[2.75rem]">{title}</h2>
        {intro && (
          <p className="mx-auto mt-5 max-w-xl text-lg text-charcoal-foreground/60">{intro}</p>
        )}
        <Link to="/contact" hash="quote" className="btn btn-light mt-9 h-12 px-8">
          {label}
        </Link>
      </div>
    </section>
  );
}

/** Questions and answers using native <details>, so they work without JavaScript. */
export function FaqList({ faqs, dark }: { faqs: { q: string; a: string }[]; dark?: boolean }) {
  return (
    <div
      className={`divide-y border-y ${dark ? "divide-charcoal-foreground/15 border-charcoal-foreground/15" : "divide-border border-border"}`}
    >
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-heading text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronIcon
              dir="down"
              className="mt-1 h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
            />
          </summary>
          <p
            className={`mt-3 max-w-3xl ${dark ? "text-charcoal-foreground/70" : "text-muted-foreground"}`}
          >
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}

/** Swipeable photo carousel with arrows and dots (CSS scroll-snap, no library). */
export function ImageCarousel({
  images,
  className = "",
  sizes,
}: {
  images: ImageKey[];
  className?: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  if (images.length === 1)
    return (
      <Img
        name={images[0]!}
        sizes={sizes}
        className={`aspect-[4/3] w-full object-cover ${className}`}
      />
    );

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const n = (i + images.length) % images.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };
  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        className="snap-carousel aspect-[4/3]"
        onScroll={(e) =>
          setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
        }
      >
        {images.map((name, i) => (
          <Img
            key={`${name}-${i}`}
            name={name}
            sizes={sizes}
            className="h-full w-full object-cover"
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal/75 text-white hover:bg-charcoal"
      >
        <ChevronIcon dir="left" className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal/75 text-white hover:bg-charcoal"
      >
        <ChevronIcon className="h-4 w-4" />
      </button>
      <div className="absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
        {images.map((name, i) => (
          <button
            key={`${name}-dot-${i}`}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            onClick={() => go(i)}
            className={`h-1.5 w-1.5 rounded-full transition ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
