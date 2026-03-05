"use client";

import {
  InstagramLogo,
  Users,
  Eye,
  ChartLineUp,
  UserCircle,
  Link as LinkIcon,
} from "@phosphor-icons/react";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { instagramMetrics } from "@/data/mock";
import { formatNumber, formatPercent, getDelta } from "@/lib/utils";
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

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case "carousel":
      return "info";
    case "reel":
      return "success";
    case "image":
      return "default";
    default:
      return "default";
  }
};

export function InstagramSection() {
  const m = instagramMetrics;

  const followersDelta = getDelta(m.followers, m.previousFollowers);
  const reachDelta = getDelta(m.reachTotal, m.previousReach);
  const impressionsDelta = getDelta(m.impressions, m.previousImpressions);
  const engagementDelta = getDelta(m.engagementRate, m.previousEngagementRate);
  const visitsDelta = getDelta(m.profileVisits, m.previousProfileVisits);
  const clicksDelta = getDelta(m.websiteClicks, m.previousWebsiteClicks);

  const topPostsData = m.topPosts.map((post) => ({
    type: <Badge variant={typeBadgeVariant(post.type) as "info" | "success" | "default"} size="sm">{post.type}</Badge>,
    caption: (
      <span className="line-clamp-1 max-w-[280px]" title={post.caption}>
        {post.caption}
      </span>
    ),
    reach: formatNumber(post.reach),
    likes: formatNumber(post.likes),
    comments: post.comments,
    saves: post.saves,
    engagement: formatPercent(post.engagementRate),
  }));

  const topPostsColumns = [
    { key: "type", label: "Tipo" },
    { key: "caption", label: "Caption" },
    { key: "reach", label: "Alcance", align: "right" as const },
    { key: "likes", label: "Likes", align: "right" as const },
    { key: "comments", label: "Coments", align: "right" as const },
    { key: "saves", label: "Saves", align: "right" as const },
    { key: "engagement", label: "Eng. Rate", align: "right" as const },
  ];

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Instagram"
        description="Metricas detalhadas do perfil @orla.tech"
        badge="Fev-Mar 2026"
        action={
          <div className="flex items-center gap-2 text-instagram">
            <InstagramLogo size={20} weight="fill" />
            <span className="text-sm font-medium">@orla.tech</span>
          </div>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          title="Followers"
          value={formatNumber(m.followers)}
          delta={followersDelta.isPositive ? followersDelta.value : -followersDelta.value}
          deltaLabel="vs anterior"
          icon={<Users size={20} weight="bold" />}
          color="#E1306C"
          sparklineData={m.followersGrowth.slice(-14).map((d) => ({ value: d.value }))}
        />
        <KpiCard
          title="Alcance"
          value={formatNumber(m.reachTotal)}
          delta={reachDelta.isPositive ? reachDelta.value : -reachDelta.value}
          deltaLabel="vs anterior"
          icon={<Eye size={20} weight="bold" />}
          color="#E1306C"
        />
        <KpiCard
          title="Impressoes"
          value={formatNumber(m.impressions)}
          delta={impressionsDelta.isPositive ? impressionsDelta.value : -impressionsDelta.value}
          deltaLabel="vs anterior"
          icon={<ChartLineUp size={20} weight="bold" />}
          color="#E1306C"
        />
        <KpiCard
          title="Eng. Rate"
          value={formatPercent(m.engagementRate)}
          delta={engagementDelta.isPositive ? engagementDelta.value : -engagementDelta.value}
          deltaLabel="vs anterior"
          icon={<ChartLineUp size={20} weight="bold" />}
          color="#E1306C"
        />
        <KpiCard
          title="Visitas Perfil"
          value={formatNumber(m.profileVisits)}
          delta={visitsDelta.isPositive ? visitsDelta.value : -visitsDelta.value}
          deltaLabel="vs anterior"
          icon={<UserCircle size={20} weight="bold" />}
          color="#E1306C"
        />
        <KpiCard
          title="Cliques Site"
          value={formatNumber(m.websiteClicks)}
          delta={clicksDelta.isPositive ? clicksDelta.value : -clicksDelta.value}
          deltaLabel="vs anterior"
          icon={<LinkIcon size={20} weight="bold" />}
          color="#E1306C"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Followers Growth */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Crescimento de Followers
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.followersGrowth}>
                <defs>
                  <linearGradient id="igFollowersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E1306C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#E1306C" stopOpacity={0} />
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
                  width={50}
                  domain={["dataMin - 20", "dataMax + 20"]}
                />
                <Tooltip {...tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Followers"
                  stroke="#E1306C"
                  strokeWidth={2}
                  fill="url(#igFollowersGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach by Day */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Alcance Diario
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.reachByDay}>
                <defs>
                  <linearGradient id="igReachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E1306C" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#E1306C" stopOpacity={0} />
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
                  width={45}
                />
                <Tooltip {...tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Alcance"
                  stroke="#E1306C"
                  strokeWidth={2}
                  fill="url(#igReachGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Posts Table */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Top Posts
        </h3>
        <DataTable columns={topPostsColumns} data={topPostsData} />
      </div>

      {/* Content Performance + Demographics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Content Performance Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Performance por Tipo de Conteudo
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.contentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E24" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="type"
                  tick={{ fill: "#A1A1AA", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip {...tooltipStyle} />
                <Bar
                  dataKey="avgReach"
                  name="Alcance Medio"
                  fill="#E1306C"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Audiencia
          </h3>

          {/* Age Groups */}
          <div className="mb-6">
            <p className="mb-3 text-xs font-medium text-muted uppercase">
              Faixa Etaria
            </p>
            <div className="space-y-2">
              {m.audienceDemographics.ageGroups.map((ag) => (
                <div key={ag.range} className="flex items-center gap-3">
                  <span className="w-12 text-xs text-muted tabular-nums">
                    {ag.range}
                  </span>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full bg-instagram/80"
                      style={{ width: `${ag.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs tabular-nums text-foreground">
                    {ag.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="mb-6">
            <p className="mb-3 text-xs font-medium text-muted uppercase">
              Principais Cidades
            </p>
            <div className="space-y-1.5">
              {m.audienceDemographics.topCities.map((c) => (
                <div key={c.city} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{c.city}</span>
                  <span className="text-xs tabular-nums text-muted">
                    {c.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Split */}
          <div>
            <p className="mb-3 text-xs font-medium text-muted uppercase">
              Genero
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 overflow-hidden rounded-full bg-surface-3">
                <div className="flex h-full">
                  <div
                    className="h-full rounded-l-full"
                    style={{
                      width: `${m.audienceDemographics.genderSplit.male}%`,
                      backgroundColor: "#3B82F6",
                    }}
                  />
                  <div
                    className="h-full rounded-r-full"
                    style={{
                      width: `${m.audienceDemographics.genderSplit.female}%`,
                      backgroundColor: "#E1306C",
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-[#3B82F6]">
                  M {m.audienceDemographics.genderSplit.male}%
                </span>
                <span className="text-instagram">
                  F {m.audienceDemographics.genderSplit.female}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
