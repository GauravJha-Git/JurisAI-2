'use client';

import { ChatAssistant } from '@/components/chat-assistant';
import { MainNav } from '@/components/main-nav';

const initialPrompts = [
    "What are the conditions for filing an FIR (First Information Report) in India?",
    "Explain the process of property registration and stamp duty calculation in Delhi, India.",
    "What are the fundamental rights guaranteed to citizens under the Constitution of India?"
];


export default function Home() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <MainNav />
      <main className="flex-1 container py-6 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <ChatAssistant initialPrompts={initialPrompts} />
        </div>
      </main>
    </div>
  );
}
