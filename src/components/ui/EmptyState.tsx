import { ReactNode } from 'react';

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 rotate-3 transition-transform hover:rotate-6">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground max-w-[250px] mb-6">{description}</p>
      {action}
    </div>
  );
}
