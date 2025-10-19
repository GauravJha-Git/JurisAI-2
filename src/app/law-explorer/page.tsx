'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getLawSummary } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Library, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MainNav } from '@/components/main-nav';
import SimpleMarkdownRenderer from '@/components/markdown-renderer';


const initialState = { summary: null, error: null };
const exampleLawText = `Section 378 of the Indian Penal Code, 1860:
Theft.—Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person’s consent, moves that property in order to such taking, is said to commit theft.`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
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
    if(state.summary) {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
     <div className="flex h-screen flex-col bg-background">
      <MainNav />
      <main className="flex-1 container pb-8 pt-4 flex flex-col overflow-hidden">
        <Card className="h-full flex flex-col shadow-xl w-full">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Law Simplifier</CardTitle>
                <CardDescription>Paste the text of a law or a section to get a simplified explanation.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                <form ref={formRef} action={formAction} className="space-y-4">
                    <Textarea name="lawText" placeholder="Paste law text here..." rows={8} defaultValue={exampleLawText} />
                    <SubmitButton />
                </form>
                 <ScrollArea className="flex-1 pr-4">
                    {state.summary && (
                    <Alert className="mt-4">
                        <Library className="h-4 w-4" />
                        <AlertTitle className="font-headline">Summary</AlertTitle>
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
