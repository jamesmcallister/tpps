/**
 * TPPS Landscapes — Services and quote guidance.
 * Public pricing should only be added once the owner confirms the ranges.
 */

export type PriceRange = {
  min: number;
  max: number;
  unit: string;
  notes?: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  live: boolean;
  pricing?: PriceRange | PriceRange[];
  tags?: string[];
};

export const services: Service[] = [
  {
    id: "patios-pathways",
    name: "Patios & Pathways",
    description:
      "Patio and pathway installation with proper ground preparation, drainage consideration, and a tidy finish.",
    live: true,
    tags: ["patios", "pathways", "porcelain", "stone", "block paving", "gravel"],
  },
  {
    id: "driveways",
    name: "Driveways",
    description:
      "Driveway preparation and installation for practical, hard-wearing entrances and parking areas.",
    live: true,
    tags: ["driveways", "block paving", "tarmac", "resin", "gravel"],
  },
  {
    id: "fencing",
    name: "Fencing",
    description:
      "Fence supply, replacement, and installation for garden boundaries, privacy, and security.",
    live: true,
    tags: ["fencing", "closeboard", "privacy", "panels"],
  },
  {
    id: "garden-design",
    name: "Landscaping & Garden Design",
    description:
      "Practical garden layouts, planting structure, levels, paths, patios, and hard landscaping plans.",
    live: true,
    tags: ["garden design", "planning", "landscaping", "layout"],
  },
  {
    id: "groundworks",
    name: "Groundworks & Drainage",
    description:
      "Excavation, levelling, sub-base preparation, drainage improvements, and site preparation.",
    live: true,
    tags: ["groundworks", "excavation", "levelling", "clearance"],
  },
  {
    id: "tree-removal",
    name: "Tree, Hedge & Stump Removal",
    description:
      "Practical clearance of overgrown areas, vegetation, small trees, and garden waste.",
    live: true,
    tags: ["tree removal", "stump", "hedge", "clearance"],
  },
  {
    id: "garden-maintenance",
    name: "Garden Renovation & Maintenance",
    description:
      "Garden tidy-ups, improvements, and renovation work to make outdoor spaces easier to use.",
    live: true,
    tags: ["maintenance", "renovation", "tidy"],
  },
];

export const pricingPolicy = {
  status: "unknown" as "known" | "unknown",
  notes: [
    "Project costs depend on access, materials, drainage, ground preparation, and waste removal.",
    "Written quotations confirm the agreed scope, preparation, materials, waste handling, and timescales.",
    "Any tax treatment or additional costs should be confirmed in the written quotation.",
  ],
  quoteProcess:
    "We start with a short enquiry, then confirm the details needed to prepare a clear written quotation.",
  surveyPolicy:
    "Free quotations are available. A site visit may be needed to confirm access, measurements, drainage, materials, and preparation.",
  quoteTimeline:
    "Written quotations are provided once the scope, materials, and site details are clear.",
};

export const futureServiceConsiderations: string[] = [];
