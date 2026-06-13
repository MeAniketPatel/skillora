"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function CertificateVerifyPage() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState("");

  const handleVerify = () => {
    const trimmed = certificateId.trim();
    if (!trimmed) return;
    router.push(`/certificates/${trimmed}`);
  };

  return (
    <main className="flex items-center justify-center p-6 md:p-10 min-h-screen">
      <Card className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">Verify a Certificate</CardTitle>
          <CardDescription>
            Enter the certificate ID to verify its authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter certificate ID (e.g. CERT-XXXXX)"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleVerify(); }}
          />
          <Button onClick={handleVerify} disabled={!certificateId.trim()} className="w-full">
            Verify Certificate
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
