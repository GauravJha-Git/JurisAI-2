import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-primary', className)}>
      <Scale className="h-7 w-7" />
      <h1 className="text-2xl font-bold font-headline tracking-tight">
        JurisAI
      </h1>
    </div>
  );
}
