"use client";

import { type ComponentType } from "react";
import { type IconProps } from "@phosphor-icons/react";
import {
  ChartLineUp,
  InstagramLogo,
  LinkedinLogo,
  Megaphone,
  Globe,
  CursorClick,
  Brain,
  Newspaper,
} from "@phosphor-icons/react";
import { sections, type Section } from "@/data/mock";
import { cn } from "@/lib/utils";

const iconMap: Record<string, ComponentType<IconProps>> = {
  ChartLineUp,
  InstagramLogo,
  LinkedinLogo,
  Megaphone,
  Globe,
  CursorClick,
  Brain,
  Newspaper,
};

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-surface-1">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          ORLA
        </h1>
        <p className="mt-0.5 text-xs text-muted">Analytics Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3">
        {sections.map((section) => {
          const Icon = iconMap[section.icon];
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-l-2 border-accent bg-surface-3 text-foreground"
                  : "border-l-2 border-transparent text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              {Icon && (
                <Icon
                  size={18}
                  weight={isActive ? "fill" : "regular"}
                  className={cn(isActive && "text-accent")}
                />
              )}
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-5 py-4">
        <p className="text-[10px] font-medium tracking-wider text-muted/60 uppercase">
          Dados mockup
        </p>
        <span className="mt-1 inline-block rounded-md bg-surface-3 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Fev-Mar 2026
        </span>
      </div>
    </aside>
  );
}
