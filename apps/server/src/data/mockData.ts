/**
 * Server-local demo/fallback data for API endpoints.
 *
 * The web's `apps/web/src/data/mockData.ts` is the canonical frontend source.
 * This file exists so the server stays within its own TypeScript `rootDir`
 * and doesn't cross workspace boundaries via relative imports.
 *
 * Keep these two files in sync if you update the data shapes.
 */

// === Events ===
export const eventsStatsList = [
  {
    title: "Focus Time",
    value: "14.5 hrs",
    percent: "+12%",
    icon: "timer",
    lightColor: "bg-purple-50 text-purple-600",
    darkColor: "bg-violet-500/10 text-violet-400",
    positive: true,
  },
  {
    title: "Meeting Time",
    value: "8.2 hrs",
    percent: "-5%",
    icon: "groups",
    lightColor: "bg-blue-50 text-blue-500",
    darkColor: "bg-blue-500/10 text-blue-400",
    positive: false,
  },
  {
    title: "Peak Energy",
    value: "9AM - 11AM",
    percent: "Optimal",
    icon: "bolt",
    lightColor: "bg-orange-50 text-orange-500",
    darkColor: "bg-orange-500/10 text-orange-400",
    positive: true,
  },
];

export const eventsNextUpList = [
  {
    time: "14:00",
    day: "Today",
    title: "Weekly Product Sync",
    location: "Google Meet",
    icon: "video_camera_front",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNxL6VtMEIK5weYlv1UrqIJy2sKYGZ56zmu40LdmyaWsnfPy_d13I5KJjJrOjB2UHN38jzj5Of9qBWgT7xIisdxJFgZa-pRIUmaVuYfgSWQkDKP1htNHXXbwXUhbCRe3-qPweaIGykAsgHTx-orTpIBIENS4Uni5QZFdJJpObPnNyCX3uH_3SRJdUtJ04sbugCZKTbdwFbimmAijgo16uVyJlmWlrC8Z285rfNJvEdMhEKLn2dROT-RAZf0Z42aQasMl-YLIIxbuky",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGZSoNovOg-Jnu2tLjdSUdqvA_TZbsm4vrIb4Z0BD4F6H56XICba7IM5Mjlj-BDgMFPjyjb6nWleSkMcrl8qlN7l2vFNuDn8uVM8ZLzzpzY92WQyVeRBVJ-ooznTpaS2yF01sWLoiULlW45_srV8Sy_OPI7x4aicHfLBwz8lD80oRn5q74rn6m6c1lE1VRe6ibo6NGTyr5ekG0BW4NS5xEnPWtSoCEnrzLEwfIi9p3oUt4kzOubYSYbLXuXPPDpzDaQwOvPRRWzDii",
    ],
    hasBriefing: true,
  },
  {
    time: "16:30",
    day: "Today",
    title: "Investor Outreach Session",
    location: "Soho House, London",
    icon: "location_on",
    avatars: [],
    hasBriefing: true,
    priority: "High Priority",
  },
];

// === Reminders ===
export const remindersStatsList = [
  {
    title: "Pending",
    value: "12",
    icon: "pending_actions",
    lightColor: "bg-orange-50 text-orange-600",
    darkColor: "bg-orange-500/10 text-orange-400",
  },
  {
    title: "Completed Today",
    value: "8",
    icon: "task_alt",
    lightColor: "bg-green-50 text-green-600",
    darkColor: "bg-green-500/10 text-green-400",
  },
  {
    title: "High Priority",
    value: "3",
    icon: "priority_high",
    lightColor: "bg-red-50 text-red-600",
    darkColor: "bg-red-500/10 text-red-400",
  },
];

export const remindersUrgentList = [
  { title: "Finalize Q3 Budget Strategy", overdue: "Overdue 2h", tag: "Finance" },
];

export const remindersActiveList = [
  {
    id: "rem-1",
    title: "Client Presentation Review",
    time: "2:00 PM",
    tag: "Work",
    actionType: "snooze",
    actionLabel: "Snooze until clear",
  },
  {
    id: "rem-2",
    title: "Renew Software Licenses",
    time: "4:30 PM",
    tag: "Operations",
    actionType: "pay",
    actionLabel: "Pay Now",
  },
];

export const remindersUpcomingList = [
  { date: "Oct 14", title: "Monthly Team Sync preparation" },
  { date: "Oct 15", title: "Review Health Insurance Options" },
  { date: "Oct 17", title: "Quarterly performance reports" },
];

export const remindersAiInsightsList = [
  {
    type: "Smart Suggestion",
    title: "Buy flowers for anniversary",
    desc: `Based on your calendar event "10th Anniversary" on Sunday. I've found three local florists with 10% discounts for NeverLate users.`,
    action: "Order Now",
    icon: "redeem",
    isSpecial: true,
  },
  {
    type: "Workflow Optimization",
    title: "Consolidate Errands",
    desc: 'You have "Dry Cleaning" and "Post Office" pending. Traffic is light near both between 2-3 PM today.',
    action: "Batch these tasks",
    icon: "directions_car",
  },
  {
    type: "Health & Focus",
    title: "Schedule Deep Work",
    desc: "Your focus scores are highest on Tuesday mornings. Should I block 9-11 AM for your Project Delta?",
    action: "Block time",
    icon: "event",
  },
];

// === Insights ===
export const insightsVelocity = [
  { day: "MON", val: "h-2/3", label: "66%" },
  { day: "TUE", val: "h-1/2", label: "50%" },
  { day: "WED", val: "h-3/4", label: "75%" },
  { day: "THU", val: "h-1/3", label: "33%" },
  { day: "FRI", val: "h-5/6", label: "83%" },
  { day: "SAT", val: "h-1/2", label: "50%" },
  { day: "SUN", val: "h-3/4", label: "75%", active: true },
];

