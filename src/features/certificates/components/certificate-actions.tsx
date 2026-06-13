"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { generateCertificatePDF } from "@/lib/pdf-generator";
import { toast } from "sonner";

interface CertificateActionsProps {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  certificateId: string;
  verifyUrl: string;
}

export default function CertificateActions({
  studentName,
  courseTitle,
  instructorName,
  issueDate,
  certificateId,
  verifyUrl,
}: CertificateActionsProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const doc = await generateCertificatePDF({
        studentName,
        courseTitle,
        instructorName,
        issueDate,
        certificateId,
        verifyUrl,
      });
      doc.save(`certificate-${certificateId}.pdf`);
      toast.success("Certificate downloaded!");
    } catch {
      toast.error("Failed to generate certificate");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={downloading} size="lg" className="gap-2">
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {downloading ? "Generating..." : "Download Certificate"}
    </Button>
  );
}
