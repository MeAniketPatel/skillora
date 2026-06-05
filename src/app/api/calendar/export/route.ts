import { NextRequest, NextResponse } from "next/server";
import { getLiveSessions } from "@/features/courses/server";
import { generateICSFile, CalendarEvent } from "@/lib/calendar-export";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") || undefined;

  try {
    const dbSessions = await getLiveSessions(courseId);
    const events: CalendarEvent[] = dbSessions.map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.meetUrl,
    }));

    const icsContent = generateICSFile(events);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="calendar-${courseId || "all"}.ics"`,
      },
    });
  } catch (error) {
    console.error("Error generating calendar:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
