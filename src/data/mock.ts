// ============================================================
// ORLA ANALYTICS DASHBOARD — MOCK DATA
// Dados fictícios para apresentação à liderança
// Período: Fev-Mar 2026
// ============================================================

// ---------- TIME SERIES HELPERS ----------
function generateDailyData(days: number, base: number, variance: number, trend: number = 0) {
  const data = [];
  const startDate = new Date("2026-02-01");
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const trendValue = base + trend * i;
    const value = Math.round(trendValue + (Math.random() - 0.4) * variance);
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, value),
    });
  }
  return data;
}

function generateWeeklyData(weeks: number, base: number, variance: number) {
  const data = [];
  const startDate = new Date("2026-01-06");
  for (let i = 0; i < weeks; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 7);
    data.push({
      week: `S${(i + 1).toString().padStart(2, "0")}`,
      date: date.toISOString().split("T")[0],
      value: Math.round(base + (Math.random() - 0.3) * variance),
    });
  }
  return data;
}

// ---------- OVERVIEW ----------
export const overviewKPIs = {
  digitalHealthScore: 72,
  previousHealthScore: 65,
  totalReach: 48_320,
  previousReach: 39_100,
  totalEngagement: 3_842,
  previousEngagement: 2_910,
  websiteSessions: 2_847,
  previousSessions: 2_130,
  leadsGenerated: 18,
  previousLeads: 11,
  pipelineValue: 324_000,
  previousPipelineValue: 180_000,
};

export const channelBreakdown = [
  { channel: "LinkedIn", reach: 28_450, engagement: 2_140, leads: 12, color: "#0A66C2" },
  { channel: "Instagram", reach: 15_870, engagement: 1_420, leads: 3, color: "#E1306C" },
  { channel: "Website", reach: 2_847, engagement: 282, leads: 3, color: "#4285F4" },
  { channel: "Campanha LinkedIn", reach: 1_153, engagement: 0, leads: 0, color: "#0D9488" },
];

export const weeklyPerformance = [
  { week: "S05", linkedin: 5200, instagram: 2800, website: 480, leads: 1 },
  { week: "S06", linkedin: 6100, instagram: 3100, website: 520, leads: 2 },
  { week: "S07", linkedin: 5800, instagram: 3400, website: 610, leads: 3 },
  { week: "S08", linkedin: 7200, instagram: 4200, website: 680, leads: 4 },
  { week: "S09", linkedin: 8400, instagram: 4800, website: 750, leads: 5 },
  { week: "S10", linkedin: 9100, instagram: 5300, website: 820, leads: 6 },
  { week: "S11", linkedin: 10200, instagram: 5900, website: 910, leads: 7 },
  { week: "S12", linkedin: 11400, instagram: 6300, website: 980, leads: 8 },
];

