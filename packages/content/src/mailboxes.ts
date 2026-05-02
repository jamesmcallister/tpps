/**
 * TPPS Landscapes — Mailbox configuration for the email assistant.
 * Extends the shared company content with email-specific settings.
 */

import { company } from "./company";

export type CustomerReplyMode = "draft_only" | "auto_send";
export type EscalationMode = "always_reply" | "escalate_only";

export type MailboxConfig = {
  name: string;
  emailAddress: string;
  role: string;
  company: {
    name: string;
    shortDescription: string;
    longDescription: string;
    ukEnglish: boolean;
  };
  /** ID used to look up the agent's knowledge profile */
  knowledgeId: "hello";
  tone: string;
  customerReplyMode: CustomerReplyMode;
  escalationMode: EscalationMode;
  humanEscalationEmail: string;
  humanEscalationDisplayName: string;
};

export const mailboxes: Record<string, MailboxConfig> = {
  [company.contact.email]: {
    name: company.shortName,
    emailAddress: company.contact.email,
    role: "Customer Enquiries",
    company: {
      name: company.shortName,
      shortDescription: company.description.short,
      longDescription: company.description.long,
      ukEnglish: true,
    },
    knowledgeId: "hello",
    tone: "professional, friendly, clear, practical, and helpful",
    customerReplyMode: "draft_only",
    escalationMode: "always_reply",
    humanEscalationEmail: company.contact.escalationEmail,
    humanEscalationDisplayName: company.contact.escalationName,
  },
};

/** Shape expected by the legacy `src/config/company.json` import in the email worker. */
export const companyConfig = {
  mailboxes: Object.fromEntries(Object.entries(mailboxes).map(([email, cfg]) => [email, cfg])),
} as const;
