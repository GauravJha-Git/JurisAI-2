'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { findPastCases } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Gavel, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MainNav } from '@/components/main-nav';
import SimpleMarkdownRenderer from '@/components/markdown-renderer';

const initialState = { summary: null, error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
      <main className="flex-1 container pb-8 pt-4 flex flex-col overflow-hidden">
        <Card className="h-full flex flex-col shadow-xl w-full">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Past Case Finder</CardTitle>
            <CardDescription>Search for past Indian court judgments by keywords or law sections.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <form ref={formRef} action={formAction} className="space-y-4">
              <Input name="keywords" placeholder="e.g., 'intellectual property in software'" />
              <SubmitButton />
            </form>
            <ScrollArea className="flex-1 pr-4">
                {state.summary && (
                <Alert className="mt-4">
                    <Gavel className="h-4 w-4" />
                    <AlertTitle className="font-headline">Judgment Summary</AlertTitle>
                    <AlertDescription>
                        <SimpleMarkdownRenderer content={state.summary} />
                    </AlertDescription>
                </Alert>
                )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
