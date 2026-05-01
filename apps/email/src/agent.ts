import { AIChatAgent } from "@cloudflare/ai-chat";
import { generateText, streamText } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { z } from "zod";
import companyConfigJson from "./config/company.json";
import companyKnowledgeJson from "./knowledge/company.json";
import staceyKnowledgeJson from "./knowledge/stacey.json";
import { renderInteractivePrompt } from "./prompts/interactive";
import { renderReplyPrompt } from "./prompts/reply";
import { renderSystemPrompt } from "./prompts/system";
import { sendEmail } from "../workers/email-sender";
import { isPromptInjection } from "../workers/lib/ai";
import {
	buildQuotedReplyBlock,
	buildReferencesChain,
	buildThreadingHeaders,
	generateMessageId,
	getMailboxStub,
	stripHtmlToText,
	textToHtml,
} from "../workers/lib/email-helpers";
import type { EmailFull } from "../workers/lib/schemas";
import type { Env } from "../workers/types";
import { Folders } from "../shared/folders";

const ContactRelationshipTypeSchema = z.enum([
	"prospect",
	"customer",
	"partner",
	"supplier",
	"unknown",
]);

const IncomingEmailCategorySchema = z.enum([
	"sales_new_venue_enquiry",
	"support",
	"partnership",
	"supplier_printer_collaboration",
	"billing_admin",
	"spam_irrelevant",
	"general_question",
]);

const ContactMemorySchema = z.object({
	senderEmail: z.string().email(),
	senderName: z.string().nullable(),
	venueOrCompanyName: z.string().nullable(),
	venueType: z.string().nullable(),
	numberOfVenues: z.number().int().positive().nullable(),
	relationshipType: ContactRelationshipTypeSchema,
	interestsOrProblems: z.array(z.string()).max(6),
	lastThreadSummary: z.string().nullable(),
	nextFollowUpItem: z.string().nullable(),
	lastCategory: IncomingEmailCategorySchema.nullable(),
	lastUpdatedAt: z.string(),
});

const MailboxAgentStateSchema = z.object({
	contacts: z.record(z.string().email(), ContactMemorySchema),
});

const KnowledgeContactDetailsSchema = z.object({
	phone: z.string().optional(),
	email: z.string().email().optional(),
	website: z.string().optional(),
	serviceArea: z.string().optional(),
});

const KnowledgePricingGuideSectionSchema = z.object({
	name: z.string(),
	lineItems: z.array(z.string()),
	notes: z.array(z.string()).optional(),
});

const KnowledgeQuoteGuidanceSchema = z.object({
	keyPrinciples: z.array(z.string()).optional(),
	nextSteps: z.array(z.string()).optional(),
	clarifyingQuestions: z.array(z.string()).optional(),
	credentials: z.array(z.string()).optional(),
	commonProjects: z.array(z.string()).optional(),
});

const KnowledgeFollowUpGuidanceSchema = z.object({
	principles: z.array(z.string()).optional(),
	preferredQuestions: z.array(z.string()).optional(),
	styleNotes: z.array(z.string()).optional(),
});

const KnowledgeHumourGuidanceSchema = z.object({
	useWhen: z.array(z.string()).optional(),
	avoidWhen: z.array(z.string()).optional(),
	approvedLines: z.array(z.string()).optional(),
});

const KnowledgeVoiceGuidanceSchema = z.object({
	preferredOpeners: z.array(z.string()).optional(),
	preferredTransitions: z.array(z.string()).optional(),
	preferredClosers: z.array(z.string()).optional(),
	avoidPhrases: z.array(z.string()).optional(),
});

const CompanyKnowledgeSchema = z.object({
	whoCompanyIsFor: z.array(z.string()),
	confirmedCurrentCapabilities: z.array(z.string()),
	inProgressCapabilities: z.array(z.string()),
	currentOperatingModelNotes: z.array(z.string()),
	plannedOrExploratoryIdeas: z.array(z.string()),
	contactDetails: KnowledgeContactDetailsSchema.optional(),
	pricingGuideSections: z.array(KnowledgePricingGuideSectionSchema).optional(),
	quoteGuidance: KnowledgeQuoteGuidanceSchema.optional(),
	followUpGuidance: KnowledgeFollowUpGuidanceSchema.optional(),
	humourGuidance: KnowledgeHumourGuidanceSchema.optional(),
	voiceGuidance: KnowledgeVoiceGuidanceSchema.optional(),
	pricing: z.object({
		status: z.enum(["known", "unknown"]),
		notes: z.array(z.string()),
	}),
	rules: z.object({
		mustNotClaim: z.array(z.string()),
		internalOnlyNotes: z.array(z.string()),
	}),
});

const CompanySchema = z.object({
	name: z.string(),
	shortDescription: z.string(),
	longDescription: z.string(),
	ukEnglish: z.boolean(),
});

const KnowledgeIdSchema = z.enum(["company", "stacey"]);
const EscalationModeSchema = z.enum(["guarded", "always_reply"]);

const AgentProfileSchema = z.object({
	name: z.string(),
	emailAddress: z.string().email(),
	role: z.string(),
	tone: z.string(),
	company: CompanySchema.optional(),
	knowledgeId: KnowledgeIdSchema.default("company"),
	customerReplyMode: z.enum(["send", "draft"]),
	escalationMode: EscalationModeSchema.default("guarded"),
	humanEscalationEmail: z.string().email(),
	humanEscalationDisplayName: z.string(),
});

const CompanyConfigSchema = z.object({
	company: CompanySchema,
	mailboxes: z.record(z.string().email(), AgentProfileSchema),
});

const DEFAULT_COMPANY_KNOWLEDGE = CompanyKnowledgeSchema.parse(companyKnowledgeJson);
const STACEY_KNOWLEDGE = CompanyKnowledgeSchema.parse(staceyKnowledgeJson);
const COMPANY_CONFIG = CompanyConfigSchema.parse(companyConfigJson);
const KNOWLEDGE_BY_ID = {
	company: DEFAULT_COMPANY_KNOWLEDGE,
	stacey: STACEY_KNOWLEDGE,
} satisfies Record<z.infer<typeof KnowledgeIdSchema>, CompanyKnowledge>;

const DEFAULT_REPLY_MODEL = "@cf/meta/llama-4-scout-17b-16e-instruct";

type ContactRelationshipType = z.infer<typeof ContactRelationshipTypeSchema>;
type IncomingEmailCategory = z.infer<typeof IncomingEmailCategorySchema>;
type ContactMemory = z.infer<typeof ContactMemorySchema>;
type MailboxAgentState = z.infer<typeof MailboxAgentStateSchema>;
type CompanyKnowledge = z.infer<typeof CompanyKnowledgeSchema>;
type Company = z.infer<typeof CompanySchema>;
type KnowledgeId = z.infer<typeof KnowledgeIdSchema>;
type AgentProfile = z.infer<typeof AgentProfileSchema>;
type MailboxContext = {
	profile: AgentProfile;
	company: Company;
	knowledge: CompanyKnowledge;
};

type IncomingEmailClassification = {
	category: IncomingEmailCategory;
	confidence: "low" | "medium" | "high";
	reasons: string[];
};

type ReplyDecision =
	| { action: "reply"; reason: string }
	| { action: "draft"; reason: string }
	| { action: "escalate"; reason: string };

type NewEmailPayload = {
	mailboxId: string;
	emailId: string;
	sender: string;
	senderName?: string | null;
	subject: string;
	threadId: string;
};

type AgentReply = {
	subject: string;
	text: string;
};

const GENERIC_EMAIL_PROVIDERS = new Set([
	"gmail.com",
	"outlook.com",
	"hotmail.com",
	"icloud.com",
	"yahoo.com",
	"live.com",
	"me.com",
]);

const DEFAULT_STATE: MailboxAgentState = {
	contacts: {},
};

const SALES_KEYWORDS = [
	"demo",
	"venue",
	"restaurant",
	"pub",
	"bar",
	"cafe",
	"caf\u00e9",
	"hospitality",
	"locations",
	"sites",
	"opening",
	"new venue",
	"menu platform",
	"food truck",
	"taco truck",
	"truck",
	"stall",
	"trailer",
	"van",
	"garden",
	"gardening",
	"groundwork",
	"groundworks",
	"landscaping",
	"driveway",
	"patio",
	"fence",
	"fencing",
	"clearance",
	"quote",
];

const SUPPORT_KEYWORDS = [
	"support",
	"help",
	"issue",
	"problem",
	"broken",
	"not working",
	"can't",
	"cannot",
	"login",
	"sign in",
	"error",
	"bug",
	"access",
];

const PARTNERSHIP_KEYWORDS = [
	"partner",
	"partnership",
	"integrat",
	"reseller",
	"affiliate",
	"agency",
	"collaboration",
];

const SUPPLIER_KEYWORDS = [
	"supplier",
	"printer",
	"printing",
	"print",
	"manufacturer",
	"menus",
	"collaboration",
];

const BILLING_KEYWORDS = [
	"invoice",
	"billing",
	"payment",
	"accounts",
	"admin",
	"vat",
	"receipt",
	"finance",
];

const SPAM_KEYWORDS = [
	"seo",
	"backlink",
	"guest post",
	"casino",
	"crypto",
	"forex",
	"lead generation",
	"buy followers",
	"telegram investment",
];

