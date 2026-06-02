/**
 * TPPS Landscapes — Company identity, positioning, and operational facts.
 * Single source of truth for all apps (email, website, etc.).
 */

const formatList = (items: readonly string[]) =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export const company = {
  name: "TPPS Landscapes",
  shortName: "TPPS Landscapes",
  description: {
    short:
      "TPPS Landscapes is a local landscaping and groundworks company covering Thanet and East Kent.",
    long: "TPPS Landscapes helps homeowners and local properties with patios, driveways, fencing, garden landscaping, groundworks, drainage, and site clearance across Thanet and East Kent.",
  },
  contact: {
    email: "tim@tppslandscapes.com",
    phone: "07886 106 517",
    escalationEmail: "tim@tppslandscapes.com",
    escalationName: "Tim Pryor",
  },
  location: {
    area: "Thanet and East Kent",
    /** Specific towns used in marketing copy and area coverage lists */
    towns: [
      "Broadstairs",
      "Ramsgate",
      "Margate",
      "Westgate-on-Sea",
      "Birchington",
      "Faversham",
      "Sandwich",
      "Deal",
      "Canterbury",
      "Whitstable",
      "Herne Bay",
      "Dover",
      "Folkestone",
    ] as string[],
    /** Priority towns used in SEO copy so homepage and service pages stay aligned */
    featuredTowns: [
      "Ramsgate",
      "Margate",
      "Broadstairs",
      "Birchington",
      "Westgate-on-Sea",
      "Canterbury",
      "Sandwich",
      "Dover",
    ] as string[],
    featuredTownsLabel: formatList([
      "Ramsgate",
      "Margate",
      "Broadstairs",
      "Birchington",
      "Westgate-on-Sea",
      "Canterbury",
      "Sandwich",
      "Dover",
    ]),
    locale: "UK",
  },
  credentials: {
    yearsExperience: undefined as number | undefined,
    licensed: undefined as boolean | undefined,
    insured: undefined as boolean | undefined,
    vatRegistered: undefined as boolean | undefined,
    vatRate: 0.2,
  },
  audiences: ["homeowners", "property developers", "commercial sites"],
} as const;
