import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Testimonial } from "@/types/marketing.types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = (testimonial.name || "U")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full border-border/60 bg-card/80 backdrop-blur">
      <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-4 w-4 ${
                  idx < testimonial.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <blockquote className="text-sm leading-relaxed text-foreground">
            “{testimonial.quote}”
          </blockquote>
          {testimonial.highlight && (
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              {testimonial.highlight}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border/60 pt-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={testimonial.avatarUrl || undefined} alt={testimonial.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
