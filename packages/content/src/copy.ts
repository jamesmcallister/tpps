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
const townListWithAnd =
  primaryTowns.slice(0, -1).join(", ") +
  " and " +
  primaryTowns[primaryTowns.length - 1];

export const areasWeCover = {
  heading: `Proudly Serving ${company.location.area}`,
  primary: primaryTowns,
  all: company.location.towns,
  description: company.location.area,
  fullSentence: `Covering ${townListWithAnd} and the surrounding areas.`,
  marketingDescription: `Covering ${townListWithAnd} and the surrounding areas. If you're looking for a reliable local team for patios, driveways, fencing, or garden transformations, ${company.shortName} is here to help.`,
  additionalText: "Other nearby areas on request",
};

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

export const hero = {
  eyebrow: "Thanet's Local Landscaping Company",
  companyName: company.name,
  tagline: "Landscaping, patios, driveways and groundworks across Thanet",

  /**
   * Three alternative hero intros — pick one per design/variant.
   * option1: friendly and local
   * option2: professional
   * option3: warm and human
   */
  options: {
    option1: {
      heading: "Thanet's trusted local landscaping team",
      body: `From patios and driveways to fencing, groundworks and complete garden makeovers, ${company.name} helps homeowners across ${townListWithAnd} and surrounding areas create outdoor spaces they can enjoy all year round.`,
      cta: "Get in touch today for a free quote and site visit.",
    },
    option2: {
      heading: "Landscaping, driveways and groundworks across Thanet",
      body: `${company.name} provides reliable landscaping and groundwork services for homeowners across ${townListWithAnd} and nearby areas. We combine careful preparation, quality materials and skilled workmanship to deliver outdoor spaces that are practical, attractive and built to last.`,
      cta: "Contact us today to arrange your free quotation.",
    },
    option3: {
      heading: "Let's make more of your outdoor space",
      body: `Whether you want a new patio for summer evenings, a driveway that looks smart and lasts, or a complete garden transformation, ${company.name} is here to help. We are a local Thanet team offering friendly advice, reliable workmanship and high-quality landscaping services across ${townListWithAnd} and the surrounding areas.`,
      cta: "Book your free quote today.",
    },
  },

  /** Default / currently used hero intro */
  intro: {
    heading: "Thanet's trusted local landscaping team",
    body: `${company.name} is a local landscaping and groundworks company covering ${townListWithAnd} and the surrounding areas. Whether you are planning a new patio, driveway, garden redesign or outdoor renovation, our experienced team is here to help from start to finish. We take care of the groundwork, preparation and finishing touches, making sure every job is completed properly, safely and with care.`,
    cta: "Call today for a free quote and site visit.",
  },
};

// ---------------------------------------------------------------------------
// About section
// ---------------------------------------------------------------------------

export const about = {
  /** Short version for sidebar / card use */
  short: `${company.name} is a local landscaping and groundworks company based in Thanet. We help homeowners improve their outdoor spaces with patios, driveways, fencing, garden design, groundwork and tree removal services. Our approach is simple: listen carefully, offer honest advice and complete every job to a high standard.`,

  /** Full version for an about/story section */
  full: "Your outdoor space should feel like a natural extension of your home — somewhere practical, attractive and enjoyable to spend time in. At TPPS, we work with homeowners across Thanet to create gardens, patios, driveways and outdoor spaces that look great and are built to last. From small improvements to full garden transformations, we offer honest advice, reliable workmanship and a friendly service throughout. We take the time to understand what you want from your space, whether that is a low-maintenance garden, a smart new driveway, a private seating area or a complete outdoor makeover. Our team can help with ideas, planning, preparation and installation, using quality materials and proven methods to achieve a long-lasting finish. We are fully insured and treat every property with respect. From the first visit to the final tidy-up, our aim is to make the process simple, straightforward and stress-free.",

  closing:
    "Let TPPS help you create an outdoor space that adds comfort, style and value to your home.",
} as const;

// ---------------------------------------------------------------------------
// Service card copy (keyed by service ID from services.ts)
// ---------------------------------------------------------------------------

import { services } from "./services";

