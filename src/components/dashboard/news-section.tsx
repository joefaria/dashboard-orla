"use client";

import { useState } from "react";
import {
  Newspaper,
  CaretDown,
  CaretUp,
  LightbulbFilament,
} from "@phosphor-icons/react";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { newsMonitorItems } from "@/data/mock";
import { cn } from "@/lib/utils";

const relevanceConfig = {
  high: { dots: 3, color: "#22C55E", label: "Alta" },
  medium: { dots: 2, color: "#F59E0B", label: "Media" },
  low: { dots: 1, color: "#71717A", label: "Baixa" },
};

const categories = [
  "Todos",
  ...Array.from(new Set(newsMonitorItems.map((n) => n.category))),
];

export function NewsSection() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered =
    selectedCategory === "Todos"
      ? newsMonitorItems
      : newsMonitorItems.filter((n) => n.category === selectedCategory);

  return (
    <section className="space-y-8">
      <SectionHeader
        title="News Monitor"
        description="Monitoramento de noticias relevantes para posicionamento de conteudo"
        badge={`${newsMonitorItems.length} noticias`}
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCategory === cat
                ? "bg-accent text-white"
                : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const rel = relevanceConfig[item.relevance];

          return (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card transition-colors hover:bg-card-hover"
            >
              {/* Card Header — always visible */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="flex w-full items-start gap-4 p-5 text-left"
              >
                {/* Relevance dots */}
                <div className="mt-1 flex shrink-0 gap-1">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: dot <= rel.dots ? rel.color : "#1F1F24",
                      }}
                    />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="info" size="sm">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted">{item.source}</span>
                    <span className="text-xs text-muted">{item.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="shrink-0 mt-1 text-muted">
                  {isExpanded ? (
                    <CaretUp size={16} weight="bold" />
                  ) : (
                    <CaretDown size={16} weight="bold" />
                  )}
                </div>
              </button>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="border-t border-border/50 px-5 pb-5 pt-4 ml-10">
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    {item.summary}
                  </p>

                  {/* Content Suggestion Callout */}
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <LightbulbFilament
                        size={18}
                        weight="fill"
                        className="text-accent shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                          Sugestao de Conteudo
                        </p>
                        <p className="text-sm text-foreground">
                          {item.contentSuggestion}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
