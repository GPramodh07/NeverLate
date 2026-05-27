import { type PlatformId, platformMetadata } from '../data/platformMetadata';
import gmailSvg from '../assets/platforms/gmail.svg?raw';
import calendarSvg from '../assets/platforms/calendar.svg?raw';
import slackSvg from '../assets/platforms/slack.svg?raw';
import driveSvg from '../assets/platforms/drive.svg?raw';
import keepSvg from '../assets/platforms/keep.svg?raw';

const svgMap: Record<PlatformId, string> = {
  gmail: gmailSvg,
  calendar: calendarSvg,
  slack: slackSvg,
  drive: driveSvg,
  keep: keepSvg,
  default: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`
};

interface PlatformIconProps {
  id: string; // The id of the platform (e.g., 'gmail', 'calendar')
  connected?: boolean; // Whether the source is currently synced/active
  size?: 'compact' | 'timeline' | 'sidebar' | 'standard' | 'large'; // Different visual contexts
  isDark: boolean;
  className?: string;
  showPulse?: boolean; // explicit override to show the green connected pulse
}

export default function PlatformIcon({ 
  id, 
  connected = false, 
  size = 'standard', 
  isDark, 
  className = '',
  showPulse = false
}: PlatformIconProps) {
  const meta = platformMetadata[id as PlatformId] || platformMetadata.default;
  const svgContent = svgMap[id as PlatformId] || svgMap.default;

  // Determine sizing logic
  let wrapperSize = 'w-8 h-8';
  let svgSize = 'w-5 h-5';
  let padding = 'p-1.5';
  
  if (size === 'compact') {
    wrapperSize = 'w-6 h-6';
    svgSize = 'w-4 h-4';
    padding = 'p-1';
  } else if (size === 'timeline') {
    wrapperSize = 'w-7 h-7';
    svgSize = 'w-4 h-4';
    padding = 'p-1';
  } else if (size === 'sidebar') {
    wrapperSize = 'w-5 h-5';
    svgSize = 'w-3 h-3';
    padding = 'p-0.5';
  } else if (size === 'large') {
    wrapperSize = 'w-12 h-12';
    svgSize = 'w-7 h-7';
    padding = 'p-2';
  }

  // Connected styling
  const isActuallyConnected = connected;
  
  const connectedClasses = isActuallyConnected
    ? isDark 
      ? `opacity-100 ${meta.glowClassDark} border-emerald-500/30 ${meta.bgClassDark}` 
      : `opacity-100 ${meta.glowClassLight} border-emerald-200 ${meta.bgClassLight}`
    : isDark
      ? `opacity-50 grayscale border-zinc-800 bg-[#0a0a0c]`
      : `opacity-60 grayscale border-slate-200 bg-slate-50`;

  return (
    <div 
      title={meta.label}
      className={`relative flex items-center justify-center shrink-0 rounded-xl border transition-all duration-300 ${wrapperSize} ${padding} ${connectedClasses} ${className}`}
    >
      {(isActuallyConnected || showPulse) && size !== 'sidebar' && size !== 'compact' && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#18181b] animate-pulse z-10" />
      )}
      {svgContent ? (
        <div 
          className={`flex items-center justify-center [&>svg]:${svgSize.replace(' ', ' [&>svg]:')} [&>svg]:transition-transform group-hover:[&>svg]:scale-110 [&>svg]:w-full [&>svg]:h-full`}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <span className={`text-[10px] font-bold uppercase tracking-tighter opacity-70 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {meta.label.substring(0, 3)}
        </span>
      )}
    </div>
  );
}
