import type { ImageKey } from "./images";

export type WorkGroup = {
  title: string;
  serviceSlug: string;
  items: { image: ImageKey; caption: string }[];
};

/** Our Work page galleries. The first three are also used as "Recent work" on the homepage. */
export const workGroups: WorkGroup[] = [
  {
    title: "Lay-in Grid Ceilings",
    serviceSlug: "ceilings",
    items: [
      { image: "layInHospitalCorridor", caption: "Hospital corridor — lay-in grid ceiling" },
      {
        image: "layInBeforeTiles",
        caption: "Grid stage — ductwork and cabling visible before tiles go in",
      },
      { image: "layInLiftLobby", caption: "Hospital corridor — lay-in grid ceiling" },
      { image: "layInCorridor", caption: "Completed lay-in grid ceiling" },
    ],
  },
  {
    title: "MF Ceilings",
    serviceSlug: "ceilings",
    items: [
      { image: "mfTrayOpenPlan", caption: "New build — MF tray ceiling and plaster finish" },
      { image: "mfTrayNewBuild", caption: "Large open-plan room — MF ceiling with tray detail" },
      { image: "mfFrameworkNewBuild", caption: "New build — MF ceiling framework" },
      { image: "mfRecessedVent", caption: "MF ceiling with recessed vent detail" },
      {
        image: "mfGridDucting",
        caption: "MF ceiling grid framework with ducting above, boards being fixed",
      },
      {
        image: "mfFrameworkSite",
        caption: "MF ceiling framework with ducting and cabling, ladders and site equipment",
      },
    ],
  },
  {
    title: "Timber Stud Partitions",
    serviceSlug: "partitions",
    items: [
      {
        image: "timberCorridorDoors",
        caption: "Timber stud partition corridor, boarded with multiple door openings",
      },
      { image: "timberRoomDoor", caption: "Timber stud partition room, boarded with door opening" },
      {
        image: "timberSkylightReveal",
        caption: "Timber stud partition detail around a skylight reveal",
      },
      {
        image: "timberCorridorDoor",
        caption: "Timber stud partition corridor, boarded with door opening",
      },
    ],
  },
  {
    title: "Plastering",
    serviceSlug: "plastering",
    items: [{ image: "skimmedCeiling", caption: "Skimmed plaster ceiling — ready for decoration" }],
  },
  {
    title: "Tape and Jointing",
    serviceSlug: "tape-jointing",
    items: [
      {
        image: "boardedForJointing",
        caption: "Plasterboard boarded and ready for tape and jointing",
      },
    ],
  },
];

export const recentWork: { image: ImageKey; caption: string }[] = [
  { image: "layInHospitalCorridor", caption: "Hospital corridor — lay-in grid ceiling" },
  { image: "mfTrayOpenPlan", caption: "New build — MF tray ceiling and plaster finish" },
  {
    image: "layInBeforeTiles",
    caption: "Grid stage — ductwork and cabling visible before tiles go in",
  },
  { image: "boardedForJointing", caption: "Plasterboard boarded and ready for tape and jointing" },
];
