import { notFound } from "next/navigation";
import { Award, ShieldCheck } from "lucide-react";
import { getCertificateById } from "@/features/certificates/server";
import { CertificateActions } from "@/features/certificates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface CertificatePageProps {
  params: Promise<{
    certificateId: string;
  }>;
}

export default async function CertificateVerificationPage({ params }: CertificatePageProps) {
  const { certificateId } = await params;

  const certificate = await getCertificateById(certificateId);

  if (!certificate) {
    notFound();
  }

  const { enrollment } = certificate;
  const studentName = enrollment.user.name || enrollment.user.email;
  const courseTitle = enrollment.course.title;
  const teacherName = enrollment.course.teacher.name || "Instructor";
  const completionDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const verifyUrl = `https://skillora.vercel.app/certificates/${certificateId}`;

  return (
    <>
      <main className="flex items-center justify-center p-6 md:p-10">
        <Card className="max-w-3xl w-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-2xl relative overflow-hidden p-8 md:p-12 text-center rounded-2xl">
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

          {/* Skillora Branding at Top */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Skillora
            </span>
          </div>

          <CardHeader className="space-y-2 pb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 animate-pulse">
              <Award className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Certificate of Completion</CardTitle>
            <CardDescription className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">
              Skillora Verified Credential
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-neutral-500 text-sm italic">This is to certify that</p>
            <h2 className="text-4xl font-extrabold text-neutral-900 dark:text-white my-4 font-serif">
              {studentName}
            </h2>
            <p className="text-neutral-500 text-sm italic max-w-lg mx-auto">
              has successfully completed all requirements and assessments for the online curriculum program
            </p>
            <h3 className="text-2xl font-bold text-primary max-w-xl mx-auto my-4">
              {courseTitle}
            </h3>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-neutral-100 dark:border-neutral-800/80 max-w-md mx-auto">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Date Issued</span>
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-1 block">
                  {completionDate}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Instructor</span>
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mt-1 block">
                  {teacherName}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-full w-fit mx-auto mt-8">
              <ShieldCheck className="h-4 w-4" />
              <span>Verifiable Credential ID: {certificateId}</span>
            </div>

            <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800/80">
              <CertificateActions
                studentName={studentName}
                courseTitle={courseTitle}
                instructorName={teacherName}
                issueDate={completionDate}
                certificateId={certificateId}
                verifyUrl={verifyUrl}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
