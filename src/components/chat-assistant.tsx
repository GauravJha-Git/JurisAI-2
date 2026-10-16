'use client';

import { useState, useRef, useEffect, useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import {
  SendHorizonal,
  BrainCircuit,
  Paperclip,
  Loader2,
  FileText,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLawSuggestion, getDocumentSummary } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
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

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      disabled={pending || disabled}
      aria-label="Send message"
      className="h-9 w-9 shrink-0 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-40 transition-colors"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <SendHorizonal className="h-4 w-4" />
      )}
    </Button>
  );
}

const EXAMPLE_PROMPTS = [
  { icon: '📋', text: 'Conditions for filing an FIR in India' },
  { icon: '🏠', text: 'Property registration and stamp duty in Delhi' },
  { icon: '⚖️', text: 'Fundamental rights under the Constitution of India' },
];

export function ChatAssistant({ initialPrompts }: { initialPrompts: string[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [state, formAction] = useActionState(getLawSuggestion, initialState);
  const [summaryState, summaryAction] = useActionState(getDocumentSummary, initialState);
  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [uploadedFile, setUploadedFile] = useState<{ file: File; dataUri: string } | null>(null);

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
          text: (
            <span className="text-destructive text-sm">
              {state.error}
            </span>
          ),
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
          text: <SimpleMarkdownRenderer content={summaryState.summary} />,
        },
      ]);
      setUploadedFile(null);
    }
    if (summaryState.error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          text: (
            <span className="text-destructive text-sm">
              {summaryState.error}
            </span>
          ),
        },
      ]);
      setUploadedFile(null);
    }
  }, [summaryState]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div');
      if (scrollableView) {
        scrollableView.scrollTo({ top: scrollableView.scrollHeight, behavior: 'smooth' });
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
        setUploadedFile({ file, dataUri });
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

  const handlePromptClick = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-white">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
          <BrainCircuit className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="font-headline font-semibold text-base text-foreground leading-tight">
            AI Chat Assistant
          </h2>
          <p className="text-xs text-muted-foreground">Indian Law · Powered by AI</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-5 py-4" ref={scrollAreaRef}>
        <div className="space-y-5 max-w-3xl mx-auto">

          {/* Welcome / empty state */}
          {messages.length === 0 && !uploadedFile && (
            <div className="pt-6 pb-2">
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">
                How can JurisAI help you today?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Ask a question about Indian law, or upload a document for instant analysis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXAMPLE_PROMPTS.map((p, i) => {
                  const fullPrompt = initialPrompts[i] ?? p.text;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePromptClick(fullPrompt)}
                      className="group flex flex-col gap-2 p-4 rounded-lg border border-border bg-background text-left hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-sm text-foreground font-medium leading-snug group-hover:text-primary transition-colors">
                        {p.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border">
                  <AvatarImage
                    data-ai-hint="robot abstract"
                    src={PlaceHolderImages.find((p) => p.id === 'chat-avatar-ai')?.imageUrl}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xl rounded-xl px-4 py-3 text-sm leading-relaxed',
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/60 border border-border text-foreground'
                )}
              >
                {message.text}
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border">
                  <AvatarImage
                    data-ai-hint="person portrait"
                    src={PlaceHolderImages.find((p) => p.id === 'chat-avatar-user')?.imageUrl}
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isPending && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border">
                <AvatarImage
                  data-ai-hint="robot abstract"
                  src={PlaceHolderImages.find((p) => p.id === 'chat-avatar-ai')?.imageUrl}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/60 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Analysing document…
              </div>
            </div>
          )}

          {/* Uploaded file actions */}
          {uploadedFile && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/60 border border-border rounded-xl px-4 py-3 text-sm max-w-sm">
                <p className="text-muted-foreground mb-3">
                  What would you like to do with{' '}
                  <span className="font-medium text-foreground">{uploadedFile.file.name}</span>?
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleSummarize}
                    disabled={isPending}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                  >
                    {isPending ? (
                      <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                    ) : (
                      <FileText className="mr-1.5 h-3 w-3" />
                    )}
                    Summarize Document
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Or ask a question about it below.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="border-t border-border bg-white px-4 py-3">
        {uploadedFile && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium rounded-md px-2.5 py-1">
              <FileText className="h-3 w-3" />
              {uploadedFile.file.name}
              <button
                onClick={() => setUploadedFile(null)}
                className="ml-1 hover:opacity-70 transition-opacity"
                aria-label="Remove file"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex items-end gap-2 max-w-3xl mx-auto"
        >
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              name="situation"
              placeholder={
                uploadedFile
                  ? `Ask about ${uploadedFile.file.name}…`
                  : 'Ask about Indian law…'
              }
              className="resize-none min-h-[40px] max-h-36 pr-10 py-2.5 text-sm border-border rounded-lg focus-visible:ring-primary placeholder:text-muted-foreground/70 leading-relaxed"
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
            <Label
              htmlFor="file-upload"
              className="absolute right-3 bottom-2.5 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
              title="Attach a document"
            >
              <Paperclip className="h-4 w-4" />
            </Label>
            <input
              id="file-upload"
              name="document"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="sr-only"
              accept=".txt,.pdf,.doc,.docx,image/*"
            />
          </div>
          <SubmitButton />
        </form>
        <p className="text-center text-xs text-muted-foreground/60 mt-2">
          JurisAI provides general legal information, not legal advice. Consult a qualified lawyer for your specific situation.
        </p>
      </div>
    </div>
  );
}
