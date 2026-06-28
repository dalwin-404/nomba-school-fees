'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, Users, Banknote, LayoutDashboard, FileText, Settings, X } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 pt-[15vh]">
      <div className="fixed inset-0" onClick={() => setOpen(false)} />
      <div className="relative bg-card text-card-foreground border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-slide-up">
        <Command label="Global Command Menu" className="flex flex-col h-full w-full">
          <div className="flex items-center border-b border-border px-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Type a command or search..." 
              className="flex-1 h-14 bg-transparent outline-none border-none px-3 text-sm placeholder:text-muted-foreground focus:ring-0" 
            />
            <button onClick={() => setOpen(false)} className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
              <X size={16} />
            </button>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Suggestions" className="px-2 py-1.5 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:mb-1">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard/students/new'))}
                className="flex items-center gap-2 px-2 py-2.5 text-sm rounded-md cursor-pointer data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <Users size={16} /> Add New Student
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard/students'))}
                className="flex items-center gap-2 px-2 py-2.5 text-sm rounded-md cursor-pointer data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <Banknote size={16} /> Record Payment
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-border my-1 mx-2" />

            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:mb-1">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-2 px-2 py-2.5 text-sm rounded-md cursor-pointer data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <LayoutDashboard size={16} /> Go to Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard/reports'))}
                className="flex items-center gap-2 px-2 py-2.5 text-sm rounded-md cursor-pointer data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <FileText size={16} /> View Reports
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard/settings'))}
                className="flex items-center gap-2 px-2 py-2.5 text-sm rounded-md cursor-pointer data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <Settings size={16} /> Settings
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
