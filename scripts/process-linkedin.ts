/**
 * Script para processar dados reais do LinkedIn (XLS/CSV)
 * e gerar arquivo de dados estruturados para o dashboard.
 *
 * Uso: npx tsx scripts/process-linkedin.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

const DATA_DIR = path.join(__dirname, "../dados/data-orla-linkedin");
const OUTPUT_FILE = path.join(__dirname, "../src/data/linkedin-real.ts");

// ============================================================
// HELPERS
// ============================================================

function readXls(filename: string, skipRows = 0): Record<string, unknown>[] {
  const filePath = path.join(DATA_DIR, filename);
  const buf = fs.readFileSync(filePath);
  const workbook = XLSX.read(buf, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { range: skipRows });
  return raw;
}

function readCsvUtf16(filename: string): string[][] {
  const filePath = path.join(DATA_DIR, filename);
  const buf = fs.readFileSync(filePath);
  // Try UTF-16LE first, fallback to utf-8
  let text: string;
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    text = buf.toString("utf16le");
  } else {
    text = buf.toString("utf-8");
  }
  // Remove BOM
  text = text.replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((line) => line.split("\t").map((c) => c.replace(/^"|"$/g, "").trim()));
}

function parseCsvWithMetadata(filename: string): { headers: string[]; rows: string[][] } {
  const allLines = readCsvUtf16(filename);
  // Find the header row (first row that has many columns and looks like data headers)
  // LinkedIn CSVs have 4 metadata rows, then the header
  let headerIdx = 0;
  for (let i = 0; i < Math.min(10, allLines.length); i++) {
    if (allLines[i].length > 5 && allLines[i][0] && !allLines[i][0].includes("Report")) {
      // Could be data or header - check if next rows have similar column count
      if (i > 0 && allLines[i].length >= allLines[i - 1].length) {
        headerIdx = i;
        break;
      }
    }
    // Look for "Start Date" or "Campaign" as header indicators
    if (allLines[i].some((c) => c === "Start Date" || c === "Campaign Name" || c === "Campaign Group Name")) {
      headerIdx = i;
      break;
    }
  }

  const headers = allLines[headerIdx];
  const rows = allLines.slice(headerIdx + 1).filter((r) => r.length >= headers.length / 2 && r[0]);
  return { headers, rows };
}

function parseDate(dateStr: string): string {
  // Handle MM/DD/YYYY format
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [m, d, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return dateStr;
}

function safeNum(val: unknown): number {
  if (val === null || val === undefined || val === "" || val === "-") return 0;
  const n = Number(String(val).replace(/,/g, ".").replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? 0 : n;
}

function getMonthKey(dateStr: string): string {
  // Returns YYYY-MM
  const d = parseDate(dateStr);
  return d.substring(0, 7);
}

// ============================================================
// PROCESS CONTENT (Organic Page)
// ============================================================

function processContent() {
  console.log("Processing content...");
  const rows = readXls("orladigitaltech_content_1772703777580.xls", 1);

  const daily: Array<{
    date: string;
    month: string;
    impressionsOrganic: number;
    impressionsSponsored: number;
    impressionsTotal: number;
    uniqueImpressionsOrganic: number;
    clicksOrganic: number;
    clicksSponsored: number;
    clicksTotal: number;
    reactionsOrganic: number;
    reactionsSponsored: number;
    reactionsTotal: number;
    commentsOrganic: number;
    commentsSponsored: number;
    commentsTotal: number;
    sharesOrganic: number;
    sharesSponsored: number;
    sharesTotal: number;
    engagementRateOrganic: number;
    engagementRateSponsored: number;
    engagementRateTotal: number;
  }> = [];

  for (const row of rows) {
    const keys = Object.keys(row);
    const dateKey = keys[0]; // "Data"
    const dateStr = String(row[dateKey]);
    if (!dateStr || dateStr === "Data") continue;

    const vals = Object.values(row).map((v) => v);
    daily.push({
      date: parseDate(dateStr),
      month: getMonthKey(dateStr),
      impressionsOrganic: safeNum(vals[1]),
      impressionsSponsored: safeNum(vals[2]),
      impressionsTotal: safeNum(vals[3]),
      uniqueImpressionsOrganic: safeNum(vals[4]),
      clicksOrganic: safeNum(vals[5]),
      clicksSponsored: safeNum(vals[6]),
      clicksTotal: safeNum(vals[7]),
      reactionsOrganic: safeNum(vals[8]),
      reactionsSponsored: safeNum(vals[9]),
      reactionsTotal: safeNum(vals[10]),
      commentsOrganic: safeNum(vals[11]),
      commentsSponsored: safeNum(vals[12]),
      commentsTotal: safeNum(vals[13]),
      sharesOrganic: safeNum(vals[14]),
      sharesSponsored: safeNum(vals[15]),
      sharesTotal: safeNum(vals[16]),
      engagementRateOrganic: safeNum(vals[17]),
      engagementRateSponsored: safeNum(vals[18]),
      engagementRateTotal: safeNum(vals[19]),
    });
  }

  return daily.sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================================
// PROCESS FOLLOWERS
// ============================================================

function processFollowers() {
  console.log("Processing followers...");
  const rows = readXls("orladigitaltech_followers_1772703807989.xls", 0);

  const daily: Array<{
    date: string;
    month: string;
    sponsored: number;
    organic: number;
    autoInvited: number;
    total: number;
  }> = [];

  for (const row of rows) {
    const keys = Object.keys(row);
    const dateStr = String(row[keys[0]]);
    if (!dateStr || dateStr.includes("Data") || dateStr.includes("Seguidores")) continue;

    daily.push({
      date: parseDate(dateStr),
      month: getMonthKey(dateStr),
      sponsored: safeNum(row[keys[1]]),
      organic: safeNum(row[keys[2]]),
      autoInvited: safeNum(row[keys[3]]),
      total: safeNum(row[keys[4]]),
    });
  }

  return daily.sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================================
// PROCESS VISITORS
// ============================================================

function processVisitors() {
  console.log("Processing visitors...");
  const rows = readXls("orladigitaltech_visitors_1772703796664.xls", 0);

  const daily: Array<{
    date: string;
    month: string;
    overviewViewsDesktop: number;
    overviewViewsMobile: number;
    overviewViewsTotal: number;
    overviewUniqueDesktop: number;
    overviewUniqueMobile: number;
    overviewUniqueTotal: number;
    totalPageViewsDesktop: number;
    totalPageViewsMobile: number;
    totalPageViewsTotal: number;
    totalUniqueDesktop: number;
    totalUniqueMobile: number;
    totalUniqueTotal: number;
  }> = [];

  for (const row of rows) {
    const keys = Object.keys(row);
    const dateStr = String(row[keys[0]]);
    if (!dateStr || dateStr.includes("Data") || dateStr.includes("Vis")) continue;

    const vals = Object.values(row);
    daily.push({
      date: parseDate(dateStr),
      month: getMonthKey(dateStr),
      overviewViewsDesktop: safeNum(vals[1]),
      overviewViewsMobile: safeNum(vals[2]),
      overviewViewsTotal: safeNum(vals[3]),
      overviewUniqueDesktop: safeNum(vals[4]),
      overviewUniqueMobile: safeNum(vals[5]),
      overviewUniqueTotal: safeNum(vals[6]),
      totalPageViewsDesktop: safeNum(vals[19]),
      totalPageViewsMobile: safeNum(vals[20]),
      totalPageViewsTotal: safeNum(vals[21]),
      totalUniqueDesktop: safeNum(vals[22]),
      totalUniqueMobile: safeNum(vals[23]),
      totalUniqueTotal: safeNum(vals[24]),
    });
  }

  return daily.sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================================
// PROCESS COMPETITORS
// ============================================================

function processCompetitors() {
  console.log("Processing competitors...");
  const filePath = path.join(DATA_DIR, "Orla_competitor_analytics_1772703839045.xlsx");
  const buf = fs.readFileSync(filePath);
  const workbook = XLSX.read(buf, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { range: 1 });

  const competitors: Array<{
    page: string;
    totalFollowers: number;
    newFollowers: number;
    totalEngagements: number;
    totalPosts: number;
  }> = [];

  for (const row of raw) {
    const keys = Object.keys(row);
    if (!row[keys[0]] || String(row[keys[0]]).includes("Pagina")) continue;
    competitors.push({
      page: String(row[keys[0]]),
      totalFollowers: safeNum(row[keys[1]]),
      newFollowers: safeNum(row[keys[2]]),
      totalEngagements: safeNum(row[keys[3]]),
      totalPosts: safeNum(row[keys[4]]),
    });
  }

  return competitors;
}

// ============================================================
// PROCESS CAMPAIGN PERFORMANCE
// ============================================================

function processCampaignPerformance() {
  console.log("Processing campaign performance...");
  const { headers, rows } = parseCsvWithMetadata(
    "campaign_group_808102433_campaign_performance_report.csv"
  );

  const campaigns = rows.map((row) => {
    const get = (name: string) => {
      const idx = headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));
      return idx >= 0 ? row[idx] : "";
    };

    return {
      name: get("Campaign Name") || get("Nome da campanha"),
      status: get("Campaign Status") || get("Status da campanha"),
      startDate: get("Start Date") || get("Data de"),
      totalSpent: safeNum(get("Total Spent") || get("Total gasto")),
      impressions: safeNum(get("Impressions") || get("Impres")),
      clicks: safeNum(get("Clicks") || get("Cliques")),
      ctr: safeNum(get("Click-Through Rate") || get("CTR") || get("Taxa de cliques")),
      avgCpm: safeNum(get("Average CPM") || get("CPM")),
      avgCpc: safeNum(get("Average CPC") || get("CPC")),
      reactions: safeNum(get("Reactions") || get("Rea")),
      comments: safeNum(get("Comment") || get("Coment")),
      shares: safeNum(get("Shares") || get("Compartilh")),
      follows: safeNum(get("Follows") || get("Seguid")),
      totalEngagements: safeNum(get("Total Engagements") || get("Total de engaj")),
      engagementRate: safeNum(get("Engagement Rate") || get("Taxa de engaj")),
      reach: safeNum(get("Reach") || get("Alcance")),
      avgFrequency: safeNum(get("Average Frequency") || get("Frequ")),
      landingPageClicks: safeNum(get("Clicks to Landing") || get("landing")),
      linkedinPageClicks: safeNum(get("Clicks to LinkedIn") || get("LinkedIn Page")),
    };
  });

  return campaigns;
}

// ============================================================
// PROCESS CREATIVE PERFORMANCE
// ============================================================

function processCreativePerformance() {
  console.log("Processing creative performance...");
  const { headers, rows } = parseCsvWithMetadata(
    "account_517883322_creative_performance_report.csv"
  );

  const creatives = rows.map((row) => {
    const get = (name: string) => {
      const idx = headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));
      return idx >= 0 ? row[idx] : "";
    };

    return {
      campaignName: get("Campaign Name") || get("Nome da campanha"),
      creativeName: get("Creative Name") || get("Nome do criativo") || get("Creative"),
      totalSpent: safeNum(get("Total Spent") || get("Total gasto")),
      impressions: safeNum(get("Impressions") || get("Impres")),
      clicks: safeNum(get("Clicks") || get("Cliques")),
      ctr: safeNum(get("Click-Through Rate") || get("CTR") || get("Taxa de cliques")),
      avgCpc: safeNum(get("Average CPC") || get("CPC")),
      reactions: safeNum(get("Reactions") || get("Rea")),
      totalEngagements: safeNum(get("Total Engagements") || get("Total de engaj")),
      engagementRate: safeNum(get("Engagement Rate") || get("Taxa de engaj")),
      reach: safeNum(get("Reach") || get("Alcance")),
    };
  });

  return creatives;
}

// ============================================================
// PROCESS DEMOGRAPHICS
// ============================================================

function processDemographics() {
  console.log("Processing demographics...");
  const allLines = readCsvUtf16("account_517883322_demographics_report.csv");

  // Split into sections by blank rows or header rows
  const sections: { name: string; headers: string[]; rows: string[][] }[] = [];
  let currentSection: { name: string; headers: string[]; rows: string[][] } | null = null;

  // Skip metadata rows (first 4-5 lines)
  let dataStarted = false;

  for (const line of allLines) {
    // Skip metadata
    if (!dataStarted) {
      if (
        line.some(
          (c) =>
            c.includes("Segment") ||
            c.includes("Segmento") ||
            c.includes("Company Name") ||
            c.includes("Nome da empresa")
        )
      ) {
        dataStarted = true;
        // This is a section header
        const sectionName = line[0] || "Unknown";
        currentSection = { name: sectionName, headers: line, rows: [] };
        sections.push(currentSection);
      }
      continue;
    }

    // Check if this is a new section header
    const isHeader =
      line.some(
        (c) =>
          c.includes("Segment") ||
          c.includes("Segmento") ||
          c.includes("Company") ||
          c.includes("Empresa") ||
          c.includes("Job") ||
          c.includes("Cargo") ||
          c.includes("Country") ||
          c.includes("Location") ||
          c.includes("Localiz")
      ) && line.some((c) => c.includes("Impressions") || c.includes("Impres"));

    if (isHeader) {
      currentSection = { name: line[0] || "Unknown", headers: line, rows: [] };
      sections.push(currentSection);
    } else if (currentSection && line[0] && line.length > 1) {
      currentSection.rows.push(line);
    }
  }

  // Convert to structured data
  const demographics: Record<
    string,
    Array<{ name: string; impressions: number; percentImpressions: number; clicks: number; ctr: number }>
  > = {};

  for (const section of sections) {
    const key = section.name
      .replace(/\s*Segment.*/, "")
      .replace(/\s*Segmento.*/, "")
      .trim();

    demographics[key] = section.rows
      .filter((r) => r[0] && !r[0].includes("Segment"))
      .map((r) => ({
        name: r[0],
        impressions: safeNum(r[1]),
        percentImpressions: safeNum(r[2]),
        clicks: safeNum(r[3]),
        ctr: safeNum(r[5]),
      }))
      .filter((d) => d.impressions > 0)
      .sort((a, b) => b.impressions - a.impressions);
  }

  return demographics;
}