// ---------- AI INSIGHTS (Cross-channel) ----------
export const aiInsights = [
  {
    id: "1",
    type: "correlation" as const,
    severity: "high" as const,
    title: "Posts sobre IA geram 3.2x mais tráfego no site",
    description:
      "Análise dos últimos 30 dias mostra que conteúdos com tema 'Inteligência Artificial aplicada' no LinkedIn geram 3.2x mais cliques para orla.tech comparado a posts sobre software custom.",
    channels: ["LinkedIn", "Website"],
    metric: "+220%",
    date: "2026-03-04",
  },
  {
    id: "2",
    type: "opportunity" as const,
    severity: "high" as const,
    title: "Horário ideal identificado: terça e quinta 8h-9h",
    description:
      "O engajamento no LinkedIn é 47% maior quando publicado entre 8h e 9h em dias úteis, especialmente terça e quinta. Recomendação: concentrar publicações estratégicas nesses slots.",
    channels: ["LinkedIn"],
    metric: "+47%",
    date: "2026-03-03",
  },
  {
    id: "3",
    type: "alert" as const,
    severity: "medium" as const,
    title: "Bounce rate alto em páginas de serviço",
    description:
      "As páginas /servicos e /quick-discovery têm bounce rate de 72% — acima da média do site (58%). Usuários vindos do Instagram têm bounce rate 23% maior que os do LinkedIn.",
    channels: ["Website", "Instagram"],
    metric: "72%",
    date: "2026-03-03",
  },
  {
    id: "4",
    type: "correlation" as const,
    severity: "medium" as const,
    title: "Carrosséis convertem 2.8x mais que imagens estáticas",
    description:
      "No Instagram, carrosséis têm engagement rate de 4.2% vs 1.5% de imagens estáticas. No LinkedIn, documentos PDF têm 2.1x mais impressões que posts com link.",
    channels: ["Instagram", "LinkedIn"],
    metric: "2.8x",
    date: "2026-03-02",
  },
  {
    id: "5",
    type: "opportunity" as const,
    severity: "low" as const,
    title: "Microsoft Clarity: 34% dos usuários não rolam além do hero",
    description:
      "Dados do Clarity mostram que 34% dos visitantes do site não passam do primeiro viewport. Sugestão: adicionar social proof ou CTA mais agressivo na área visível inicial.",
    channels: ["Website", "Clarity"],
    metric: "34%",
    date: "2026-03-01",
  },
  {
    id: "6",
    type: "trend" as const,
    severity: "high" as const,
    title: "Crescimento orgânico do LinkedIn acelerou 68% em março",
    description:
      "A taxa de crescimento de followers no LinkedIn passou de 12/semana em fevereiro para 20/semana em março. Principal driver: série de posts 'Decisão antes da ferramenta'.",
    channels: ["LinkedIn"],
    metric: "+68%",
    date: "2026-03-04",
  },
];

// ---------- INSTAGRAM ----------
export const instagramMetrics = {
  followers: 1_243,
  previousFollowers: 1_089,
  followersGrowth: generateDailyData(33, 1089, 15, 4.7),
  reachTotal: 15_870,
  previousReach: 12_400,
  impressions: 24_310,
  previousImpressions: 19_200,
  engagementRate: 3.8,
  previousEngagementRate: 3.2,
  profileVisits: 892,
  previousProfileVisits: 710,
  websiteClicks: 124,
  previousWebsiteClicks: 89,
  storiesViews: 4_200,
  previousStoriesViews: 3_100,
  reelsPlays: 8_700,
  previousReelsPlays: 5_400,
  reachByDay: generateDailyData(33, 420, 180, 5),
  topPosts: [
    {
      id: "1",
      type: "carousel",
      caption: "5 sinais de que sua empresa precisa de uma estratégia de IA (e não de mais ferramentas)",
      reach: 2_840,
      likes: 187,
      comments: 34,
      saves: 62,
      shares: 28,
      engagementRate: 5.2,
      date: "2026-03-01",
    },
    {
      id: "2",
      type: "reel",
      caption: "Quick Discovery: como diagnosticamos oportunidades de IA em 2 semanas",
      reach: 3_120,
      likes: 245,
      comments: 18,
      saves: 41,
      shares: 52,
      engagementRate: 4.8,
      date: "2026-02-26",
    },
    {
      id: "3",
      type: "carousel",
      caption: "Antes de contratar uma consultoria de software, pergunte essas 3 coisas",
      reach: 1_980,
      likes: 156,
      comments: 42,
      saves: 78,
      shares: 15,
      engagementRate: 6.1,
      date: "2026-02-22",
    },
    {
      id: "4",
      type: "image",
      caption: "Decisão antes da ferramenta. Sempre.",
      reach: 1_420,
      likes: 98,
      comments: 12,
      saves: 34,
      shares: 8,
      engagementRate: 3.4,
      date: "2026-02-18",
    },
    {
      id: "5",
      type: "reel",
      caption: "O que é Quick Discovery e por que CTOs estão pedindo",
      reach: 2_560,
      likes: 203,
      comments: 27,
      saves: 55,
      shares: 38,
      engagementRate: 4.5,
      date: "2026-02-14",
    },
  ],
  audienceDemographics: {
    ageGroups: [
      { range: "18-24", percentage: 8 },
      { range: "25-34", percentage: 34 },
      { range: "35-44", percentage: 38 },
      { range: "45-54", percentage: 15 },
      { range: "55+", percentage: 5 },
    ],
    topCities: [
      { city: "São Paulo", percentage: 42 },
      { city: "Rio de Janeiro", percentage: 12 },
      { city: "Belo Horizonte", percentage: 8 },
      { city: "Curitiba", percentage: 6 },
      { city: "Brasília", percentage: 5 },
    ],
    genderSplit: { male: 62, female: 38 },
  },
  contentPerformance: [
    { type: "Carrossel", posts: 8, avgReach: 2_210, avgEngagement: 5.1 },
    { type: "Reels", posts: 6, avgReach: 2_840, avgEngagement: 4.6 },
    { type: "Imagem", posts: 4, avgReach: 1_320, avgEngagement: 2.8 },
    { type: "Stories", posts: 22, avgReach: 380, avgEngagement: 3.2 },
  ],
};