export const serviceCardCopy: Record<string, { heading: string; short: string; full: string }> = {
  "patios-pathways": {
    heading: services.find(s => s.id === "patios-pathways")?.name ?? "Patio & Pathway Installation",
    short:
      "Create the perfect place to relax, dine or entertain outdoors. We install patios using quality materials and proper ground preparation for a strong, attractive finish.",
    full: "Create a space to relax, entertain or enjoy the garden with a professionally installed patio or pathway. We prepare the ground properly before laying slabs, paving, bricks or stone, helping to ensure a clean finish that is durable and built to last. Whether you want a small seating area or a full garden pathway, we can create a design that fits naturally with your outdoor space.",
  },
  driveways: {
    heading: services.find(s => s.id === "driveways")?.name ?? "Driveway Construction",
    short:
      "Improve your home's entrance with a practical and long-lasting driveway. We can help with block paving, gravel, tarmac and resin-bound options.",
    full: "A new driveway can improve the look of your home while giving you a strong, reliable surface for everyday use. Our team can handle the full process, including excavation, ground preparation, sub-base installation and the finished surface. We work with a range of driveway options, including block paving, gravel, tarmac and resin-bound surfaces.",
  },
  fencing: {
    heading: services.find(s => s.id === "fencing")?.name ?? "Fence Installation",
    short:
      "Add privacy, security and structure to your garden with professionally installed fencing tailored to your property.",
    full: "Good fencing can add privacy, security and a smart finish to your garden. We install a range of fencing styles and materials to suit different homes, gardens and budgets. Whether you need to replace old panels, secure a boundary or improve the look of your outdoor space, we can recommend the right option for you.",
  },
  "garden-design": {
    heading: services.find(s => s.id === "garden-design")?.name ?? "Garden Design & Planning",
    short:
      "A well-designed garden can completely change the way you use your outdoor space. We help you plan a garden that suits your home, your lifestyle and the amount of maintenance you want.",
    full: "A well-designed garden can completely change the way you use your outdoor space. We help you plan a garden that suits your home, your lifestyle and the amount of maintenance you want. Whether you prefer a modern, clean design or something more traditional and natural, we can help bring your ideas together and create a practical plan for your garden.",
  },
  groundworks: {
    heading: services.find(s => s.id === "groundworks")?.name ?? "Gardens & Groundworks",
    short:
      "Good groundwork is the foundation of every successful outdoor project. We prepare sites properly to support patios, driveways, landscaping and garden renovations.",
    full: "From regular garden improvements to full groundwork preparation, we help create outdoor spaces that are both attractive and practical. Our services can include lawn preparation, planting areas, levelling, drainage, foundations, garden clearance and full outdoor renovations. Whether you need a fresh start or ongoing improvements, TPPS can help get the job done properly.",
  },
  "tree-removal": {
    heading: services.find(s => s.id === "tree-removal")?.name ?? "Tree Removal",
    short:
      "Safe and efficient tree removal with minimal disruption to your garden and surrounding areas.",
    full: "If you have a tree that is unsafe, overgrown or in the way of a new project, our team can help remove it safely and efficiently. We take care to minimise disruption to your garden and surrounding areas, leaving the space clear and ready for its next use.",
  },
  "garden-maintenance": {
    heading: services.find(s => s.id === "garden-maintenance")?.name ?? "Garden Makeovers",
    short:
      "Whether your garden needs a simple refresh or a complete redesign, we can help turn it into a space that works for you.",
    full: "A beautiful and well-maintained garden can transform your outdoor space into a peaceful retreat, boost kerb appeal, and provide a relaxing environment for you and your family. Our gardening service is designed to help you create and maintain the perfect garden, whether you are looking for regular upkeep, seasonal planting, or a complete garden redesign.",
  },
};

// ---------------------------------------------------------------------------
// Calls to action
// ---------------------------------------------------------------------------

export const ctas = {
  primary: "Call today for a free quote and site visit",
  secondary: `Ready to improve your outdoor space? Get in touch with ${company.shortName} today.`,
  planning: "Planning a new patio, driveway or garden project? Let's talk.",
  areas: `Free quotations available across ${townListWithAnd} and surrounding areas.`,
  open: "Tell us what you have in mind, and we'll help bring it to life.",
};

// ---------------------------------------------------------------------------
// Trust points (short reassurance items for header / hero strip)
// ---------------------------------------------------------------------------

export const trustPoints = [
  "Free quotations and site surveys",
  ...(company.credentials.licensed && company.credentials.insured ? ["Fully licensed and insured"] : []),
  "Local and reliable",
  "Quality workmanship guaranteed",
] as string[];

// ---------------------------------------------------------------------------
// Services section
// ---------------------------------------------------------------------------

export const servicesCopy = {
  heading: "Our Services",
  subtitle: "Comprehensive landscaping and groundwork solutions built to the highest standards.",
  additionalServicesLabel: "Also offering:",
  additionalServicesLink: "Contact us for details",
};

// ---------------------------------------------------------------------------
// Why Choose Us section
// ---------------------------------------------------------------------------

export const whyChoose = {
  heading: `Why Choose ${company.shortName}`,
  subtitle: `We take pride in every detail. Here's why homeowners across ${company.location.area} trust us with their properties.`,
  points: [
    `Local ${company.location.area} company`,
    ...trustPoints,
    "Skilled and experienced team",
    "Quality materials",
    "Attention to detail",
    "Built to last",
  ],
  featuredProject: {
    badge: "Featured Project",
    title: "Outdoor Spaces Built to Last",
    description: "See how we transform ordinary gardens into stunning, practical spaces designed for modern living.",
  },
};

// ---------------------------------------------------------------------------
// CTA Banner
// ---------------------------------------------------------------------------

export const ctaBanner = {
  subtitle: "Let's transform your outdoor space with quality landscaping, groundwork, patios, driveways, and fencing tailored to your property.",
};
