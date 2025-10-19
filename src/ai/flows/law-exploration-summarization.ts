'use server';

/**
 * @fileOverview Summarizes a given law using GenAI.
 *
 * - summarizeLaw - A function that takes law text as input and returns a summarized version.
 * - SummarizeLawInput - The input type for the summarizeLaw function, containing the law text.
 * - SummarizeLawOutput - The return type for the summarizeLaw function, containing the summarized law text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeLawInputSchema = z.object({
  lawText: z
    .string()
    .describe('The text of the law to be summarized.'),
});
export type SummarizeLawInput = z.infer<typeof SummarizeLawInputSchema>;

const SummarizeLawOutputSchema = z.object({
  summary: z.string().describe('A summarized version of the law.'),
});
export type SummarizeLawOutput = z.infer<typeof SummarizeLawOutputSchema>;

export async function summarizeLaw(input: SummarizeLawInput): Promise<SummarizeLawOutput> {
  return summarizeLawFlow(input);
}

const summarizeLawPrompt = ai.definePrompt({
  name: 'summarizeLawPrompt',
  input: {schema: SummarizeLawInputSchema},
  output: {schema: SummarizeLawOutputSchema},
  prompt: `You are an expert legal professional. Summarize the following law so that it can be easily understood.

Format the response using HTML. Use <h3> tags for headings, <p> tags for paragraphs, and <ul> with <li> tags for lists. Use <strong> for bold and <em> for italics where appropriate.

Law Text:
{{{lawText}}}`,
});

const summarizeLawFlow = ai.defineFlow(
  {
    name: 'summarizeLawFlow',
    inputSchema: SummarizeLawInputSchema,
    outputSchema: SummarizeLawOutputSchema,
  },
  async input => {
    const {output} = await summarizeLawPrompt(input);
    return output!;
  }
);
