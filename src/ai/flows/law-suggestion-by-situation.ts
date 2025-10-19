'use server';

/**
 * @fileOverview A flow to suggest relevant laws based on a user-inputted situation.
 *
 * - suggestLawsBySituation - A function that handles the law suggestion process.
 * - SuggestLawsBySituationInput - The input type for the suggestLawsBySituation function.
 * - SuggestLawsBySituationOutput - The return type for the suggestLawsBySituation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLawsBySituationInputSchema = z.object({
  situationDescription: z
    .string()
    .describe('A description of the situation for which to suggest laws.'),
});
export type SuggestLawsBySituationInput = z.infer<typeof SuggestLawsBySituationInputSchema>;

const SuggestLawsBySituationOutputSchema = z.object({
  suggestedLaws: z
    .string()
    .describe('A list of laws that may be relevant to the situation.'),
});
export type SuggestLawsBySituationOutput = z.infer<typeof SuggestLawsBySituationOutputSchema>;

export async function suggestLawsBySituation(
  input: SuggestLawsBySituationInput
): Promise<SuggestLawsBySituationOutput> {
  return suggestLawsBySituationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLawsBySituationPrompt',
  input: {schema: SuggestLawsBySituationInputSchema},
  output: {schema: SuggestLawsBySituationOutputSchema},
  prompt: `You are an expert in Indian law.

  Based on the following description of a situation, suggest relevant laws that might apply. Be as specific as possible, including the names of Acts, and section numbers.

  Format the response using HTML. Use <h3> tags for headings, <p> tags for paragraphs, and <ul> with <li> tags for lists. Use <strong> for bold and <em> for italics where appropriate.

  Situation Description: {{{situationDescription}}}`,
});

const suggestLawsBySituationFlow = ai.defineFlow(
  {
    name: 'suggestLawsBySituationFlow',
    inputSchema: SuggestLawsBySituationInputSchema,
    outputSchema: SuggestLawsBySituationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
