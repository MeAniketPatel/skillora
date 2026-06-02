import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <CardTitle className="text-5xl">404</CardTitle>
          <CardDescription className="mt-2">
            We couldn't find that page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-neutral-600">
            Try returning to the homepage or contact us if you think this is an
            error.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/">
              <Button>Home</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
