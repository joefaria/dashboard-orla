"use client";

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted">{description}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="rounded-md bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground">
            Fev-Mar 2026
          </span>

          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-success uppercase">
              Live
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
