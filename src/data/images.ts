export type SiteImage = {
  src: string;
  alt: string;
  srcSet?: string | undefined;
  width: number;
  height: number;
};

/** Photo with an 800px and (when the original is big enough) a 1600px WebP version. */
const photo = (
  file: string,
  alt: string,
  orientation: "landscape" | "portrait",
  large = true,
): SiteImage => {
  const [width, height] = orientation === "landscape" ? [800, 600] : [600, 800];
  return {
    src: `/images/${file}-800.webp`,
    srcSet: large ? `/images/${file}-800.webp 800w, /images/${file}-1600.webp 1600w` : undefined,
    alt,
    width,
    height,
  };
};

export const images = {
  logoDark: {
    src: "/images/logo-dark.webp",
    alt: "Walsh Ceilings and Partitions",
    width: 640,
    height: 219,
  },
  logoWhite: {
    src: "/images/logo-white.webp",
    alt: "Walsh Ceilings and Partitions",
    width: 640,
    height: 219,
  },

  layInHospitalCorridor: photo(
    "01-lay-in-grid-hospital-corridor",
    "Lay-in grid suspended ceiling in a hospital corridor, with lift doors and double doors along the walls",
    "landscape",
  ),
  layInLiftLobby: photo(
    "02-lay-in-grid-lift-lobby",
    "Completed lay-in grid ceiling in a hospital corridor near the lift lobby",
    "landscape",
  ),
  layInCorridor: photo(
    "03-lay-in-grid-corridor",
    "Completed lay-in grid ceiling in a hospital corridor",
    "portrait",
  ),
  layInBeforeTiles: photo(
    "04-lay-in-grid-before-tiles",
    "Suspended ceiling grid installed ahead of tile fitting, with ductwork and cabling visible above",
    "portrait",
  ),
  mfTrayOpenPlan: photo(
    "05-mf-tray-ceiling-open-plan",
    "MF ceiling tray detail with recessed lighting positions in a large open-plan new build room",
    "landscape",
  ),
  mfTrayNewBuild: photo(
    "06-mf-tray-ceiling-new-build",
    "Large open-plan new build room with an MF ceiling tray detail",
    "portrait",
  ),
  mfFrameworkNewBuild: photo(
    "07-mf-ceiling-framework-new-build",
    "New build room with the MF ceiling framework in place",
    "portrait",
  ),
  mfRecessedVent: photo(
    "08-mf-ceiling-recessed-vent",
    "MF ceiling with a recessed vent detail",
    "portrait",
  ),
  mfGridDucting: photo(
    "09-mf-ceiling-grid-ducting",
    "MF ceiling grid framework with ducting above and boards being fixed on a commercial project",
    "portrait",
    false,
  ),
  mfFrameworkSite: photo(
    "10-mf-ceiling-framework-site",
    "MF ceiling framework with ducting and cabling above, ladders and site equipment below",
    "portrait",
    false,
  ),
  timberCorridorDoors: photo(
    "11-timber-stud-corridor-doors",
    "Timber stud partitions forming a boarded corridor with several door openings",
    "portrait",
  ),
  timberRoomDoor: photo(
    "12-timber-stud-room-door",
    "Boarded timber stud partition room with a door opening",
    "portrait",
  ),
  timberSkylightReveal: photo(
    "13-timber-stud-skylight-reveal",
    "Timber stud partition boarded around a skylight reveal",
    "portrait",
  ),
  timberCorridorDoor: photo(
    "14-timber-stud-corridor-door",
    "Boarded timber stud partition corridor with a door opening",
    "portrait",
  ),
  skimmedCeiling: photo(
    "15-skimmed-plaster-ceiling",
    "Skimmed plaster ceiling, smooth and ready for decoration",
    "landscape",
  ),
  boardedForJointing: photo(
    "16-plasterboard-ready-for-jointing",
    "Vaulted room with plasterboard walls and ceiling boarded and ready for tape and jointing",
    "portrait",
  ),

  // Not Walsh's own work: image from onlineinsulation-sales.com. Needs their permission before going live.
  metalStudPartition: {
    src: "/images/17-metal-stud-partition-800.webp",
    srcSet:
      "/images/17-metal-stud-partition-800.webp 800w, /images/17-metal-stud-partition-1600.webp 1360w",
    alt: "Metal stud partition frame next to a boarded wall, under a suspended ceiling grid",
    width: 800,
    height: 452,
  },

  // 1200x630 preview used when the site is shared on WhatsApp, Facebook, LinkedIn etc.
  share: {
    src: "/images/share.jpg",
    alt: "Lay-in grid ceiling in a hospital corridor, with the Walsh Ceilings and Partitions logo",
    width: 1200,
    height: 630,
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
