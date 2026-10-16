'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { findPastCases } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Gavel, Loader2, Search, FileSearch } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MainNav } from '@/components/main-nav';
import SimpleMarkdownRenderer from '@/components/markdown-renderer';
import { cn } from '@/lib/utils';

const initialState = { summary: null, error: null };

const EXAMPLE_KEYWORDS = [
  'Right to privacy',
  'Motor accident compensation',
  'Intellectual property in software',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="shrink-0 px-5 font-medium"
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Search className="mr-2 h-4 w-4" />
      )}
      Search Judgments
    </Button>
  );
}

export default function CaseFinderPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(findPastCases, initialState);
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
              <Gavel className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h1 className="font-headline font-semibold text-base text-foreground leading-tight">
                Case Finder
              </h1>
              <p className="text-xs text-muted-foreground">
                Search past Indian court judgments by keywords or law sections
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-5 gap-5 max-w-3xl mx-auto w-full">
            {/* Search form */}
            <form ref={formRef} action={formAction} className="space-y-3">
              <div>
                <label
                  htmlFor="case-keywords"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Keywords or Law Section
                </label>
                <div className="flex gap-2">
                  <Input
                    id="case-keywords"
                    name="keywords"
                    placeholder="e.g., 'intellectual property in software' or 'Section 302 IPC'"
                    className="flex-1 border-border text-sm focus-visible:ring-primary placeholder:text-muted-foreground/60"
                  />
                  <SubmitButton />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Try searching for a legal topic, act, or specific section number.
                </p>
              </div>

              {/* Example keyword chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-muted-foreground mt-1">Try:</span>
                {EXAMPLE_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={(e) => {
                      const form = (e.target as HTMLElement).closest('form');
                      const input = form?.querySelector<HTMLInputElement>('input[name="keywords"]');
                      if (input) input.value = kw;
                    }}
                    className="text-xs px-2.5 py-1 rounded-full border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </form>

            {/* Results */}
            <ScrollArea className="flex-1">
              {state.summary && (
                <div className="bg-background rounded-lg border border-border p-5">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <FileSearch className="h-4 w-4" />
                    <h2 className="font-headline font-semibold text-sm">Judgment Summary</h2>
                  </div>
                  <div className={cn('text-sm text-foreground leading-relaxed')}>
                    <SimpleMarkdownRenderer content={state.summary} />
                  </div>
                </div>
              )}

              {!state.summary && (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                  <Gavel className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">Search results and judgment summaries will appear here.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
