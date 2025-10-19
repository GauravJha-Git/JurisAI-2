'use client';

import { useState, useRef, useEffect, useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { SendHorizonal, BrainCircuit, Paperclip, Loader2, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLawSuggestion, getDocumentSummary } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';
import SimpleMarkdownRenderer from './markdown-renderer';

type Message = {
  id: number;
  sender: 'user' | 'ai';
  text: string | React.ReactNode;
};

const initialState = {
  response: null,
  error: null,
  summary: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Send message">
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <SendHorizonal />
      )}
    </Button>
  );
}

export function ChatAssistant({ initialPrompts }: { initialPrompts: string[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [state, formAction] = useActionState(getLawSuggestion, initialState);
  const [summaryState, summaryAction] = useActionState(getDocumentSummary, initialState);

  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<{file: File, dataUri: string} | null>(null);

  useEffect(() => {
    if (state.response) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          text: <SimpleMarkdownRenderer content={state.response} />,
        },
      ]);
    }
    if (state.error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          text: <span className="text-destructive">{state.error}</span>,
        },
      ]);
    }
  }, [state]);

  useEffect(() => {
    if (summaryState.summary) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          text: (
             <SimpleMarkdownRenderer content={summaryState.summary} />
          ),
        },
      ]);
      setUploadedFile(null); // Clear after summarization
    }
     if (summaryState.error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          text: <span className="text-destructive">{summaryState.error}</span>,
        },
      ]);
      setUploadedFile(null); // Clear on error
    }
  }, [summaryState]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div');
      if (scrollableView) {
          scrollableView.scrollTo({
            top: scrollableView.scrollHeight,
            behavior: 'smooth',
          });
      }
    }
  }, [messages]);

  const handleFormSubmit = (formData: FormData) => {
    const userInput = formData.get('situation') as string;
    if (userInput.trim() || uploadedFile) {
      let fullMessage = userInput;
      if (uploadedFile) {
        fullMessage = `Regarding the file ${uploadedFile.file.name}:\n${userInput}`;
      }
       if (fullMessage.trim()) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), sender: 'user', text: fullMessage },
        ]);
       }
      formAction(formData);
      setInput('');
      setUploadedFile(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          const dataUri = e.target?.result as string;
          setUploadedFile({file, dataUri});
          setMessages((prev) => [
              ...prev,
              { id: Date.now(), sender: 'user', text: `Uploaded file: ${file.name}` },
          ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSummarize = async () => {
    if (uploadedFile) {
        const formData = new FormData();
        formData.append('documentDataUri', uploadedFile.dataUri);
        startTransition(() => {
            summaryAction(formData);
        });
    }
  };

  const handleInitialPromptClick = (prompt: string) => {
    setInput(prompt);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    if(suggestion === 'summarize') {
        handleSummarize();
    } else {
        setInput(suggestion);
        formRef.current?.requestSubmit();
    }
  }

  return (
    <Card className="h-full flex flex-col shadow-xl w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit className="text-primary" />
          AI Chat Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && !uploadedFile ? (
               <Alert>
                <AlertTitle className="font-headline">Welcome to JurisAI!</AlertTitle>
                <AlertDescription>
                  <p>Describe a situation or upload a document below, and I'll assist you. Here are some examples to get you started:</p>
                  <div className="mt-4 space-y-2">
                  {initialPrompts.map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="w-full text-left h-auto py-2"
                      onClick={() => handleInitialPromptClick(prompt)}
                    >
                     {prompt}
                    </Button>
                  ))}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage data-ai-hint="robot abstract" src={PlaceHolderImages.find(p => p.id === 'chat-avatar-ai')?.imageUrl} />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-prose rounded-lg p-3 text-sm shadow-md',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card'
                    )}
                  >
                    {message.text}
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage data-ai-hint="person portrait" src={PlaceHolderImages.find(p => p.id === 'chat-avatar-user')?.imageUrl} />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
             {(isPending) && (
              <div className="flex justify-start">
                 <div className={cn('flex items-start gap-3 justify-start')}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage data-ai-hint="robot abstract" src={PlaceHolderImages.find(p => p.id === 'chat-avatar-ai')?.imageUrl} />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="max-w-md rounded-lg p-3 text-sm bg-card shadow-md flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin"/> Analyzing document...
                    </div>
                  </div>
              </div>
            )}
            {uploadedFile && (
                <div className="flex justify-start">
                     <div className={cn('flex items-start gap-3 justify-start')}>
                        <Avatar className="h-8 w-8">
                            <AvatarImage data-ai-hint="robot abstract" src={PlaceHolderImages.find(p => p.id === 'chat-avatar-ai')?.imageUrl} />
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="max-w-prose rounded-lg p-3 text-sm bg-card shadow-md">
                            <p className="text-sm text-muted-foreground mb-2">What would you like to do with {uploadedFile.file.name}?</p>
                            <div className='flex gap-2 flex-wrap'>
                                <Button onClick={handleSummarize} disabled={isPending} variant="outline" size="sm">
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                    Summarize Document
                                </Button>
                            </div>
                             <p className="text-sm text-muted-foreground mt-4 mb-2">Or, just ask something about it in the chat.</p>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex w-full items-start gap-2"
        >
          <div className="flex-1 relative">
            <Textarea
              name="situation"
              placeholder={uploadedFile ? `Ask a question about ${uploadedFile.file.name}` : "e.g., 'My online account was hacked and used for fraud.'"}
              className="flex-1 pr-12 min-h-[40px] max-h-36"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              rows={1}
            />
            <Label htmlFor="file-upload" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground">
                <Paperclip />
            </Label>
            <input id="file-upload" name="document" type="file" ref={fileInputRef} onChange={handleFileChange} className="sr-only" accept=".txt,.pdf,.doc,.docx,image/*" />
          </div>
          <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
