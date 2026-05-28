import { useState, useEffect } from "react";
import {
  dashboardKpis,
  dashboardInsights,
  dashboardSources,
  dashboardAgenda,
} from "../data/mockData";
import PlatformIcon from "../components/PlatformIcon";

interface DashboardProps {
  setActivePage: (page: string) => void;
  isDark: boolean;
}

export default function Dashboard({ setActivePage, isDark }: DashboardProps) {
  const [sources, setSources] = useState(dashboardSources);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<any[]>([]);

  const [kpis, setKpis] = useState(dashboardKpis);
  const [insights, setInsights] = useState(dashboardInsights);
  const [summary, setSummary] = useState("");
  const [memory, setMemory] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const statusRes = await fetch("http://localhost:3000/api/google/status");
        const status = await statusRes.json();

        if (status.connected) {
          console.log("Using LIVE Google data");

          setSources((prev) =>
            prev.map((s) => {
              if (s.id === "gmail" || s.id === "calendar") {
                return { ...s, connected: true, email: status.email };
              }
              return s;
            })
          );

          try {
            const aiRes = await fetch("http://localhost:3000/api/ai/dashboard");
            const aiData = await aiRes.json();

            setSummary(aiData.summary || "");
            setKpis(aiData.metrics || []);
            setInsights(aiData.insights || []);
            setTimeline(aiData.timeline || []);
            setMemory(aiData.memory || []);
          } catch (e) {
            console.error("AI Dashboard fetch failed", e);
          }

          try {
            const emailsRes = await fetch("http://localhost:3000/api/google/emails");
            const emailsData = await emailsRes.json();
            console.log("LIVE EMAIL API RESPONSE", emailsData);
            if (Array.isArray(emailsData)) {
              setEmails(emailsData);
            } else {
              setEmails([]);
            }
          } catch (e) {
            console.error("Emails fetch failed", e);
            setEmails([]);
          }
        } else {
          console.log("Using MOCK fallback data");
          setSummary(
            "Your dashboard is running in offline mock mode. Connect your data sources to unlock real AI insights."
          );
          setKpis(dashboardKpis);
          setInsights(dashboardInsights);
          setTimeline(dashboardAgenda);
          setMemory(["You usually prefer dark mode.", "Mock mode is currently active."]);
          setSources(
            dashboardSources.map((s) =>
              s.id === "gmail" || s.id === "calendar" ? { ...s, connected: false } : s
            )
          );
          setEmails([]);
        }
      } catch (err) {
        console.error("Status fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function categorizeEmail(subject: string, snippet: string) {
    const text = (subject + " " + snippet).toLowerCase();
    if (text.match(/urgent|deadline|interview|payment|critical/)) {
      return {
        category: "High Priority",
        colorLight: "bg-rose-100 text-rose-700 border-rose-200",
        colorDark: "bg-rose-900/30 text-rose-400 border-rose-800",
      };
    } else if (text.match(/invoice|action required|needs attention|reminder/)) {
      return {
        category: "Needs Attention",
        colorLight: "bg-amber-100 text-amber-700 border-amber-200",
        colorDark: "bg-amber-900/30 text-amber-400 border-amber-800",
      };
    } else if (text.match(/meeting|application|update|confirmation/)) {
      return {
        category: "Updates",
        colorLight: "bg-blue-100 text-blue-700 border-blue-200",
        colorDark: "bg-blue-900/30 text-blue-400 border-blue-800",
      };
    } else if (text.match(/promo|offer|discount|sale/)) {
      return {
        category: "Promotions",
        colorLight: "bg-emerald-100 text-emerald-700 border-emerald-200",
        colorDark: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
      };
    } else {
      return {
        category: "Social",
        colorLight: "bg-slate-100 text-slate-700 border-slate-200",
        colorDark: "bg-zinc-800 text-zinc-400 border-zinc-700",
      };
    }
  }

  function formatTime(dateString: string) {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateString;
    }
  }

  return (
    <div
      className={`pt-20 px-4 md:px-8 pb-12 max-w-[1600px] mx-auto grid grid-cols-12 gap-4 animate-in fade-in duration-500 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
    >
      {/* Top Banner: Daily AI Summary */}
      <div
        className={`col-span-12 p-6 rounded-2xl border shadow-sm relative overflow-hidden flex items-center justify-between ${
          isDark
            ? "bg-gradient-to-r from-violet-900/40 to-[#18181b] border-zinc-800"
            : "bg-gradient-to-r from-purple-100 to-white border-purple-100"
        }`}
      >
        <div className="z-10">
          <h2
            className={`text-2xl font-bold mb-1 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
          >
            <span className="material-symbols-outlined text-[28px] text-purple-500">
              auto_awesome
            </span>
            Good morning, Shazil!
          </h2>
          <p
            className={`text-sm font-medium max-w-2xl leading-relaxed ${isDark ? "text-zinc-300" : "text-slate-600"}`}
          >
            {summary}
          </p>
        </div>
        <div className="hidden md:flex gap-2 z-10">
          <button
            onClick={() => setActivePage("chat")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
              isDark
                ? "bg-white text-zinc-900 hover:bg-zinc-200"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            Ask AI
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#8B5CF6"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98,-18.1,97.7,-2.8C97.4,12.5,90.2,27.6,80.4,40.1C70.6,52.6,58.3,62.5,44.5,70.5C30.7,78.5,15.4,84.6,0.3,84.1C-14.8,83.6,-29.6,76.5,-42.6,67.8C-55.6,59.1,-66.8,48.8,-74.6,36.2C-82.4,23.6,-86.8,8.8,-84.9,-5.3C-83,-19.4,-74.8,-32.8,-64.5,-43.3C-54.2,-53.8,-41.8,-61.4,-29,-69.2C-16.2,-77,-3.1,-85,10.6,-85.7C24.3,-86.4,30.6,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>

      {/* Smart Metrics (Dense layout) */}
      <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi: any, idx: number) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border shadow-sm flex items-center space-x-4 hover:-translate-y-0.5 transition-transform duration-200 ${
              isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? kpi.darkColor : kpi.lightColor}`}
            >
              <span className="material-symbols-outlined text-[20px]">{kpi.icon}</span>
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span
                  className={`text-xl font-bold leading-none ${isDark ? "text-white" : "text-slate-800"}`}
                >
                  {kpi.value}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase ${isDark ? "text-zinc-500" : "text-slate-400"}`}
                >
                  {kpi.desc}
                </span>
              </div>
              <p
                className={`text-[11px] mt-1 font-medium ${isDark ? "text-zinc-400" : "text-slate-500"}`}
              >
                {kpi.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Left Column (Dense Insights & Sources) */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {/* Dynamic AI Insights */}
        {insights.length > 0 && (
          <section
            className={`p-5 rounded-2xl border shadow-sm ${isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4
                className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${isDark ? "text-rose-400" : "text-rose-600"}`}
                >
                  error
                </span>
                Actionable Insights
              </h4>
              <button
                onClick={() => setActivePage("insights")}
                className={`text-[10px] font-bold uppercase hover:underline ${isDark ? "text-violet-400" : "text-purple-600"}`}
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.map((insight: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col group transition-all hover:shadow-md ${
                    isDark
                      ? "bg-[#0a0a0c]/80 border-zinc-800/80 hover:border-zinc-700"
                      : "bg-slate-50 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2 items-center">
                      <PlatformIcon
                        id={
                          insight.type.toLowerCase().includes("interview") ||
                          insight.text.toLowerCase().includes("email")
                            ? "gmail"
                            : insight.type.toLowerCase().includes("conflict")
                              ? "calendar"
                              : insight.type.toLowerCase().includes("document")
                                ? "drive"
                                : insight.type.toLowerCase().includes("collaboration")
                                  ? "slack"
                                  : "calendar"
                        }
                        connected={true}
                        isDark={isDark}
                        size="compact"
                        className="opacity-70 group-hover:opacity-100"
                      />
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${isDark ? insight.colorDark : insight.colorLight}`}
                      >
                        {insight.severity || insight.type}
                      </span>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-zinc-500" : "text-slate-400"}`}
                    >
                      arrow_forward
                    </span>
                  </div>
                  <p
                    className={`text-xs font-bold leading-snug mb-1 ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    {insight.text}
                  </p>
                  <p
                    className={`text-[10px] line-clamp-1 mb-3 ${isDark ? "text-zinc-500" : "text-slate-500"}`}
                  >
                    {insight.desc}
                  </p>
                  <button
                    className={`mt-auto w-full text-[10px] font-bold py-1.5 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {insight.action}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Memory Widget */}
        {memory.length > 0 && (
          <section
            className={`p-5 rounded-2xl border shadow-sm ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-purple-50/30 border-purple-100/50"}`}
          >
            <h4
              className={`text-sm font-bold flex items-center gap-2 mb-3 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
              >
                psychology
              </span>
              AI Context & Memory
            </h4>
            <ul className="space-y-2">
              {memory.map((m: string, i: number) => (
                <li
                  key={i}
                  className={`text-xs flex items-start gap-2 ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                >
                  <span className="material-symbols-outlined text-[14px] mt-0.5 text-emerald-500">
                    check_circle
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Live Emails Intelligence Widget */}
        <section
          className={`p-5 rounded-2xl border shadow-sm flex flex-col max-h-[500px] ${
            isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
          }`}
        >
          <div className="flex justify-between items-center mb-5 shrink-0">
            <h4
              className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <PlatformIcon
                id="gmail"
                isDark={isDark}
                connected={true}
                size="timeline"
                className="opacity-80"
              />
              Recent Emails
            </h4>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span
                className={`text-[9px] font-semibold uppercase tracking-wider ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              >
                Live Intelligence
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {emails.length === 0 && (
              <p className={`text-xs italic ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                No emails found.
              </p>
            )}
            {emails.slice(0, 10).map((email, idx) => {
              const cat = categorizeEmail(email.subject, email.snippet);
              const senderName = email.sender.split("<")[0].replace(/"/g, "").trim();

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                    isDark
                      ? "bg-[#0a0a0c]/80 border-zinc-800/80 hover:border-zinc-700"
                      : "bg-slate-50 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                          cat.category === "High Priority"
                            ? "bg-rose-500"
                            : cat.category === "Needs Attention"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                        }`}
                      >
                        {senderName.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`text-xs font-bold truncate ${isDark ? "text-zinc-200" : "text-slate-700"}`}
                      >
                        {senderName}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] whitespace-nowrap opacity-60 ${isDark ? "text-zinc-400" : "text-slate-500"}`}
                    >
                      {formatTime(email.date)}
                    </span>
                  </div>

                  <p
                    className={`text-xs font-bold leading-tight line-clamp-1 ${isDark ? "text-zinc-100" : "text-slate-800"}`}
                  >
                    {email.subject}
                  </p>

                  <p
                    className={`text-[10px] leading-relaxed line-clamp-2 ${isDark ? "text-zinc-500" : "text-slate-500"}`}
                  >
                    {email.snippet}
                  </p>

                  <div className="mt-1 flex">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border ${isDark ? cat.colorDark : cat.colorLight}`}
                    >
                      {cat.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Data Sources Grid (Dense) */}
        <section
          className={`p-5 rounded-2xl border shadow-sm ${isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h4
              className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${isDark ? "text-blue-400" : "text-blue-600"}`}
              >
                hub
              </span>
              Connected Services
            </h4>
            <button
              onClick={() => setActivePage("sources")}
              className={`text-[10px] font-bold uppercase hover:underline ${isDark ? "text-violet-400" : "text-purple-600"}`}
            >
              Manage
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className={`relative flex items-center gap-3 p-2.5 pr-4 rounded-xl border transition-all ${
                  src.connected
                    ? isDark
                      ? "bg-zinc-800/50 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                      : "bg-emerald-50/50 border-emerald-200 shadow-sm"
                    : isDark
                      ? "bg-[#0a0a0c] border-zinc-800 opacity-50"
                      : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                {src.connected && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#18181b] animate-pulse" />
                )}
                <PlatformIcon
                  id={src.id}
                  connected={src.connected}
                  isDark={isDark}
                  size="standard"
                />
                <div>
                  <p
                    className={`text-xs font-bold leading-none ${isDark ? "text-zinc-200" : "text-slate-700"}`}
                  >
                    {src.name}
                  </p>
                  <p
                    className={`text-[9px] mt-1 truncate max-w-[120px] ${isDark ? "text-zinc-500" : "text-slate-400"}`}
                  >
                    {src.connected ? src.email || "Synced" : "Not Connected"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column (Unified Timeline & Quick Actions) */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
        {/* Unified Timeline */}
        <section
          className={`p-5 rounded-2xl border shadow-sm flex flex-col h-[500px] ${
            isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
          }`}
        >
          <div className="flex justify-between items-center mb-5 shrink-0">
            <h4
              className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
              >
                stream
              </span>
              Unified Feed
            </h4>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              Live
            </span>
          </div>

          <div
            className={`flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5 relative before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[1.5px] ${
              isDark ? "before:bg-zinc-800" : "before:bg-slate-100"
            }`}
          >
            {timeline.length === 0 && (
              <p className={`text-xs italic pl-5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                No events detected yet.
              </p>
            )}
            {timeline.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex relative pl-5 group animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <div
                  className={`absolute left-0 top-[5px] w-2.5 h-2.5 rounded-full border-2 ${isDark ? "border-[#18181b]" : "border-white"} ${isDark ? item.dotColorDark || "bg-blue-400" : item.dotColorLight || "bg-blue-500"} group-hover:scale-125 transition-transform z-10 shadow-sm`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex gap-2 items-center">
                      <PlatformIcon
                        id={
                          item.type.toLowerCase().includes("gmail") ||
                          item.type.toLowerCase().includes("email")
                            ? "gmail"
                            : item.type.toLowerCase().includes("calendar")
                              ? "calendar"
                              : item.type.toLowerCase().includes("slack")
                                ? "slack"
                                : item.type.toLowerCase().includes("drive")
                                  ? "drive"
                                  : "calendar"
                        }
                        connected={true}
                        isDark={isDark}
                        size="timeline"
                      />
                      <span
                        className={`text-[10px] font-bold ${item.isAI ? (isDark ? "text-rose-400" : "text-rose-600") : isDark ? "text-violet-400" : "text-purple-600"}`}
                      >
                        {item.time}
                      </span>
                    </div>
                    {item.isAI && (
                      <span
                        className={`material-symbols-outlined text-[12px] ${isDark ? "text-rose-400" : "text-rose-500"}`}
                      >
                        auto_awesome
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-bold leading-snug line-clamp-2 ${isDark ? "text-zinc-200" : "text-slate-800"}`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section
          className={`p-4 rounded-2xl border shadow-sm ${
            isDark ? "bg-[#18181b] border-zinc-800" : "bg-white border-slate-100"
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Smart Reply", icon: "edit_square" },
              { label: "Find Time", icon: "event" },
              { label: "AI Summary", icon: "summarize" },
              { label: "Deep Focus", icon: "headphones" },
            ].map((act, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (act.label === "AI Summary" || act.label === "Smart Reply")
                    setActivePage("chat");
                }}
                className={`p-2.5 border rounded-xl flex flex-col items-start gap-1 transition-all active:scale-[0.98] text-xs font-bold ${
                  isDark
                    ? "bg-[#0a0a0c]/80 border-zinc-800 text-zinc-400 hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-400"
                    : "bg-slate-50 border-slate-100 hover:bg-purple-50/80 hover:border-purple-500/30 hover:text-purple-600 text-slate-600"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${isDark ? "text-violet-400" : "text-purple-600"}`}
                >
                  {act.icon}
                </span>
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
export { Dashboard };