export const insightsCounters = [
  {
    type: "CRITICAL",
    value: "03",
    desc: "Urgent conflicts requiring immediate action.",
    icon: "warning",
    lightBorder: "border-l-red-500 text-red-500 bg-white border-slate-100",
    darkBorder: "border-l-red-500 text-red-400 bg-[#18181b] border-zinc-800",
  },
  {
    type: "MEDIUM",
    value: "12",
    desc: "Potential bottlenecks in late-week flow.",
    icon: "bolt",
    lightBorder: "border-l-slate-400 text-slate-500 bg-white border-slate-100",
    darkBorder: "border-l-zinc-500 text-zinc-400 bg-[#18181b] border-zinc-800",
  },
  {
    type: "LOW",
    value: "08",
    desc: "Minor schedule optimizations available.",
    icon: "check_circle",
    lightBorder: "border-l-purple-500 text-purple-600 bg-white border-slate-100",
    darkBorder: "border-l-violet-500 text-violet-400 bg-[#18181b] border-zinc-800",
  },
];

export const insightsRisks = [
  {
    title: "Flight overlap",
    text: "LHR Departure (14:30) conflicts with Strategic Review meeting.",
    p: "P1 PRIORITY",
    time: "4m ago",
    icon: "flight_takeoff",
    lightColor: "bg-red-50 text-red-600",
    darkColor: "bg-red-500/10 text-red-400",
  },
  {
    title: "Unsent deliverable",
    text: "Project 'Zenith' Alpha deck hasn't been shared with stakeholders.",
    p: "P2 PRIORITY",
    time: "12m ago",
    icon: "pending_actions",
    lightColor: "bg-purple-50 text-purple-600",
    darkColor: "bg-violet-500/10 text-violet-400",
  },
  {
    title: "Low Buffer Zone",
    text: "Back-to-back meetings tomorrow (09:00 - 13:00) leave no room for transit.",
    p: "P3 PRIORITY",
    time: "1h ago",
    icon: "schedule",
    lightColor: "bg-slate-100 text-slate-600",
    darkColor: "bg-zinc-800 text-zinc-400",
  },
];

export const insightsSuggestions = [
  {
    title: "Reschedule Review Meeting",
    desc: "Move Strategic Review to Wednesday 10:00 AM to resolve flight conflict.",
    action: "Apply Optimization",
    outline: false,
  },
  {
    title: "Automate Status Report",
    desc: "Intelligence can draft the 'Zenith' report based on recent Slack updates.",
    action: "Apply",
    outline: true,
  },
];

// === Actions ===
export const actionsStatsList = [
  {
    title: "High Impact Pending",
    value: "12",
    badge: "Urgent",
    icon: "error",
    lightColor: "bg-red-50 text-red-500",
    darkColor: "bg-red-500/10 text-red-400",
    badgeClassLight: "bg-red-50 text-red-500",
    badgeClassDark: "bg-red-500/10 text-red-400",
  },
  {
    title: "Time Saved This Week",
    value: "12.5 hrs",
    badge: "+2.4h",
    icon: "bolt",
    lightColor: "bg-purple-50 text-primary",
    darkColor: "bg-violet-500/10 text-violet-400",
    badgeClassLight: "bg-purple-50 text-primary",
    badgeClassDark: "bg-violet-550/10 text-violet-400",
  },
  {
    title: "Success Rate",
    value: "94%",
    badge: "Optimal",
    icon: "verified",
    lightColor: "bg-emerald-50 text-emerald-600",
    darkColor: "bg-emerald-500/10 text-emerald-400",
    badgeClassLight: "bg-emerald-50 text-emerald-600",
    badgeClassDark: "bg-emerald-500/10 text-emerald-400",
  },
];

export const actionsPendingList = [
  {
    id: "act-1",
    title: "Reschedule Marketing Sync",
    desc: "Conflict detected with 'Executive Review'. Suggest moving to Thursday at 10:00 AM.",
    tag: "Calendar",
    bgLight: "bg-amber-50",
    icon: "calendar_month",
    iconColorLight: "text-amber-500",
    iconColorDark: "text-amber-400",
    actionLabel: "Approve Auto-Reschedule",
    dismissLabel: "Dismiss",
  },
  {
    id: "act-2",
    title: "Draft Investor Follow-up",
    desc: "Ready based on yesterday's 'Q3 Planning' meeting notes. Action required: Final review.",
    tag: "Email",
    bgLight: "bg-blue-50",
    icon: "mail",
    iconColorLight: "text-blue-500",
    iconColorDark: "text-blue-400",
    actionLabel: "Review Draft",
    dismissLabel: "Ignore",
  },
  {
    id: "act-3",
    title: "Optimize Focus Blocks",
    desc: "Consolidate 3 fragmented 30-min gaps into a single 1.5h deep work session.",
    tag: "Optimization",
    bgLight: "bg-purple-50",
    icon: "auto_fix_high",
    iconColorLight: "text-purple-50",
    iconColorDark: "text-violet-400",
    actionLabel: "Consolidate Now",
    dismissLabel: "View Schedule",
  },
];

export const actionsWeeklyChart = [
  { day: "Mon", suggestedPercent: "60%", executedPercent: "35%" },
  { day: "Tue", suggestedPercent: "85%", executedPercent: "70%" },
  { day: "Wed", suggestedPercent: "45%", executedPercent: "20%" },
  { day: "Thu", suggestedPercent: "75%", executedPercent: "55%" },
  { day: "Fri", suggestedPercent: "95%", executedPercent: "80%" },
];