// ---------- LINKEDIN ----------
export const linkedinMetrics = {
  followers: 2_847,
  previousFollowers: 2_510,
  followersGrowth: generateDailyData(33, 2510, 20, 10.2),
  impressions: 42_100,
  previousImpressions: 31_200,
  uniqueVisitors: 8_340,
  previousUniqueVisitors: 6_200,
  engagementRate: 5.1,
  previousEngagementRate: 4.3,
  clickThroughRate: 2.8,
  previousClickThroughRate: 2.1,
  pageViews: 12_450,
  previousPageViews: 9_100,
  impressionsByDay: generateDailyData(33, 1100, 500, 12),
  topPosts: [
    {
      id: "1",
      type: "document",
      title: "Framework de Priorização de IA: como decidir onde investir primeiro",
      impressions: 8_420,
      reactions: 342,
      comments: 67,
      reposts: 48,
      clicks: 289,
      engagementRate: 7.2,
      date: "2026-03-03",
    },
    {
      id: "2",
      type: "text",
      title: "Há 3 meses um CTO me disse: 'Não preciso de IA, preciso de software que funcione.'",
      impressions: 6_890,
      reactions: 278,
      comments: 94,
      reposts: 32,
      clicks: 156,
      engagementRate: 6.8,
      date: "2026-02-28",
    },
    {
      id: "3",
      type: "article",
      title: "Quick Discovery: o diagnóstico que evita R$500K em projetos errados",
      impressions: 5_240,
      reactions: 198,
      comments: 45,
      reposts: 28,
      clicks: 412,
      engagementRate: 5.9,
      date: "2026-02-24",
    },
    {
      id: "4",
      type: "image",
      title: "Decisão → Arquitetura → Execução. Nessa ordem.",
      impressions: 4_120,
      reactions: 187,
      comments: 23,
      reposts: 18,
      clicks: 89,
      engagementRate: 4.8,
      date: "2026-02-20",
    },
    {
      id: "5",
      type: "document",
      title: "7 perguntas que todo board deveria fazer antes de aprovar um projeto de IA",
      impressions: 7_100,
      reactions: 312,
      comments: 78,
      reposts: 41,
      clicks: 345,
      engagementRate: 6.5,
      date: "2026-02-16",
    },
  ],
  followerDemographics: {
    industries: [
      { name: "Tecnologia", percentage: 35 },
      { name: "Serviços Financeiros", percentage: 18 },
      { name: "Consultoria", percentage: 14 },
      { name: "Manufatura", percentage: 8 },
      { name: "Varejo", percentage: 7 },
      { name: "Outros", percentage: 18 },
    ],
    seniority: [
      { level: "C-Level", percentage: 12 },
      { level: "VP / Director", percentage: 22 },
      { level: "Manager", percentage: 28 },
      { level: "Senior", percentage: 24 },
      { level: "Entry / Mid", percentage: 14 },
    ],
    companySize: [
      { range: "1-50", percentage: 18 },
      { range: "51-200", percentage: 22 },
      { range: "201-1000", percentage: 28 },
      { range: "1001-5000", percentage: 20 },
      { range: "5000+", percentage: 12 },
    ],
  },
  contentPerformance: [
    { type: "Documento/PDF", posts: 4, avgImpressions: 7_760, avgEngagement: 6.8 },
    { type: "Texto longo", posts: 6, avgImpressions: 5_540, avgEngagement: 5.4 },
    { type: "Artigo", posts: 2, avgImpressions: 5_240, avgEngagement: 5.9 },
    { type: "Imagem", posts: 5, avgImpressions: 3_420, avgEngagement: 3.8 },
    { type: "Link externo", posts: 3, avgImpressions: 2_180, avgEngagement: 2.1 },
  ],
};