// ============================================================
// AGGREGATE BY MONTH
// ============================================================

interface MonthlyAggregate {
  month: string;
  label: string;
  impressionsOrganic: number;
  impressionsSponsored: number;
  impressionsTotal: number;
  clicksOrganic: number;
  clicksSponsored: number;
  clicksTotal: number;
  reactionsTotal: number;
  commentsTotal: number;
  sharesTotal: number;
  avgEngagementRate: number;
  newFollowersOrganic: number;
  newFollowersTotal: number;
  totalPageViews: number;
  totalUniqueVisitors: number;
  desktopViews: number;
  mobileViews: number;
  daysWithData: number;
}

function aggregateByMonth(
  content: ReturnType<typeof processContent>,
  followers: ReturnType<typeof processFollowers>,
  visitors: ReturnType<typeof processVisitors>
): MonthlyAggregate[] {
  const monthLabels: Record<string, string> = {
    "2025-03": "Mar 2025",
    "2025-04": "Abr 2025",
    "2025-05": "Mai 2025",
    "2025-06": "Jun 2025",
    "2025-07": "Jul 2025",
    "2025-08": "Ago 2025",
    "2025-09": "Set 2025",
    "2025-10": "Out 2025",
    "2025-11": "Nov 2025",
    "2025-12": "Dez 2025",
    "2026-01": "Jan 2026",
    "2026-02": "Fev 2026",
    "2026-03": "Mar 2026",
  };

  const months = [...new Set([...content.map((c) => c.month), ...followers.map((f) => f.month)])].sort();

  return months.map((month) => {
    const mc = content.filter((c) => c.month === month);
    const mf = followers.filter((f) => f.month === month);
    const mv = visitors.filter((v) => v.month === month);

    const engRates = mc.filter((c) => c.engagementRateTotal > 0).map((c) => c.engagementRateTotal);

    return {
      month,
      label: monthLabels[month] || month,
      impressionsOrganic: mc.reduce((s, c) => s + c.impressionsOrganic, 0),
      impressionsSponsored: mc.reduce((s, c) => s + c.impressionsSponsored, 0),
      impressionsTotal: mc.reduce((s, c) => s + c.impressionsTotal, 0),
      clicksOrganic: mc.reduce((s, c) => s + c.clicksOrganic, 0),
      clicksSponsored: mc.reduce((s, c) => s + c.clicksSponsored, 0),
      clicksTotal: mc.reduce((s, c) => s + c.clicksTotal, 0),
      reactionsTotal: mc.reduce((s, c) => s + c.reactionsTotal, 0),
      commentsTotal: mc.reduce((s, c) => s + c.commentsTotal, 0),
      sharesTotal: mc.reduce((s, c) => s + c.sharesTotal, 0),
      avgEngagementRate: engRates.length > 0 ? engRates.reduce((s, r) => s + r, 0) / engRates.length : 0,
      newFollowersOrganic: mf.reduce((s, f) => s + f.organic, 0),
      newFollowersTotal: mf.reduce((s, f) => s + f.total, 0),
      totalPageViews: mv.reduce((s, v) => s + v.totalPageViewsTotal, 0),
      totalUniqueVisitors: mv.reduce((s, v) => s + v.totalUniqueTotal, 0),
      desktopViews: mv.reduce((s, v) => s + v.totalPageViewsDesktop, 0),
      mobileViews: mv.reduce((s, v) => s + v.totalPageViewsMobile, 0),
      daysWithData: mc.length,
    };
  });
}

