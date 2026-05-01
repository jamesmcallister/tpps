type ReplyPromptArgs = {
	latestSubject: string;
	latestEmailText: string;
	replyMode?: "default" | "quote_follow_up_detail";
	replyContext?: string;
};

export function renderReplyPrompt(args: ReplyPromptArgs): string {
	const modeInstructions = args.replyMode === "quote_follow_up_detail"
		? "This is a follow-up quote question in an active thread. Answer the customer's latest detail directly first. Keep it professional, warm, concise, and commercially helpful. Do not include prices, estimates, ranges, starting prices, minimum budgets, budget thresholds, or calculated figures. Ask at most one or two useful follow-up questions. Where pricing or next steps are needed, ask whether they are working within a particular budget or would like suggestions, then offer a phone chat, design consultation, or site visit. Sound like a human handling a business enquiry, not like a support bot or a checklist. Do not use jokes, banter, flirty wording, suggestive wording, or informal humour. Do not invent supplier checks, stock limits, availability, or operational constraints unless they are grounded in the provided knowledge."
		: "Draft the reply the assistant should send now. Keep it accurate, practical, professional, warm, and natural. Do not include prices, estimates, ranges, starting prices, minimum budgets, budget thresholds, or calculated figures. If the customer asks about pricing or a quote, explain briefly that a human should handle pricing once the scope is understood, ask whether they are working within a particular budget or would like suggestions, and offer a phone chat, design consultation, or site visit. If the customer has already given useful job details, make use of them and do not ask for the same information again. Do not use jokes, banter, flirty wording, suggestive wording, or informal humour.";
	const contextBlock = args.replyContext
		? `\n\nAdditional reply context:\n${args.replyContext}`
		: "";

	return `Latest inbound email subject: ${args.latestSubject}

Latest inbound email text:
${args.latestEmailText}${contextBlock}

${modeInstructions}`;
}
