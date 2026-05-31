import { getDashboardContext } from "../mcp/tools/getDashboardContext.ts";
import { getUpcomingConflicts } from "../mcp/tools/getUpcomingConflicts.ts";
import { getHighRiskCommitments } from "../mcp/tools/getHighRiskCommitments.ts";
import { getTravelIssues } from "../mcp/tools/getTravelIssues.ts";
import { insightsVelocity, insightsCounters, insightsRisks, insightsSuggestions } from "../data/mockData.ts";

export async function getInsightsContext() {
  try {
    const { emails, events } = await getDashboardContext.execute();
    const { conflicts } = await getUpcomingConflicts.execute();
    const { risks } = await getHighRiskCommitments.execute();
    const { issues } = await getTravelIssues.execute();

    const activeRisks: any[] = [];
    let highCount = 0;
    let medCount = 0;
    let lowCount = 0; // Using zero to avoid fabricating

    conflicts.forEach(c => {
      highCount++;
      activeRisks.push({
        title: "Overlapping meetings detected.",
        text: c.desc,
        p: "P1 PRIORITY",
        time: "Just now",
        icon: "schedule",
        lightColor: "bg-red-50 text-red-600",
        darkColor: "bg-red-500/10 text-red-400"
      });
    });

    risks.forEach(r => {
      medCount++;
      activeRisks.push({
        title: "Urgent unanswered email",
        text: r.desc,
        p: "P2 PRIORITY",
        time: "Just now",
        icon: "warning",
        lightColor: "bg-orange-50 text-orange-600",
        darkColor: "bg-orange-500/10 text-orange-400"
      });
    });

    issues.forEach(i => {
      highCount++;
      activeRisks.push({
        title: "Imminent travel preparation issue",
        text: i.desc,
        p: "P1 PRIORITY",
        time: "Just now",
        icon: "flight_takeoff",
        lightColor: "bg-red-50 text-red-600",
        darkColor: "bg-red-500/10 text-red-400"
      });
    });

    // Velocity Chart (Trailing 7 days using real timestamps)
    const velocityMap = new Map();
    const now = new Date();
    // Pre-fill last 7 days to preserve structural integrity
    for (let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      velocityMap.set(dayStr, 0);
    }
    
    events.forEach(e => {
      if (!e.start) return;
      const d = new Date(e.start);
      if (d <= now && d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        if (velocityMap.has(dayStr)) velocityMap.set(dayStr, velocityMap.get(dayStr) + 1);
      }
    });

    emails.forEach(e => {
      if (!e.date) return;
      const d = new Date(e.date);
      if (d <= now && d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        if (velocityMap.has(dayStr)) velocityMap.set(dayStr, velocityMap.get(dayStr) + 1);
      }
    });

    const velocity = Array.from(velocityMap.entries()).map(([day, val]) => {
      let percent = Math.min(100, (val as number) * 10);
      let hClass = "h-1/2";
      if (percent < 30) hClass = "h-1/3";
      else if (percent > 70) hClass = "h-3/4";
      return { day, val: hClass, label: `${percent}%`, active: day === now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() };
    });

    const counters = [
      {
        type: "CRITICAL",
        value: highCount.toString().padStart(2, '0'),
        desc: "Urgent conflicts requiring immediate action.",
        icon: "warning",
        lightBorder: "border-l-red-500 text-red-500 bg-white border-slate-100",
        darkBorder: "border-l-red-500 text-red-400 bg-[#18181b] border-zinc-800",
      },
      {
        type: "MEDIUM",
        value: medCount.toString().padStart(2, '0'),
        desc: "Potential bottlenecks in late-week flow.",
        icon: "bolt",
        lightBorder: "border-l-slate-400 text-slate-500 bg-white border-slate-100",
        darkBorder: "border-l-zinc-500 text-zinc-400 bg-[#18181b] border-zinc-800",
      },
      {
        type: "LOW",
        value: lowCount.toString().padStart(2, '0'),
        desc: "Minor schedule optimizations available.",
        icon: "check_circle",
        lightBorder: "border-l-purple-500 text-purple-600 bg-white border-slate-100",
        darkBorder: "border-l-violet-500 text-violet-400 bg-[#18181b] border-zinc-800",
      }
    ];

    const suggestions: any[] = [];
    if (conflicts.length > 0) {
      suggestions.push({
        title: "Reschedule Overlapping Meeting",
        desc: `Move ${conflicts[0]?.desc?.substring(0, 15)} to resolve conflict.`,
        action: "Apply Optimization",
        outline: false,
      });
    }
    if (risks.length > 0) {
      suggestions.push({
        title: "Automate Email Draft",
        desc: `Intelligence can draft a response to ${risks[0]?.desc?.substring(0, 15)} based on context.`,
        action: "Apply",
        outline: true,
      });
    }

    // Default suggestions if none generated
    if (suggestions.length === 0) {
      suggestions.push({
        title: "Consolidate Meetings",
        desc: "Schedule remains open, consolidating meetings could increase deep work blocks.",
        action: "Apply Optimization",
        outline: false
      });
    }

    return {
      source: "live",
      generatedAt: new Date().toISOString(),
      velocity,
      counters,
      risks: activeRisks,
      suggestions
    };
  } catch (err) {
    console.error("Failed to fetch Insights live context. Falling back to mock data.");
    return {
      source: "fallback",
      generatedAt: new Date().toISOString(),
      velocity: insightsVelocity,
      counters: insightsCounters,
      risks: insightsRisks,
      suggestions: insightsSuggestions
    };
  }
}
