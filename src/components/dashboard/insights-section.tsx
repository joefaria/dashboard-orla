"use client";

import {
  TrendUp,
  LightbulbFilament,
  Warning,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { aiInsights } from "@/data/mock";
import { cn } from "@/lib/utils";

const typeConfig = {
  correlation: {
    icon: ArrowsLeftRight,
    label: "Correlacao",
    color: "#3B82F6",
    bgClass: "bg-accent/10",
  },
  opportunity: {
    icon: LightbulbFilament,
    label: "Oportunidade",
    color: "#22C55E",
    bgClass: "bg-success/10",
  },
  alert: {
    icon: Warning,
    label: "Alerta",
    color: "#F59E0B",
    bgClass: "bg-warning/10",
  },
  trend: {
    icon: TrendUp,
    label: "Tendencia",
    color: "#7C3AED",
    bgClass: "bg-[#7C3AED]/10",
  },
};

const severityVariant = {
  high: "danger" as const,
  medium: "warning" as const,
  low: "default" as const,
};

const severityLabel = {
  high: "Alta",
  medium: "Media",
  low: "Baixa",
};

export function InsightsSection() {
  const sorted = [...aiInsights].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    const sDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sDiff !== 0) return sDiff;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Insights IA"
        description="Analise cruzada de canais com inteligencia artificial"
        badge={`${sorted.length} insights`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sorted.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;

          return (
            <div
              key={insight.id}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card-hover"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      config.bgClass
                    )}
                  >
                    <Icon size={20} weight="bold" style={{ color: config.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                      <Badge variant={severityVariant[insight.severity]} size="sm">
                        {severityLabel[insight.severity]}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {insight.title}
                    </h3>
                  </div>
                </div>

                {/* Key Metric */}
                <div className="shrink-0 rounded-lg bg-surface-2 px-3 py-2 text-center">
                  <span className="text-lg font-bold text-foreground">
                    {insight.metric}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                {insight.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {insight.channels.map((ch) => (
                    <Badge key={ch} variant="default" size="sm">
                      {ch}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-muted">{insight.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
