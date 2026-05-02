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
    long:
      "TPPS Landscapes handles gardening and groundwork enquiries, providing patios, driveways, fencing, design, groundworks, tree removal, and garden maintenance. Based in Thanet with 10+ years' experience.",
  },
  contact: {
    email: "hello@tppslandscapes.co.uk",
    phone: "01227 000000",
    escalationEmail: "tim@tppslandscapes.co.uk",
    escalationName: "Tim Pryor",
  },
  location: {
    area: "Thanet and East Kent",
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
  positioning: {
    coreProblems: [
      "Customers need reliable, clear pricing and reliable landscapers in East Kent.",
      "Gardens and driveways need professional, insured groundwork.",
    ],
    coreValues: [
      "Free site surveys",
      "Detailed written quotes within 2 working days",
      "Quality materials and finish guaranteed",
      "Fully licensed and insured",
    ],
  },
} as const;
