export interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  location?: string | null;
}

function formatToICSDate(date: Date): string {
  const d = new Date(date);
  const pad = (num: number) => String(num).padStart(2, "0");
  
  const year = d.getUTCFullYear();
  const month = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const hours = pad(d.getUTCHours());
  const minutes = pad(d.getUTCMinutes());
  const seconds = pad(d.getUTCSeconds());
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function generateICSFile(events: CalendarEvent[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Skillora//Calendar Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  events.forEach(event => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.id}@skillora.com`);
    lines.push(`DTSTAMP:${formatToICSDate(new Date())}`);
    lines.push(`DTSTART:${formatToICSDate(event.startTime)}`);
    lines.push(`DTEND:${formatToICSDate(event.endTime)}`);
    lines.push(`SUMMARY:${event.title.replace(/[,;]/g, "\\$&")}`);
    if (event.description) {
      lines.push(`DESCRIPTION:${event.description.replace(/[\n\r]/g, "\\n").replace(/[,;]/g, "\\$&")}`);
    }
    if (event.location) {
      lines.push(`LOCATION:${event.location.replace(/[,;]/g, "\\$&")}`);
    }
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
