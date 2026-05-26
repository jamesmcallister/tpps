/**
 * TPPS Landscapes — Website copy.
 * All marketing text, hero options, service card copy, CTAs, and about sections.
 * Single source of truth for the website and any other channel that needs it.
 *
 * Derives location and company facts from company.ts — update there and this
 * copy will stay in sync automatically.
 */

import { company } from "./company";

// ---------------------------------------------------------------------------
// Areas
// ---------------------------------------------------------------------------

const primaryTowns = company.location.towns.slice(0, 3);
const formatList = (items: readonly string[]) =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
const thanetTownList = formatList(primaryTowns);

export const areasWeCover = {
  heading: "Working across Thanet and East Kent",
  primary: primaryTowns,
  all: company.location.towns,
  description: company.location.area,
  fullSentence: `Covering ${thanetTownList}, wider Thanet, and towns across East Kent.`,
  marketingDescription:
    "We're based in Thanet and take on garden, driveway and outdoor work across East Kent, from the main coastal towns to the smaller villages nearby.",
  additionalText: "",
};

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

export const hero = {
  eyebrow: "Local East Kent Landscaping",
  companyName: company.name,
  tagline: "Landscaping, patios, driveways and groundworks across Thanet and East Kent",

  /**
   * Three alternative hero intros — pick one per design/variant.
   * option1: friendly and local
   * option2: professional
   * option3: warm and human
   */
  options: {
    option1: {
      heading: "Trusted landscaping and groundworks across East Kent",
      body: `From patios and driveways to fencing, drainage and garden renovations, ${company.name} helps homeowners across Thanet and East Kent improve outdoor spaces with practical, careful workmanship.`,
      cta: "Request a free quote.",
    },
    option2: {
      heading: "Local landscaping specialists covering Thanet and East Kent",
      body: `${company.name} provides landscaping and groundwork services for homeowners across Thanet and nearby East Kent towns. We focus on careful preparation, practical advice and a finish that suits the property.`,
      cta: "Contact us to arrange a quote.",
    },
    option3: {
      heading: "Let's make more of your outdoor space",
      body: `Whether you want a new patio, a better driveway, improved drainage or a garden that is easier to use, ${company.name} offers friendly advice and practical landscaping support across Thanet and East Kent.`,
      cta: "Tell us about your project.",
    },
  },

  /** Default / currently used hero intro */
  intro: {
    heading: "Trusted landscaping and groundworks across East Kent",
    body: `${company.name} is a local landscaping and groundworks company with Thanet roots, covering homes and local properties across East Kent. We help with patios, driveways, fencing, drainage, garden renovations and site preparation, with clear advice before work starts and careful attention to the finish.`,
    cta: "Request a free quote.",
  },
};

// ---------------------------------------------------------------------------
// About section
// ---------------------------------------------------------------------------

export const about = {
  /** Short version for sidebar / card use */
  short: `${company.name} is a local landscaping and groundworks company based in Thanet and covering East Kent. We help homeowners improve outdoor spaces with patios, driveways, fencing, drainage, garden landscaping and site clearance. Our approach is simple: understand the job, give clear advice and leave the property tidy.`,

  /** Full version for an about/story section */
  full: "Outdoor work needs to be practical as well as good to look at. TPPS Landscapes works with homeowners across Thanet and East Kent on patios, driveways, fencing, garden layouts, drainage and ground preparation. From smaller improvements to full garden renovations, we keep the advice straightforward and the scope clear. We take the time to understand how you want to use the space, what access and drainage are like, and which finish will suit the property. The aim is a clear quote, sensible preparation and a tidy handover.",

  closing: "Tell us what needs improving and we will talk through the most practical next step.",
} as const;

// ---------------------------------------------------------------------------
// Service card copy (keyed by service ID from services.ts)
// ---------------------------------------------------------------------------

import { services } from "./services";

