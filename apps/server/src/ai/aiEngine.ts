import { buildTimeline } from "./heuristicEngine.ts";
import { mcpRegistry } from "../mcp/registry.ts";
import { getPriorityReminders } from "../services/coralService.ts";

export async function processDashboardData() {
  const [
    { emails, events },
    { briefing },
    { focusScore, upcomingMeetings, importantEmails, conflicts, recommendation },
    { risks },
    { conflicts: scheduleConflicts },
    { issues },
    reminders
  ] = await Promise.all([
    mcpRegistry.get_dashboard_context.execute(),
    mcpRegistry.get_daily_briefing.execute(),
    mcpRegistry.get_productivity_summary.execute(),
    mcpRegistry.get_high_risk_commitments.execute(),
    mcpRegistry.get_upcoming_conflicts.execute(),
    mcpRegistry.get_travel_issues.execute(),
    getPriorityReminders()
  ]);

  const allInsights = [...risks, ...scheduleConflicts, ...issues];
  const timeline = buildTimeline(emails, events, allInsights);

  return {
    summary: briefing,
    insights: allInsights.slice(0, 4), // Top 4
    timeline,
    reminders,
    metrics: [
      { title: 'Focus Score', value: `${focusScore}`, desc: 'Optimal', icon: 'center_focus_strong', lightColor: 'bg-emerald-100 text-emerald-600', darkColor: 'bg-emerald-500/20 text-emerald-400' },
      { title: 'Meeting Load', value: `${upcomingMeetings}`, desc: 'Events Today', icon: 'event_busy', lightColor: 'bg-amber-100 text-amber-600', darkColor: 'bg-amber-500/20 text-amber-400' },
      { title: 'Pending Action', value: `${importantEmails}`, desc: 'Important Emails', icon: 'mark_email_unread', lightColor: 'bg-blue-100 text-blue-600', darkColor: 'bg-blue-500/20 text-blue-400' },
      { title: 'Conflicts', value: `${conflicts}`, desc: 'Schedule overlaps', icon: 'warning', lightColor: 'bg-rose-100 text-rose-600', darkColor: 'bg-rose-500/20 text-rose-400' }
    ],
    memory: [recommendation]
  };
}

type Intent =
  | "daily_summary"
  | "risk_review"
  | "productivity_review"
  | "unfinished_work"
  | "connected_sources"
  | "unknown";

function classifyIntent(query: string, context: any[] = []): Intent {
  const q = query.toLowerCase();
  
  // Context resolution heuristic:
  // If the query is short or contains referential pronouns, we use the prior user message to determine intent
  let effectiveQuery = q;
  if ((q.includes("which") || q.includes("those") || q.includes("that") || q.includes("it") || q.includes("most urgent") || q.split(" ").length < 5) && context.length > 0) {
    for (let i = context.length - 1; i >= 0; i--) {
      if (context[i].role === 'user' && context[i].content !== query) {
        effectiveQuery = context[i].content.toLowerCase() + " " + q;
        break;
      }
    }
  }

  const riskTriggers = ["miss", "risk", "problem", "danger", "conflict", "overlap", "deadline", "important", "worry", "issue", "urgent"];
  const summaryTriggers = ["today", "focus", "briefing", "summary", "agenda", "schedule", "workload", "priorities"];
  const prodTriggers = ["productive", "productivity", "efficiency", "performance", "focus score"];
  const taskTriggers = ["unfinished", "pending", "remaining", "todo", "tasks", "follow up"];
  const sourceTriggers = ["connected", "accounts", "integrations", "sources", "gmail", "calendar"];

  if (riskTriggers.some(t => effectiveQuery.includes(t))) return "risk_review";
  if (summaryTriggers.some(t => effectiveQuery.includes(t))) return "daily_summary";
  if (prodTriggers.some(t => effectiveQuery.includes(t))) return "productivity_review";
  if (taskTriggers.some(t => effectiveQuery.includes(t))) return "unfinished_work";
  if (sourceTriggers.some(t => effectiveQuery.includes(t))) return "connected_sources";

  return "unknown";
}

