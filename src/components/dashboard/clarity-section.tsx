"use client";

import {
  CursorClick,
  Scroll,
  HandPointing,
  Warning,
  ArrowUUpLeft,
  Bug,
} from "@phosphor-icons/react";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { DataTable } from "@/components/ui/data-table";
import { clarityMetrics } from "@/data/mock";
import { formatNumber, formatPercent, getDelta } from "@/lib/utils";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
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

export function ClaritySection() {
  const m = clarityMetrics;

  const scrollDelta = getDelta(m.avgScrollDepth, m.previousAvgScrollDepth);
  const deadClicksDelta = getDelta(m.deadClicks, m.previousDeadClicks);
  const rageClicksDelta = getDelta(m.rageClicks, m.previousRageClicks);
  const quickbacksDelta = getDelta(m.quickbacks, m.previousQuickbacks);
  const jsErrorsDelta = getDelta(m.jsErrors, m.previousJsErrors);

  const deadClickData = m.topDeadClickElements.map((e) => ({
    element: e.element,
    clicks: e.clicks,
    page: e.page,
  }));

  const deadClickColumns = [
    { key: "element", label: "Elemento" },
    { key: "clicks", label: "Cliques", align: "right" as const },
    { key: "page", label: "Pagina", align: "right" as const },
  ];

  const rageClickData = m.topRageClickElements.map((e) => ({
    element: e.element,
    clicks: e.clicks,
    page: e.page,
  }));

  const rageClickColumns = [
    { key: "element", label: "Elemento" },
    { key: "clicks", label: "Cliques", align: "right" as const },
    { key: "page", label: "Pagina", align: "right" as const },
  ];

  const deviceData = [
    { device: "Desktop", ...m.deviceInsights.desktop },
    { device: "Mobile", ...m.deviceInsights.mobile },
    { device: "Tablet", ...m.deviceInsights.tablet },
  ];

  const deviceColumns = [
    { key: "device", label: "Dispositivo" },
    { key: "avgScrollDepth", label: "Scroll Depth", align: "right" as const },
    { key: "avgSessionDuration", label: "Duracao (s)", align: "right" as const },
    { key: "deadClicks", label: "Dead Clicks", align: "right" as const },
    { key: "rageClicks", label: "Rage Clicks", align: "right" as const },
  ];

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Microsoft Clarity"
        description="Comportamento do usuario e UX insights"
        badge="Fev-Mar 2026"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          title="Total Sessoes"
          value={formatNumber(m.totalSessions)}
          delta={0}
          icon={<CursorClick size={18} weight="bold" />}
          color="#7C3AED"
        />
        <KpiCard
          title="Scroll Depth"
          value={formatPercent(m.avgScrollDepth)}
          delta={scrollDelta.isPositive ? scrollDelta.value : -scrollDelta.value}
          deltaLabel="vs anterior"
          icon={<Scroll size={18} weight="bold" />}
          color="#7C3AED"
        />
        <KpiCard
          title="Dead Clicks"
          value={formatNumber(m.deadClicks)}
          delta={deadClicksDelta.isPositive ? -deadClicksDelta.value : deadClicksDelta.value}
          deltaLabel="vs anterior"
          icon={<HandPointing size={18} weight="bold" />}
          color="#EF4444"
        />
        <KpiCard
          title="Rage Clicks"
          value={formatNumber(m.rageClicks)}
          delta={rageClicksDelta.isPositive ? -rageClicksDelta.value : rageClicksDelta.value}
          deltaLabel="vs anterior"
          icon={<Warning size={18} weight="bold" />}
          color="#EF4444"
        />
        <KpiCard
          title="Quickbacks"
          value={formatNumber(m.quickbacks)}
          delta={quickbacksDelta.isPositive ? -quickbacksDelta.value : quickbacksDelta.value}
          deltaLabel="vs anterior"
          icon={<ArrowUUpLeft size={18} weight="bold" />}
          color="#F59E0B"
        />
        <KpiCard
          title="JS Errors"
          value={m.jsErrors.toString()}
          delta={jsErrorsDelta.isPositive ? -jsErrorsDelta.value : jsErrorsDelta.value}
          deltaLabel="vs anterior"
          icon={<Bug size={18} weight="bold" />}
          color="#EF4444"
        />
      </div>

      {/* Scroll Depth + Heatmap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Scroll Depth by Page */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Profundidade de Scroll por Pagina
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.scrollDepthByPage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
                <XAxis
                  dataKey="page"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#1E1E24" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#A1A1AA" }} />
                <Bar
                  dataKey="depth25"
                  name="25%"
                  fill="#7C3AED"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="depth50"
                  name="50%"
                  fill="#8B5CF6"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="depth75"
                  name="75%"
                  fill="#A78BFA"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="depth100"
                  name="100%"
                  fill="#C4B5FD"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Zones */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6 text-sm font-semibold text-foreground">
            Zonas de Atencao (Heatmap)
          </h3>
          <div className="space-y-4">
            {m.heatmapZones.map((zone) => (
              <div key={zone.zone} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{zone.zone}</span>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>{formatNumber(zone.clicks)} cliques</span>
                    <span className="tabular-nums font-medium text-foreground">
                      {zone.attention}%
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${zone.attention}%`,
                      background: `linear-gradient(90deg, #7C3AED ${100 - zone.attention}%, ${
                        zone.attention > 70
                          ? "#EF4444"
                          : zone.attention > 50
                          ? "#F59E0B"
                          : "#3B82F6"
                      } 100%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Top Dead Click Elements
          </h3>
          <DataTable columns={deadClickColumns} data={deadClickData} />
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Top Rage Click Elements
          </h3>
          <DataTable columns={rageClickColumns} data={rageClickData} />
        </div>
      </div>

      {/* Device Insights */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Comparacao por Dispositivo
        </h3>
        <DataTable columns={deviceColumns} data={deviceData} />
      </div>
    </section>
  );
}
