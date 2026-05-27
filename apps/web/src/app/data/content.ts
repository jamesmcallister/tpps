import {
  about,
  areasWeCover,
  company,
  ctas,
  ctaBanner,
  hero,
  serviceCardCopy,
  servicesCopy,
  trustPoints,
  whyChoose,
} from "@tpps/content";

const serviceDisplayOrder = [
  "garden-design",
  "patios-pathways",
  "driveways",
  "fencing",
  "groundworks",
  "garden-maintenance",
  "tree-removal",
];

const aboutParagraphs = about.full
  .split(/\n{2,}/)
  .map((paragraph) => paragraph.trim())
  .filter(Boolean);

export const siteContent = {
  hero: {
    title: hero.intro.heading,
    subtitle: hero.intro.body,
    ctaPrimary: "Request a Quote",
    ctaSecondary: "View Services",
    trustPoints: [...trustPoints],
  },

  about: {
    badge: `About ${company.shortName}`,
    title: hero.tagline,
    paragraphs: aboutParagraphs,
    linkText: "Explore our services",
  },

  services: {
    heading: servicesCopy.heading,
    subtitle: servicesCopy.subtitle,
    items: serviceDisplayOrder.map((id) => ({
      id,
      title: serviceCardCopy[id].heading,
      description: serviceCardCopy[id].short,
    })),
    additionalServicesLabel: servicesCopy.additionalServicesLabel,
    additionalServices: "Mixed landscaping and groundwork projects",
    additionalServicesLink: servicesCopy.additionalServicesLink,
  },

  whyChoose: {
    heading: whyChoose.heading,
    subtitle: whyChoose.subtitle,
    points: [...whyChoose.points],
    featuredProject: {
      badge: whyChoose.featuredProject.badge,
      title: whyChoose.featuredProject.title,
      description: whyChoose.featuredProject.description,
      ctaText: "See typical work",
    },
  },

  areas: {
    heading: areasWeCover.heading,
    description: areasWeCover.marketingDescription,
    locations: areasWeCover.all,
    additionalText: areasWeCover.additionalText,
  },

  cta: {
    heading: ctas.primary,
    subtitle: ctaBanner.subtitle,
    primaryButton: "Email Your Enquiry",
    secondaryButton: "View Services",
  },

  contact: {
    phone: company.contact.phone,
    email: company.contact.email,
  },

  navigation: {
    companyName: company.name,
    links: [
      { name: "Home", href: "#" },
      { name: "Services", href: "#services" },
      { name: "About", href: "#about" },
      { name: "Work", href: "#work" },
      { name: "Areas We Cover", href: "#areas" },
      { name: "Contact", href: "#contact" },
    ],
    ctaPrimary: "Request a Quote",
    ctaSecondary: "Email us",
  },

  footer: {
    companyDescription: about.short,
    quickLinksTitle: "Quick Links",
    areasTitle: "Areas We Cover",
    contactTitle: "Contact Us",
    phoneLabel: "Call Tim",
    locationText: `Serving ${company.location.area}`,
    copyright: `${company.name}. All rights reserved.`,
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
  },
};
