'use server';

/**
 * @fileOverview Summarizes past Indian court judgments based on keywords.
 *
 * - summarizePastJudgments - A function that takes keywords and returns summarized results of past court judgments.
 * - SummarizePastJudgmentsInput - The input type for the summarizePastJudgments function.
 * - SummarizePastJudgmentsOutput - The return type for the summarizePastJudgments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePastJudgmentsInputSchema = z.object({
  keywords: z.string().describe('Keywords to search for in past Indian court judgments.'),
});
export type SummarizePastJudgmentsInput = z.infer<typeof SummarizePastJudgmentsInputSchema>;

const SummarizePastJudgmentsOutputSchema = z.object({
  summary: z.string().describe('A summary of the relevant past court judgments.'),
});
export type SummarizePastJudgmentsOutput = z.infer<typeof SummarizePastJudgmentsOutputSchema>;

export async function summarizePastJudgments(input: SummarizePastJudgmentsInput): Promise<SummarizePastJudgmentsOutput> {
  return summarizePastJudgmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePastJudgmentsPrompt',
  input: {schema: SummarizePastJudgmentsInputSchema},
  output: {schema: SummarizePastJudgmentsOutputSchema},
  prompt: `You are an expert in Indian law. Please summarize past Indian court judgments based on the following keywords: {{{keywords}}}.

Format the response using HTML. Use <h3> tags for headings, <p> tags for paragraphs, and <ul> with <li> tags for lists. Use <strong> for bold and <em> for italics where appropriate.
`,
});

const summarizePastJudgmentsFlow = ai.defineFlow(
  {
    name: 'summarizePastJudgmentsFlow',
    inputSchema: SummarizePastJudgmentsInputSchema,
    outputSchema: SummarizePastJudgmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
