import { getRecentEmails, getUpcomingEvents } from "./coralService.ts";
import { generateReminderInsights } from "../ai/heuristicEngine.ts";
import {
  remindersStatsList,
  remindersUrgentList,
  remindersActiveList,
  remindersUpcomingList,
  remindersAiInsightsList
} from "../data/mockData.ts";

export interface RemindersContext {
  source: "live" | "fallback";
  stats: any[];
  urgent: any[];
  active: any[];
  upcoming: any[];
  aiInsights: any[];
}

export async function getRemindersContext(): Promise<RemindersContext> {
  try {
    const emails = await getRecentEmails();
    const events = await getUpcomingEvents();

    const now = new Date();
    
    // Arrays for reminders
    const urgentItems: any[] = [];
    const activeItems: any[] = [];
    const upcomingItems: any[] = [];

    let completedToday = 0; // Rule: Do not fabricate completed items
    let highPriorityCount = 0;

    // Deterministic rules for Emails
    emails.forEach(email => {
      const subject = email.subject || "No Subject";
      const lowerSub = subject.toLowerCase();
      const isHighPriority = email.priority === "High" || 
        (email.labels && email.labels.includes("IMPORTANT")) ||
        lowerSub.includes("urgent") || lowerSub.includes("deadline") || 
        lowerSub.includes("action required") || lowerSub.includes("follow up") || 
        lowerSub.includes("response needed");

      const isPayment = lowerSub.includes("invoice") || lowerSub.includes("payment due") || 
        lowerSub.includes("bill") || lowerSub.includes("subscription renewal") || 
        lowerSub.includes("receipt");

      const actionType = isPayment ? "pay" : "snooze";
      const actionLabel = isPayment ? "Pay Now" : "Snooze until clear";

      if (isHighPriority) {
        highPriorityCount++;
        urgentItems.push({
          title: subject,
          overdue: "Action Required",
          tag: "Email"
        });
      } else {
        activeItems.push({
          id: `email-${email.id}`,
          title: subject,
          time: new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tag: "Email",
          actionType,
          actionLabel
        });
      }
    });

    // Deterministic rules for Events
    events.forEach(event => {
      if (!event.start) return;
      const eventDate = new Date(event.start);
      const hoursUntil = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      const title = event.title || "Busy";
      const lowerTitle = title.toLowerCase();

      const isHighPriority = hoursUntil > 0 && hoursUntil <= 24 && (
        lowerTitle.includes("interview") || lowerTitle.includes("flight") || 
        lowerTitle.includes("urgent") || lowerTitle.includes("review")
      );

      if (isHighPriority) {
        highPriorityCount++;
        urgentItems.push({
          title: title,
          overdue: `Starts in ${Math.round(hoursUntil)}h`,
          tag: "Calendar"
        });
      } else if (hoursUntil > 24 && hoursUntil < 7 * 24) {
        upcomingItems.push({
          date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          title: title
        });
      } else if (hoursUntil > 0 && hoursUntil <= 24) {
        activeItems.push({
          id: `event-${event.id}`,
          title: title,
          time: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tag: "Calendar",
          actionType: "snooze",
          actionLabel: "Snooze"
        });
      }
    });

    // Generate Insights using heuristicEngine
    const aiInsights = generateReminderInsights(emails, events);

    // Build Stats
    const stats = [
      {
        title: "Pending",
        value: (urgentItems.length + activeItems.length).toString(),
        icon: "pending_actions",
        lightColor: "bg-orange-50 text-orange-600",
        darkColor: "bg-orange-500/10 text-orange-400",
      },
      {
        title: "Completed Today",
        value: completedToday.toString(),
        icon: "task_alt",
        lightColor: "bg-green-50 text-green-600",
        darkColor: "bg-green-500/10 text-green-400",
      },
      {
        title: "High Priority",
        value: highPriorityCount.toString(),
        icon: "priority_high",
        lightColor: "bg-red-50 text-red-600",
        darkColor: "bg-red-500/10 text-red-400",
      }
    ];

    return {
      source: "live",
      stats,
      urgent: urgentItems,
      active: activeItems,
      upcoming: upcomingItems,
      aiInsights
    };

  } catch (error) {
    console.error("Failed to fetch reminders context from Coral. Falling back to mock data.");
    return {
      source: "fallback",
      stats: remindersStatsList,
      urgent: remindersUrgentList,
      active: remindersActiveList,
      upcoming: remindersUpcomingList,
      aiInsights: remindersAiInsightsList,
    };
  }
}
