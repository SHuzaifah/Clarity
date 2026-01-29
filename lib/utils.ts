import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: string | number): string {
  if (!duration) return "";

  // Handle seconds (number or string number)
  if (typeof duration === 'number' || !isNaN(Number(duration))) {
    const seconds = Number(duration);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Handle ISO 8601 (PT1H2M3S)
  if (typeof duration === 'string' && duration.startsWith('PT')) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "";

    const h = (match[1] || '').replace('H', '');
    const m = (match[2] || '').replace('M', '');
    const s = (match[3] || '').replace('S', '');

    const hours = parseInt(h || '0');
    const minutes = parseInt(m || '0');
    const seconds = parseInt(s || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return String(duration);
}
