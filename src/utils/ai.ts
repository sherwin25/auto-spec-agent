import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type GeneratedSpec = {
  dbSchema: string;
  userStories: string[];
  mermaidDiagram: string;
};

export async function generateSpec(prompt: string): Promise<GeneratedSpec> {
  const systemPrompt = `
    You are an expert Technical Product Manager and System Architect.
    Given a product description, you must generate a technical specification in JSON format.
    
    The JSON object must have exactly these keys:
    1. "dbSchema": A valid SQL schema (Postgres dialect) for the core tables needed. Include comments.
    2. "userStories": An array of strings, each being a Gherkin-style user story.
    3. "mermaidDiagram": A Mermaid.js markdown string (ER Diagram) visualizing the database schema. Use "erDiagram" syntax.
    
    Keep the schema simple but functional.
    The response must be a valid JSON object.
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Product Idea: ${prompt}` },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error("Failed to generate content from OpenAI");
  }

  return JSON.parse(content) as GeneratedSpec;
}
