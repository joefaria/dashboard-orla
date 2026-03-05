"use client";

import {
  Globe,
  Users,
  UserPlus,
  Browser,
  Timer,
  ArrowUUpLeft,
  Stack,
} from "@phosphor-icons/react";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { DataTable } from "@/components/ui/data-table";
import { analyticsMetrics } from "@/data/mock";
import { formatNumber, formatPercent, getDelta } from "@/lib/utils";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AnalyticsSection() {
  const m = analyticsMetrics;

  const sessionsDelta = getDelta(m.sessions, m.previousSessions);
  const usersDelta = getDelta(m.users, m.previousUsers);
  const newUsersDelta = getDelta(m.newUsers, m.previousNewUsers);
  const pageViewsDelta = getDelta(m.pageViews, m.previousPageViews);
  const durationDelta = getDelta(m.avgSessionDuration, m.previousAvgSessionDuration);
  const bounceDelta = getDelta(m.bounceRate, m.previousBounceRate);
  const ppsDelta = getDelta(m.pagesPerSession, m.previousPagesPerSession);

  const trafficData = m.trafficSources.map((s) => ({
    source: s.source,
    sessions: formatNumber(s.sessions),
    percentage: (
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${s.percentage}%` }}
          />
        </div>
        <span className="tabular-nums">{formatPercent(s.percentage)}</span>
      </div>
    ),
    bounceRate: formatPercent(s.bounceRate),
    avgDuration: formatDuration(s.avgDuration),
  }));

  const trafficColumns = [
    { key: "source", label: "Fonte" },
    { key: "sessions", label: "Sessoes", align: "right" as const },
    { key: "percentage", label: "% do Total", align: "right" as const },
    { key: "bounceRate", label: "Bounce Rate", align: "right" as const },
    { key: "avgDuration", label: "Duracao Media", align: "right" as const },
  ];

  const pagesData = m.topPages.map((p) => ({
    page: (
      <div>
        <span className="text-foreground">{p.title}</span>
        <span className="ml-2 text-xs text-muted">{p.page}</span>
      </div>
    ),
    views: formatNumber(p.views),
    uniqueViews: formatNumber(p.uniqueViews),
    avgTime: `${p.avgTime}s`,
    bounceRate: formatPercent(p.bounceRate),
  }));

  const pagesColumns = [
    { key: "page", label: "Pagina" },
    { key: "views", label: "Views", align: "right" as const },
    { key: "uniqueViews", label: "Unicas", align: "right" as const },
    { key: "avgTime", label: "Tempo Medio", align: "right" as const },
    { key: "bounceRate", label: "Bounce Rate", align: "right" as const },
  ];

  const maxDeviceSessions = Math.max(...m.deviceBreakdown.map((d) => d.sessions));
  const deviceColors = ["#3B82F6", "#22C55E", "#F59E0B"];

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Google Analytics"
        description="Dados de trafego e comportamento no site orla.tech"
        badge="Fev-Mar 2026"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <KpiCard
          title="Sessoes"
          value={formatNumber(m.sessions)}
          delta={sessionsDelta.isPositive ? sessionsDelta.value : -sessionsDelta.value}
          deltaLabel="vs anterior"
          icon={<Globe size={18} weight="bold" />}
          color="#4285F4"
          sparklineData={m.sessionsByDay.slice(-14).map((d) => ({ value: d.value }))}
        />
        <KpiCard
          title="Usuarios"
          value={formatNumber(m.users)}
          delta={usersDelta.isPositive ? usersDelta.value : -usersDelta.value}
          deltaLabel="vs anterior"
          icon={<Users size={18} weight="bold" />}
          color="#4285F4"
        />
        <KpiCard
          title="Novos Usuarios"
          value={formatNumber(m.newUsers)}
          delta={newUsersDelta.isPositive ? newUsersDelta.value : -newUsersDelta.value}
          deltaLabel="vs anterior"
          icon={<UserPlus size={18} weight="bold" />}
          color="#22C55E"
        />
        <KpiCard
          title="Page Views"
          value={formatNumber(m.pageViews)}
          delta={pageViewsDelta.isPositive ? pageViewsDelta.value : -pageViewsDelta.value}
          deltaLabel="vs anterior"
          icon={<Browser size={18} weight="bold" />}
          color="#4285F4"
        />
        <KpiCard
          title="Duracao Media"
          value={formatDuration(m.avgSessionDuration)}
          delta={durationDelta.isPositive ? durationDelta.value : -durationDelta.value}
          deltaLabel="vs anterior"
          icon={<Timer size={18} weight="bold" />}
          color="#22C55E"
        />
        <KpiCard
          title="Bounce Rate"
          value={formatPercent(m.bounceRate)}
          delta={bounceDelta.isPositive ? -bounceDelta.value : bounceDelta.value}
          deltaLabel="vs anterior"
          icon={<ArrowUUpLeft size={18} weight="bold" />}
          color="#EF4444"
        />
        <KpiCard
          title="Pags/Sessao"
          value={m.pagesPerSession.toFixed(2)}
          delta={ppsDelta.isPositive ? ppsDelta.value : -ppsDelta.value}
          deltaLabel="vs anterior"
          icon={<Stack size={18} weight="bold" />}
          color="#22C55E"
        />
      </div>

      {/* Sessions by Day Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Sessoes por Dia
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={m.sessionsByDay}>
              <defs>
                <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4285F4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4285F4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#71717A", fontSize: 11 }}
                axisLine={{ stroke: "#1E1E24" }}
                tickLine={false}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fill: "#71717A", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="value"
                name="Sessoes"
                stroke="#4285F4"
                strokeWidth={2}
                fill="url(#sessionsGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Fontes de Trafego
        </h3>
        <DataTable columns={trafficColumns} data={trafficData} />
      </div>

      {/* Top Pages + Device Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Paginas Mais Visitadas
          </h3>
          <DataTable columns={pagesColumns} data={pagesData} />
        </div>

        {/* Device Breakdown */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6 text-sm font-semibold text-foreground">
            Dispositivos
          </h3>
          <div className="space-y-5">
            {m.deviceBreakdown.map((d, i) => (
              <div key={d.device} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {d.device}
                  </span>
                  <span className="text-xs tabular-nums text-muted">
                    {formatNumber(d.sessions)} ({d.percentage}%)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(d.sessions / maxDeviceSessions) * 100}%`,
                      backgroundColor: deviceColors[i],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
