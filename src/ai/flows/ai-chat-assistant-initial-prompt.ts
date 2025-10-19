'use server';
/**
 * @fileOverview A Genkit flow for generating initial prompts for the AI chat assistant.
 *
 * - `generateInitialPrompts` - A function that generates example prompts for new users.
 * - `InitialPromptsInput` - The input type for the `generateInitialPrompts` function.
 * - `InitialPromptsOutput` - The return type for the `generateInitialPrompts` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialPromptsInputSchema = z.object({
  topic: z.string().optional().describe('The topic to generate initial prompts for.')
});
export type InitialPromptsInput = z.infer<typeof InitialPromptsInputSchema>;

const InitialPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of example prompts for the AI chat assistant.')
});
export type InitialPromptsOutput = z.infer<typeof InitialPromptsOutputSchema>;

export async function generateInitialPrompts(input: InitialPromptsInput): Promise<InitialPromptsOutput> {
  return initialPromptsFlow(input);
}

const initialPromptsPrompt = ai.definePrompt({
  name: 'initialPromptsPrompt',
  input: {schema: InitialPromptsInputSchema},
  output: {schema: InitialPromptsOutputSchema},
  prompt: `You are an AI assistant that generates example prompts for new users of a legal AI chat assistant, so they can quickly understand what kind of questions they can ask about Indian law.

  Generate 3 example prompts. The prompts should be diverse and cover different areas of Indian law.

  {{#if topic}}
  The prompts should be related to the following topic: {{topic}}
  {{/if}}

  The output should be a JSON array of strings.
  `,
});

const initialPromptsFlow = ai.defineFlow(
  {
    name: 'initialPromptsFlow',
    inputSchema: InitialPromptsInputSchema,
    outputSchema: InitialPromptsOutputSchema,
  },
  async input => {
    const {output} = await initialPromptsPrompt(input);
    return output!;
  }
);
