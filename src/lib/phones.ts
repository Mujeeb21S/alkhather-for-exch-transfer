export function intlPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("967")) return `+${digits}`;
  if (digits.startsWith("0")) return `+967${digits.slice(1)}`;
  return `+${digits}`;
}

export function phoneParts(value: string): string[] {
  return value.split(/[^\d+]+/).map((part) => part.trim()).filter((part) => part.replace(/\D/g, "").length >= 5);
}

export function mapsSearch(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}، اليمن`)}`;
}

export function openNow(hours: string, now = new Date()): boolean | null {
  const match = hours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Aden",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
  const [hh, mm] = clock.split(":").map(Number);
  const cur = hh * 60 + mm;
  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);
  if (end === start) return null;
  if (end < start) return cur >= start || cur < end;
  return cur >= start && cur < end;
}