function normaliseWhitespace(value: string): string {
	return value.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function toSentenceCaseLabel(value: string): string {
	return value
		.split(/[.\-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join(" ");
}

function titleCaseDomainLabel(email: string): string | null {
	const domain = email.split("@")[1]?.toLowerCase();
	if (!domain || GENERIC_EMAIL_PROVIDERS.has(domain)) {
		return null;
	}

	const host = domain.split(".")[0];
	if (!host) {
		return null;
	}

	return toSentenceCaseLabel(host);
}

function extractReplyOnlyText(text: string): string {
	const trimmed = normaliseWhitespace(text);
	const replyBoundaryPatterns = [
		/\nOn [^\n]{0,500}? wrote:\s*/i,
		/\nFrom:\s.+\nSent:\s.+/i,
		/\n-{2,}\s*Original Message\s*-{2,}\s*/i,
		/\n_{5,}\n/i,
		/\n-{5,}\s*Forwarded message\s*-{2,}\n/i,
	];

	for (const pattern of replyBoundaryPatterns) {
		const match = trimmed.match(pattern);
		if (match?.index !== undefined) {
			return trimmed.slice(0, match.index).trim();
		}
	}

	const withoutQuotedLines = trimmed
		.split("\n")
		.filter((line) => {
			const value = line.trim();
			if (!value) {
				return true;
			}

			if (value.startsWith(">")) {
				return false;
			}

			if (/^On .+ wrote:$/i.test(value)) {
				return false;
			}

			if (/^On .+ wrote:\s*$/i.test(value)) {
				return false;
			}

			if (/^From:\s/i.test(value) || /^Sent:\s/i.test(value) || /^Subject:\s/i.test(value)) {
				return false;
			}

			return true;
		})
		.join("\n")
		.trim();

	const inlineReplyCut = withoutQuotedLines
		.split(/\n(?=On [^\n]{0,500}? wrote:\s*)/i)[0]
		.trim();

	return inlineReplyCut || withoutQuotedLines || trimmed;
}

function stripNegatedSupportPhrases(text: string): string {
	return text
		.replace(/\bno errors?\b/gi, "")
		.replace(/\bnot an error\b/gi, "")
		.replace(/\bno problem\b/gi, "")
		.replace(/\bnot a problem\b/gi, "")
		.replace(/\bnot broken\b/gi, "")
		.replace(/\bwithout issue\b/gi, "")
		.replace(/\bno issues?\b/gi, "");
}

function htmlToReplyText(html: string): string {
	return html
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
		.replace(/<(br|\/p|\/div|\/li|\/blockquote)\b[^>]*>/gi, "\n")
		.replace(/<(p|div|li|blockquote)\b[^>]*>/gi, "\n")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&amp;/gi, "&")
		.replace(/\r\n/g, "\n")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

export function extractBestEmailText(body: string | null | undefined): string {
	if (!body) {
		return "";
	}

	const plainText = /<[a-z][\s\S]*>/i.test(body)
		? htmlToReplyText(body)
		: body;

	return extractReplyOnlyText(plainText);
}

function formatList(items: string[]): string {
	return items.map((item) => `- ${item}`).join("\n");
}

export function buildKnowledgeContext(knowledge: CompanyKnowledge): string {
	const sections = [
		`Who this company is for:\n${formatList(knowledge.whoCompanyIsFor)}`,
		`Confirmed current capabilities:\n${formatList(knowledge.confirmedCurrentCapabilities)}`,
		`In progress or limited rollout:\n${formatList(knowledge.inProgressCapabilities)}`,
		`Current operating model notes:\n${formatList(knowledge.currentOperatingModelNotes)}`,
		`Planned or exploratory ideas:\n${formatList(knowledge.plannedOrExploratoryIdeas)}`,
		`Pricing status: ${knowledge.pricing.status}`,
		`Must not claim:\n${formatList(knowledge.rules.mustNotClaim)}`,
	];

	if (knowledge.contactDetails) {
		const contactLines = [
			knowledge.contactDetails.phone ? `Phone: ${knowledge.contactDetails.phone}` : null,
			knowledge.contactDetails.email ? `Email: ${knowledge.contactDetails.email}` : null,
			knowledge.contactDetails.website ? `Website: ${knowledge.contactDetails.website}` : null,
			knowledge.contactDetails.serviceArea ? `Service area: ${knowledge.contactDetails.serviceArea}` : null,
		].filter(Boolean) as string[];

		if (contactLines.length > 0) {
			sections.push(`Contact details:\n${formatList(contactLines)}`);
		}
	}

	if (knowledge.pricingGuideSections && knowledge.pricingGuideSections.length > 0) {
		const pricingLines = knowledge.pricingGuideSections.map((section) => {
			const notes = section.notes && section.notes.length > 0
				? `\n  Notes: ${section.notes.join("; ")}`
				: "";
			return `- ${section.name}:\n  ${section.lineItems.join("\n  ")}${notes}`;
		});
		sections.push(`Approved pricing guide:\n${pricingLines.join("\n")}`);
	}

	if (knowledge.quoteGuidance?.keyPrinciples?.length) {
		sections.push(`Quote principles:\n${formatList(knowledge.quoteGuidance.keyPrinciples)}`);
	}

	if (knowledge.quoteGuidance?.clarifyingQuestions?.length) {
		sections.push(`Clarifying questions to ask when needed:\n${formatList(knowledge.quoteGuidance.clarifyingQuestions)}`);
	}

	if (knowledge.quoteGuidance?.nextSteps?.length) {
		sections.push(`Preferred next steps:\n${formatList(knowledge.quoteGuidance.nextSteps)}`);
	}

	if (knowledge.quoteGuidance?.credentials?.length) {
		sections.push(`Approved business credentials:\n${formatList(knowledge.quoteGuidance.credentials)}`);
	}

	if (knowledge.quoteGuidance?.commonProjects?.length) {
		sections.push(`Typical project budgets:\n${formatList(knowledge.quoteGuidance.commonProjects)}`);
	}

	if (knowledge.followUpGuidance?.principles?.length) {
		sections.push(`Follow-up reply principles:\n${formatList(knowledge.followUpGuidance.principles)}`);
	}

	if (knowledge.followUpGuidance?.preferredQuestions?.length) {
		sections.push(`Preferred follow-up questions:\n${formatList(knowledge.followUpGuidance.preferredQuestions)}`);
	}

	if (knowledge.followUpGuidance?.styleNotes?.length) {
		sections.push(`Follow-up tone and style notes:\n${formatList(knowledge.followUpGuidance.styleNotes)}`);
	}

	if (knowledge.humourGuidance?.useWhen?.length) {
		sections.push(`Humour may be used when:\n${formatList(knowledge.humourGuidance.useWhen)}`);
	}

	if (knowledge.humourGuidance?.avoidWhen?.length) {
		sections.push(`Humour must be avoided when:\n${formatList(knowledge.humourGuidance.avoidWhen)}`);
	}

	if (knowledge.humourGuidance?.approvedLines?.length) {
		sections.push(`Approved cheeky lines to use sparingly and only when the tone fits:\n${formatList(knowledge.humourGuidance.approvedLines)}`);
	}

	if (knowledge.voiceGuidance?.preferredOpeners?.length) {
		sections.push(`Preferred opener styles:\n${formatList(knowledge.voiceGuidance.preferredOpeners)}`);
	}

	if (knowledge.voiceGuidance?.preferredTransitions?.length) {
		sections.push(`Preferred transition styles:\n${formatList(knowledge.voiceGuidance.preferredTransitions)}`);
	}

	if (knowledge.voiceGuidance?.preferredClosers?.length) {
		sections.push(`Preferred closing styles:\n${formatList(knowledge.voiceGuidance.preferredClosers)}`);
	}

	if (knowledge.voiceGuidance?.avoidPhrases?.length) {
		sections.push(`Phrases and tones to avoid:\n${formatList(knowledge.voiceGuidance.avoidPhrases)}`);
	}

	return sections.join("\n\n");
}

function buildContactMemoryContext(memory: ContactMemory): string {
	const items = [
		`Sender email: ${memory.senderEmail}`,
		`Sender name: ${memory.senderName ?? "unknown"}`,
		`Venue or company: ${memory.venueOrCompanyName ?? "unknown"}`,
		`Venue type: ${memory.venueType ?? "unknown"}`,
		`Number of venues: ${memory.numberOfVenues ?? "unknown"}`,
		`Relationship type: ${memory.relationshipType}`,
		`Interests or problems: ${memory.interestsOrProblems.length > 0 ? memory.interestsOrProblems.join("; ") : "none captured"}`,
		`Last thread summary: ${memory.lastThreadSummary ?? "none"}`,
		`Next follow-up item: ${memory.nextFollowUpItem ?? "none"}`,
	];

	return items.join("\n");
}

function buildThreadContext(emails: EmailFull[]): string {
	if (emails.length <= 1) {
		return "No earlier messages in this thread.";
	}

	return emails
		.sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
		.map((email) => {
			const bodyText = extractBestEmailText(email.body);
			return `[${email.date}] ${email.sender} -> ${email.recipient}: ${bodyText || "(empty body)"}`;
		})
		.join("\n\n");
}

// Prompt inputs are split deliberately:
// 1. System behaviour defines the mailbox agent's voice and guardrails.
// 2. Company knowledge JSON holds editable product truth.
// 3. Per-contact memory stores lightweight sender facts only.
// 4. The current email thread context carries the live conversation details.
export function buildAgentSystemPrompt(args: {
	profile: AgentProfile;
	company: Company;
	knowledge: CompanyKnowledge;
	classification: IncomingEmailClassification;
	contactMemory: ContactMemory;
	threadContext: string;
}): string {
	return renderSystemPrompt({
		profileName: args.profile.name,
		profileRole: args.profile.role,
		profileEmailAddress: args.profile.emailAddress,
		profileTone: args.profile.tone,
		companyName: args.company.name,
		companyShortDescription: args.company.shortDescription,
		companyLongDescription: args.company.longDescription,
		knowledgeContext: buildKnowledgeContext(args.knowledge),
		contactMemoryContext: buildContactMemoryContext(args.contactMemory),
		classificationCategory: args.classification.category,
		classificationConfidence: args.classification.confidence,
		classificationReasons: args.classification.reasons.join("; ") || "none",
		threadContext: args.threadContext,
	});
}

function includesAny(text: string, words: string[]): string[] {
	return words.filter((word) => text.includes(word));
}

function resolveMailboxContext(mailboxId: string): MailboxContext {
	const profile = COMPANY_CONFIG.mailboxes[mailboxId.toLowerCase()];
	if (!profile) {
		throw new Error(`No agent profile configured for mailbox ${mailboxId}`);
	}

	const company = profile.company ?? COMPANY_CONFIG.company;
	const knowledge = KNOWLEDGE_BY_ID[profile.knowledgeId as KnowledgeId];
	if (!knowledge) {
		throw new Error(`No knowledge configured for mailbox ${mailboxId}`);
	}

	return {
		profile,
		company,
		knowledge,
	};
}

function isPricingQuestion(text: string, subject: string): boolean {
	return /\bpricing\b|\bprice\b|\bcost\b|\bquote\b|\bhow much\b/i.test(`${subject}\n${text}`);
}

export function classifyIncomingEmail(params: {
	subject: string;
	bodyText: string;
	senderEmail: string;
}): IncomingEmailClassification {
	const haystack = stripNegatedSupportPhrases(
		`${params.subject}\n${params.bodyText}\n${params.senderEmail}`.toLowerCase(),
	);
	const strongSalesSignals = includesAny(haystack, [
		"want a menu",
		"need a menu",
		"menu on",
		"looking for a menu",
		"food truck",
		"taco truck",
		"sell tacos",
		"venue",
		"garden",
		"groundwork",
		"groundworks",
		"need a quote",
		"looking for a quote",
		"drive way",
	]);

	if (strongSalesSignals.length > 0) {
		return {
			category: "sales_new_venue_enquiry",
			confidence: strongSalesSignals.length >= 2 ? "high" : "medium",
			reasons: strongSalesSignals.slice(0, 3),
		};
	}

	const spamMatches = includesAny(haystack, SPAM_KEYWORDS);
	if (spamMatches.length > 0) {
		return {
			category: "spam_irrelevant",
			confidence: "high",
			reasons: spamMatches.slice(0, 3),
		};
	}

	const scoredCategories: Array<{
		category: IncomingEmailCategory;
		matches: string[];
	}> = [
		{ category: "billing_admin", matches: includesAny(haystack, BILLING_KEYWORDS) },
		{ category: "support", matches: includesAny(haystack, SUPPORT_KEYWORDS) },
		{ category: "partnership", matches: includesAny(haystack, PARTNERSHIP_KEYWORDS) },
		{ category: "supplier_printer_collaboration", matches: includesAny(haystack, SUPPLIER_KEYWORDS) },
		{ category: "sales_new_venue_enquiry", matches: includesAny(haystack, SALES_KEYWORDS) },
	];

	const topMatch = scoredCategories
		.sort((left, right) => right.matches.length - left.matches.length)[0];

	if (topMatch && topMatch.matches.length > 0) {
		return {
			category: topMatch.category,
			confidence: topMatch.matches.length >= 2 ? "high" : "medium",
			reasons: topMatch.matches.slice(0, 3),
		};
	}

	return {
		category: "general_question",
		confidence: "low",
		reasons: ["no strong keyword match"],
	};
}

function extractSenderNameFromText(bodyText: string): string | null {
	const lines = bodyText.split("\n").map((line) => line.trim()).filter(Boolean);
	const signOffIndex = lines.findIndex((line) =>
		/^(thanks|thank you|cheers|kind regards|best|regards)[,!]?$/i.test(line),
	);

	if (signOffIndex >= 0) {
		const candidate = lines[signOffIndex + 1];
		if (candidate && /^[A-Z][A-Za-z'. -]{1,60}$/.test(candidate)) {
			return candidate.trim();
		}
	}

	return null;
}

function extractVenueType(bodyText: string): string | null {
	const haystack = bodyText.toLowerCase();
	const venueTypes = ["pub", "restaurant", "bar", "cafe", "caf\u00e9", "hotel", "coffee shop"];

	for (const venueType of venueTypes) {
		if (haystack.includes(venueType)) {
			return venueType === "caf\u00e9" ? "cafe" : venueType;
		}
	}

	return null;
}

function extractNumberOfVenues(bodyText: string): number | null {
	const match = bodyText.match(/\b(\d{1,3})\s+(venues|sites|locations|restaurants|pubs|bars|cafes)\b/i);
	if (!match) {
		return null;
	}

	const number = Number(match[1]);
	return Number.isInteger(number) && number > 0 ? number : null;
}

function cleanEntityCandidate(candidate: string): string | null {
	const trimmed = candidate.trim().replace(/[.,;:!?]+$/, "");
	if (!trimmed || trimmed.length < 2 || trimmed.length > 80) {
		return null;
	}

	return trimmed;
}

function extractVenueOrCompanyName(bodyText: string, senderEmail: string): string | null {
	const patterns = [
		/\b(?:our venue|our company|our restaurant|our pub|our bar|our cafe|my venue|my company|my restaurant|my pub|my bar|my cafe)\s+(?:is|called|named)\s+([A-Z][A-Za-z0-9 '&-]{1,60})/i,
		/\b(?:I run|I own|I manage|we run|we own|we manage)\s+([A-Z][A-Za-z0-9 '&-]{1,60})/i,
		/\bI'm from\s+([A-Z][A-Za-z0-9 '&-]{1,60})/i,
	];

	for (const pattern of patterns) {
		const match = bodyText.match(pattern);
		const candidate = match?.[1] ? cleanEntityCandidate(match[1]) : null;
		if (candidate) {
			return candidate;
		}
	}

	return titleCaseDomainLabel(senderEmail);
}

function extractInterestsOrProblems(bodyText: string): string[] {
	const sentences = bodyText
		.split(/(?<=[.!?])\s+/)
		.map((sentence) => sentence.trim())
		.filter(Boolean);

	const relevant = sentences.filter((sentence) =>
		/(menu|menus|pricing|price|support|problem|issue|venue|venues|import|upload|partner|integration|print|printer|billing|invoice|admin|garden|gardening|groundwork|groundworks|landscaping|driveway|patio|fence|fencing|quote)/i.test(sentence),
	);

	return relevant.slice(0, 3).map((sentence) => sentence.slice(0, 160));
}

function summariseLatestThread(params: {
	classification: IncomingEmailClassification;
	bodyText: string;
}): string {
	const firstSentence = params.bodyText
		.split(/(?<=[.!?])\s+/)
		.map((sentence) => sentence.trim())
		.find(Boolean);

	return `${params.classification.category}: ${firstSentence ?? "No clear summary available."}`.slice(0, 220);
}

function buildNextFollowUpItem(params: {
	classification: IncomingEmailClassification;
	memory: ContactMemory;
}): string | null {
	switch (params.classification.category) {
		case "sales_new_venue_enquiry":
			return "Await the work scope, site details, and any quote or availability questions.";
		case "support":
			return "Await the specific issue details or examples if the problem is still unclear.";
		case "billing_admin":
			return "Await billing or account context if more detail is needed.";
		case "partnership":
			return "Await the proposed partnership scope and intended outcome.";
		case "supplier_printer_collaboration":
			return "Await collaboration details and how it would fit the current workflow.";
		default:
			return null;
	}
}

function inferRelationshipType(params: {
	existing: ContactRelationshipType;
	classification: IncomingEmailClassification;
	bodyText: string;
}): ContactRelationshipType {
	if (/(customer|we use this service|our account)/i.test(params.bodyText)) {
		return "customer";
	}

	switch (params.classification.category) {
		case "sales_new_venue_enquiry":
			return "prospect";
		case "partnership":
			return "partner";
		case "supplier_printer_collaboration":
			return "supplier";
		case "support":
		case "billing_admin":
			return params.existing === "unknown" ? "customer" : params.existing;
		default:
			return params.existing;
	}
}

export function getOrCreateContactMemory(
	state: MailboxAgentState,
	senderEmail: string,
	senderName?: string | null,
): ContactMemory {
	const existing = state.contacts[senderEmail];
	if (existing) {
		return existing;
	}

	return {
		senderEmail,
		senderName: senderName ?? null,
		venueOrCompanyName: null,
		venueType: null,
		numberOfVenues: null,
		relationshipType: "unknown",
		interestsOrProblems: [],
		lastThreadSummary: null,
		nextFollowUpItem: null,
		lastCategory: null,
		lastUpdatedAt: new Date().toISOString(),
	};
}

export function updateContactMemory(params: {
	existing: ContactMemory;
	classification: IncomingEmailClassification;
	bodyText: string;
	senderName?: string | null;
}): ContactMemory {
	const inferredSenderName = params.senderName ?? extractSenderNameFromText(params.bodyText);
	const venueOrCompanyName = extractVenueOrCompanyName(params.bodyText, params.existing.senderEmail);
	const venueType = extractVenueType(params.bodyText);
	const numberOfVenues = extractNumberOfVenues(params.bodyText);
	const interestsOrProblems = Array.from(new Set([
		...extractInterestsOrProblems(params.bodyText),
		...params.existing.interestsOrProblems,
	])).slice(0, 6);

	const updated: ContactMemory = {
		...params.existing,
		senderName: inferredSenderName ?? params.existing.senderName,
		venueOrCompanyName: venueOrCompanyName ?? params.existing.venueOrCompanyName,
		venueType: venueType ?? params.existing.venueType,
		numberOfVenues: numberOfVenues ?? params.existing.numberOfVenues,
		relationshipType: inferRelationshipType({
			existing: params.existing.relationshipType,
			classification: params.classification,
			bodyText: params.bodyText,
		}),
		interestsOrProblems,
		lastThreadSummary: summariseLatestThread({
			classification: params.classification,
			bodyText: params.bodyText,
		}),
		lastCategory: params.classification.category,
		lastUpdatedAt: new Date().toISOString(),
		nextFollowUpItem: null,
	};

	updated.nextFollowUpItem = buildNextFollowUpItem({
		classification: params.classification,
		memory: updated,
	});

	return updated;
}

function buildInteractivePrompt(params: {
	company: Company;
	knowledge: CompanyKnowledge;
	question: string;
}): string {
	return renderInteractivePrompt({
		companyName: params.company.name,
		companyShortDescription: params.company.shortDescription,
		companyLongDescription: params.company.longDescription,
		knowledgeContext: buildKnowledgeContext(params.knowledge),
		question: params.question,
	});
}

function buildReplySubject(originalSubject: string): string {
	if (/^\s*re:/i.test(originalSubject)) {
		return originalSubject.trim();
	}

	return `Re: ${originalSubject.trim() || "Your email"}`;
}

function summariseForLog(text: string, limit = 200): string {
	const compact = text.replace(/\s+/g, " ").trim();
	if (compact.length <= limit) {
		return compact;
	}

	return `${compact.slice(0, limit)}...`;
}

function extractFirstName(name: string | null | undefined): string | null {
	if (!name) {
		return null;
	}

	const firstName = name.trim().split(/\s+/)[0];
	return firstName || null;
}

function isQuoteStyleEnquiry(subject: string, text: string): boolean {
	return /\bquote\b|\bprice\b|\bpricing\b|\bcost\b|\bhow much\b|\bestimate\b/i.test(`${subject}\n${text}`);
}

function isQuoteFollowUpDetailQuestion(params: {
	latestSubject: string;
	latestEmailText: string;
	threadContext: string;
}): boolean {
	const haystack = `${params.latestSubject}\n${params.latestEmailText}`.toLowerCase();
	const compactLength = haystack.replace(/\s+/g, " ").trim().length;
	if (compactLength > 220) {
		return false;
	}

	const hasReplySubject = /^re:\s*/i.test(params.latestSubject);
	const hasReplyQuoteSubject = /^re:\s*quote\b/i.test(params.latestSubject);
	const hasDetailSignal = /\b(resin|sparkles|colour|color|finish|edging|border|block paving|tarmac|gravel|pattern|premium|budget|photo|picture|image|slope|access|surface|concrete|cracked|next step)\b/i.test(haystack);
	const hasExistingThreadContext = params.threadContext !== "No earlier messages in this thread.";

	return hasReplyQuoteSubject
		|| (hasReplySubject && hasExistingThreadContext)
		|| (hasReplySubject && hasDetailSignal)
		|| (hasExistingThreadContext && hasDetailSignal);
}

function buildQuoteFollowUpReplyContext(params: {
	knowledge: CompanyKnowledge;
	latestEmailText: string;
	latestSubject: string;
	threadContext: string;
}): string | null {
	if (!isQuoteFollowUpDetailQuestion({
		latestSubject: params.latestSubject,
		latestEmailText: params.latestEmailText,
		threadContext: params.threadContext,
	})) {
		return null;
	}

	const haystack = `${params.latestSubject}\n${params.latestEmailText}`.toLowerCase();
	const detectedTopics = [
		/\bpink sparkles?\b/i.test(haystack) ? "pink sparkles" : null,
		/\bgold sparkles?\b/i.test(haystack) ? "gold sparkles" : null,
		/\bresin\b/i.test(haystack) ? "resin" : null,
		/\bblock paving\b/i.test(haystack) ? "block paving" : null,
		/\btarmac\b/i.test(haystack) ? "tarmac" : null,
		/\bgravel\b/i.test(haystack) ? "gravel" : null,
		/\bfinish\b/i.test(haystack) ? "finish" : null,
		/\bcolour\b|\bcolor\b/i.test(haystack) ? "colour" : null,
	].filter(Boolean);
	const guidanceLines = [
		"Detected a short follow-up detail question in an existing quote thread.",
		detectedTopics.length > 0 ? `Detected topics: ${detectedTopics.join(", ")}.` : "Detected topics: general finish or material details.",
		"Answer the customer's latest point directly before asking anything else.",
		"Do not include prices, estimates, ranges, starting prices, budget thresholds, or calculated figures.",
		"Keep the email professional, concise, and commercially helpful, not like a checklist.",
	];

	if (params.knowledge.followUpGuidance?.principles?.length) {
		guidanceLines.push(`Follow-up principles: ${params.knowledge.followUpGuidance.principles.join("; ")}`);
	}

	if (params.knowledge.followUpGuidance?.styleNotes?.length) {
		guidanceLines.push(`Style notes: ${params.knowledge.followUpGuidance.styleNotes.join("; ")}`);
	}

	if (params.knowledge.followUpGuidance?.preferredQuestions?.length) {
		guidanceLines.push(
			`Only ask from these if genuinely needed, and keep it to one or two: ${params.knowledge.followUpGuidance.preferredQuestions.join("; ")}`,
		);
	}

	if (params.knowledge.voiceGuidance?.preferredOpeners?.length) {
		guidanceLines.push(`Good opener styles for this persona: ${params.knowledge.voiceGuidance.preferredOpeners.join("; ")}`);
	}

	if (params.knowledge.voiceGuidance?.preferredTransitions?.length) {
		guidanceLines.push(`Good transition styles for this persona: ${params.knowledge.voiceGuidance.preferredTransitions.join("; ")}`);
	}

	if (params.knowledge.voiceGuidance?.preferredClosers?.length) {
		guidanceLines.push(`Good closing styles for this persona: ${params.knowledge.voiceGuidance.preferredClosers.join("; ")}`);
	}

	if (params.knowledge.voiceGuidance?.avoidPhrases?.length) {
		guidanceLines.push(`Avoid these flat or generic phrases: ${params.knowledge.voiceGuidance.avoidPhrases.join("; ")}`);
	}

	return guidanceLines.join("\n");
}

function buildStructuredQuoteReply(params: {
	profile: AgentProfile;
	company: Company;
	knowledge: CompanyKnowledge;
	contactMemory: ContactMemory;
	latestEmailText: string;
	latestSubject: string;
	threadContext: string;
}): AgentReply | null {
	const hasReplySubject = /^re:\s*/i.test(params.latestSubject);
	const hasExistingThreadContext = params.threadContext !== "No earlier messages in this thread.";
	if (hasReplySubject && hasExistingThreadContext) {
		return null;
	}

	if (!isQuoteStyleEnquiry(params.latestSubject, params.latestEmailText)) {
		return null;
	}

	const greetingName = extractFirstName(params.contactMemory.senderName);
	const salutation = greetingName ? `Hi ${greetingName},` : "Hi,";
	const quoteFacts = extractQuoteFacts(`${params.latestSubject}\n${params.latestEmailText}`);
	const clarifyingQuestions = buildTailoredClarifyingQuestions(params.knowledge, quoteFacts);
	const phone = params.knowledge.contactDetails?.phone;
	const email = params.profile.emailAddress || params.knowledge.contactDetails?.email;
	const preferenceLead = buildQuotePreferenceLead(quoteFacts);
	const siteDetailsLead = buildQuoteSiteDetailsLead(quoteFacts);
	const quoteTransition = pickVoiceLine(
		params.knowledge.voiceGuidance?.preferredTransitions,
		`${params.latestSubject}:${params.latestEmailText}:transition`,
	) ?? "The most useful next step is to understand the scope properly before discussing pricing.";
	const quoteCloser = pickVoiceLine(
		params.knowledge.voiceGuidance?.preferredClosers,
		`${params.latestSubject}:${params.latestEmailText}:closer`,
	) ?? "If you send over your preferred next step and availability, we can help get that arranged.";

	const bodyLines = [
		salutation,
		"",
		buildStructuredQuoteOpening("project", quoteFacts, params.knowledge, `${params.latestSubject}:${params.latestEmailText}`),
		"",
		`${quoteTransition}${preferenceLead}${siteDetailsLead}`,
		"",
		"Rather than guessing at figures by email, pricing is best handled by a human once the scope, materials, access, and site details are clear.",
		"",
		"Are you working within a particular budget, or would you like us to suggest suitable design, material, and finish options?",
	];

	if (clarifyingQuestions.length > 0) {
		const detailQuestions = clarifyingQuestions
			.filter((question) => !/\bbudget\b/i.test(question))
			.slice(0, 1);
		bodyLines.push(
			"",
			detailQuestions.length > 0
				? `It would also help to know: ${detailQuestions[0]}`
				: "If you have photos, measurements, or a preferred finish, please send those over as well.",
		);
	}

	bodyLines.push(
		"",
		"The best next step is a quick phone chat, a design consultation, or a site visit so the right person can look at it properly and follow up with a written quotation.",
		"",
		quoteCloser
	);

	if (phone || email) {
		bodyLines.push("", "You can also reach us here:");
		if (phone) {
			bodyLines.push(`- Phone: ${phone}`);
		}
		if (email) {
			bodyLines.push(`- Email: ${email}`);
		}
	}

	bodyLines.push("", `${params.profile.name}`);

	return {
		subject: buildReplySubject(params.latestSubject),
		text: bodyLines.join("\n"),
	};
}

function buildStructuredQuoteOpening(
	serviceIntro: string,
	quoteFacts: QuoteFacts,
	knowledge: CompanyKnowledge,
	seed: string,
): string {
	const finishLabel =
		quoteFacts.preferredFinish === "block_paving"
			? "block paving"
			: quoteFacts.preferredFinish === "tarmac"
				? "tarmac"
				: quoteFacts.preferredFinish === "gravel"
					? "gravel"
					: quoteFacts.preferredFinish === "resin"
						? "resin"
						: null;

	const preferredOpener = pickVoiceLine(knowledge.voiceGuidance?.preferredOpeners, seed);

	if (quoteFacts.areaSqM && finishLabel) {
		return preferredOpener
			? `${preferredOpener} A ${quoteFacts.areaSqM} m² ${finishLabel} ${serviceIntro} job is something we can look at for you.`
			: `Yes, a ${quoteFacts.areaSqM} m² ${finishLabel} ${serviceIntro} job is something we can look at for you.`;
	}

	if (finishLabel) {
		return preferredOpener
			? `${preferredOpener} ${finishLabel} ${serviceIntro} is something we can look at for you.`
			: `Yes, ${finishLabel} ${serviceIntro} is something we can look at for you.`;
	}

	return preferredOpener
		? `${preferredOpener} That kind of ${serviceIntro} job is something we can look at for you.`
		: `Yes, that is the sort of ${serviceIntro} job we can look at for you.`;
}

type QuoteFacts = {
	areaSqM: number | null;
	preferredFinish: "resin" | "block_paving" | "tarmac" | "gravel" | null;
	finishLevel: "budget" | "standard" | "premium" | null;
	hasSlope: boolean;
	hasPoorAccess: boolean;
	hasWaterlogging: boolean;
	hasClay: boolean;
};

function extractQuoteFacts(haystack: string): QuoteFacts {
	const normalized = haystack.toLowerCase();
	const areaMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:square metres|square meters|sq m|sqm|m2|m²)/i);
	const areaSqM = areaMatch ? Number.parseFloat(areaMatch[1]) : null;

	let preferredFinish: QuoteFacts["preferredFinish"] = null;
	if (/\bresin(?:-bound|-style)?\b/i.test(normalized)) {
		preferredFinish = "resin";
	} else if (/\bblock paving\b/i.test(normalized)) {
		preferredFinish = "block_paving";
	} else if (/\btarmac\b/i.test(normalized)) {
		preferredFinish = "tarmac";
	} else if (/\bgravel\b/i.test(normalized)) {
		preferredFinish = "gravel";
	}

	let finishLevel: QuoteFacts["finishLevel"] = null;
	if (/\bpremium\b|\bhigh[- ]end\b|\bluxury\b|\bsmart\b/i.test(normalized)) {
		finishLevel = "premium";
	} else if (/\bbudget\b|\bbasic\b/i.test(normalized)) {
		finishLevel = "budget";
	} else if (/\bstandard\b/i.test(normalized)) {
		finishLevel = "standard";
	}

	return {
		areaSqM,
		preferredFinish,
		finishLevel,
		hasSlope: /\bslope\b|\bsloped\b|\buneven\b/i.test(normalized),
		hasPoorAccess: /\bpoor access\b|\btight access\b|\blimited access\b/i.test(normalized),
		hasWaterlogging: /\bwaterlog(?:ged|ging)?\b|\bdrainage issue\b/i.test(normalized),
		hasClay: /\bclay\b/i.test(normalized),
	};
}

function buildTailoredClarifyingQuestions(
	knowledge: CompanyKnowledge,
	quoteFacts: QuoteFacts,
): string[] {
	const questions = knowledge.quoteGuidance?.clarifyingQuestions?.slice(0, 3) ?? [];
	return questions.filter((question) => {
		if (quoteFacts.areaSqM && /approximate area|length/i.test(question)) {
			return false;
		}
		if (quoteFacts.finishLevel && /finish level/i.test(question)) {
			return false;
		}
		if (
			(quoteFacts.hasSlope || quoteFacts.hasPoorAccess || quoteFacts.hasWaterlogging || quoteFacts.hasClay)
			&& /special site conditions/i.test(question)
		) {
			return false;
		}
		return true;
	});
}

function buildQuotePreferenceLead(quoteFacts: QuoteFacts): string {
	const parts: string[] = [];

	if (quoteFacts.preferredFinish === "resin") {
		parts.push(" Resin can be a good option if you want a clean, smart finish.");
	} else if (quoteFacts.preferredFinish === "block_paving") {
		parts.push(" Block paving can work well if you want more pattern and definition.");
	} else if (quoteFacts.preferredFinish === "tarmac") {
		parts.push(" Tarmac can work well if you want something practical and tidy.");
	} else if (quoteFacts.preferredFinish === "gravel") {
		parts.push(" Gravel can be a good option if you want something simpler.");
	}

	if (quoteFacts.finishLevel === "premium") {
		parts.push(" A more premium finish gives a clearer steer on the look you are after.");
	} else if (quoteFacts.finishLevel === "budget") {
		parts.push(" Knowing that you are budget-conscious is helpful because it narrows the finish options.");
	}

	return parts.join("");
}

function buildQuoteSiteDetailsLead(quoteFacts: QuoteFacts): string {
	if (quoteFacts.hasSlope) {
		return " The slope is worth flagging as well, because that can affect the prep and drainage side of the job.";
	}
	if (quoteFacts.hasPoorAccess) {
		return " Access is useful to know early, because that can affect labour and prep.";
	}
	if (quoteFacts.hasWaterlogging) {
		return " Drainage is worth flagging early, because that can change the prep work needed.";
	}
	if (quoteFacts.hasClay) {
		return " Clay ground is useful to know about early, because it can affect the prep and base work.";
	}
	return "";
}

function lowercaseFirstLetter(value: string): string {
	if (!value) {
		return value;
	}

	return value.charAt(0).toLowerCase() + value.slice(1);
}

function pickVoiceLine(lines: string[] | undefined, seed: string): string | null {
	if (!lines || lines.length === 0) {
		return null;
	}

	let hash = 0;
	for (let i = 0; i < seed.length; i += 1) {
		hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
	}

	return lines[hash % lines.length] ?? null;
}

function sanitiseGeneratedReplyText(text: string): string {
	let cleaned = text;

	cleaned = cleaned.replace(
		/\b(?:I would need to|I'd need to|we would need to|we'd need to)\s+check with (?:our )?suppliers?\b[^.?!]*[.?!]/gi,
		"It may be possible, but I would want to pin down the exact finish first rather than overpromise. "
	);

	cleaned = cleaned.replace(
		/\b(?:I will|I'll|we will|we'll)\s+check with (?:our )?suppliers?\b[^.?!]*[.?!]/gi,
		"I would want to pin down the exact finish first rather than overpromise. "
	);

	cleaned = cleaned.replace(
		/\b(?:supplier|suppliers)\b/gi,
		"finish options"
	);

	return normaliseWhitespace(cleaned);
}

function buildAgentFallbackReply(params: {
	company: Company;
	classification: IncomingEmailClassification;
	contactMemory: ContactMemory;
	latestEmailText: string;
	latestSubject?: string;
	replyMode?: "default" | "quote_follow_up_detail";
	knowledge?: CompanyKnowledge;
}): string {
	if (params.replyMode === "quote_follow_up_detail") {
		const preferredQuestions = params.knowledge?.followUpGuidance?.preferredQuestions?.slice(0, 2) ?? [];
		const lines = [
			"That could be something we work with, but I’d want to pin down the exact finish and the look you’re after before saying yes too confidently.",
		];

		if (preferredQuestions.length > 0) {
			lines.push(
				"",
				"To point you the right way, send me:",
				...preferredQuestions.map((question) => `- ${question}`),
			);
		}

		return lines.join("\n");
	}

	if (params.classification.category === "support") {
		return "Thanks for your email. I’m sorry you’ve run into a problem. If you can send a little more detail about what’s happening, including any error message or the step you were trying to complete, I’ll do my best to help.";
	}

	if (params.classification.category === "sales_new_venue_enquiry") {
		const venueReference = params.contactMemory.venueOrCompanyName
			? ` for ${params.contactMemory.venueOrCompanyName}`
			: "";
		return `Thanks for getting in touch${venueReference}. If you send me a bit more about the job, I can help point you in the right direction and work out the next step without guessing.`;
	}

	if (/\bpricing\b|\bprice\b|\bcost\b/i.test(params.latestEmailText)) {
		return `Thanks for your email. Pricing is best handled by a human once the scope and site details are clear. Are you working within a particular budget, or would you like us to suggest suitable options? From there, we can help arrange a phone chat, design consultation, or site visit.`;
	}

	if (params.latestEmailText.trim().length <= 20) {
		return `Thanks for your email. I’m sorry, but I’m not sure I understood your last message. If you can send a little more detail about what you need from ${params.company.name}, I’ll do my best to help.`;
	}

	return `Thanks for your email. If you send me a little more detail about what you need from ${params.company.name}, I can help point you in the right direction and get the next step moving.`;
}

function isSafeOverviewQuestion(params: {
	companyName: string;
	subject: string;
	bodyText: string;
	classification: IncomingEmailClassification;
}): boolean {
	const haystack = `${params.subject}\n${params.bodyText}`.toLowerCase();
	const companyName = params.companyName.toLowerCase();
	const combinedLength = haystack.replace(/\s+/g, " ").trim().length;
	const exclusionKeywords = [
		...SUPPORT_KEYWORDS,
		...BILLING_KEYWORDS,
		...PARTNERSHIP_KEYWORDS,
		...SUPPLIER_KEYWORDS,
		"invoice",
		"payment",
		"integration",
		"printer",
		"problem",
		"error",
		"bug",
	];

	if (combinedLength > 280) {
		return false;
	}

	if (isPricingQuestion(params.bodyText, params.subject)) {
		return false;
	}

	if (params.classification.category === "spam_irrelevant") {
		return false;
	}

	if (includesAny(haystack, exclusionKeywords).length > 0) {
		return false;
	}

	const overviewSignals = [
		"tell me about",
		"what do you do",
		"what is this",
		"what is your",
		"what does your company do",
		"can you explain",
		"how does it work",
		"how do you work",
		"what is your service",
		"what is your product",
		"what is your platform",
		"who are you",
		"introduce yourself",
		"can you tell me about",
	];

	const mentionsCompany = companyName.length > 1 && haystack.includes(companyName);
	const hasOverviewSignal = includesAny(haystack, overviewSignals).length > 0;
	const startsLikeOverviewQuestion = /^(tell|what|how|who|can|could|would|please)\b/i.test(params.bodyText.trim());
	const asksQuestion = /\?/.test(haystack) || startsLikeOverviewQuestion;
	const shortCompanyIntroRequest = mentionsCompany && combinedLength <= 120;

	return (hasOverviewSignal && asksQuestion) || (shortCompanyIntroRequest && asksQuestion);
}

function shouldEscalateToHuman(params: {
	profile: AgentProfile;
	company: Company;
	knowledge: CompanyKnowledge;
	classification: IncomingEmailClassification;
	latestEmailText: string;
	latestSubject: string;
}): ReplyDecision {
	if (params.profile.escalationMode === "always_reply") {
		return {
			action: params.profile.customerReplyMode === "draft" ? "draft" : "reply",
			reason: "profile_always_reply",
		};
	}

	if (isPricingQuestion(params.latestEmailText, params.latestSubject) && params.knowledge.pricing.status !== "known") {
		return {
			action: "escalate",
			reason: "pricing_not_in_knowledge",
		};
	}

	if (params.classification.category === "billing_admin"
		|| params.classification.category === "partnership"
		|| params.classification.category === "supplier_printer_collaboration") {
		return {
			action: "escalate",
			reason: `category_${params.classification.category}`,
		};
	}

	if (isSafeOverviewQuestion({
		companyName: params.company.name,
		subject: params.latestSubject,
		bodyText: params.latestEmailText,
		classification: params.classification,
	})) {
		return {
			action: params.profile.customerReplyMode === "draft" ? "draft" : "reply",
			reason: "safe_overview_question",
		};
	}

	if (params.classification.confidence === "low") {
		return {
			action: "escalate",
			reason: "low_confidence",
		};
	}

	if (params.latestEmailText.trim().length < 25) {
		return {
			action: "escalate",
			reason: "insufficient_context",
		};
	}

	if (params.profile.customerReplyMode === "draft") {
		return {
			action: "draft",
			reason: "profile_customer_reply_mode_draft",
		};
	}

	return {
		action: "reply",
		reason: "grounded_auto_reply_allowed",
	};
}

export async function generateAgentReply(params: {
	profile: AgentProfile;
	company: Company;
	env: Env;
	knowledge: CompanyKnowledge;
	classification: IncomingEmailClassification;
	contactMemory: ContactMemory;
	threadContext: string;
	latestEmailText: string;
	latestSubject: string;
	sessionAffinity?: string;
}): Promise<AgentReply> {
	const quoteFollowUpContext = buildQuoteFollowUpReplyContext({
		knowledge: params.knowledge,
		latestEmailText: params.latestEmailText,
		latestSubject: params.latestSubject,
		threadContext: params.threadContext,
	});

	if (!quoteFollowUpContext) {
		const structuredQuoteReply = buildStructuredQuoteReply({
			profile: params.profile,
			company: params.company,
			knowledge: params.knowledge,
			contactMemory: params.contactMemory,
			latestEmailText: params.latestEmailText,
			latestSubject: params.latestSubject,
			threadContext: params.threadContext,
		});
		if (structuredQuoteReply) {
			console.log("Mailbox agent used structured quote reply", JSON.stringify({
				subject: params.latestSubject,
				classification: params.classification.category,
				replyLength: structuredQuoteReply.text.length,
			}));
			return structuredQuoteReply;
		}
	}

	const workersai = createWorkersAI({ binding: params.env.AI });
	const system = buildAgentSystemPrompt({
		profile: params.profile,
		company: params.company,
		knowledge: params.knowledge,
		classification: params.classification,
		contactMemory: params.contactMemory,
		threadContext: params.threadContext,
	});

	const userPrompt = renderReplyPrompt({
		latestSubject: params.latestSubject,
		latestEmailText: params.latestEmailText,
		replyMode: quoteFollowUpContext ? "quote_follow_up_detail" : "default",
		replyContext: quoteFollowUpContext ?? undefined,
	});

	console.log("Mailbox agent generateReply input", JSON.stringify({
		subject: params.latestSubject,
		classification: params.classification.category,
		latestEmailTextLength: params.latestEmailText.length,
		latestEmailPreview: summariseForLog(params.latestEmailText),
		threadContextLength: params.threadContext.length,
		contactEmail: params.contactMemory.senderEmail,
		replyMode: quoteFollowUpContext ? "quote_follow_up_detail" : "default",
	}));

	const result = await generateText({
		model: workersai(DEFAULT_REPLY_MODEL, params.sessionAffinity ? {
			sessionAffinity: params.sessionAffinity,
		} : undefined),
		system,
		prompt: userPrompt,
		temperature: 0.2,
		maxOutputTokens: 700,
	});
	const generatedText = sanitiseGeneratedReplyText(result.text ?? "");
	if (!generatedText) {
		console.warn("Mailbox agent generateReply returned empty text", JSON.stringify({
			subject: params.latestSubject,
			classification: params.classification.category,
			latestEmailPreview: summariseForLog(params.latestEmailText),
		}));
		return {
			subject: buildReplySubject(params.latestSubject),
			text: "",
		};
	}

	return {
		subject: buildReplySubject(params.latestSubject),
		text: generatedText,
	};
}

async function sendAgentReply(params: {
	profile: AgentProfile;
	env: Env;
	mailboxId: string;
	originalEmail: EmailFull;
	reply: AgentReply;
}): Promise<void> {
	const stub = getMailboxStub(params.env, params.mailboxId);
	if (!import.meta.env.DEV) {
		const rateLimitError = await (stub as unknown as {
			checkSendRateLimit: () => Promise<string | null>;
		}).checkSendRateLimit();

		if (rateLimitError) {
			throw new Error(rateLimitError);
		}
	}

	const fromDomain = params.mailboxId.split("@")[1];
	if (!fromDomain) {
		throw new Error(`Invalid mailbox address: ${params.mailboxId}`);
	}

	const { originalMsgId, references, threadId } = buildReferencesChain(params.originalEmail);
	const { messageId, outgoingMessageId } = generateMessageId(fromDomain);

	await sendEmail(params.env.EMAIL, {
		to: params.originalEmail.sender ?? "",
		from: {
			email: params.mailboxId,
			name: params.profile.name,
		},
		subject: params.reply.subject,
		text: params.reply.text,
		html: textToHtml(params.reply.text),
		headers: buildThreadingHeaders(originalMsgId, references),
	});

	await stub.createEmail(
		Folders.SENT,
		{
			id: messageId,
			subject: params.reply.subject,
			sender: params.mailboxId.toLowerCase(),
			recipient: (params.originalEmail.sender ?? "").toLowerCase(),
			date: new Date().toISOString(),
			body: textToHtml(params.reply.text),
			in_reply_to: originalMsgId,
			email_references: JSON.stringify(references),
			thread_id: threadId,
			message_id: outgoingMessageId,
			raw_headers: JSON.stringify([
				{
					key: "from",
					value: `${params.profile.name} <${params.mailboxId}>`,
				},
				{ key: "to", value: params.originalEmail.sender ?? "" },
				{ key: "subject", value: params.reply.subject },
				{ key: "date", value: new Date().toISOString() },
				{ key: "message-id", value: `<${outgoingMessageId}>` },
				{ key: "in-reply-to", value: `<${originalMsgId}>` },
				...(references.length > 0
					? [{
						key: "references",
						value: references.map((reference) => `<${reference}>`).join(" "),
					}]
					: []),
			]),
		},
		[],
	);
}

async function createReplyDraft(params: {
	profile: AgentProfile;
	env: Env;
	mailboxId: string;
	originalEmail: EmailFull;
	reply: AgentReply;
}): Promise<string> {
	const stub = getMailboxStub(params.env, params.mailboxId);
	const draftId = crypto.randomUUID();
	const threadId = params.originalEmail.thread_id || params.originalEmail.id;
	const quotedBlock = buildQuotedReplyBlock({
		date: params.originalEmail.date,
		sender: params.originalEmail.sender ?? "",
		body: params.originalEmail.body ?? undefined,
	});

	await stub.createEmail(
		Folders.DRAFT,
		{
			id: draftId,
			subject: params.reply.subject,
			sender: params.mailboxId.toLowerCase(),
			recipient: (params.originalEmail.sender ?? "").toLowerCase(),
			date: new Date().toISOString(),
			body: `${textToHtml(params.reply.text)}${quotedBlock}`,
			in_reply_to: params.originalEmail.id,
			email_references: null,
			thread_id: threadId,
		},
		[],
	);

	return draftId;
}

async function sendHumanEscalationEmail(params: {
	profile: AgentProfile;
	env: Env;
	mailboxId: string;
	originalEmail: EmailFull;
	classification: IncomingEmailClassification;
	latestEmailText: string;
	threadContext: string;
	reason: string;
}): Promise<{ storedInHumanMailbox: boolean; messageId: string }> {
	const subject = `${params.profile.name} handoff: ${params.originalEmail.subject || "Customer email"}`;
	const body = [
		`${params.profile.name} escalated this thread for human review.`,
		"",
		`Reason: ${params.reason}`,
		`Mailbox: ${params.mailboxId}`,
		`Customer: ${params.originalEmail.sender ?? "unknown"}`,
		`Classification: ${params.classification.category} (${params.classification.confidence})`,
		`Subject: ${params.originalEmail.subject || ""}`,
		"",
		"Latest extracted message:",
		params.latestEmailText || "(empty)",
		"",
		"Thread context:",
		params.threadContext,
	].join("\n");
	const fromDomain = params.mailboxId.split("@")[1];
	if (!fromDomain) {
		throw new Error(`Invalid mailbox address: ${params.mailboxId}`);
	}

	const { messageId, outgoingMessageId } = generateMessageId(fromDomain);
	const sentStub = getMailboxStub(params.env, params.mailboxId);

	await sentStub.createEmail(
		Folders.SENT,
		{
			id: messageId,
			subject,
			sender: params.mailboxId.toLowerCase(),
			recipient: params.profile.humanEscalationEmail.toLowerCase(),
			date: new Date().toISOString(),
			body: textToHtml(body),
			in_reply_to: params.originalEmail.message_id || params.originalEmail.id,
			email_references: params.originalEmail.email_references ?? null,
			thread_id: params.originalEmail.thread_id || params.originalEmail.id,
			message_id: outgoingMessageId,
			raw_headers: JSON.stringify([
				{
					key: "from",
					value: `${params.profile.name} <${params.mailboxId}>`,
				},
				{ key: "to", value: params.profile.humanEscalationEmail },
				{ key: "subject", value: subject },
				{ key: "date", value: new Date().toISOString() },
				{ key: "message-id", value: `<${outgoingMessageId}>` },
			]),
		},
		[],
	);

	await sendEmail(params.env.EMAIL, {
		to: params.profile.humanEscalationEmail,
		from: {
			email: params.mailboxId,
			name: params.profile.name,
		},
		subject,
		text: body,
		html: textToHtml(body),
	});

	const targetMailboxExists = await params.env.BUCKET.head(
		`mailboxes/${params.profile.humanEscalationEmail.toLowerCase()}.json`,
	);

	if (targetMailboxExists) {
		const targetStub = getMailboxStub(params.env, params.profile.humanEscalationEmail.toLowerCase());
		await targetStub.createEmail(
			Folders.INBOX,
			{
				id: messageId,
				subject,
				sender: params.mailboxId.toLowerCase(),
				recipient: params.profile.humanEscalationEmail.toLowerCase(),
				date: new Date().toISOString(),
				body: textToHtml(body),
				in_reply_to: params.originalEmail.message_id || params.originalEmail.id,
				email_references: params.originalEmail.email_references ?? null,
				thread_id: params.originalEmail.thread_id || params.originalEmail.id,
				message_id: outgoingMessageId,
				raw_headers: JSON.stringify([
					{
						key: "from",
						value: `${params.profile.name} <${params.mailboxId}>`,
					},
					{ key: "to", value: params.profile.humanEscalationEmail },
					{ key: "subject", value: subject },
					{ key: "date", value: new Date().toISOString() },
					{ key: "message-id", value: `<${outgoingMessageId}>` },
				]),
				read: false,
			},
			[],
		);
	}

	return {
		storedInHumanMailbox: Boolean(targetMailboxExists),
		messageId,
	};
}

export class EmailAgent extends AIChatAgent<Env, MailboxAgentState> {
	initialState = DEFAULT_STATE;

	async onChatMessage(onFinish: any, _options?: any) {
		const mailboxContext = resolveMailboxContext(this.name);
		const { profile, company, knowledge } = mailboxContext;
		const workersai = createWorkersAI({ binding: this.env.AI });
		const question = this.messages.at(-1)?.parts
			.filter((part): part is { type: "text"; text: string } => part.type === "text")
			.map((part) => part.text)
			.join("\n")
			.trim() ?? `Tell me about ${company.name}.`;
		const prompt = renderInteractivePrompt({
			companyName: company.name,
			companyShortDescription: company.shortDescription,
			companyLongDescription: company.longDescription,
			knowledgeContext: `${buildKnowledgeContext(knowledge)}

You are ${profile.name}, the ${profile.role} at ${profile.emailAddress}. Use ${profile.tone}.`,
			question,
		});

		const result = streamText({
			model: workersai(DEFAULT_REPLY_MODEL, { sessionAffinity: this.sessionAffinity }),
			prompt,
			onFinish,
		});

		return result.toUIMessageStreamResponse();
	}

	async onRequest(request: Request): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/onNewEmail" && request.method === "POST") {
			let emailData: NewEmailPayload | null = null;
			try {
				emailData = await request.json() as NewEmailPayload;
				const result = await this.handleNewEmail(emailData);
				return new Response(JSON.stringify(result), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (error) {
				const typedError = error as Error;
				console.error("Mailbox agent onNewEmail failed", JSON.stringify({
					message: typedError.message,
					stack: typedError.stack ?? null,
					mailboxId: emailData?.mailboxId ?? null,
					emailId: emailData?.emailId ?? null,
					sender: emailData?.sender ?? null,
					senderName: emailData?.senderName ?? null,
					subject: emailData?.subject ?? null,
					threadId: emailData?.threadId ?? null,
				}));
				return new Response(JSON.stringify({
					status: "error",
					error: typedError.message,
				}), {
					status: 500,
					headers: { "Content-Type": "application/json" },
				});
			}
		}

		return super.onRequest(request);
	}

	async handleNewEmail(emailData: NewEmailPayload) {
		const mailboxContext = resolveMailboxContext(emailData.mailboxId);
		const { profile, company, knowledge } = mailboxContext;
		console.log("Mailbox agent onNewEmail received", JSON.stringify({
			mailboxId: emailData.mailboxId,
			emailId: emailData.emailId,
			sender: emailData.sender,
			senderName: emailData.senderName ?? null,
			subject: emailData.subject,
			threadId: emailData.threadId,
		}));

		const stub = getMailboxStub(this.env, emailData.mailboxId);
		const originalEmail = (await stub.getEmail(emailData.emailId)) as EmailFull | null;

		if (!originalEmail) {
			throw new Error(`Email not found: ${emailData.emailId}`);
		}

		const bodyLooksUnsafe = await isPromptInjection(this.env.AI, originalEmail.body);
		if (bodyLooksUnsafe) {
			const reason = "prompt_injection_detected";
			console.warn("Mailbox agent blocked email due to prompt injection", JSON.stringify({
				mailboxId: emailData.mailboxId,
				emailId: emailData.emailId,
				sender: emailData.sender,
				threadId: emailData.threadId,
			}));
			const escalation = await sendHumanEscalationEmail({
				profile,
				env: this.env,
				mailboxId: emailData.mailboxId,
				originalEmail,
				classification: { category: "general_question", confidence: "low", reasons: [reason] },
				latestEmailText: extractBestEmailText(originalEmail.body),
				threadContext: "No earlier messages in this thread.",
				reason,
			});
			console.log("Mailbox agent escalated to human", JSON.stringify({
				mailboxId: emailData.mailboxId,
				emailId: emailData.emailId,
				threadId: emailData.threadId,
				reason,
				humanEscalationEmail: profile.humanEscalationEmail,
				storedInHumanMailbox: escalation.storedInHumanMailbox,
				messageId: escalation.messageId,
			}));
			return {
				status: "escalated",
				reason,
			};
		}

		const latestEmailText = extractBestEmailText(originalEmail.body);
		console.log("Mailbox agent extracted inbound text", JSON.stringify({
			mailboxId: emailData.mailboxId,
			emailId: emailData.emailId,
			sender: emailData.sender,
			threadId: emailData.threadId,
			textLength: latestEmailText.length,
			textPreview: summariseForLog(latestEmailText),
		}));
		const classification = classifyIncomingEmail({
			subject: originalEmail.subject ?? emailData.subject,
			bodyText: latestEmailText,
			senderEmail: emailData.sender,
		});
		console.log("Mailbox agent classified email", JSON.stringify({
			mailboxId: emailData.mailboxId,
			emailId: emailData.emailId,
			sender: emailData.sender,
			threadId: emailData.threadId,
			category: classification.category,
			confidence: classification.confidence,
			reasons: classification.reasons,
		}));

		const existingMemory = getOrCreateContactMemory(
			MailboxAgentStateSchema.parse(this.state ?? DEFAULT_STATE),
			emailData.sender.toLowerCase(),
			emailData.senderName,
		);
		const updatedMemory = updateContactMemory({
			existing: existingMemory,
			classification,
			bodyText: latestEmailText,
			senderName: emailData.senderName,
		});

		this.setState({
			...MailboxAgentStateSchema.parse(this.state ?? DEFAULT_STATE),
			contacts: {
				...MailboxAgentStateSchema.parse(this.state ?? DEFAULT_STATE).contacts,
				[emailData.sender.toLowerCase()]: updatedMemory,
			},
		});

		if (classification.category === "spam_irrelevant") {
			console.warn("Mailbox agent ignored email as spam/irrelevant", JSON.stringify({
				mailboxId: emailData.mailboxId,
				emailId: emailData.emailId,
				sender: emailData.sender,
				threadId: emailData.threadId,
				reasons: classification.reasons,
			}));
			return {
				status: "ignored",
				category: classification.category,
				reasons: classification.reasons,
			};
		}

		const threadEmails = (await stub.getEmails({
			thread_id: emailData.threadId,
			sortColumn: "date",
			sortDirection: "ASC",
			limit: 100,
			page: 1,
		})) as Array<{ id: string }>;
		const fullThread = await Promise.all(
			threadEmails.map(async (email) => (await stub.getEmail(email.id)) as EmailFull | null),
		);
		const threadContext = buildThreadContext(fullThread.filter((email): email is EmailFull => Boolean(email)));
		if (threadContext !== "No earlier messages in this thread.") {
			const threadLooksUnsafe = await isPromptInjection(this.env.AI, threadContext);
			if (threadLooksUnsafe) {
				const reason = "thread_prompt_injection_detected";
				console.warn("Mailbox agent blocked thread due to prompt injection", JSON.stringify({
					mailboxId: emailData.mailboxId,
					emailId: emailData.emailId,
					sender: emailData.sender,
					threadId: emailData.threadId,
				}));
				const escalation = await sendHumanEscalationEmail({
					profile,
					env: this.env,
					mailboxId: emailData.mailboxId,
					originalEmail,
					classification,
					latestEmailText,
					threadContext,
					reason,
				});
				console.log("Mailbox agent escalated to human", JSON.stringify({
					mailboxId: emailData.mailboxId,
					emailId: emailData.emailId,
					threadId: emailData.threadId,
					reason,
					humanEscalationEmail: profile.humanEscalationEmail,
					storedInHumanMailbox: escalation.storedInHumanMailbox,
					messageId: escalation.messageId,
				}));
				return {
					status: "escalated",
					reason,
				};
			}
		}

		const decision = shouldEscalateToHuman({
			profile,
			company,
			knowledge,
			classification,
			latestEmailText,
			latestSubject: originalEmail.subject ?? emailData.subject,
		});
		console.log("Mailbox agent reply decision", JSON.stringify({
			mailboxId: emailData.mailboxId,
			emailId: emailData.emailId,
			threadId: emailData.threadId,
			action: decision.action,
			reason: decision.reason,
		}));

		if (decision.action === "escalate") {
			const escalation = await sendHumanEscalationEmail({
				profile,
				env: this.env,
				mailboxId: emailData.mailboxId,
				originalEmail,
				classification,
				latestEmailText,
				threadContext,
				reason: decision.reason,
			});
			console.log("Mailbox agent escalated to human", JSON.stringify({
				mailboxId: emailData.mailboxId,
				emailId: emailData.emailId,
				threadId: emailData.threadId,
				reason: decision.reason,
				humanEscalationEmail: profile.humanEscalationEmail,
				storedInHumanMailbox: escalation.storedInHumanMailbox,
				messageId: escalation.messageId,
			}));
			return {
				status: "escalated",
				category: classification.category,
				reason: decision.reason,
			};
		}

		const reply = await generateAgentReply({
			profile,
			company,
			env: this.env,
			knowledge,
			classification,
			contactMemory: updatedMemory,
			threadContext,
			latestEmailText,
			latestSubject: originalEmail.subject ?? emailData.subject,
			sessionAffinity: this.sessionAffinity,
		});
		console.log("Mailbox agent generated reply", JSON.stringify({
			mailboxId: emailData.mailboxId,
			emailId: emailData.emailId,
			sender: emailData.sender,
			threadId: emailData.threadId,
			subject: reply.subject,
			replyLength: reply.text.length,
		}));

		if (!reply.text) {
			if (profile.escalationMode === "always_reply") {
				const fallbackReply: AgentReply = {
					subject: buildReplySubject(originalEmail.subject ?? emailData.subject),
					text: buildAgentFallbackReply({
						company,
						classification,
						contactMemory: updatedMemory,
						latestEmailText,
						latestSubject: originalEmail.subject ?? emailData.subject,
						replyMode: isQuoteFollowUpDetailQuestion({
							latestSubject: originalEmail.subject ?? emailData.subject,
							latestEmailText,
							threadContext,
						}) ? "quote_follow_up_detail" : "default",
						knowledge,
					}),
				};
				console.warn("Mailbox agent used fallback reply", JSON.stringify({
					mailboxId: emailData.mailboxId,
					emailId: emailData.emailId,
					threadId: emailData.threadId,
					classification: classification.category,
					replyLength: fallbackReply.text.length,
				}));

				if (decision.action === "draft") {
					const draftId = await createReplyDraft({
						profile,
						env: this.env,
						mailboxId: emailData.mailboxId,
						originalEmail,
						reply: fallbackReply,
					});
					console.log("Mailbox agent drafted fallback reply", JSON.stringify({
						mailboxId: emailData.mailboxId,
						emailId: emailData.emailId,
						threadId: emailData.threadId,
						draftId,
					}));
					return {
						status: "drafted",
						category: classification.category,
						subject: fallbackReply.subject,
						draftId,
					};
				}

				await sendAgentReply({
					profile,
					env: this.env,
					mailboxId: emailData.mailboxId,
					originalEmail,
					reply: fallbackReply,
				});
				console.log("Mailbox agent sent fallback reply", JSON.stringify({
					mailboxId: emailData.mailboxId,
					emailId: emailData.emailId,
					threadId: emailData.threadId,
					subject: fallbackReply.subject,
				}));
				return {
					status: "replied",
					category: classification.category,
					subject: fallbackReply.subject,
				};
			}

			const escalation = await sendHumanEscalationEmail({
				profile,
				env: this.env,
				mailboxId: emailData.mailboxId,
				originalEmail,
				classification,
				latestEmailText,
				threadContext,
				reason: "empty_model_reply",
			});
			console.log("Mailbox agent escalated to human", JSON.stringify({
				mailboxId: emailData.mailboxId,
				emailId: emailData.emailId,
				threadId: emailData.threadId,
				reason: "empty_model_reply",
				humanEscalationEmail: profile.humanEscalationEmail,
				storedInHumanMailbox: escalation.storedInHumanMailbox,
				messageId: escalation.messageId,
			}));
			return {
				status: "escalated",
				category: classification.category,
				reason: "empty_model_reply",
			};
		}

		if (decision.action === "draft") {
			const draftId = await createReplyDraft({
				profile,
				env: this.env,
				mailboxId: emailData.mailboxId,
				originalEmail,
				reply,
			});
			console.log("Mailbox agent drafted reply", JSON.stringify({
				mailboxId: emailData.mailboxId,
				emailId: emailData.emailId,
				sender: emailData.sender,
				threadId: emailData.threadId,
				subject: reply.subject,
				draftId,
			}));
			return {
				status: "drafted",
				category: classification.category,
				subject: reply.subject,
				draftId,
			};
		}

		await sendAgentReply({
			profile,
			env: this.env,
			mailboxId: emailData.mailboxId,
			originalEmail,
			reply,
		});
		console.log("Mailbox agent sent reply", JSON.stringify({
			mailboxId: emailData.mailboxId,
			emailId: emailData.emailId,
			sender: emailData.sender,
			threadId: emailData.threadId,
			subject: reply.subject,
		}));

		return {
			status: "replied",
			category: classification.category,
			subject: reply.subject,
		};
	}
}
