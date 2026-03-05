"use client";

import { cn } from "@/lib/utils";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  onRowClick?: (row: Record<string, unknown>, index: number) => void;
  className?: string;
}

export function DataTable({ columns, data, onRowClick, className }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border bg-card", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-xs font-medium tracking-wide text-muted uppercase",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  !col.align && "text-left"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row, i)}
              className={cn(
                "border-b border-border/50 transition-colors last:border-b-0",
                onRowClick
                  ? "cursor-pointer hover:bg-surface-2"
                  : "hover:bg-surface-1"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-foreground",
                    col.align === "right" && "text-right tabular-nums",
                    col.align === "center" && "text-center"
                  )}
                >
                  {row[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