// ============================================================
// CALCULATE CUMULATIVE FOLLOWERS
// ============================================================

function calculateCumulativeFollowers(followers: ReturnType<typeof processFollowers>) {
  // We know from competitor data that Orla has ~4,048 total followers at the end
  // Work backwards from the last day
  const totalAtEnd = 4048;
  const totalNewFollowers = followers.reduce((s, f) => s + f.total, 0);
  const startingFollowers = totalAtEnd - totalNewFollowers;

  let cumulative = startingFollowers;
  return followers.map((f) => {
    cumulative += f.total;
    return {
      date: f.date,
      month: f.month,
      newFollowers: f.total,
      cumulativeFollowers: cumulative,
    };
  });
}

// ============================================================
// MAIN
// ============================================================

function main() {
  console.log("=== Processing LinkedIn Data ===\n");

  const content = processContent();
  const followers = processFollowers();
  const visitors = processVisitors();
  const competitors = processCompetitors();
  const campaigns = processCampaignPerformance();
  const creatives = processCreativePerformance();
  const demographics = processDemographics();
  const monthly = aggregateByMonth(content, followers, visitors);
  const cumulativeFollowers = calculateCumulativeFollowers(followers);

  console.log(`\nContent: ${content.length} days`);
  console.log(`Followers: ${followers.length} days`);
  console.log(`Visitors: ${visitors.length} days`);
  console.log(`Competitors: ${competitors.length} entries`);
  console.log(`Campaigns: ${campaigns.length} campaigns`);
  console.log(`Creatives: ${creatives.length} ads`);
  console.log(`Demographics: ${Object.keys(demographics).length} sections`);
  console.log(`Monthly aggregates: ${monthly.length} months`);

  // Generate output
  const output = `// ============================================================
// LINKEDIN DATA — Processado automaticamente
// Gerado em: ${new Date().toISOString()}
// Fonte: dados/data-orla-linkedin/
// ============================================================

// ---------- DAILY CONTENT ENGAGEMENT ----------
export const linkedinContent = ${JSON.stringify(content, null, 2)} as const;

// ---------- DAILY FOLLOWER GROWTH ----------
export const linkedinFollowers = ${JSON.stringify(followers, null, 2)} as const;

// ---------- CUMULATIVE FOLLOWERS ----------
export const linkedinCumulativeFollowers = ${JSON.stringify(cumulativeFollowers, null, 2)} as const;

// ---------- DAILY VISITORS ----------
export const linkedinVisitors = ${JSON.stringify(visitors, null, 2)} as const;

// ---------- COMPETITOR BENCHMARKS ----------
export const linkedinCompetitors = ${JSON.stringify(competitors, null, 2)} as const;

// ---------- CAMPAIGN PERFORMANCE ----------
export const linkedinCampaigns = ${JSON.stringify(campaigns, null, 2)} as const;

// ---------- CREATIVE PERFORMANCE ----------
export const linkedinCreatives = ${JSON.stringify(creatives, null, 2)} as const;

// ---------- DEMOGRAPHICS ----------
export const linkedinDemographics = ${JSON.stringify(demographics, null, 2)} as const;

// ---------- MONTHLY AGGREGATES ----------
export const linkedinMonthly = ${JSON.stringify(monthly, null, 2)} as const;

// ---------- AVAILABLE MONTHS ----------
export const linkedinAvailableMonths = ${JSON.stringify(
    monthly.map((m) => ({ value: m.month, label: m.label })),
    null,
    2
  )} as const;

// ---------- SUMMARY TOTALS ----------
export const linkedinTotals = {
  followers: ${cumulativeFollowers.length > 0 ? cumulativeFollowers[cumulativeFollowers.length - 1].cumulativeFollowers : 0},
  totalImpressions: ${content.reduce((s, c) => s + c.impressionsTotal, 0)},
  totalClicks: ${content.reduce((s, c) => s + c.clicksTotal, 0)},
  totalReactions: ${content.reduce((s, c) => s + c.reactionsTotal, 0)},
  totalComments: ${content.reduce((s, c) => s + c.commentsTotal, 0)},
  totalShares: ${content.reduce((s, c) => s + c.sharesTotal, 0)},
  totalNewFollowers: ${followers.reduce((s, f) => s + f.total, 0)},
  adSpend: ${campaigns.reduce((s, c) => s + c.totalSpent, 0)},
  adImpressions: ${campaigns.reduce((s, c) => s + c.impressions, 0)},
  adClicks: ${campaigns.reduce((s, c) => s + c.clicks, 0)},
} as const;
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
  console.log("Done!");
}

main();
