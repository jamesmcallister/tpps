/**
 * TPPS Landscapes — Services and pricing guide.
 * All prices are rough estimates. Accurate quotes require a free site survey.
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
      "Professional installation of porcelain, natural stone (Indian Sandstone), block paving, and gravel patios and pathways.",
    live: true,
    pricing: [
      { min: 45, max: 65, unit: "per m²", notes: "Porcelain / Natural Stone" },
      { min: 35, max: 50, unit: "per m²", notes: "Indian Sandstone" },
      { min: 30, max: 45, unit: "per m²", notes: "Block Paving" },
      { min: 15, max: 25, unit: "per m²", notes: "Gravel Pathways" },
    ],
    tags: ["patios", "pathways", "porcelain", "stone", "block paving", "gravel"],
  },
  {
    id: "driveways",
    name: "Driveway Installation",
    description:
      "Driveway installation using resin-bound, tarmac, block paving, or gravel finishes.",
    live: true,
    pricing: [
      { min: 40, max: 60, unit: "per m²", notes: "Block Paving" },
      { min: 25, max: 40, unit: "per m²", notes: "Tarmac" },
      { min: 50, max: 75, unit: "per m²", notes: "Resin-Bound" },
      { min: 12, max: 20, unit: "per m²", notes: "Gravel" },
    ],
    tags: ["driveways", "block paving", "tarmac", "resin", "gravel"],
  },
  {
    id: "fencing",
    name: "Fencing",
    description: "Supply and installation of closeboard, ranch-style, and privacy fencing.",
    live: true,
    pricing: [
      { min: 80, max: 120, unit: "per linear meter", notes: "Closeboard panels" },
      { min: 60, max: 90, unit: "per linear meter", notes: "Ranch-style" },
      { min: 100, max: 150, unit: "per linear meter", notes: "Privacy fence upgrades" },
    ],
    tags: ["fencing", "closeboard", "privacy", "panels"],
  },
  {
    id: "garden-design",
    name: "Garden Design & Planning",
    description: "Consultations, concept sketches, and full 3D garden design packages.",
    live: true,
    pricing: [
      { min: 150, max: 300, unit: "fixed", notes: "Consultation & basic sketch" },
      { min: 500, max: 1200, unit: "fixed", notes: "Full design package" },
    ],
    tags: ["garden design", "planning", "consultation", "3D"],
  },
  {
    id: "groundworks",
    name: "Groundworks",
    description: "Excavation, levelling, sub-base preparation, and site clearance.",
    live: true,
    pricing: [
      {
        min: 800,
        max: 1500,
        unit: "project",
        notes: "Small-mid excavation / clearance",
      },
      { min: 30, max: 50, unit: "per m²", notes: "Levelling" },
    ],
    tags: ["groundworks", "excavation", "levelling", "clearance"],
  },
  {
    id: "tree-removal",
    name: "Tree Removal & Site Clearance",
    description: "Safe removal of trees and vegetation, including stump grinding.",
    live: true,
    pricing: [
      { min: 200, max: 600, unit: "per tree", notes: "Single tree removal" },
      { min: 100, max: 300, unit: "per stump", notes: "Stump grinding" },
    ],
    tags: ["tree removal", "stump", "clearance"],
  },
  {
    id: "garden-maintenance",
    name: "Garden Renovation & Maintenance",
    description: "Ongoing maintenance, seasonal tidy-ups, and full garden renovation projects.",
    live: true,
    tags: ["maintenance", "renovation", "tidy"],
  },
];

export const pricingPolicy = {
  status: "estimates_available" as const,
  notes: [
    "Prices are rough estimates and vary based on accessibility, materials, and ground prep.",
    "All quotes include professional site survey, written estimate, site prep, waste removal, and 20% VAT.",
    "Typical residential projects range £2,000-£8,000.",
  ],
  quoteProcess:
    "We provide rough estimates over email based on our pricing guide. For accurate quotes, we schedule a free site survey.",
  surveyPolicy: "Free site surveys are provided to confirm exact requirements.",
  quoteTimeline: "Detailed written quotations are provided within 2 working days after a survey.",
};

export const roadmapServices = [
  "Complex multi-trade full garden overhauls",
  "Larger commercial groundworks",
  "Ongoing seasonal maintenance plans",
];
