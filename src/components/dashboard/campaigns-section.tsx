"use client";

import { useState } from "react";
import {
  Megaphone,
  Eye,
  CursorClick,
  Target,
  CurrencyDollar,
  HandPointing,
  ChartBar,
  UsersThree,
  Buildings,
  MapPin,
  Briefcase,
  UserCircle,
  Gauge,
} from "@phosphor-icons/react";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import {
  linkedinCampaigns,
  linkedinCreatives,
  linkedinDemographics,
} from "@/data/linkedin-real";
import { formatNumber, formatCurrency, formatPercent, cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#0F0F12",
    border: "1px solid #1E1E24",
    borderRadius: "8px",
  },
  labelStyle: { color: "#A1A1AA" },
  itemStyle: { color: "#FAFAFA" },
};

// Budget total allocated across both campaigns
const TOTAL_BUDGET = 700;

type DemoTab = "industry" | "seniority" | "function" | "size" | "location";

const DEMO_TABS: { key: DemoTab; label: string; icon: typeof Buildings }[] = [
  { key: "industry", label: "Industria", icon: Buildings },
  { key: "seniority", label: "Senioridade", icon: UserCircle },
  { key: "function", label: "Funcao", icon: Briefcase },
  { key: "size", label: "Porte", icon: UsersThree },
  { key: "location", label: "Localizacao", icon: MapPin },
];

const DEMO_KEY_MAP: Record<DemoTab, string> = {
  industry: "Company Industry",
  seniority: "Job Seniority",
  function: "Job Function",
  size: "Company Size",
  location: "Location",
};

const BAR_COLORS = [
  "#0A66C2",
  "#1A7AD4",
  "#2B8FE6",
  "#3DA3F5",
  "#5BB5F7",
  "#7DC7F9",
  "#9ED8FB",
  "#BFE8FC",
  "#D0EFFE",
  "#E0F5FF",
];

