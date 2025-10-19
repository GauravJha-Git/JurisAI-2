import { config } from 'dotenv';
config();

import '@/ai/flows/explore-legal-terms.ts';
import '@/ai/flows/document-summarization.ts';
import '@/ai/flows/ai-chat-assistant-initial-prompt.ts';
import '@/ai/flows/summarize-past-judgments.ts';
import '@/ai/flows/law-suggestion-by-situation.ts';
import '@/ai/flows/law-exploration-summarization.ts';