"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  color,
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-muted">{label}</span>}
          {showValue && (
            <span className="tabular-nums font-medium text-foreground">
              {clamped.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundColor: color || "var(--color-accent)",
          }}
        />
      </div>
    </div>
  );
}
