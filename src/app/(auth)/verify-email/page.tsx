import { Suspense } from "react";
import VerifyEmailForm from "@/features/auth/components/verify-email-form";
import { Loader2 } from "lucide-react";

export default async function VerifyEmailPage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token || null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <VerifyEmailForm token={token} />
      </Suspense>
    </div>
  );
}
