"use client";

import { type ReactNode, useState } from "react";
import { cn, formatPercent } from "@/lib/utils";
import { ArrowUp, ArrowDown, Question } from "@phosphor-icons/react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  title: string;
  value: string;
  delta: number;
  deltaLabel?: string;
  icon?: ReactNode;
  color?: string;
  sparklineData?: { value: number }[];
  className?: string;
  tooltip?: string;
}

export function KpiCard({
  title,
  value,
  delta,
  deltaLabel,
  icon,
  color,
  sparklineData,
  className,
  tooltip,
}: KpiCardProps) {
  const isPositive = delta >= 0;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              {title}
            </p>
            {tooltip && (
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="text-muted/50 hover:text-muted transition-colors"
                >
                  <Question size={13} weight="bold" />
                </button>
                {showTooltip && (
                  <div className="absolute left-0 bottom-full mb-2 z-50 w-60 rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-xs text-muted-foreground shadow-2xl leading-relaxed normal-case tracking-normal font-normal">
                    {tooltip}
                    <div className="absolute top-full left-4 -mt-px">
                      <div className="border-4 border-transparent border-t-surface-2" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        {icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2"
            style={color ? { color } : undefined}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-semibold",
            isPositive ? "text-success" : "text-danger"
          )}
        >
          {isPositive ? (
            <ArrowUp size={12} weight="bold" />
          ) : (
            <ArrowDown size={12} weight="bold" />
          )}
          {formatPercent(Math.abs(delta))}
        </span>
        {deltaLabel && (
          <span className="text-xs text-muted">{deltaLabel}</span>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3 -mx-1 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "#22C55E" : "#EF4444"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "#22C55E" : "#EF4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#22C55E" : "#EF4444"}
                strokeWidth={1.5}
                fill={`url(#spark-${title})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