export function CampaignsSection() {
  const [activeDemo, setActiveDemo] = useState<DemoTab>("industry");

  // ---------- Combined Totals ----------
  const totalSpent = linkedinCampaigns.reduce((s, c) => s + c.totalSpent, 0);
  const totalImpressions = linkedinCampaigns.reduce(
    (s, c) => s + c.impressions,
    0
  );
  const totalClicks = linkedinCampaigns.reduce((s, c) => s + c.clicks, 0);
  const totalReach = linkedinCampaigns.reduce((s, c) => s + c.reach, 0);
  const totalEngagements = linkedinCampaigns.reduce(
    (s, c) => s + c.totalEngagements,
    0
  );
  const avgCtr =
    totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
  const avgEngRate =
    linkedinCampaigns.reduce((s, c) => s + c.engagementRate, 0) /
    linkedinCampaigns.length;
  const avgCpm = (totalSpent / totalImpressions) * 1000;
  const spentPercent = (totalSpent / TOTAL_BUDGET) * 100;

  // ---------- Campaign Comparison Data ----------
  const comparisonMetrics = [
    {
      metric: "Impressoes",
      Tech: linkedinCampaigns[0].impressions,
      Produto: linkedinCampaigns[1].impressions,
    },
    {
      metric: "Cliques",
      Tech: linkedinCampaigns[0].clicks,
      Produto: linkedinCampaigns[1].clicks,
    },
    {
      metric: "Engajamentos",
      Tech: linkedinCampaigns[0].totalEngagements,
      Produto: linkedinCampaigns[1].totalEngagements,
    },
    {
      metric: "Alcance",
      Tech: linkedinCampaigns[0].reach,
      Produto: linkedinCampaigns[1].reach,
    },
    {
      metric: "LP Clicks",
      Tech: linkedinCampaigns[0].landingPageClicks,
      Produto: linkedinCampaigns[1].landingPageClicks,
    },
  ];

  // ---------- Creative Table ----------
  const creativesData = linkedinCreatives
    .slice()
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .map((c) => ({
      creative: c.creativeName,
      campaign:
        c.campaignName.includes("Tech") ? "Tech" : "Produto",
      spent: formatCurrency(c.totalSpent),
      impressions: formatNumber(c.impressions),
      clicks: c.clicks.toString(),
      ctr: c.ctr > 0 ? formatPercent(c.ctr) : "--",
      cpc: c.avgCpc > 0 ? formatCurrency(c.avgCpc) : "--",
      engagements: c.totalEngagements.toString(),
      engRate: formatPercent(c.engagementRate),
      reach: formatNumber(c.reach),
    }));

  const creativeColumns = [
    { key: "creative", label: "Criativo" },
    { key: "campaign", label: "Campanha" },
    { key: "spent", label: "Gasto", align: "right" as const },
    { key: "impressions", label: "Impressoes", align: "right" as const },
    { key: "clicks", label: "Cliques", align: "right" as const },
    { key: "cpc", label: "CPC", align: "right" as const },
    { key: "engagements", label: "Engajamentos", align: "right" as const },
    { key: "engRate", label: "Eng. Rate", align: "right" as const },
    { key: "reach", label: "Alcance", align: "right" as const },
  ];

  // ---------- Demographics ----------
  const demoKey = DEMO_KEY_MAP[activeDemo];
  const demoData = (
    linkedinDemographics as unknown as Record<
      string,
      { name: string; impressions: number; percentImpressions: number; clicks: number; ctr: number }[]
    >
  )[demoKey] || [];

  const topDemo = demoData.slice(0, 10);
  const maxDemoPercent = Math.max(
    ...topDemo.map((d) => d.percentImpressions),
    1
  );

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Campanhas LinkedIn Ads"
        description="Performance das campanhas de trafego — dados reais do LinkedIn Campaign Manager"
        badge="Fev-Mar 2026"
      />

      {/* Budget Utilization */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Megaphone size={24} weight="bold" className="text-accent" />
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Quick Discovery — LinkedIn Ads
              </h3>
              <p className="text-xs text-muted">
                2 campanhas ativas desde 06/12/2025
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {linkedinCampaigns.map((c) => (
              <Badge
                key={c.name}
                variant={c.status === "Active" ? "success" : "warning"}
                size="sm"
              >
                {c.name.includes("Tech") ? "Tech" : "Produto"} — {c.status === "Active" ? "Ativa" : c.status}
              </Badge>
            ))}
          </div>
        </div>
        <ProgressBar
          value={spentPercent}
          color="#0A66C2"
          label={`${formatCurrency(totalSpent)} de ${formatCurrency(TOTAL_BUDGET)} investidos (${formatCurrency(TOTAL_BUDGET - totalSpent)} restante)`}
          showValue
        />
      </div>

      {/* KPI Row — Awareness Focus */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <KpiCard
          title="Investido"
          value={formatCurrency(totalSpent)}
          delta={0}
          icon={<CurrencyDollar size={18} weight="bold" />}
          color="#0A66C2"
          tooltip="Valor total gasto nas duas campanhas de LinkedIn Ads no periodo."
        />
        <KpiCard
          title="Impressoes"
          value={formatNumber(totalImpressions)}
          delta={0}
          icon={<Eye size={18} weight="bold" />}
          color="#0A66C2"
          tooltip="Numero total de vezes que os anuncios foram exibidos para a audiencia segmentada."
        />
        <KpiCard
          title="Alcance"
          value={formatNumber(totalReach)}
          delta={0}
          icon={<UsersThree size={18} weight="bold" />}
          color="#3B82F6"
          tooltip="Numero de pessoas unicas que viram os anuncios. Diferente de impressoes, conta cada pessoa apenas uma vez."
        />
        <KpiCard
          title="Cliques"
          value={totalClicks.toString()}
          delta={0}
          icon={<CursorClick size={18} weight="bold" />}
          color="#3B82F6"
          tooltip="Total de cliques nos anuncios — inclui cliques no conteudo, links e landing page."
        />
        <KpiCard
          title="CTR"
          value={formatPercent(avgCtr)}
          delta={0}
          icon={<Target size={18} weight="bold" />}
          color="#F59E0B"
          tooltip="Click-Through Rate: percentual de pessoas que clicaram apos ver o anuncio. Formula: (cliques / impressoes) x 100."
        />
        <KpiCard
          title="CPM"
          value={formatCurrency(avgCpm)}
          delta={0}
          icon={<Gauge size={18} weight="bold" />}
          color="#F59E0B"
          tooltip="Custo por Mil Impressoes: quanto custa para exibir o anuncio 1.000 vezes. Referencia LinkedIn: R$20-50 e bom."
        />
        <KpiCard
          title="Eng. Rate"
          value={formatPercent(avgEngRate)}
          delta={0}
          icon={<HandPointing size={18} weight="bold" />}
          color="#22C55E"
          tooltip="Taxa de Engajamento dos anuncios: (cliques + reacoes + comentarios + compartilhamentos) / impressoes."
        />
      </div>

      {/* Campaign Cards Side by Side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {linkedinCampaigns.map((campaign) => {
          const label = campaign.name.includes("Tech")
            ? "Tech"
            : "Produto";
          const color = campaign.name.includes("Tech")
            ? "#0A66C2"
            : "#22C55E";

          return (
            <div
              key={campaign.name}
              className="rounded-xl border border-border bg-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <h3 className="text-sm font-semibold text-foreground">
                    Campanha {label}
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  Ativa
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Gasto
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(campaign.totalSpent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Impressoes
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatNumber(campaign.impressions)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Alcance
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatNumber(campaign.reach)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Cliques
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {campaign.clicks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    CPM
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(campaign.avgCpm)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    CPC
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {campaign.avgCpc > 0
                      ? formatCurrency(campaign.avgCpc)
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Engajamentos
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {campaign.totalEngagements}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide">
                    Eng. Rate
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatPercent(campaign.engagementRate)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-muted">Reacoes</p>
                  <p className="text-sm font-semibold text-foreground">
                    {campaign.reactions}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted">LP Clicks</p>
                  <p className="text-sm font-semibold text-foreground">
                    {campaign.landingPageClicks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted">Freq. Media</p>
                  <p className="text-sm font-semibold text-foreground">
                    {campaign.avgFrequency.toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Comparison Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6 text-sm font-semibold text-foreground">
          Comparativo entre Campanhas
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonMetrics}
              barCategoryGap="20%"
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E1E24"
                vertical={false}
              />
              <XAxis
                dataKey="metric"
                tick={{ fill: "#71717A", fontSize: 11 }}
                axisLine={{ stroke: "#1E1E24" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717A", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                {...tooltipStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [
                  formatNumber(Number(value) || 0),
                  String(name),
                ]}
              />
              <Bar
                dataKey="Tech"
                name="Tech"
                fill="#0A66C2"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Produto"
                name="Produto"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#0A66C2]" />
            <span className="text-xs text-muted">Tech</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#22C55E]" />
            <span className="text-xs text-muted">Produto</span>
          </div>
        </div>
      </div>

      {/* Creative Performance Table */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Performance dos Criativos
        </h3>
        <DataTable columns={creativeColumns} data={creativesData} />
      </div>

      {/* Demographics Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Demografia da Audiencia
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Distribuicao por segmento — Top 10
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveDemo(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    activeDemo === tab.key
                      ? "bg-surface-2 text-foreground"
                      : "text-muted hover:text-foreground hover:bg-surface-1"
                  )}
                >
                  <Icon size={14} weight="bold" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="space-y-2.5">
          {topDemo.map((item, i) => {
            const barWidth = Math.max(
              4,
              (item.percentImpressions / maxDemoPercent) * 100
            );
            return (
              <div key={item.name} className="group flex items-center gap-3">
                <span className="w-56 truncate text-xs text-muted shrink-0 text-right pr-2">
                  {item.name}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 relative h-8">
                    <div
                      className="absolute inset-y-0 left-0 rounded-md transition-all duration-500 group-hover:opacity-90"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: BAR_COLORS[i] || BAR_COLORS[9],
                      }}
                    />
                    <div className="relative h-full flex items-center pl-2">
                      <span className="text-xs font-semibold text-white drop-shadow-sm">
                        {item.percentImpressions.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-20 text-right shrink-0">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatNumber(item.impressions)} imp.
                    </span>
                  </div>
                  {item.clicks > 0 && (
                    <div className="w-16 text-right shrink-0">
                      <span className="text-xs tabular-nums text-success">
                        {item.clicks} cliques
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Insights */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Insights Rapidos
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-surface-1 p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Melhor CPC
            </p>
            <p className="text-sm font-semibold text-foreground">
              Campanha Produto
            </p>
            <p className="text-xs text-success mt-0.5">
              {formatCurrency(linkedinCampaigns[1].avgCpc)} vs{" "}
              {formatCurrency(linkedinCampaigns[0].avgCpc)}
            </p>
          </div>
          <div className="rounded-lg bg-surface-1 p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Maior Alcance
            </p>
            <p className="text-sm font-semibold text-foreground">
              {linkedinCampaigns[1].reach > linkedinCampaigns[0].reach
                ? "Campanha Produto"
                : "Campanha Tech"}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {formatNumber(
                Math.max(
                  linkedinCampaigns[0].reach,
                  linkedinCampaigns[1].reach
                )
              )}{" "}
              pessoas
            </p>
          </div>
          <div className="rounded-lg bg-surface-1 p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Maior Engajamento
            </p>
            <p className="text-sm font-semibold text-foreground">
              {linkedinCampaigns[0].engagementRate >
              linkedinCampaigns[1].engagementRate
                ? "Campanha Tech"
                : "Campanha Produto"}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {formatPercent(
                Math.max(
                  linkedinCampaigns[0].engagementRate,
                  linkedinCampaigns[1].engagementRate
                )
              )}{" "}
              engagement rate
            </p>
          </div>
          <div className="rounded-lg bg-surface-1 p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Audiencia Principal
            </p>
            <p className="text-sm font-semibold text-foreground">
              Product Management
            </p>
            <p className="text-xs text-muted mt-0.5">
              22% das impressoes
            </p>
          </div>
          <div className="rounded-lg bg-surface-1 p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Industria Top
            </p>
            <p className="text-sm font-semibold text-foreground">
              Technology & Internet
            </p>
            <p className="text-xs text-muted mt-0.5">
              28.7% das impressoes
            </p>
          </div>
          <div className="rounded-lg bg-surface-1 p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              Regiao Principal
            </p>
            <p className="text-sm font-semibold text-foreground">
              Grande Sao Paulo
            </p>
            <p className="text-xs text-muted mt-0.5">
              16.6% das impressoes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
