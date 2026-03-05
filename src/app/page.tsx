"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { OverviewSection } from "@/components/dashboard/overview-section";
import { InstagramSection } from "@/components/dashboard/instagram-section";
import { LinkedinSection as LinkedInSection } from "@/components/dashboard/linkedin-section";
import { CampaignsSection } from "@/components/dashboard/campaigns-section";
import { AnalyticsSection } from "@/components/dashboard/analytics-section";
import { ClaritySection } from "@/components/dashboard/clarity-section";
import { InsightsSection } from "@/components/dashboard/insights-section";
import { NewsSection } from "@/components/dashboard/news-section";
import type { Section } from "@/data/mock";

const sectionConfig: Record<Section, { title: string; description: string }> = {
  overview: {
    title: "Overview",
    description: "Visão executiva consolidada de todos os canais",
  },
  instagram: {
    title: "Instagram",
    description: "Métricas de performance orgânica do Instagram",
  },
  linkedin: {
    title: "LinkedIn",
    description: "Performance orgânica e crescimento no LinkedIn",
  },
  campaigns: {
    title: "Campanhas",
    description: "Performance da campanha LinkedIn Ads — Quick Discovery",
  },
  analytics: {
    title: "Website (GA4)",
    description: "Métricas do Google Analytics para orla.tech",
  },
  clarity: {
    title: "Microsoft Clarity",
    description: "Comportamento do usuário e insights de UX",
  },
  insights: {
    title: "Insights IA",
    description: "Cruzamento de dados e recomendações inteligentes",
  },
  news: {
    title: "News Monitor",
    description: "Monitoramento de notícias do setor para pautas de conteúdo",
  },
};

const sectionComponents: Record<Section, React.ComponentType> = {
  overview: OverviewSection,
  instagram: InstagramSection,
  linkedin: LinkedInSection,
  campaigns: CampaignsSection,
  analytics: AnalyticsSection,
  clarity: ClaritySection,
  insights: InsightsSection,
  news: NewsSection,
};

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const config = sectionConfig[activeSection];
  const SectionComponent = sectionComponents[activeSection];

  return (
    <div className="flex min-h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 ml-60">
        <Header title={config.title} description={config.description} />
        <main className="p-6 pt-24">
          <SectionComponent />
        </main>
      </div>
    </div>
  );
}
