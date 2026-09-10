const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const dayFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function formatTime(iso: string) {
  return timeFmt.format(new Date(iso));
}

export function formatDay(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return dayFmt.format(date);
}

export function sameMinuteWindow(a: string, b: string, minutes = 5) {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) < minutes * 60_000;
}
