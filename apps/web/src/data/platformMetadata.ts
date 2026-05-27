export type PlatformId = 'gmail' | 'calendar' | 'slack' | 'drive' | 'keep' | 'default';

export interface PlatformMeta {
  id: PlatformId;
  label: string;
  brandColor: string;
  glowClassLight: string;
  glowClassDark: string;
  borderClassLight: string;
  borderClassDark: string;
  bgClassLight: string;
  bgClassDark: string;
  description: string;
  svg: string; // The inner path content of the SVG (assuming viewBox="0 0 24 24")
}

export const platformMetadata: Record<PlatformId, PlatformMeta> = {
  gmail: {
    id: 'gmail',
    label: 'Gmail',
    brandColor: '#EA4335',
    glowClassLight: 'shadow-[0_0_10px_rgba(234,67,53,0.2)]',
    glowClassDark: 'shadow-[0_0_15px_rgba(234,67,53,0.3)]',
    borderClassLight: 'border-red-200',
    borderClassDark: 'border-red-500/30',
    bgClassLight: 'bg-red-50/50',
    bgClassDark: 'bg-red-950/20',
    description: 'Aggregating meeting requests, travel confirmations, and high-priority threads.',
    svg: `<path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/><path fill="#34A853" d="M24 5.457v6.273L18.545 6.82V2.843l3.927 1.486c.943.357 1.528 1.251 1.528 2.274z" opacity=".2"/><path fill="#4285F4" d="M0 5.457v6.273L5.455 6.82V2.843L1.528 4.33C.585 4.686 0 5.58 0 6.603v-1.146z" opacity=".2"/>`
  },
  calendar: {
    id: 'calendar',
    label: 'Google Calendar',
    brandColor: '#4285F4',
    glowClassLight: 'shadow-[0_0_10px_rgba(66,133,244,0.2)]',
    glowClassDark: 'shadow-[0_0_15px_rgba(66,133,244,0.3)]',
    borderClassLight: 'border-blue-200',
    borderClassDark: 'border-blue-500/30',
    bgClassLight: 'bg-blue-50/50',
    bgClassDark: 'bg-blue-950/20',
    description: 'Syncing primary and shared calendars for schedule optimization.',
    svg: `<path fill="#4285F4" d="M17.143 2.571h-1.714V.857h-1.715v1.714H10.286V.857H8.571v1.714H6.857A2.57 2.57 0 0 0 4.286 5.143v14.571A2.57 2.57 0 0 0 6.857 22.286h10.286a2.57 2.57 0 0 0 2.571-2.572V5.143a2.57 2.57 0 0 0-2.571-2.572zm.857 17.143a.857.857 0 0 1-.857.858H6.857a.857.857 0 0 1-.857-.858V9.429h12v10.285zm0-12H5.143V5.143a.857.857 0 0 1 .857-.857h1.714v1.714h1.715V4.286h3.428v1.714h1.715V4.286h1.714a.857.857 0 0 1 .857.857v2.571z"/>`
  },
  slack: {
    id: 'slack',
    label: 'Slack',
    brandColor: '#4A154B',
    glowClassLight: 'shadow-[0_0_10px_rgba(74,21,75,0.2)]',
    glowClassDark: 'shadow-[0_0_15px_rgba(224,30,90,0.3)]', // E01E5A
    borderClassLight: 'border-fuchsia-200',
    borderClassDark: 'border-fuchsia-500/30',
    bgClassLight: 'bg-fuchsia-50/50',
    bgClassDark: 'bg-fuchsia-950/20',
    description: 'Extracting action items and deadline mentions from active workspace channels.',
    svg: `<path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"/><path fill="#E01E5A" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/><path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"/><path fill="#36C5F0" d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/><path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522v-2.521z"/><path fill="#2EB67D" d="M17.685 8.834a2.528 2.528 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.522 2.522v6.312z"/><path fill="#ECB22E" d="M15.163 18.956a2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.522-2.521v-2.522h2.522z"/><path fill="#ECB22E" d="M15.163 17.685a2.528 2.528 0 0 1-2.522-2.52 2.528 2.528 0 0 1 2.522-2.522h6.315A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.52h-6.315z"/>`
  },
  drive: {
    id: 'drive',
    label: 'Google Drive',
    brandColor: '#FFC107',
    glowClassLight: 'shadow-[0_0_10px_rgba(255,193,7,0.2)]',
    glowClassDark: 'shadow-[0_0_15px_rgba(255,193,7,0.3)]',
    borderClassLight: 'border-yellow-200',
    borderClassDark: 'border-yellow-500/30',
    bgClassLight: 'bg-yellow-50/50',
    bgClassDark: 'bg-yellow-950/20',
    description: 'Scanning PDFs, Docs, and spreadsheets for project context and data points.',
    svg: `<path fill="#FFC107" d="M15.827 8l-4.225-7.319H3.148L7.373 8z"/><path fill="#1976D2" d="M15.827 8H24l-4.227 7.318H11.6z"/><path fill="#4CAF50" d="M7.373 8L3.148.681.01 6.113l7.363 12.756z"/>`
  },
  keep: {
    id: 'keep',
    label: 'Google Keep',
    brandColor: '#FFBA00',
    glowClassLight: 'shadow-[0_0_10px_rgba(255,186,0,0.2)]',
    glowClassDark: 'shadow-[0_0_15px_rgba(255,186,0,0.3)]',
    borderClassLight: 'border-amber-200',
    borderClassDark: 'border-amber-500/30',
    bgClassLight: 'bg-amber-50/50',
    bgClassDark: 'bg-amber-950/20',
    description: 'Syncing personal ideation and scratchpads for long-term goal alignment.',
    svg: `<path fill="#FFBA00" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`
  },
  default: {
    id: 'default',
    label: 'App',
    brandColor: '#6B7280',
    glowClassLight: 'shadow-sm',
    glowClassDark: 'shadow-none',
    borderClassLight: 'border-slate-200',
    borderClassDark: 'border-zinc-700',
    bgClassLight: 'bg-slate-50',
    bgClassDark: 'bg-zinc-800',
    description: 'Generic connected source.',
    svg: `<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>`
  }
};
