'use server';

/**
 * @fileOverview AI agent for exploring legal terms in a document.
 *
 * - exploreLegalTerms - A function that takes a document and identifies/explains legal terms.
 * - ExploreLegalTermsInput - The input type for the exploreLegalTerms function.
 * - ExploreLegalTermsOutput - The return type for the exploreLegalTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExploreLegalTermsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      'A legal document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type ExploreLegalTermsInput = z.infer<typeof ExploreLegalTermsInputSchema>;

const ExploreLegalTermsOutputSchema = z.object({
  terms: z.array(
    z.object({
      term: z.string().describe('The legal term.'),
      explanation: z.string().describe('AI explanation of the term.'),
    })
  ).describe('List of legal terms and their explanations.'),
});
export type ExploreLegalTermsOutput = z.infer<typeof ExploreLegalTermsOutputSchema>;

export async function exploreLegalTerms(input: ExploreLegalTermsInput): Promise<ExploreLegalTermsOutput> {
  return exploreLegalTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exploreLegalTermsPrompt',
  input: {schema: ExploreLegalTermsInputSchema},
  output: {schema: ExploreLegalTermsOutputSchema},
  prompt: `You are a legal expert. Analyze the provided legal document and identify key legal terms. Provide a concise explanation for each term.

Document: {{media url=documentDataUri}}`,
});

const exploreLegalTermsFlow = ai.defineFlow(
  {
    name: 'exploreLegalTermsFlow',
    inputSchema: ExploreLegalTermsInputSchema,
    outputSchema: ExploreLegalTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
