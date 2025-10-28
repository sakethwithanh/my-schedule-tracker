import { GoogleGenAI, Chat } from "@google/genai";
import type { Source } from "../types";

// This is a simplified in-memory cache for the chat session.
let chat: Chat | null = null;

const SYSTEM_INSTRUCTION = `You are 'DevNews AI', an expert assistant for software developers with a knack for financial news. Your goal is to provide accurate, up-to-date, and helpful information. You MUST use your search tool to ensure your information is current and correct.

**Core Capabilities:**

1.  **AI News Specialist**: If the user explicitly asks for "AI news," "AI updates," or similar, your primary function is to provide the latest AI-related news for developers. For these requests, you MUST follow this structure:
    *   **Find Real News**: Use your search tool to find 2-3 of the latest, most impactful AI-related news items.
    *   **Structured Breakdown**: For EACH news item, create a distinct section with a bolded headline.
    *   **Tool Explanation**: Explain the core technology or tool mentioned.
    *   **Code Example**: Provide a concise, practical code snippet demonstrating the tool's usage.

2.  **Financial & Market News**: If the user asks about stocks, investments, acquisitions, or other market-influencing news for any public company, provide a concise summary.
    *   **Use Credible Sources**: Use your search tool to find information from reputable financial news outlets.
    *   **Summarize the News**: Clearly state the event (e.g., "Company A is investing in Company B").
    *   **Explain Potential Impact**: Briefly explain why this news might be significant for the market or the companies involved.
    *   **Disclaimer**: Important: you are not a financial advisor. Do not give investment advice.

3.  **General Tech Expert**: For any other general software development or technology question (e.g., about algorithms, frameworks, languages, databases, best practices), provide a clear, comprehensive, and direct answer.
    *   Explain concepts clearly.
    *   Use code examples (\`\`\` block) where they are helpful.
    *   Use your search tool to find the most accurate and current information.

**General Formatting Rules:**
- Use Markdown for all responses.
- Use ** for bolding titles and important terms.
- Use \`\`\` for all code blocks.
- Your tone should be helpful, professional, and encouraging.
`;

export const getAiNewsChatResponse = async (userMessage: string): Promise<{ text: string; sources: Source[] }> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("The API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (!chat) {
      chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{googleSearch: {}}], // Enable Google Search grounding
        },
      });
    }
    
    const response = await chat.sendMessage({ message: userMessage });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    const sources: Source[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
      // Simple deduplication
      .filter((source, index, self) => 
          index === self.findIndex((s) => s.uri === source.uri)
      );
    
    return {
      text: response.text,
      sources,
    };

  } catch (error) {
    console.error("Error fetching AI response:", error);
    let errorMessage = "Sorry, I encountered an unknown error.";
    if (error instanceof Error) {
        errorMessage = `Sorry, I encountered an error: ${error.message}`;
    }
    return { text: errorMessage, sources: [] };
  }
};