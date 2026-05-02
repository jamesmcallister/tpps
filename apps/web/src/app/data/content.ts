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
];

const splitMarker = "We take the time";
const splitIndex = (about.full as string).indexOf(splitMarker);
const aboutPara1 = (about.full as string).slice(0, splitIndex).trimEnd();
const aboutPara2 = (about.full as string).slice(splitIndex);

export const siteContent = {
  hero: {
    title: hero.intro.heading,
    subtitle: hero.intro.body,
    ctaPrimary: "Get a Free Quote",
    ctaSecondary: "Call Us Today",
    trustPoints: [...trustPoints],
  },

  about: {
    badge: `About ${company.shortName}`,
    title: hero.tagline,
    paragraphs: [aboutPara1, aboutPara2],
    linkText: "Explore our services",
  },

  services: {
    heading: servicesCopy.heading,
    subtitle: servicesCopy.subtitle,
    items: serviceDisplayOrder.map((id) => ({
      title: serviceCardCopy[id].heading,
      description: serviceCardCopy[id].short,
    })),
    additionalServicesLabel: servicesCopy.additionalServicesLabel,
    additionalServices: serviceCardCopy["tree-removal"].heading,
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
      ctaText: "View More Work",
    },
  },

  areas: {
    heading: areasWeCover.heading,
    description: areasWeCover.marketingDescription,
    locations: areasWeCover.all,
    additionalText: areasWeCover.additionalText,
  },

  testimonials: {
    heading: "What Our Clients Say",
    subtitle: "Don't just take our word for it. Read reviews from homeowners across East Kent.",
    reviews: [
      {
        text: "TPPS transformed our tired garden into an incredible outdoor living space. The patio looks fantastic, and their attention to detail was spot on. Highly recommend.",
        author: "Sarah J.",
        location: "Broadstairs",
      },
      {
        text: "Professional, reliable, and left the site spotless every day. We had a new block paved driveway installed and the finish is superb. Great team to work with.",
        author: "Mark & Emma",
        location: "Ramsgate",
      },
      {
        text: "The groundwork for our new extension and the subsequent landscaping was handled perfectly. Honest advice and quality craftsmanship throughout the project.",
        author: "David L.",
        location: "Margate",
      },
    ],
  },

  cta: {
    heading: ctas.primary,
    subtitle: ctaBanner.subtitle,
    primaryButton: "Get a Free Quote",
    secondaryButton: "Call Now",
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
      { name: "Gallery", href: "#gallery" },
      { name: "Areas We Cover", href: "#areas" },
      { name: "Contact", href: "#contact" },
    ],
    ctaPrimary: "Get a Free Quote",
    ctaSecondary: "Call Now",
  },

  footer: {
    companyDescription: about.short,
    quickLinksTitle: "Quick Links",
    areasTitle: "Areas We Cover",
    contactTitle: "Contact Us",
    phoneLabel: "Call for a free quote",
    locationText: `Serving ${company.location.area}`,
    copyright: `${company.name}. All rights reserved.`,
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
  },
};