export const serviceCardCopy: Record<string, { heading: string; short: string; full: string }> = {
  "patios-pathways": {
    heading:
      services.find((s) => s.id === "patios-pathways")?.name ?? "Patio & Pathway Installation",
    short:
      "Patios and paths installed with proper preparation, sensible drainage and a clean finish.",
    full: "A patio or pathway should sit well with the garden and cope with everyday use. We prepare the ground properly before laying slabs, paving, brick or stone, and we talk through drainage, access and maintenance before work begins.",
  },
  driveways: {
    heading: services.find((s) => s.id === "driveways")?.name ?? "Driveways",
    short:
      "Driveway preparation and installation for practical entrances, parking areas and kerb appeal.",
    full: "A driveway needs the right preparation underneath the final surface. We can help with excavation, levels, sub-base preparation and a finish that suits the property, from gravel and block paving to other suitable driveway options.",
  },
  fencing: {
    heading: services.find((s) => s.id === "fencing")?.name ?? "Fence Installation",
    short: "Fence replacement and installation for privacy, boundaries and a neater garden edge.",
    full: "Good fencing gives a garden structure, privacy and a clearer boundary. We can replace old panels, improve a boundary line or install fencing as part of a wider garden project, with materials discussed before quoting.",
  },
  "garden-design": {
    heading: services.find((s) => s.id === "garden-design")?.name ?? "Landscaping & Garden Design",
    short:
      "Practical garden layouts, planting structure and landscaping plans shaped around how you use the space.",
    full: "Garden design starts with how the space needs to work. We can help plan seating areas, pathways, levels, planting structure and hard landscaping so the finished garden feels practical, settled and manageable.",
  },
  groundworks: {
    heading: services.find((s) => s.id === "groundworks")?.name ?? "Groundworks & Drainage",
    short:
      "Excavation, levelling, drainage and sub-base preparation for outdoor projects that need a solid start.",
    full: "Good groundwork is what helps patios, driveways and garden changes last. We can help with excavation, levelling, drainage, sub-base preparation and site preparation so the visible finish has the right support underneath.",
  },
  "tree-removal": {
    heading: services.find((s) => s.id === "tree-removal")?.name ?? "Tree & Site Clearance",
    short:
      "Clearance of overgrown areas, vegetation, small trees and waste before new landscaping work.",
    full: "If a garden or site needs clearing before work can begin, we can help remove vegetation, small trees and waste so the space is ready for its next use. For specialist tree work, we will discuss what is suitable before quoting.",
  },
  "garden-maintenance": {
    heading: services.find((s) => s.id === "garden-maintenance")?.name ?? "Garden Makeovers",
    short:
      "Garden tidy-ups, renovation work and practical improvements for spaces that need a fresh start.",
    full: "Some gardens need a full redesign, while others need a careful tidy-up and a few practical changes. We can help with renovation work, planting areas, lawn preparation, clearance and improvements that make the space easier to use.",
  },
};

// ---------------------------------------------------------------------------
// Calls to action
// ---------------------------------------------------------------------------

export const ctas = {
  primary: "Request a free landscaping quote",
  secondary: `Ready to improve your outdoor space? Get in touch with ${company.shortName}.`,
  planning: "Planning a new patio, driveway or garden project? Let's talk.",
  areas: "Quotations available across Thanet and East Kent.",
  open: "Tell us what needs improving, and we will talk through the next step.",
};

// ---------------------------------------------------------------------------
// Trust points (short reassurance items for header / hero strip)
// ---------------------------------------------------------------------------

export const trustPoints = [
  "Free quotations",
  "Thanet-based local team",
  "Clear written estimates",
  "Practical advice before work starts",
] as string[];

// ---------------------------------------------------------------------------
// Services section
// ---------------------------------------------------------------------------

export const servicesCopy = {
  heading: "Our Services",
  subtitle:
    "Landscaping, groundwork and garden improvements for homes across Thanet and East Kent.",
  additionalServicesLabel: "Also offering:",
  additionalServicesLink: "Contact us for details",
};

// ---------------------------------------------------------------------------
// Why Choose Us section
// ---------------------------------------------------------------------------

export const whyChoose = {
  heading: `Why Choose ${company.shortName}`,
  subtitle: `A straightforward local team for outdoor work across ${company.location.area}.`,
  points: [
    "Local Thanet roots",
    "East Kent coverage",
    ...trustPoints,
    "Careful ground preparation",
    "Respectful site tidy-up",
  ],
  featuredProject: {
    badge: "Project Approach",
    title: "Outdoor work shaped around the property",
    description:
      "We look at access, drainage, levels, materials and how you want to use the space before recommending the right route.",
  },
};

// ---------------------------------------------------------------------------
// CTA Banner
// ---------------------------------------------------------------------------

export const ctaBanner = {
  subtitle:
    "Tell us about your patio, driveway, fencing, drainage or garden project and we will come back with practical next steps.",
};
