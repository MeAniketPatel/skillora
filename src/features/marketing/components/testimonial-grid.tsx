import { TestimonialCard } from "./testimonial-card";
import type { Testimonial } from "@/types/marketing.types";

export function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Trusted by thousands
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            What our community says
          </h2>
        </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id ?? testimonial.name}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}
