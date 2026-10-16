'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getLawSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Library, Loader2, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MainNav } from '@/components/main-nav';
import SimpleMarkdownRenderer from '@/components/markdown-renderer';
import { cn } from '@/lib/utils';

const initialState = { summary: null, error: null };
const exampleLawText = `Section 378 of the Indian Penal Code, 1860:
Theft.—Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto px-6 font-medium"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Summarize Law
    </Button>
  );
}

export default function LawExplorerPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(getLawSummary, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
    if (state.summary) {
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <MainNav />
      <main className="flex-1 container py-6 flex flex-col overflow-hidden">
        <div className="h-full flex flex-col bg-white rounded-xl border border-border shadow-sm overflow-hidden">

          {/* Page header */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-white">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
              <Library className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h1 className="font-headline font-semibold text-base text-foreground leading-tight">
                Law Explorer
              </h1>
              <p className="text-xs text-muted-foreground">
                Paste any statute or section to get a plain-language explanation
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-5 gap-5 max-w-3xl mx-auto w-full">
            {/* Input form */}
            <form ref={formRef} action={formAction} className="space-y-3">
              <div>
                <label
                  htmlFor="law-text"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Law or Statute Text
                </label>
                <Textarea
                  id="law-text"
                  name="lawText"
                  placeholder="Paste the text of an Indian law or statutory section here…"
                  rows={8}
                  defaultValue={exampleLawText}
                  className="resize-none border-border text-sm leading-relaxed focus-visible:ring-primary placeholder:text-muted-foreground/60"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  You can paste full sections from the IPC, CrPC, Constitution, or any other Indian statute.
                </p>
              </div>
              <SubmitButton />
            </form>

            {/* Result */}
            <ScrollArea className="flex-1">
              {state.summary && (
                <div className="bg-background rounded-lg border border-border p-5">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <BookOpen className="h-4 w-4" />
                    <h2 className="font-headline font-semibold text-sm">Plain-Language Summary</h2>
                  </div>
                  <div className={cn('text-sm text-foreground leading-relaxed')}>
                    <SimpleMarkdownRenderer content={state.summary} />
                  </div>
                </div>
              )}

              {!state.summary && (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                  <Library className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">
                    Your plain-language summary will appear here after you submit.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
