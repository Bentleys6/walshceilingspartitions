import type { ImageKey } from "./images";

export type SubService = {
  /** Anchor on the service page, e.g. /services/ceilings#mf-ceilings */
  id: string;
  name: string;
  /** Short line used on the homepage cards. */
  summary: string;
  body: string;
  involved: string[];
  image: ImageKey;
  /** Extra photos shown under the section. */
  gallery?: ImageKey[];
  /** Homepage "What we do" card image, when different from `image`. */
  cardImage?: ImageKey;
  /** Homepage card title and link text, when different from `name`. */
  cardTitle?: string;
  cardLink?: string;
};

export type Service = {
  slug: string;
  name: string;
  /** Page title (before " — Walsh Ceilings and Partitions Ltd"). */
  title: string;
  metaDescription: string;
  intro: string;
  /** Short line used on the Services page cards. */
  summary: string;
  quoteLabel: string;
  /** Photos on the Services page card, first one shown first. */
  cardImages: ImageKey[];
  /** Options for the quote form's type dropdown on this page; none = no dropdown. */
  formTypeLabel?: string;
  formTypes?: string[];
  subServices: SubService[];
  /** Answers to common questions, written only from facts stated elsewhere on the site. */
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "ceilings",
    name: "Ceilings",
    title: "Ceilings — MF & Lay-in Grid",
    metaDescription:
      "MF ceilings and lay-in grid ceilings across Hertfordshire and nationwide. Metal furring grids, tray details, recessed lighting layouts and suspended tile systems. Free quote from Walsh Ceilings and Partitions.",
    intro:
      "MF ceilings and lay-in grid ceilings, fitted across Hertfordshire and on projects nationwide.",
    summary:
      "MF and lay-in grid ceiling systems for new build, refurbishment and commercial projects.",
    quoteLabel: "Get a ceiling quote",
    cardImages: [
      "mfTrayOpenPlan",
      "mfGridDucting",
      "mfFrameworkSite",
      "mfFrameworkNewBuild",
      "mfRecessedVent",
      "layInLiftLobby",
    ],
    formTypeLabel: "Ceiling type",
    formTypes: ["MF Ceiling", "Lay-in Grid Ceiling"],
    subServices: [
      {
        id: "mf-ceilings",
        name: "MF Ceilings",
        cardLink: "View MF ceilings",
        summary:
          "Flat and feature ceilings using metal furring grids, ideal for tray details and recessed lighting.",
        body: "MF ceilings use a metal furring grid fixed back to the soffit, giving a flat or feature ceiling ready for boarding and plastering. We use this system for tray details, recessed lighting layouts, and large open-plan rooms where a dead-flat finish matters. Once the grid is set and boarded, we plaster to a smooth finish or hand over for decoration. We fit MF ceilings on new build, refurbishment and commercial projects.",
        involved: [
          "Setting out and fixing the metal furring grid to the soffit",
          "Boarding to the grid, including drops, trays and service voids",
          "Tape and jointing or full plaster skim to finish",
          "Cutting for recessed lighting, vents and access points",
        ],
        image: "mfTrayOpenPlan",
        gallery: ["mfGridDucting", "mfFrameworkSite", "mfFrameworkNewBuild", "mfRecessedVent"],
      },
      {
        id: "lay-in-grid-ceilings",
        name: "Lay-in Grid Ceilings",
        summary:
          "Suspended metal grid systems with removable tiles for easy service access in commercial spaces.",
        body: "Lay-in grid ceilings use a suspended metal grid with removable tiles, giving straightforward access to services above the ceiling line. This is the standard choice for corridors, offices and healthcare settings where cabling, ductwork and fire systems need to stay reachable. We install the grid, run it level and square, and fit tiles to match the space.",
        involved: [
          "Setting out and hanging the suspension grid",
          "Levelling and squaring the grid to the room",
          "Fitting ceiling tiles",
          "Allowing for access panels, lighting and services",
        ],
        image: "layInLiftLobby",
        cardImage: "layInHospitalCorridor",
      },
    ],
    faqs: [
      {
        q: "What's the difference between an MF ceiling and a lay-in grid ceiling?",
        a: "An MF ceiling is a metal furring grid fixed back to the soffit, boarded and then plastered or taped and jointed, giving a flat or feature ceiling. A lay-in grid ceiling is a suspended metal grid with removable tiles, so services above the ceiling stay easy to reach.",
      },
      {
        q: "Which ceiling is right for my project?",
        a: "Lay-in grid is the standard choice for corridors, offices and healthcare settings where cabling, ductwork and fire systems need to stay reachable. MF suits tray details, recessed lighting layouts and large open-plan rooms where a dead-flat finish matters.",
      },
      {
        q: "Do you finish the ceiling as well as fit it?",
        a: "Yes. Once an MF grid is set and boarded, we tape and joint or skim plaster it to a smooth finish, or hand over for decoration.",
      },
    ],
  },
  {
    slug: "partitions",
    name: "Partitions",
    title: "Partitions — Metal & Timber Stud",
    metaDescription:
      "Metal stud and timber stud partitions across Hertfordshire and nationwide. Fire and sound rated wall systems for commercial fit-outs, office divisions and residential projects. Free quote.",
    intro:
      "Metal stud and timber stud partitions, built across Hertfordshire and on projects nationwide.",
    summary:
      "Metal and timber stud partitions built to layout, ready for tape and jointing or plastering.",
    quoteLabel: "Get a partition quote",
    cardImages: [
      "timberCorridorDoors",
      "boardedForJointing",
      "timberRoomDoor",
      "timberSkylightReveal",
      "timberCorridorDoor",
    ],
    formTypeLabel: "Partition type",
    formTypes: ["Metal Stud", "Timber Stud"],
    subServices: [
      {
        id: "metal-stud-partitions",
        name: "Metal Stud Partitions",
        summary:
          "Straight, true wall lines with fire and sound ratings for commercial fit-outs and office divisions.",
        body: "Metal stud partitions give a straight, true wall line and work well where fire rating or sound resistance is specified. We build the stud frame to the layout, insulate where needed, and board ready for tape and jointing or plastering. This system suits commercial fit-outs, office divisions and larger residential projects.",
        involved: [
          "Setting out the partition line and fixing head and floor tracks",
          "Building the metal stud frame, including door openings",
          "Insulating for sound or fire performance where specified",
          "Boarding ready for finishing",
        ],
        // TODO: no photo of a metal stud frame yet (the old site used a stock photo we can't reuse).
        image: "boardedForJointing",
      },
      {
        id: "timber-stud-partitions",
        name: "Timber Stud Partitions",
        summary:
          "Practical timber-framed walls for residential work, loft conversions and smaller commercial jobs.",
        body: "Timber stud partitions are a practical choice for residential work, loft conversions and smaller commercial jobs where a metal system isn't needed. We frame the wall in timber, fix noggins for fixings and fittings, and board ready for finishing. This is often the quickest route to a new internal wall on domestic projects.",
        involved: [
          "Framing the timber stud wall to the agreed layout",
          "Fixing noggins for sockets, radiators or wall-mounted fittings",
          "Door and opening framing where required",
          "Boarding ready for tape and jointing or plastering",
        ],
        image: "timberCorridorDoors",
        gallery: ["timberRoomDoor", "timberSkylightReveal", "timberCorridorDoor"],
      },
    ],
    faqs: [
      {
        q: "Metal stud or timber stud — which do I need?",
        a: "Metal stud gives a straight, true wall line and works well where fire rating or sound resistance is specified, so it suits commercial fit-outs and office divisions. Timber stud is a practical choice for residential work, loft conversions and smaller commercial jobs where a metal system isn't needed.",
      },
      {
        q: "Can partitions be fire or sound rated?",
        a: "Yes. We insulate metal stud partitions for sound or fire performance where it's specified.",
      },
      {
        q: "Are new partitions ready to decorate?",
        a: "We board them ready for finishing, and can tape and joint or skim plaster them so they're ready for decoration.",
      },
    ],
  },
  {
    slug: "plastering",
    name: "Plastering",
    title: "Plastering",
    metaDescription:
      "Skim plastering for ceilings and walls across Hertfordshire and nationwide. Decoration-ready finishes over new plasterboard, stud partitions and MF ceiling installations. Free quote.",
    intro:
      "Skim plastering for ceilings and walls, across Hertfordshire and on projects nationwide.",
    summary:
      "Skim plastering to a smooth, decoration-ready finish on ceilings, walls and new stud partitions.",
    quoteLabel: "Get a plastering quote",
    cardImages: ["skimmedCeiling"],
    subServices: [
      {
        id: "skim-plastering",
        name: "Skim plastering",
        cardTitle: "Plastering",
        cardLink: "View plastering",
        summary:
          "Skim plastering to a smooth, decoration-ready finish on ceilings, walls and new stud partitions.",
        body: "We skim plaster ceilings and walls to a smooth, decoration-ready finish on new build, extension and refurbishment work. This includes finishing over MF and lay-in grid ceiling installations, stud partitions, and existing plasterboard. We work to a level finish around coving, window reveals and recessed ceiling details.",
        involved: [
          "Skim plastering ceilings and walls",
          "Finishing around coving, reveals and recessed detailing",
          "Working over new stud partitions and boarded ceilings",
          "Preparing surfaces ready for decoration",
        ],
        image: "skimmedCeiling",
      },
    ],
    faqs: [
      {
        q: "Skim plastering or tape and jointing?",
        a: "A skim coat covers the whole surface for a smooth, decoration-ready finish. Tape and jointing finishes just the plasterboard joints, so a wall or ceiling is flat and ready for decoration without a full skim — the standard finish on many commercial projects.",
      },
      {
        q: "What kind of work do you plaster?",
        a: "New build, extension and refurbishment work, including over MF and lay-in grid ceiling installations, stud partitions and existing plasterboard.",
      },
    ],
  },
  {
    slug: "tape-jointing",
    name: "Tape and Jointing",
    title: "Tape and Jointing",
    metaDescription:
      "Tape and jointing for plasterboard ceilings and walls across Hertfordshire and nationwide. Flat, decoration-ready joints without a full plaster skim. Free quote from Walsh Ceilings.",
    intro:
      "Flat, decoration-ready plasterboard joints, across Hertfordshire and on projects nationwide.",
    summary: "Flat, even plasterboard joints without a full skim — the standard commercial finish.",
    quoteLabel: "Get a tape and jointing quote",
    cardImages: ["boardedForJointing"],
    subServices: [
      {
        id: "tape-and-jointing",
        name: "Tape and jointing",
        cardTitle: "Tape and Jointing",
        summary:
          "Flat, even plasterboard joints without a full skim — the standard commercial finish for stud partitions.",
        body: "Tape and jointing finishes plasterboard joints so a wall or ceiling is flat and ready for decoration without a full plaster skim. We tape the joints, apply jointing compound in coats, and sand back for a clean, even surface. This is the standard finish for stud partitions and boarded ceilings on many commercial projects.",
        involved: [
          "Taping plasterboard joints",
          "Applying and building up jointing compound",
          "Sanding back to a flat, even finish",
          "Preparing the surface for decoration",
        ],
        image: "boardedForJointing",
        cardImage: "timberRoomDoor",
      },
    ],
    faqs: [
      {
        q: "What is tape and jointing?",
        a: "Tape and jointing finishes plasterboard joints so a wall or ceiling is flat and ready for decoration without a full plaster skim. We tape the joints, apply jointing compound in coats, and sand back for a clean, even surface.",
      },
      {
        q: "When is tape and jointing used instead of plastering?",
        a: "It's the standard finish for stud partitions and boarded ceilings on many commercial projects. If you want a full skim coat instead, see our plastering service.",
      },
    ],
  },
];

/** The six homepage "What we do" cards, in order. */
export const homeCards = services.flatMap((s) =>
  s.subServices.map((sub) => ({
    ...sub,
    slug: s.slug,
    title: sub.cardTitle ?? sub.name,
    linkLabel: sub.cardLink ?? `View ${sub.name.toLowerCase()}`,
  })),
);

export const serviceInterestOptions = [
  "MF Ceilings",
  "Lay-in Grid Ceilings",
  "Metal Stud Partitions",
  "Timber Stud Partitions",
  "Plastering",
  "Tape and Jointing",
  "Not sure",
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
