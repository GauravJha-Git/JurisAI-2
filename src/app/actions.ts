'use server';

import { suggestLawsBySituation } from '@/ai/flows/law-suggestion-by-situation';
import { summarizeDocument } from '@/ai/flows/document-summarization';
import { exploreLegalTerms } from '@/ai/flows/explore-legal-terms';
import { summarizeLaw } from '@/ai/flows/law-exploration-summarization';
import { summarizePastJudgments } from '@/ai/flows/summarize-past-judgments';
import { z } from 'zod';

// Chat Assistant Action
const situationSchema = z.object({
  situation: z.string().optional(),
});
export async function getLawSuggestion(prevState: any, formData: FormData) {
  try {
    const validatedFields = situationSchema.safeParse({
      situation: formData.get('situation'),
    });

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors.situation?.[0] };
    }
    
    if(!validatedFields.data.situation) {
        return { response: null };
    }

    const result = await suggestLawsBySituation({ situationDescription: validatedFields.data.situation });
    return { response: result.suggestedLaws };
  } catch (e) {
    return { error: 'An error occurred. Please try again.' };
  }
}

// Document Analyzer Actions
const summarySchema = z.object({
    documentDataUri: z.string(),
});
export async function getDocumentSummary(prevState: any, formData: FormData) {
  try {
    const validatedFields = summarySchema.safeParse({
      documentDataUri: formData.get('documentDataUri'),
    });

    if (!validatedFields.success) {
      return { error: 'Invalid document data URI.' };
    }

    const result = await summarizeDocument({ documentDataUri: validatedFields.data.documentDataUri });
    return { summary: result.summary };
  } catch (e) {
    return { error: 'An error occurred while summarizing. Please try again.' };
  }
}

const fileSchema = z.instanceof(File).refine((file) => file.size > 0, 'File cannot be empty.');
export async function getLegalTerms(prevState: any, formData: FormData) {
  try {
    const file = formData.get('document') as File;
    const validatedFile = fileSchema.safeParse(file);

     if (!validatedFile.success) {
      return { error: "Please select a file." };
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await exploreLegalTerms({ documentDataUri: dataUri });
    return { terms: result.terms };
  } catch (e) {
    return { error: 'An error occurred while analyzing the document. Please try again.' };
  }
}


// Law Explorer Action
const lawSchema = z.object({
  lawText: z.string().min(20, 'Please provide more text to summarize.'),
});
export async function getLawSummary(prevState: any, formData: FormData) {
  try {
    const validatedFields = lawSchema.safeParse({
      lawText: formData.get('lawText'),
    });

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors.lawText?.[0] };
    }

    const result = await summarizeLaw({ lawText: validatedFields.data.lawText });
    return { summary: result.summary };
  } catch (e) {
    return { error: 'An error occurred while summarizing. Please try again.' };
  }
}

// Case Finder Action
const caseSchema = z.object({
  keywords: z.string().min(3, 'Please provide more specific keywords.'),
});
export async function findPastCases(prevState: any, formData: FormData) {
  try {
    const validatedFields = caseSchema.safeParse({
      keywords: formData.get('keywords'),
    });

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors.keywords?.[0] };
    }
    
    const result = await summarizePastJudgments({ keywords: validatedFields.data.keywords });
    return { summary: result.summary };
  } catch (e) {
    return { error: 'An error occurred while searching. Please try again.' };
  }
}
