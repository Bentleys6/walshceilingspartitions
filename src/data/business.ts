export const business = {
  name: "Walsh Ceilings and Partitions",
  legalName: "Walsh Ceilings and Partitions Ltd",
  owner: "Daniel Walsh",
  tagline: "Ceilings, partitions and plastering",
  established: 2014,
  phoneDisplay: "07957 321647",
  phoneTel: "+447957321647",
  whatsapp: "https://wa.me/447957321647",
  email: "daniel.walsh75@gmail.com",
  address: {
    street: "202 Ware Road",
    town: "Hoddesdon",
    county: "Hertfordshire",
    postcode: "EN11 9EY",
  },
  baseTown: "Hoddesdon",
  areaSummary:
    "Based in Hoddesdon, we cover Hertfordshire and the surrounding area as standard, and take on projects further afield across the country where the job calls for it.",
  googleReviewLink: "https://g.page/r/CdjtKp4abVnVEAI/review",
  // Google Maps search for the address; used by the map embed and "Open in Maps" link.
  mapsQuery: "202 Ware Road, Hoddesdon EN11 9EY",
  // Social profiles; empty entries are hidden.
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
  responsePromise: "We'll get back to you with a quote.",
  // Live domain. Turns on canonical URLs, the share image and the website in structured data.
  siteUrl: "https://www.walshceilingspartitions.co.uk",
  metaPixelId: "",
  // From Cloudflare dashboard > Web Analytics > Add a site. Cookie-free, so no consent needed.
  cloudflareAnalyticsToken: "",
  // Web3Forms access keys (web3forms.com, free). client = Daniel's inbox, agency = optional copy.
  formKeys: { client: "", agency: "" },
};

export const pageTitle = (page: string) => `${page} — ${business.legalName}`;