// ---------- LINKEDIN CAMPAIGN ----------
export const campaignMetrics = {
  campaignName: "Quick Discovery — Decision Makers",
  status: "active" as const,
  startDate: "2026-02-17",
  endDate: "2026-03-17",
  budget: 8_000,
  spent: 4_820,
  remaining: 3_180,
  impressions: 34_200,
  clicks: 487,
  ctr: 1.42,
  cpc: 9.9,
  cpl: 68.9,
  conversions: 7,
  leads: 7,
  costPerLead: 688.57,
  pipelineGenerated: 126_000,
  roas: 26.1,
  dailySpend: generateDailyData(17, 280, 80, 2),
  dailyImpressions: generateDailyData(17, 1800, 600, 30),
  dailyClicks: generateDailyData(17, 25, 12, 0.8),
  audienceSegments: [
    { name: "CTOs — Tech & Finance", impressions: 12_400, clicks: 198, ctr: 1.6, leads: 3, spend: 1_960 },
    { name: "Product Directors", impressions: 9_800, clicks: 142, ctr: 1.45, leads: 2, spend: 1_420 },
    { name: "Founders — Series A-C", impressions: 7_200, clicks: 98, ctr: 1.36, leads: 1, spend: 980 },
    { name: "Procurement / Finance", impressions: 4_800, clicks: 49, ctr: 1.02, leads: 1, spend: 460 },
  ],
  adCreatives: [
    { name: "Framework Decision — Carousel", impressions: 14_200, clicks: 234, ctr: 1.65, leads: 4 },
    { name: "Quick Discovery — Video", impressions: 11_800, clicks: 168, ctr: 1.42, leads: 2 },
    { name: "Case ROI — Static", impressions: 8_200, clicks: 85, ctr: 1.04, leads: 1 },
  ],
  pipeline: [
    { stage: "Lead", count: 7, value: 0 },
    { stage: "Qualificado", count: 5, value: 0 },
    { stage: "Reunião agendada", count: 3, value: 54_000 },
    { stage: "Proposta enviada", count: 2, value: 72_000 },
    { stage: "Fechado", count: 0, value: 0 },
  ],
};

