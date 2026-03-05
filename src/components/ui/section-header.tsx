import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  badge,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {badge && (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
