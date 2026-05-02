/**
 * TPPS Landscapes — AI agent knowledge for the email assistant.
 *
 * This file provides the structured knowledge consumed by the email agent's
 * prompt builder (buildKnowledgeContext). It consolidates data from company,
 * services, and communication modules into the shape the agent schemas expect.
 *
 * Two knowledge profiles are exported:
 *   - companyKnowledge  — general company knowledge (knowledgeId: "company")
 *   - helloKnowledge    — rich customer-facing knowledge for hello@ (knowledgeId: "hello")
 */

import { company } from "./company";
import { services, pricingPolicy } from "./services";
import { communicationRules, voiceProfile, escalationTriggers } from "./communication";
import { trustPoints } from "./copy";

// ---------------------------------------------------------------------------
// Company-level knowledge (knowledgeId: "company")
// ---------------------------------------------------------------------------

export const companyKnowledge = {
  whoCompanyIsFor: [
    "Residential homeowners",
    "Commercial properties",
    "People needing garden design or maintenance",
    "People needing groundworks, driveways, or patios",
  ],
  confirmedCurrentCapabilities: services.filter((s) => s.live).map((s) => s.name),
  inProgressCapabilities: ["Project timelines depend on site surveys and material availability."],
  currentOperatingModelNotes: [
    pricingPolicy.surveyPolicy,
    pricingPolicy.quoteTimeline,
    `Fully licensed and insured.`,
    `Local to ${company.location.area} with ${company.credentials.yearsExperience}+ years' experience.`,
  ],
  plannedOrExploratoryIdeas: [
    "Larger commercial groundworks",
    "Ongoing seasonal maintenance plans",
  ],
  pricing: {
    status: "known" as const,
    notes: pricingPolicy.notes,
  },
  rules: {
    mustNotClaim: [
      "Fixed prices before a site survey",
      "Guaranteed start dates before quote approval",
      "Services outside of landscaping and groundworks without checking",
    ],
    internalOnlyNotes: ["Labour is typically 60–70% of the quote."],
  },
} as const;

// ---------------------------------------------------------------------------
// Hello@ mailbox knowledge (knowledgeId: "hello")
// ---------------------------------------------------------------------------

export const helloKnowledge = {
  whoCompanyIsFor: companyKnowledge.whoCompanyIsFor,
  confirmedCurrentCapabilities: companyKnowledge.confirmedCurrentCapabilities,
  inProgressCapabilities: companyKnowledge.inProgressCapabilities,
  currentOperatingModelNotes: companyKnowledge.currentOperatingModelNotes,
  plannedOrExploratoryIdeas: companyKnowledge.plannedOrExploratoryIdeas,
  contactDetails: {
    phone: company.contact.phone,
    email: company.contact.email,
    serviceArea: company.location.area,
  },
  pricingGuideSections: services
    .filter((s) => s.live && s.pricing)
    .map((s) => {
      const pricing = Array.isArray(s.pricing) ? s.pricing : [s.pricing!];
      return {
        name: s.name,
        lineItems: pricing.map((p) =>
          p.notes ? `${p.notes}: £${p.min}–£${p.max} ${p.unit}` : `£${p.min}–£${p.max} ${p.unit}`,
        ),
        notes: pricingPolicy.notes,
      };
    }),
  quoteGuidance: {
    keyPrinciples: communicationRules.alwaysDo,
    nextSteps: [
      pricingPolicy.quoteProcess,
      pricingPolicy.surveyPolicy,
      pricingPolicy.quoteTimeline,
    ],
    clarifyingQuestions: [
      "What is the approximate area in m² or dimensions?",
      "What type of finish or material are you looking for?",
      "Are there any access limitations or ground conditions we should know about?",
      "What is your rough timeline or urgency?",
    ],
    credentials: [...trustPoints],
    commonProjects: ["Typical residential projects range £2,000–£8,000 (all-in, inc. VAT)."],
  },
  followUpGuidance: {
    principles: [
      "Answer the main question first.",
      "Ask only a small number of useful follow-up questions.",
      "Sound natural, warm, and commercially useful.",
      "Avoid robotic phrasing, box-ticking language, and repetitive filler.",
    ],
    styleNotes: [`${voiceProfile.style}`, `Use ${voiceProfile.locale}.`],
  },
  voiceGuidance: {
    preferredOpeners: ["Thank you for getting in touch.", "Thanks for your enquiry."],
    preferredClosers: [
      `Kind regards,\nThe ${company.shortName} Team`,
      `Best regards,\nThe ${company.shortName} Team`,
    ],
    avoidPhrases: communicationRules.neverDo,
  },
  pricing: {
    status: "known" as const,
    notes: pricingPolicy.notes,
  },
  rules: {
    mustNotClaim: [...companyKnowledge.rules.mustNotClaim, ...escalationTriggers],
    internalOnlyNotes: companyKnowledge.rules.internalOnlyNotes as unknown as string[],
  },
} as const;

// ---------------------------------------------------------------------------
// Agent config (replaces src/config/company.json)
// ---------------------------------------------------------------------------

export const agentConfig = {
  company: {
    name: company.shortName,
    shortDescription: company.description.short,
    longDescription: company.description.long,
    ukEnglish: true,
  },
  mailboxes: {
    [company.contact.email]: {
      name: company.shortName,
      emailAddress: company.contact.email,
      role: "Customer Enquiries",
      tone: "professional, friendly, clear, practical, and helpful",
      company: {
        name: company.shortName,
        shortDescription: company.description.short,
        longDescription: company.description.long,
        ukEnglish: true,
      },
      knowledgeId: "hello" as const,
      customerReplyMode: "draft" as const,
      escalationMode: "always_reply" as const,
      humanEscalationEmail: company.contact.escalationEmail,
      humanEscalationDisplayName: company.contact.escalationName,
    },
  },
} as const;
