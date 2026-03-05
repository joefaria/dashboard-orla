"use client";

import { useState, useMemo } from "react";
import {
  LinkedinLogo,
  Users,
  Eye,
  ChartLineUp,
  CursorClick,
  Browser,
  Heart,
  ChatCircle,
  ShareNetwork,
  Funnel,
  Trophy,
  DeviceMobile,
  Desktop,
  CalendarBlank,
} from "@phosphor-icons/react";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  linkedinContent,
  linkedinCumulativeFollowers,
  linkedinVisitors,
  linkedinCompetitors,
  linkedinMonthly,
  linkedinAvailableMonths,
  linkedinTotals,
} from "@/data/linkedin-real";
import { cn, formatNumber, formatPercent } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#0F0F12",
    border: "1px solid #1E1E24",
    borderRadius: "8px",
  },
  labelStyle: { color: "#A1A1AA" },
  itemStyle: { color: "#FAFAFA" },
};

const LINKEDIN_BLUE = "#0A66C2";
const LINKEDIN_LIGHT = "#378FE9";
const ACCENT_ORANGE = "#F97316";
const ACCENT_EMERALD = "#10B981";
const ACCENT_VIOLET = "#8B5CF6";
const ACCENT_ROSE = "#F43F5E";

type FilterMode = "all" | "last3" | string; // string = specific month value

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function monthLabel(value: string): string {
  const found = linkedinAvailableMonths.find((m) => m.value === value);
  return found ? found.label : value;
}

function formatDate(d: string): string {
  // "2025-03-04" -> "04/03"
  const parts = d.split("-");
  return `${parts[2]}/${parts[1]}`;
}

function safeDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LinkedinSection() {
  const [filter, setFilter] = useState<FilterMode>("all");

  // Determine which months are selected
  const selectedMonths = useMemo(() => {
    if (filter === "all") return linkedinAvailableMonths.map((m) => m.value);
    if (filter === "last3") {
      const all = linkedinAvailableMonths.map((m) => m.value);
      return all.slice(-3);
    }
    return [filter];
  }, [filter]);

  const previousMonth = useMemo(() => {
    if (filter === "all" || filter === "last3") return null;
    const allValues = linkedinAvailableMonths.map((m) => m.value as string);
    const idx = allValues.indexOf(filter);
    return idx > 0 ? allValues[idx - 1] : null;
  }, [filter]);

  // ---------------------------------------------------------------------------
  // Filtered daily data
  // ---------------------------------------------------------------------------

  const inPeriod = (month: string) => selectedMonths.includes(month);

  const filteredContent = useMemo(
    () => [...linkedinContent].filter((d) => inPeriod(d.month)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMonths]
  );

  const filteredCumulativeFollowers = useMemo(
    () => [...linkedinCumulativeFollowers].filter((d) => inPeriod(d.month)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMonths]
  );

  const filteredVisitors = useMemo(
    () => [...linkedinVisitors].filter((d) => inPeriod(d.month)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMonths]
  );

  const filteredMonthly = useMemo(
    () => [...linkedinMonthly].filter((m) => inPeriod(m.month)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMonths]
  );

  // ---------------------------------------------------------------------------
  // KPI Aggregation
  // ---------------------------------------------------------------------------

  const kpis = useMemo(() => {
    if (filter === "all") {
      // Use linkedinTotals for all-time
      const lastMonth = linkedinMonthly[linkedinMonthly.length - 1];
      const prevMonth = linkedinMonthly[linkedinMonthly.length - 2];
      return {
        followers: linkedinTotals.followers,
        impressions: linkedinTotals.totalImpressions,
        clicks: linkedinTotals.totalClicks,
        reactions: linkedinTotals.totalReactions,
        comments: linkedinTotals.totalComments,
        shares: linkedinTotals.totalShares,
        newFollowers: linkedinTotals.totalNewFollowers,
        avgEngRate:
          linkedinMonthly.reduce((s, m) => s + m.avgEngagementRate, 0) /
          linkedinMonthly.length,
        pageViews: linkedinMonthly.reduce((s, m) => s + m.totalPageViews, 0),
        uniqueVisitors: linkedinMonthly.reduce(
          (s, m) => s + m.totalUniqueVisitors,
          0
        ),
        deltaFollowers: lastMonth && prevMonth
          ? safeDelta(lastMonth.newFollowersTotal, prevMonth.newFollowersTotal)
          : 0,
        deltaImpressions: lastMonth && prevMonth
          ? safeDelta(lastMonth.impressionsTotal, prevMonth.impressionsTotal)
          : 0,
        deltaEngRate: lastMonth && prevMonth
          ? safeDelta(lastMonth.avgEngagementRate, prevMonth.avgEngagementRate)
          : 0,
        deltaClicks: lastMonth && prevMonth
          ? safeDelta(lastMonth.clicksTotal, prevMonth.clicksTotal)
          : 0,
        deltaPageViews: lastMonth && prevMonth
          ? safeDelta(lastMonth.totalPageViews, prevMonth.totalPageViews)
          : 0,
        deltaVisitors: lastMonth && prevMonth
          ? safeDelta(
              lastMonth.totalUniqueVisitors,
              prevMonth.totalUniqueVisitors
            )
          : 0,
      };
    }

    // Aggregate selected months
    const agg = filteredMonthly.reduce(
      (acc, m) => ({
        impressions: acc.impressions + m.impressionsTotal,
        clicks: acc.clicks + m.clicksTotal,
        reactions: acc.reactions + m.reactionsTotal,
        comments: acc.comments + m.commentsTotal,
        shares: acc.shares + m.sharesTotal,
        newFollowers: acc.newFollowers + m.newFollowersTotal,
        pageViews: acc.pageViews + m.totalPageViews,
        uniqueVisitors: acc.uniqueVisitors + m.totalUniqueVisitors,
        engRateSum: acc.engRateSum + m.avgEngagementRate,
      }),
      {
        impressions: 0,
        clicks: 0,
        reactions: 0,
        comments: 0,
        shares: 0,
        newFollowers: 0,
        pageViews: 0,
        uniqueVisitors: 0,
        engRateSum: 0,
      }
    );

    const avgEngRate =
      filteredMonthly.length > 0 ? agg.engRateSum / filteredMonthly.length : 0;

    // Delta vs previous month (only for single month filter)
    let deltaFollowers = 0;
    let deltaImpressions = 0;
    let deltaEngRate = 0;
    let deltaClicks = 0;
    let deltaPageViews = 0;
    let deltaVisitors = 0;

    if (previousMonth) {
      const prev = linkedinMonthly.find((m) => m.month === previousMonth);
      const curr = filteredMonthly[0];
      if (prev && curr) {
        deltaFollowers = safeDelta(
          curr.newFollowersTotal,
          prev.newFollowersTotal
        );
        deltaImpressions = safeDelta(
          curr.impressionsTotal,
          prev.impressionsTotal
        );
        deltaEngRate = safeDelta(
          curr.avgEngagementRate,
          prev.avgEngagementRate
        );
        deltaClicks = safeDelta(curr.clicksTotal, prev.clicksTotal);
        deltaPageViews = safeDelta(curr.totalPageViews, prev.totalPageViews);
        deltaVisitors = safeDelta(
          curr.totalUniqueVisitors,
          prev.totalUniqueVisitors
        );
      }
    } else if (filter === "last3" && filteredMonthly.length >= 2) {
      const curr = filteredMonthly[filteredMonthly.length - 1];
      const prev = filteredMonthly[filteredMonthly.length - 2];
      deltaFollowers = safeDelta(
        curr.newFollowersTotal,
        prev.newFollowersTotal
      );
      deltaImpressions = safeDelta(
        curr.impressionsTotal,
        prev.impressionsTotal
      );
      deltaEngRate = safeDelta(curr.avgEngagementRate, prev.avgEngagementRate);
      deltaClicks = safeDelta(curr.clicksTotal, prev.clicksTotal);
      deltaPageViews = safeDelta(curr.totalPageViews, prev.totalPageViews);
      deltaVisitors = safeDelta(
        curr.totalUniqueVisitors,
        prev.totalUniqueVisitors
      );
    }

    // Last cumulative followers count in period
    const lastCumulative =
      filteredCumulativeFollowers.length > 0
        ? filteredCumulativeFollowers[filteredCumulativeFollowers.length - 1]
            .cumulativeFollowers
        : linkedinTotals.followers;

    return {
      followers: lastCumulative,
      impressions: agg.impressions,
      clicks: agg.clicks,
      reactions: agg.reactions,
      comments: agg.comments,
      shares: agg.shares,
      newFollowers: agg.newFollowers,
      avgEngRate,
      pageViews: agg.pageViews,
      uniqueVisitors: agg.uniqueVisitors,
      deltaFollowers,
      deltaImpressions,
      deltaEngRate,
      deltaClicks,
      deltaPageViews,
      deltaVisitors,
    };
  }, [filter, filteredMonthly, filteredCumulativeFollowers, previousMonth]);

  // ---------------------------------------------------------------------------
  // Chart data
  // ---------------------------------------------------------------------------

  // Cumulative followers line chart
  const followersChartData = useMemo(() => {
    // Sample every nth point if too many
    const data = filteredCumulativeFollowers.map((d) => ({
      date: formatDate(d.date),
      followers: d.cumulativeFollowers,
      newFollowers: d.newFollowers,
    }));
    if (data.length > 120) {
      const step = Math.ceil(data.length / 90);
      return data.filter((_, i) => i % step === 0 || i === data.length - 1);
    }
    return data;
  }, [filteredCumulativeFollowers]);

  // Daily impressions area chart
  const impressionsChartData = useMemo(() => {
    const data = filteredContent.map((d) => ({
      date: formatDate(d.date),
      organic: d.impressionsOrganic,
      sponsored: d.impressionsSponsored,
      total: d.impressionsTotal,
    }));
    if (data.length > 120) {
      const step = Math.ceil(data.length / 90);
      return data.filter((_, i) => i % step === 0 || i === data.length - 1);
    }
    return data;
  }, [filteredContent]);

  // Engagement breakdown bar chart (monthly)
  const engagementChartData = useMemo(
    () =>
      filteredMonthly.map((m) => ({
        month: m.label,
        reactions: m.reactionsTotal,
        comments: m.commentsTotal,
        shares: m.sharesTotal,
      })),
    [filteredMonthly]
  );

  // Visitors by device
  const visitorDeviceData = useMemo(() => {
    const totalDesktop = filteredVisitors.reduce(
      (s, d) => s + d.totalPageViewsDesktop,
      0
    );
    const totalMobile = filteredVisitors.reduce(
      (s, d) => s + d.totalPageViewsMobile,
      0
    );
    return { desktop: totalDesktop, mobile: totalMobile };
  }, [filteredVisitors]);

  const visitorDeviceMonthly = useMemo(
    () =>
      filteredMonthly.map((m) => ({
        month: m.label,
        desktop: m.desktopViews,
        mobile: m.mobileViews,
      })),
    [filteredMonthly]
  );

  // Competitor data for horizontal bar chart
  const competitorData = useMemo(
    () =>
      [...linkedinCompetitors]
        .sort(
          (a, b) => b.totalFollowers - a.totalFollowers
        )
        .map((c) => ({
          page: c.page,
          totalFollowers: c.totalFollowers,
          newFollowers: c.newFollowers,
          totalEngagements: c.totalEngagements,
          totalPosts: c.totalPosts,
          isOrla: c.page === "Orla",
        })),
    []
  );

  // Sparkline data for KPI cards
  const followersSparkline = useMemo(
    () =>
      filteredCumulativeFollowers
        .slice(-30)
        .map((d) => ({ value: d.cumulativeFollowers })),
    [filteredCumulativeFollowers]
  );

  const impressionsSparkline = useMemo(
    () =>
      filteredContent.slice(-30).map((d) => ({ value: d.impressionsTotal })),
    [filteredContent]
  );

  // Monthly comparison table data
  const monthlyTableData = useMemo(
    () =>
      filteredMonthly.map((m) => ({
        month: m.label,
        impressions: formatNumber(m.impressionsTotal),
        clicks: formatNumber(m.clicksTotal),
        reactions: formatNumber(m.reactionsTotal),
        comments: String(m.commentsTotal),
        shares: String(m.sharesTotal),
        engRate: formatPercent(m.avgEngagementRate * 100),
        newFollowers: formatNumber(m.newFollowersTotal),
        pageViews: formatNumber(m.totalPageViews),
        uniqueVisitors: formatNumber(m.totalUniqueVisitors),
      })),
    [filteredMonthly]
  );

  const monthlyTableColumns = [
    { key: "month", label: "Mes" },
    { key: "impressions", label: "Impressoes", align: "right" as const },
    { key: "clicks", label: "Cliques", align: "right" as const },
    { key: "reactions", label: "Reacoes", align: "right" as const },
    { key: "comments", label: "Coments", align: "right" as const },
    { key: "shares", label: "Shares", align: "right" as const },
    { key: "engRate", label: "Eng. Rate", align: "right" as const },
    { key: "newFollowers", label: "Novos Seg.", align: "right" as const },
    { key: "pageViews", label: "Page Views", align: "right" as const },
    { key: "uniqueVisitors", label: "Visitantes", align: "right" as const },
  ];

  // Active filter label for header badge
  const filterLabel = useMemo(() => {
    if (filter === "all") return "Todos os meses";
    if (filter === "last3") return "Ultimos 3 meses";
    return monthLabel(filter);
  }, [filter]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="LinkedIn"
        description="Metricas da Company Page — dados reais da Orla"
        badge={filterLabel}
        action={
          <div className="flex items-center gap-2 text-[#0A66C2]">
            <LinkedinLogo size={20} weight="fill" />
            <span className="text-sm font-medium">Orla</span>
          </div>
        }
      />

      {/* Month Filter — sticky & prominent */}
      <div className="sticky top-0 z-30 -mx-1 px-1 py-3 backdrop-blur-xl bg-background/80">
        <div className="flex items-center gap-2">
          <Funnel
            size={16}
            weight="bold"
            className="text-muted shrink-0"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Todos */}
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                filter === "all"
                  ? "bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/25"
                  : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground"
              )}
            >
              Todos
            </button>
            {/* Ultimos 3 */}
            <button
              onClick={() => setFilter("last3")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                filter === "last3"
                  ? "bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/25"
                  : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground"
              )}
            >
              Ultimos 3m
            </button>

            <div className="mx-1 h-5 w-px bg-border" />

            {/* Individual months */}
            {linkedinAvailableMonths.map((m) => (
              <button
                key={m.value}
                onClick={() => setFilter(m.value)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                  filter === m.value
                    ? "bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/25"
                    : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          title="Followers"
          value={formatNumber(kpis.followers)}
          delta={kpis.deltaFollowers}
          deltaLabel="vs anterior"
          icon={<Users size={20} weight="bold" />}
          color={LINKEDIN_BLUE}
          sparklineData={followersSparkline}
          tooltip="Total acumulado de seguidores da pagina da Orla no LinkedIn."
        />
        <KpiCard
          title="Impressoes"
          value={formatNumber(kpis.impressions)}
          delta={kpis.deltaImpressions}
          deltaLabel="vs anterior"
          icon={<Eye size={20} weight="bold" />}
          color={LINKEDIN_BLUE}
          sparklineData={impressionsSparkline}
          tooltip="Numero de vezes que os posts da Orla foram exibidos no feed de usuarios (organico + patrocinado)."
        />
        <KpiCard
          title="Cliques"
          value={formatNumber(kpis.clicks)}
          delta={kpis.deltaClicks}
          deltaLabel="vs anterior"
          icon={<CursorClick size={20} weight="bold" />}
          color={LINKEDIN_BLUE}
          tooltip="Total de cliques nos posts — inclui cliques no conteudo, links, 'ver mais' e imagens."
        />
        <KpiCard
          title="Eng. Rate"
          value={formatPercent(kpis.avgEngRate * 100)}
          delta={kpis.deltaEngRate}
          deltaLabel="vs anterior"
          icon={<ChartLineUp size={20} weight="bold" />}
          color={LINKEDIN_BLUE}
          tooltip="Taxa de engajamento: (cliques + reacoes + comentarios + compartilhamentos) / impressoes. Mede o quanto a audiencia interage com o conteudo."
        />
        <KpiCard
          title="Page Views"
          value={formatNumber(kpis.pageViews)}
          delta={kpis.deltaPageViews}
          deltaLabel="vs anterior"
          icon={<Browser size={20} weight="bold" />}
          color={LINKEDIN_BLUE}
          tooltip="Visualizacoes da pagina da Orla no LinkedIn (perfil da empresa). Inclui desktop e mobile."
        />
        <KpiCard
          title="Visitantes"
          value={formatNumber(kpis.uniqueVisitors)}
          delta={kpis.deltaVisitors}
          deltaLabel="vs anterior"
          icon={<Users size={20} weight="bold" />}
          color={LINKEDIN_BLUE}
          tooltip="Visitantes unicos que acessaram a pagina da Orla no LinkedIn no periodo selecionado."
        />
      </div>

      {/* Charts Row 1: Followers Growth + Impressions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cumulative Followers Line Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Crescimento de Followers
            </h3>
            <Badge variant="info" size="sm">
              {formatNumber(kpis.followers)} total
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followersChartData}>
                <defs>
                  <linearGradient
                    id="liFollowersGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={LINKEDIN_BLUE}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={LINKEDIN_BLUE}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#1E1E24" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  domain={["dataMin - 50", "dataMax + 50"]}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={((value: number) => [
                    formatNumber(value),
                    "Followers",
                  ]) as never}
                />
                <Area
                  type="monotone"
                  dataKey="followers"
                  name="Followers"
                  stroke={LINKEDIN_BLUE}
                  strokeWidth={2}
                  fill="url(#liFollowersGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Impressions Area Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Impressoes Diarias
            </h3>
            <Badge variant="info" size="sm">
              {formatNumber(kpis.impressions)} total
            </Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={impressionsChartData}>
                <defs>
                  <linearGradient
                    id="liImprOrgGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={LINKEDIN_BLUE}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor={LINKEDIN_BLUE}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="liImprSponGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={ACCENT_ORANGE}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor={ACCENT_ORANGE}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#1E1E24" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={((value: number, name: string) => [
                    formatNumber(value),
                    name,
                  ]) as never}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: "#A1A1AA" }}
                />
                <Area
                  type="monotone"
                  dataKey="organic"
                  name="Organico"
                  stroke={LINKEDIN_BLUE}
                  strokeWidth={2}
                  fill="url(#liImprOrgGrad)"
                  dot={false}
                  stackId="impr"
                />
                <Area
                  type="monotone"
                  dataKey="sponsored"
                  name="Patrocinado"
                  stroke={ACCENT_ORANGE}
                  strokeWidth={2}
                  fill="url(#liImprSponGrad)"
                  dot={false}
                  stackId="impr"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Engagement Breakdown + Visitors by Device */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Engagement Breakdown Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Engajamento por Tipo
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: ACCENT_EMERALD }}
                />
                Reacoes
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: LINKEDIN_LIGHT }}
                />
                Comentarios
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: ACCENT_VIOLET }}
                />
                Shares
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#1E1E24" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={((value: number, name: string) => [
                    formatNumber(value),
                    name,
                  ]) as never}
                />
                <Bar
                  dataKey="reactions"
                  name="Reacoes"
                  fill={ACCENT_EMERALD}
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Bar
                  dataKey="comments"
                  name="Comentarios"
                  fill={LINKEDIN_LIGHT}
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Bar
                  dataKey="shares"
                  name="Shares"
                  fill={ACCENT_VIOLET}
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitors by Device */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Visitantes por Dispositivo
            </h3>
            <Badge variant="default" size="sm">
              {formatNumber(visitorDeviceData.desktop + visitorDeviceData.mobile)}{" "}
              views
            </Badge>
          </div>

          {/* Summary bars */}
          <div className="mb-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted">
                  <Desktop size={14} weight="bold" className="text-[#0A66C2]" />
                  Desktop
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatNumber(visitorDeviceData.desktop)}
                  <span className="ml-1 text-muted font-normal">
                    (
                    {(
                      (visitorDeviceData.desktop /
                        (visitorDeviceData.desktop +
                          visitorDeviceData.mobile || 1)) *
                      100
                    ).toFixed(0)}
                    %)
                  </span>
                </span>
              </div>
              <ProgressBar
                value={
                  (visitorDeviceData.desktop /
                    (visitorDeviceData.desktop + visitorDeviceData.mobile ||
                      1)) *
                  100
                }
                color="#0A66C2"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted">
                  <DeviceMobile
                    size={14}
                    weight="bold"
                    className="text-[#378FE9]"
                  />
                  Mobile
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatNumber(visitorDeviceData.mobile)}
                  <span className="ml-1 text-muted font-normal">
                    (
                    {(
                      (visitorDeviceData.mobile /
                        (visitorDeviceData.desktop +
                          visitorDeviceData.mobile || 1)) *
                      100
                    ).toFixed(0)}
                    %)
                  </span>
                </span>
              </div>
              <ProgressBar
                value={
                  (visitorDeviceData.mobile /
                    (visitorDeviceData.desktop + visitorDeviceData.mobile ||
                      1)) *
                  100
                }
                color="#378FE9"
              />
            </div>
          </div>

          {/* Monthly device breakdown */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorDeviceMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#71717A", fontSize: 10 }}
                  axisLine={{ stroke: "#1E1E24" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={((value: number, name: string) => [
                    formatNumber(value),
                    name,
                  ]) as never}
                />
                <Bar
                  dataKey="desktop"
                  name="Desktop"
                  fill={LINKEDIN_BLUE}
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                />
                <Bar
                  dataKey="mobile"
                  name="Mobile"
                  fill={LINKEDIN_LIGHT}
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Competitors Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={18} weight="bold" className="text-[#0A66C2]" />
            <h3 className="text-sm font-semibold text-foreground">
              Benchmark Competitivo
            </h3>
          </div>
          <Badge variant="info" size="sm">
            3 paginas
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Followers comparison */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted uppercase">
              Total de Followers
            </p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitorData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E1E24"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#71717A", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatNumber(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="page"
                    tick={{ fill: "#A1A1AA", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={((value: number) => [
                      formatNumber(value),
                      "Followers",
                    ]) as never}
                  />
                  <Bar
                    dataKey="totalFollowers"
                    name="Followers"
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                  >
                    {competitorData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={entry.isOrla ? LINKEDIN_BLUE : "#27272A"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed comparison cards */}
          <div className="space-y-3">
            {competitorData.map((c) => {
              const maxFollowers = Math.max(
                ...competitorData.map((x) => x.totalFollowers)
              );
              return (
                <div
                  key={c.page}
                  className={cn(
                    "rounded-lg border p-4 transition-colors",
                    c.isOrla
                      ? "border-[#0A66C2]/30 bg-[#0A66C2]/5"
                      : "border-border bg-surface-1"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        c.isOrla ? "text-[#0A66C2]" : "text-foreground"
                      )}
                    >
                      {c.page}
                      {c.isOrla && (
                        <Badge variant="info" size="sm" className="ml-2">
                          Voce
                        </Badge>
                      )}
                    </span>
                    <span className="text-lg font-bold text-foreground tabular-nums">
                      {formatNumber(c.totalFollowers)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="text-muted">Novos Seg.</p>
                      <p className="font-semibold text-foreground tabular-nums">
                        +{formatNumber(c.newFollowers)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted">Engajamentos</p>
                      <p className="font-semibold text-foreground tabular-nums">
                        {formatNumber(c.totalEngagements)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted">Posts</p>
                      <p className="font-semibold text-foreground tabular-nums">
                        {c.totalPosts}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(c.totalFollowers / maxFollowers) * 100}%`,
                          backgroundColor: c.isOrla ? LINKEDIN_BLUE : "#3F3F46",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engagement Summary Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} weight="bold" className="text-[#F43F5E]" />
            <span className="text-xs font-medium text-muted uppercase">
              Reacoes
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatNumber(kpis.reactions)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <ChatCircle size={16} weight="bold" className="text-[#378FE9]" />
            <span className="text-xs font-medium text-muted uppercase">
              Comentarios
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {kpis.comments}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShareNetwork size={16} weight="bold" className="text-[#8B5CF6]" />
            <span className="text-xs font-medium text-muted uppercase">
              Compartilhamentos
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {kpis.shares}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} weight="bold" className="text-[#10B981]" />
            <span className="text-xs font-medium text-muted uppercase">
              Novos Seguidores
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            +{formatNumber(kpis.newFollowers)}
          </p>
        </div>
      </div>

      {/* Monthly Comparison Table */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <CalendarBlank size={18} weight="bold" className="text-muted" />
          <h3 className="text-sm font-semibold text-foreground">
            Comparativo Mensal
          </h3>
          <Badge variant="default" size="sm">
            {filteredMonthly.length} meses
          </Badge>
        </div>
        <DataTable columns={monthlyTableColumns} data={monthlyTableData} />
      </div>
    </section>
  );
}
