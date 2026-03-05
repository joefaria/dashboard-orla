"use client";

import {
  ChartLineUp,
  Users,
  HandTap,
  Globe,
  UserPlus,
  CurrencyDollar,
} from "@phosphor-icons/react";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  overviewKPIs,
  channelBreakdown,
  weeklyPerformance,
} from "@/data/mock";
import { formatNumber, formatCurrency, getDelta } from "@/lib/utils";
import {
  LineChart,
  Line,
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

export function OverviewSection() {
  const healthDelta = getDelta(
    overviewKPIs.digitalHealthScore,
    overviewKPIs.previousHealthScore
  );
  const reachDelta = getDelta(
    overviewKPIs.totalReach,
    overviewKPIs.previousReach
  );
  const engagementDelta = getDelta(
    overviewKPIs.totalEngagement,
    overviewKPIs.previousEngagement
  );
  const sessionsDelta = getDelta(
    overviewKPIs.websiteSessions,
    overviewKPIs.previousSessions
  );
  const leadsDelta = getDelta(
    overviewKPIs.leadsGenerated,
    overviewKPIs.previousLeads
  );
  const pipelineDelta = getDelta(
    overviewKPIs.pipelineValue,
    overviewKPIs.previousPipelineValue
  );

  const healthScore = overviewKPIs.digitalHealthScore;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Executive Overview"
        description="Visao consolidada de todos os canais digitais da Orla"
        badge="Fev-Mar 2026"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* Health Score — special circular indicator */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Health Score
          </p>
          <div className="mt-3 flex items-center justify-center">
            <div className="relative h-28 w-28">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#1F1F24"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={healthScore >= 70 ? "#22C55E" : healthScore >= 50 ? "#F59E0B" : "#EF4444"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  {healthScore}
                </span>
                <span className="text-[10px] text-muted">/100</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="text-xs font-semibold text-success">
              +{healthDelta.value.toFixed(1)}%
            </span>
            <span className="text-xs text-muted">vs anterior</span>
          </div>
        </div>

        <KpiCard
          title="Alcance Total"
          value={formatNumber(overviewKPIs.totalReach)}
          delta={reachDelta.isPositive ? reachDelta.value : -reachDelta.value}
          deltaLabel="vs anterior"
          icon={<Users size={20} weight="bold" />}
          color="#3B82F6"
          tooltip="Soma de pessoas alcancadas em todos os canais (LinkedIn, Instagram, Website). Mede a visibilidade total da marca."
        />
        <KpiCard
          title="Engajamento"
          value={formatNumber(overviewKPIs.totalEngagement)}
          delta={engagementDelta.isPositive ? engagementDelta.value : -engagementDelta.value}
          deltaLabel="vs anterior"
          icon={<HandTap size={20} weight="bold" />}
          color="#22C55E"
          tooltip="Total de interacoes (cliques, reacoes, comentarios, compartilhamentos) somadas de todos os canais."
        />
        <KpiCard
          title="Sessoes Site"
          value={formatNumber(overviewKPIs.websiteSessions)}
          delta={sessionsDelta.isPositive ? sessionsDelta.value : -sessionsDelta.value}
          deltaLabel="vs anterior"
          icon={<Globe size={20} weight="bold" />}
          color="#4285F4"
          tooltip="Numero de sessoes registradas no Google Analytics do site orla.tech. Cada visita conta como uma sessao."
        />
        <KpiCard
          title="Leads Gerados"
          value={overviewKPIs.leadsGenerated.toString()}
          delta={leadsDelta.isPositive ? leadsDelta.value : -leadsDelta.value}
          deltaLabel="vs anterior"
          icon={<UserPlus size={20} weight="bold" />}
          color="#F59E0B"
          tooltip="Contatos qualificados gerados no periodo — pessoas que demonstraram interesse real (formulario, agendamento, mensagem)."
        />
        <KpiCard
          title="Pipeline"
          value={formatCurrency(overviewKPIs.pipelineValue)}
          delta={pipelineDelta.isPositive ? pipelineDelta.value : -pipelineDelta.value}
          deltaLabel="vs anterior"
          icon={<CurrencyDollar size={20} weight="bold" />}
          color="#22C55E"
          tooltip="Valor total em reais das oportunidades abertas no funil de vendas, desde lead qualificado ate proposta enviada."
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Weekly Performance Line Chart */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Performance Semanal
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#71717A", fontSize: 12 }}
                  axisLine={{ stroke: "#1E1E24" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip {...tooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#A1A1AA" }}
                />
                <Line
                  type="monotone"
                  dataKey="linkedin"
                  name="LinkedIn"
                  stroke="#0A66C2"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#0A66C2" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="instagram"
                  name="Instagram"
                  stroke="#E1306C"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#E1306C" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="website"
                  name="Website"
                  stroke="#4285F4"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#4285F4" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: "#F59E0B" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Breakdown Horizontal Bars */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-6 text-sm font-semibold text-foreground">
            Breakdown por Canal
          </h3>
          <div className="space-y-5">
            {channelBreakdown.map((ch) => {
              const maxReach = Math.max(...channelBreakdown.map((c) => c.reach));
              return (
                <div key={ch.channel} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {ch.channel}
                    </span>
                    <span className="text-xs tabular-nums text-muted">
                      {formatNumber(ch.reach)} alcance
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(ch.reach / maxReach) * 100}%`,
                        backgroundColor: ch.color,
                      }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted">
                    <span>{formatNumber(ch.engagement)} engaj.</span>
                    <span>{ch.leads} leads</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
