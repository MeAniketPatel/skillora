import ContactForm from "@/components/contact/contact-form";
import { Mail, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Questions? We&apos;d love to hear from you. Send a message and
              we&apos;ll reply within 2 business days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    support@skillora.example
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">
                    Remote — distributed team
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