// ---------- GOOGLE ANALYTICS ----------
export const analyticsMetrics = {
  sessions: 2_847,
  previousSessions: 2_130,
  users: 2_124,
  previousUsers: 1_580,
  newUsers: 1_687,
  previousNewUsers: 1_210,
  pageViews: 7_842,
  previousPageViews: 5_920,
  avgSessionDuration: 142, // seconds
  previousAvgSessionDuration: 118,
  bounceRate: 58.2,
  previousBounceRate: 64.1,
  pagesPerSession: 2.75,
  previousPagesPerSession: 2.41,
  sessionsByDay: generateDailyData(33, 75, 30, 1.5),
  trafficSources: [
    { source: "LinkedIn (orgânico)", sessions: 1_024, percentage: 36, bounceRate: 48.2, avgDuration: 185 },
    { source: "Google (orgânico)", sessions: 642, percentage: 22.5, bounceRate: 52.1, avgDuration: 162 },
    { source: "Direto", sessions: 498, percentage: 17.5, bounceRate: 45.8, avgDuration: 198 },
    { source: "LinkedIn Ads", sessions: 312, percentage: 11, bounceRate: 62.4, avgDuration: 124 },
    { source: "Instagram", sessions: 187, percentage: 6.6, bounceRate: 71.3, avgDuration: 89 },
    { source: "Referral", sessions: 112, percentage: 3.9, bounceRate: 54.6, avgDuration: 145 },
    { source: "Outros", sessions: 72, percentage: 2.5, bounceRate: 68.2, avgDuration: 102 },
  ],
  topPages: [
    { page: "/", title: "Home", views: 3_210, uniqueViews: 2_480, avgTime: 45, bounceRate: 52.1 },
    { page: "/quick-discovery", title: "Quick Discovery", views: 1_420, uniqueViews: 1_180, avgTime: 128, bounceRate: 38.4 },
    { page: "/servicos", title: "Serviços", views: 980, uniqueViews: 820, avgTime: 62, bounceRate: 68.2 },
    { page: "/sobre", title: "Sobre", views: 640, uniqueViews: 520, avgTime: 85, bounceRate: 42.8 },
    { page: "/contato", title: "Contato", views: 510, uniqueViews: 410, avgTime: 95, bounceRate: 28.4 },
    { page: "/blog/ia-prioridades", title: "Blog: Priorizando IA", views: 420, uniqueViews: 380, avgTime: 245, bounceRate: 32.1 },
    { page: "/cases", title: "Cases", views: 380, uniqueViews: 310, avgTime: 110, bounceRate: 48.6 },
    { page: "/blog/quick-discovery-guide", title: "Blog: Guia Quick Discovery", views: 282, uniqueViews: 240, avgTime: 312, bounceRate: 22.8 },
  ],
  deviceBreakdown: [
    { device: "Desktop", sessions: 1_852, percentage: 65 },
    { device: "Mobile", sessions: 882, percentage: 31 },
    { device: "Tablet", sessions: 113, percentage: 4 },
  ],
  userFlow: [
    { from: "Home", to: "Quick Discovery", sessions: 420 },
    { from: "Home", to: "Serviços", sessions: 310 },
    { from: "Home", to: "Sobre", sessions: 280 },
    { from: "Quick Discovery", to: "Contato", sessions: 180 },
    { from: "Blog", to: "Quick Discovery", sessions: 142 },
    { from: "Serviços", to: "Contato", sessions: 98 },
  ],
};