export async function processChat(query: string, context: any[] = []) {
  const intent = classifyIntent(query, context);
  const lowerQuery = query.toLowerCase();
  const isUrgencyFollowup = lowerQuery.includes("most urgent") || lowerQuery.includes("urgent") || lowerQuery.includes("worst");

  switch (intent) {
    case "risk_review": {
      const [
        { risks },
        { conflicts },
        { issues },
      ] = await Promise.all([
        mcpRegistry.get_high_risk_commitments.execute(),
        mcpRegistry.get_upcoming_conflicts.execute(),
        mcpRegistry.get_travel_issues.execute(),
      ]);

      if (isUrgencyFollowup) {
         let urgentText = "";
         if (conflicts.length > 0) {
            urgentText = conflicts[0]?.desc || conflicts[0]?.text || "";
         } else if (risks.length > 0) {
            urgentText = risks[0]?.desc || risks[0]?.text || "";
         } else if (issues.length > 0) {
            urgentText = issues[0]?.desc || issues[0]?.text || "";
         } else {
            return { reply: "None of your current commitments appear to be highly urgent.", sourceTools: ["getHighRiskCommitments", "getUpcomingConflicts"] };
         }
         return {
           reply: `**Summary**\nBased on your data, the most urgent issue right now is isolated to a single event.\n\n**Key Findings**\n• ${urgentText}\n\n**Recommended Actions**\nI recommend resolving this overlap immediately to clear your timeline.`,
           sourceTools: ["getHighRiskCommitments", "getUpcomingConflicts", "getTravelIssues"]
         };
      }

      let reply = "**Summary**\nBased on your current commitments, I've scanned your calendar and inbox for high-priority risks.\n\n**Key Findings**\n";
      let hasIssues = false;
      
      if (conflicts.length > 0) {
        reply += `• ${conflicts.length === 1 ? 'One scheduling conflict requires' : `${conflicts.length} scheduling conflicts require`} attention.\n`;
        hasIssues = true;
      }
      if (risks.length > 0) {
        reply += `• ${risks.length === 1 ? 'One important email still needs' : `${risks.length} important emails still need`} follow-up.\n`;
        hasIssues = true;
      }
      if (issues.length > 0) {
        reply += `• ${issues.length === 1 ? 'One travel-related event lacks' : `${issues.length} travel-related events lack`} preparation time.\n`;
        hasIssues = true;
      }
      
      if (!hasIssues) {
        reply = "You currently have no high-risk commitments, scheduling conflicts, or travel issues. Everything looks clear!";
      } else {
         let topIssue = "";
         if (conflicts.length > 0) topIssue = conflicts[0]?.desc || conflicts[0]?.text || "a schedule overlap";
         else if (risks.length > 0) topIssue = risks[0]?.desc || risks[0]?.text || "an urgent email";
         
         reply += `\n**Recommended Actions**\nYour highest-priority issue is ${topIssue}. Would you like me to resolve it?`;
      }

      return {
        reply,
        sourceTools: ["getHighRiskCommitments", "getUpcomingConflicts", "getTravelIssues"]
      };
    }
    case "daily_summary": {
      const { briefing, priorities, warnings } = await mcpRegistry.get_daily_briefing.execute();
      let reply = `**Summary**\n${briefing}\n\n`;
      if (priorities && priorities.length > 0) {
        reply += `**Key Findings**\n${priorities.map(p => `• ${p}`).join("\n")}\n\n`;
      }
      if (warnings && warnings.length > 0) {
        reply += `**Recommended Actions**\n${warnings.map(w => `• ${w}`).join("\n")}`;
      } else {
        reply += `**Recommended Actions**\n• No critical actions required today.`;
      }
      return {
        reply: reply.trim(),
        sourceTools: ["getDailyBriefing"]
      };
    }
    case "productivity_review": {
      const { focusScore, upcomingMeetings, importantEmails, conflicts, recommendation } = await mcpRegistry.get_productivity_summary.execute();
      let reply = `**Summary**\nYour current Focus Score is **${focusScore}**.\n\n`;
      reply += `**Key Findings**\n`;
      reply += `• You have ${upcomingMeetings} upcoming meetings today.\n`;
      reply += `• There ${importantEmails === 1 ? 'is' : 'are'} ${importantEmails} urgent ${importantEmails === 1 ? 'email' : 'emails'} pending.\n`;
      if (conflicts > 0) {
        reply += `• You have ${conflicts} scheduling ${conflicts === 1 ? 'conflict' : 'conflicts'}.\n`;
      }
      reply += `\n**Recommended Actions**\n• ${recommendation}`;
      
      return {
        reply,
        sourceTools: ["getProductivitySummary"]
      };
    }
    case "unfinished_work": {
      const { tasks } = await mcpRegistry.get_unfinished_tasks.execute();
      if (!tasks || tasks.length === 0) {
        return {
          reply: "You currently have no unfinished tasks or pending follow-ups. Great job!",
          sourceTools: ["getUnfinishedTasks"]
        };
      }
      let reply = `**Summary**\nYou have ${tasks.length} unfinished ${tasks.length === 1 ? 'task' : 'tasks'} pending.\n\n`;
      reply += `**Key Findings**\n`;
      reply += tasks.map((t: string) => `• ${t}`).join("\n");
      reply += `\n\n**Recommended Actions**\n• Try to clear the oldest tasks first to maintain inbox zero.`;
      
      return {
        reply,
        sourceTools: ["getUnfinishedTasks"]
      };
    }
    case "connected_sources": {
      const { sources } = await mcpRegistry.get_connected_sources.execute();
      let reply = `**Summary**\nYou have ${sources.length} connected ${sources.length === 1 ? 'account' : 'accounts'}.\n\n`;
      reply += `**Key Findings**\n`;
      reply += sources.map((s: any) => `• **${s.name}**: ${s.status}`).join("\n");
      return {
        reply,
        sourceTools: ["getConnectedSources"]
      };
    }
    default: {
      return {
        reply: "I couldn't confidently determine your intent from that request, but I can currently help with:\n\n• Scheduling conflicts\n• Upcoming commitments\n• Email follow-ups\n• Productivity summaries\n• Travel preparation\n\nCould you rephrase your question?",
        sourceTools: []
      };
    }
  }
}

export async function getActiveNotifications() {
  const { risks } = await mcpRegistry.get_high_risk_commitments.execute();
  const { conflicts } = await mcpRegistry.get_upcoming_conflicts.execute();
  
  const allInsights = [...risks, ...conflicts];
  return allInsights.map(ins => ({
    id: ins.id,
    message: ins.text,
    type: ins.severity === 'High Risk' ? 'alert' : 'info',
    time: 'Just Now'
  }));
}
