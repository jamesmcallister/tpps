import {
  about,
  areasWeCover,
  company,
  ctas,
  ctaBanner,
  homepageSeo,
  hero,
  serviceCardCopy,
  servicesCopy,
  trustPoints,
  websiteUi,
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
    ctaPrimary: websiteUi.hero.ctaPrimary,
    ctaSecondary: websiteUi.hero.ctaSecondary,
    trustPoints: [...trustPoints],
  },

  about: {
    badge: websiteUi.about.badge,
    title: hero.tagline,
    paragraphs: aboutParagraphs,
    linkText: websiteUi.about.linkText,
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
    additionalServices: websiteUi.services.additionalServices,
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
      ctaText: websiteUi.whyChoose.ctaText,
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
    primaryButton: websiteUi.cta.primaryButton,
    secondaryButton: websiteUi.cta.secondaryButton,
  },

  contact: {
    phone: company.contact.phone,
    email: company.contact.email,
  },

  navigation: {
    companyName: company.name,
    links: [...websiteUi.navigation.links],
    ctaPrimary: websiteUi.navigation.ctaPrimary,
    ctaSecondary: websiteUi.navigation.ctaSecondary,
  },

  footer: {
    companyDescription: about.short,
    seoSummary: homepageSeo.footerSummary,
    quickLinksTitle: websiteUi.footer.quickLinksTitle,
    areasTitle: websiteUi.footer.areasTitle,
    contactTitle: websiteUi.footer.contactTitle,
    phoneLabel: websiteUi.footer.phoneLabel,
    locationText: `Serving ${company.location.area}`,
    copyright: `${company.name}. All rights reserved.`,
    privacyPolicy: websiteUi.footer.privacyPolicy,
    termsOfService: websiteUi.footer.termsOfService,
  },
};
