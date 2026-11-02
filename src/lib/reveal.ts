/**
 * Scroll reveal: content below the first screen fades up into place as it scrolls into view.
 * Targets each section's content automatically (the first section of a page is left alone),
 * and staggers the cards of a grid. Elements are only hidden once this has run, so with no JS,
 * or with prefers-reduced-motion, everything is simply visible.
 */
const STAGGER_MS = 90;
const MAX_STAGGER = 5;

function targets(): HTMLElement[] {
  const out: HTMLElement[] = [];
  const sections = [...document.querySelectorAll<HTMLElement>("main > section")].slice(1);
  for (const section of sections) {
    if (section.closest("[data-no-reveal]")) continue;
    const container = section.querySelector<HTMLElement>(".container-site") ?? section;
    for (const child of [...container.children] as HTMLElement[]) {
      if (child.matches("[data-no-reveal]")) continue;
      // Reveal the cards of a grid one by one; anything containing a form moves as one block.
      const isGrid =
        /\bgrid\b/.test(child.className) &&
        child.children.length > 1 &&
        !child.querySelector("form");
      if (isGrid) out.push(...([...child.children] as HTMLElement[]));
      else out.push(child);
    }
  }
  return out;
}

function settle(el: HTMLElement) {
  el.classList.remove("reveal", "revealed");
  el.style.removeProperty("--reveal-delay");
}

export function setupScrollReveal(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  // Only hide what is below the fold, so nothing on screen ever disappears.
  const hidden = targets().filter(
    (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92,
  );
  hidden.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      entering.forEach((el, i) => {
        io.unobserve(el);
        el.style.setProperty("--reveal-delay", `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`);
        el.classList.add("revealed");
        // Hand the element back to its own transitions (hover effects) once it has arrived.
        const done = (e: TransitionEvent) => {
          if (e.target !== el || e.propertyName !== "transform") return;
          el.removeEventListener("transitionend", done);
          settle(el);
        };
        el.addEventListener("transitionend", done);
        window.setTimeout(() => settle(el), 2000);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  hidden.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    hidden.forEach(settle);
  };
}
