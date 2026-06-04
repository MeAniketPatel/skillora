import ical, { ICalEventStatus } from "ical-generator";

export interface CalendarEventData {
  id: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  location?: string | null;
  url?: string | null;
}

export function generateICalString(events: CalendarEventData[]): string {
  const calendar = ical({ name: "Skillora Learning Calendar" });

  events.forEach((event) => {
    calendar.createEvent({
      id: event.id,
      start: event.startTime,
      end: event.endTime,
      summary: event.title,
      description: event.description || undefined,
      location: event.location || undefined,
      url: event.url || undefined,
      status: ICalEventStatus.CONFIRMED,
    });
  });

  return calendar.toString();
}