// ---------- MICROSOFT CLARITY ----------
export const clarityMetrics = {
  totalSessions: 2_642,
  sessionsWithRecordings: 1_890,
  avgScrollDepth: 62,
  previousAvgScrollDepth: 54,
  deadClicks: 342,
  previousDeadClicks: 410,
  rageClicks: 89,
  previousRageClicks: 124,
  quickbacks: 186,
  previousQuickbacks: 220,
  excessiveScrolling: 124,
  previousExcessiveScrolling: 156,
  jsErrors: 12,
  previousJsErrors: 28,
  scrollDepthByPage: [
    { page: "Home", depth25: 95, depth50: 72, depth75: 48, depth100: 22 },
    { page: "Quick Discovery", depth25: 92, depth50: 78, depth75: 64, depth100: 41 },
    { page: "Serviços", depth25: 88, depth50: 58, depth75: 32, depth100: 14 },
    { page: "Contato", depth25: 96, depth50: 89, depth75: 82, depth100: 68 },
    { page: "Blog Posts", depth25: 90, depth50: 74, depth75: 56, depth100: 38 },
  ],
  heatmapZones: [
    { zone: "Hero / Above the fold", clicks: 1_240, attention: 92 },
    { zone: "Value Proposition", clicks: 680, attention: 74 },
    { zone: "Services Overview", clicks: 420, attention: 58 },
    { zone: "Social Proof / Cases", clicks: 310, attention: 52 },
    { zone: "CTA Final", clicks: 280, attention: 44 },
    { zone: "Footer", clicks: 120, attention: 28 },
  ],
  topDeadClickElements: [
    { element: "Hero image (não clicável)", clicks: 68, page: "Home" },
    { element: "Título de seção 'Nossos Serviços'", clicks: 52, page: "Home" },
    { element: "Logo parceiros", clicks: 44, page: "Sobre" },
    { element: "Ícone de benefício", clicks: 38, page: "Quick Discovery" },
  ],
  topRageClickElements: [
    { element: "Botão 'Agendar Conversa' (loading lento)", clicks: 24, page: "Contato" },
    { element: "Menu mobile (delay)", clicks: 18, page: "Global" },
    { element: "Filtro de cases", clicks: 14, page: "Cases" },
  ],
  deviceInsights: {
    desktop: { avgScrollDepth: 68, avgSessionDuration: 165, deadClicks: 180, rageClicks: 34 },
    mobile: { avgScrollDepth: 54, avgSessionDuration: 92, deadClicks: 142, rageClicks: 48 },
    tablet: { avgScrollDepth: 61, avgSessionDuration: 134, deadClicks: 20, rageClicks: 7 },
  },
};

