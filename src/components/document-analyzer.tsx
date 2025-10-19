'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getDocumentSummary, getLegalTerms } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { FileText, Loader2 } from 'lucide-react';

const summaryInitialState = { summary: null, error: null };
const termsInitialState = { terms: null, error: null };

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

export function DocumentAnalyzer() {
  const { toast } = useToast();
  const [summaryState, summaryAction] = useActionState(getDocumentSummary, summaryInitialState);
  const [termsState, termsAction] = useActionState(getLegalTerms, termsInitialState);
  
  const [fileName, setFileName] = useState('');
  const summaryFormRef = useRef<HTMLFormElement>(null);
  const termsFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (summaryState.error) {
      toast({ variant: 'destructive', title: 'Error', description: summaryState.error });
    }
    if (summaryState.summary) {
        summaryFormRef.current?.reset();
    }
  }, [summaryState, toast]);

   useEffect(() => {
    if (termsState.error) {
      toast({ variant: 'destructive', title: 'Error', description: termsState.error });
    }
    if (termsState.terms) {
        termsFormRef.current?.reset();
        setFileName('');
    }
  }, [termsState, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Summarize Document</CardTitle>
          <CardDescription>Paste the text of a document to get a concise summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={summaryFormRef} action={summaryAction} className="space-y-4">
            <Textarea name="text" placeholder="Paste your document text here..." rows={6} />
            <SubmitButton>Summarize Text</SubmitButton>
          </form>
          {summaryState.summary && (
            <Alert className="mt-4">
              <FileText className="h-4 w-4" />
              <AlertTitle className="font-headline">Summary</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{summaryState.summary}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Explore Legal Terms</CardTitle>
          <CardDescription>Upload a document to identify and get explanations for legal terms.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={termsFormRef} action={termsAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-upload">Document File</Label>
              <Input id="document-upload" name="document" type="file" onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
              {fileName && <p className='text-sm text-muted-foreground'>Selected: {fileName}</p>}
            </div>
            <SubmitButton>Explore Terms</SubmitButton>
          </form>
          {termsState.terms && termsState.terms.length > 0 && (
            <div className="mt-4">
             <h3 className="font-semibold mb-2 font-headline">Identified Terms</h3>
            <Accordion type="single" collapsible className="w-full">
              {termsState.terms.map((item: { term: string; explanation: string }, index: number) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.term}</AccordionTrigger>
                  <AccordionContent>{item.explanation}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            </div>
          )}
           {termsState.terms && termsState.terms.length === 0 && (
             <Alert className="mt-4">
                <AlertTitle className="font-headline">No Terms Found</AlertTitle>
                <AlertDescription>We couldn't identify any specific legal terms in the uploaded document.</AlertDescription>
            </Alert>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
