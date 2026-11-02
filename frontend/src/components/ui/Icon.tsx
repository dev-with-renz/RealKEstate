import type { ReactNode } from "react";

export type IconName =
  | "menu" | "close" | "search" | "pin" | "phone" | "mail" | "arrow-right" | "chevron-left" | "chevron-right"
  | "chevron-down" | "home" | "building" | "bed" | "check" | "sparkle" | "wallet" | "shield" | "heart"
  | "school" | "hospital" | "landmark" | "cart" | "bag" | "download" | "send" | "file" | "clock" | "layers";

const PATHS: Record<IconName, ReactNode> = {
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>),
  pin: (<><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "chevron-left": <path d="M15 6l-6 6 6 6" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />,
  building: (<><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" /></>),
  bed: <path d="M3 18V7M3 14h18v4M21 18v-5a3 3 0 00-3-3h-7v4" />,
  check: <path d="M5 12l5 5 9-10" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />,
  wallet: (<><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18M16 14.5h2" /></>),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />,
  heart: <path d="M12 20s-7-4.6-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.4-7 10-7 10z" />,
  school: <path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />,
  hospital: (<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>),
  landmark: <path d="M3 10l9-6 9 6H3zM5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" />,
  cart: (<><path d="M3 4h2l2.5 11h10L20 7H6.5" /><circle cx="9" cy="19" r="1.3" /><circle cx="17" cy="19" r="1.3" /></>),
  bag: <path d="M5 8h14l-1 12H6zM9 8a3 3 0 016 0" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  send: <path d="M4 12l16-8-6 16-3-6z" />,
  file: <path d="M7 3h7l5 5v13H7zM14 3v5h5" />,
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  layers: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
};

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ name, className = "size-5", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
