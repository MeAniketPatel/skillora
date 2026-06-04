"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContactForm } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Mail, MessageSquare, MapPin } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      const res = await submitContactForm(values);
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("We've received your message and will get back to you shortly.");
        form.reset();
      }
    } catch (err: any) {
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question about our platform, courses, or pricing? We're here to help. Fill out the form below and our team will respond within 24 hours.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="space-y-8 md:col-span-1">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email Us</h3>
              <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
              <a href="mailto:support@skillora.com" className="font-medium hover:text-primary transition-colors">support@skillora.com</a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Live Chat</h3>
              <p className="text-muted-foreground mb-1">Available Mon-Fri, 9am-5pm EST.</p>
              <button className="font-medium hover:text-primary transition-colors">Start a chat</button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Office</h3>
              <p className="text-muted-foreground mb-1">Come say hello at our HQ.</p>
              <address className="font-medium not-italic">
                100 Innovation Drive<br/>
                Tech City, TC 10101
              </address>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-card p-8 rounded-2xl shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" disabled={form.formState.isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" disabled={form.formState.isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="How can we help you?" disabled={form.formState.isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us a little more about what you need..." 
                        className="min-h-[150px] resize-none"
                        disabled={form.formState.isSubmitting} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full md:w-auto px-8" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
