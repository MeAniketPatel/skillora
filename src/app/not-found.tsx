import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import LinkButton from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-heading">Page not found</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Oops — we couldn't find the page you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-neutral-600">
            Try returning to the homepage, searching, or contact us if you
            believe this is an error.
          </p>
          <div className="flex items-center justify-center gap-3">
            <LinkButton href="/" size="lg">
              Go home
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Contact Support
            </LinkButton>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
