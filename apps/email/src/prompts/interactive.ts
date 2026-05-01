type InteractivePromptArgs = {
	companyName: string;
	companyShortDescription: string;
	companyLongDescription: string;
	knowledgeContext: string;
	question: string;
};

export function renderInteractivePrompt(args: InteractivePromptArgs): string {
	return `Company: ${args.companyName}
Short description: ${args.companyShortDescription}
Long description: ${args.companyLongDescription}

${args.knowledgeContext}

Answer questions about ${args.companyName} in UK English. Be clear about what is current, what is in progress, and what is only planned or exploratory. If the repo knowledge does not support a claim, say that plainly. Reply in short paragraphs and keep it concise.

Question:
${args.question}`;
}