// ---------- NEWS MONITOR ----------
export const newsMonitorItems = [
  {
    id: "n1",
    title: "McKinsey: 72% das empresas planejam aumentar investimento em IA em 2026",
    source: "McKinsey Digital",
    date: "2026-03-04",
    category: "Inteligência Artificial",
    relevance: "high" as const,
    summary: "Relatório anual da McKinsey aponta que a maioria das empresas enterprise planeja aumentar budget de IA, com foco em aplicações práticas e ROI mensurável. Destaque para o gap entre intenção e execução — apenas 28% têm estratégia estruturada.",
    contentSuggestion: "Artigo: 'O gap da intenção: por que 72% quer investir em IA mas só 28% sabe como'",
    url: "#",
    tags: ["IA", "Enterprise", "Investimento"],
  },
  {
    id: "n2",
    title: "Gartner prevê que 40% dos projetos de IA falharão por falta de governança até 2027",
    source: "Gartner Research",
    date: "2026-03-03",
    category: "Inteligência Artificial",
    relevance: "high" as const,
    summary: "Novo relatório Gartner aponta que a maioria das falhas em projetos de IA não são técnicas, mas de governança, priorização e alinhamento com estratégia de negócio. Recomendação: frameworks de decisão antes de frameworks técnicos.",
    contentSuggestion: "Post LinkedIn: 'Gartner confirma o que dizemos há meses: decisão antes da ferramenta'",
    url: "#",
    tags: ["IA", "Governança", "Estratégia"],
  },
  {
    id: "n3",
    title: "Claude 4 da Anthropic redefine padrão de agentes autônomos para empresas",
    source: "TechCrunch",
    date: "2026-03-02",
    category: "Inteligência Artificial",
    relevance: "high" as const,
    summary: "Lançamento do Claude 4 com capacidades avançadas de agente e tool use. Empresas já estão implementando workflows autônomos para processos internos. Implicação: consultoria especializada em IA ganha relevância para integrar agentes.",
    contentSuggestion: "Carrossel Instagram: 'O que agentes de IA significam para sua operação: 5 casos reais'",
    url: "#",
    tags: ["IA", "Agentes", "LLM"],
  },
  {
    id: "n4",
    title: "Mercado brasileiro de software custom cresce 23% e atinge R$48bi em 2025",
    source: "IDC Brasil",
    date: "2026-03-01",
    category: "Software",
    relevance: "medium" as const,
    summary: "O mercado de desenvolvimento de software sob demanda no Brasil atingiu R$48 bilhões em 2025, com crescimento de 23% YoY. Principais drivers: transformação digital, regulação e necessidade de customização que SaaS não atende.",
    contentSuggestion: "Post LinkedIn: 'R$48bi em software custom. A questão não é SE, mas COMO investir certo.'",
    url: "#",
    tags: ["Software", "Mercado", "Brasil"],
  },
  {
    id: "n5",
    title: "Open AI lança o3-mini com custo 90% menor para aplicações enterprise",
    source: "The Verge",
    date: "2026-02-28",
    category: "Inteligência Artificial",
    relevance: "medium" as const,
    summary: "Nova família de modelos reduz drasticamente custo de inferência para aplicações corporativas. Impacto: democratiza IA mas aumenta complexidade de decisão — qual modelo usar, quando, para quê.",
    contentSuggestion: "Artigo blog: 'Mais modelos, mais confusão: como escolher a IA certa para cada problema'",
    url: "#",
    tags: ["IA", "LLM", "Custos"],
  },
  {
    id: "n6",
    title: "Banco Central anuncia regulação para uso de IA em serviços financeiros",
    source: "Valor Econômico",
    date: "2026-02-27",
    category: "Regulação",
    relevance: "high" as const,
    summary: "BACEN publicou normativa sobre uso de IA em instituições financeiras, exigindo auditabilidade, explicabilidade e governança em modelos de decisão. Prazo de adequação: 12 meses.",
    contentSuggestion: "Post LinkedIn urgente: 'Nova regulação do BACEN para IA em serviços financeiros: o que seu time precisa saber'",
    url: "#",
    tags: ["Regulação", "IA", "Financeiro"],
  },
  {
    id: "n7",
    title: "Estudo: CTOs apontam 'falta de estratégia' como maior barreira para adoção de IA",
    source: "Harvard Business Review",
    date: "2026-02-25",
    category: "Estratégia",
    relevance: "high" as const,
    summary: "Pesquisa com 500 CTOs globais revela que o principal obstáculo não é tecnologia ou talento, mas falta de estratégia clara e priorização. 67% citam dificuldade em traduzir oportunidades de IA em roadmaps executáveis.",
    contentSuggestion: "Série de posts: 'De oportunidade a roadmap: o método Quick Discovery'",
    url: "#",
    tags: ["Estratégia", "IA", "CTO"],
  },
  {
    id: "n8",
    title: "Microsoft anuncia Copilot Agents para automação de processos empresariais",
    source: "Microsoft Blog",
    date: "2026-02-23",
    category: "Software",
    relevance: "medium" as const,
    summary: "Nova oferta da Microsoft permite criar agentes de IA sem código para automatizar processos internos. Impacto no mercado de consultoria: mais demanda por estratégia de adoção e menos por implementação básica.",
    contentSuggestion: "Post: 'Copilot Agents facilita a execução. Mas quem define O QUE automatizar?'",
    url: "#",
    tags: ["Software", "Automação", "Microsoft"],
  },
];

// ---------- NAVIGATION ----------
export type Section =
  | "overview"
  | "instagram"
  | "linkedin"
  | "campaigns"
  | "analytics"
  | "clarity"
  | "insights"
  | "news";

export const sections: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "ChartLineUp" },
  { id: "instagram", label: "Instagram", icon: "InstagramLogo" },
  { id: "linkedin", label: "LinkedIn", icon: "LinkedinLogo" },
  { id: "campaigns", label: "Campanhas", icon: "Megaphone" },
  { id: "analytics", label: "Website", icon: "Globe" },
  { id: "clarity", label: "Clarity", icon: "CursorClick" },
  { id: "insights", label: "Insights IA", icon: "Brain" },
  { id: "news", label: "News Monitor", icon: "Newspaper" },
];
