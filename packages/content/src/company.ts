/**
 * TPPS Landscapes — Company identity, positioning, and operational facts.
 * Single source of truth for all apps (email, website, etc.).
 */

export const company = {
  name: "TPPS Landscapes Ltd",
  shortName: "TPPS Landscapes",
  description: {
    short:
      "TPPS Landscapes Ltd is a premium landscaping and groundwork company serving Thanet and East Kent.",
    long: "TPPS Landscapes handles gardening and groundwork enquiries, providing patios, driveways, fencing, design, groundworks, tree removal, and garden maintenance. Based in Thanet with 10+ years' experience.",
  },
  contact: {
    email: "hello@tppslandscapes.co.uk",
    phone: "01227 000000",
    escalationEmail: "tim@tppslandscapes.co.uk",
    escalationName: "Tim Pryor",
  },
  location: {
    area: "Thanet and East Kent",
    /** Specific towns used in marketing copy and area coverage lists */
    towns: ["Broadstairs", "Ramsgate", "Margate"] as string[],
    locale: "UK",
  },
  credentials: {
    yearsExperience: 10,
    licensed: true,
    insured: true,
    vatRegistered: true,
    vatRate: 0.2,
  },
  audiences: ["homeowners", "property developers", "commercial sites"],
} as const;
