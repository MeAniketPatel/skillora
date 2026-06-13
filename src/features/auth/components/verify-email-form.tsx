"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail, sendVerificationEmail } from "@/features/auth/actions/auth.actions";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

export default function VerifyEmailForm({ token }: { token: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    console.log("%c[DEV] Verifying email with token:", "color:blue;font-weight:bold", token);

    verifyEmail(token).then((res) => {
      if (res.success) {
        setStatus("success");
        setMessage(res.data?.success || "Email verified!");
        console.log("%c[DEV] Email verification successful!", "color:green;font-weight:bold");
      } else {
        setStatus("error");
        setMessage(res.error || "Verification failed.");
        console.log("%c[DEV] Email verification failed:", "color:red;font-weight:bold", res.error);
      }
    });
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await sendVerificationEmail(token || "");
      if (res.success) {
        setMessage("Verification email resent! Check console.");
        console.log("%c[DEV] Resent verification email", "color:green;font-weight:bold");
      }
    } catch {
      setMessage("Failed to resend. Try again.");
    }
    setResending(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
          {status === "success" && <CheckCircle2 className="h-12 w-12 text-green-500" />}
          {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>
        <CardTitle>
          {status === "loading" && "Verifying your email..."}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === "success" && (
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        )}
        {status === "error" && (
          <>
            <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
              Back to Login
            </Button>
            {token && (
              <Button onClick={handleResend} disabled={resending} variant="secondary" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                {resending ? "Sending..." : "Resend Verification Email"}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
