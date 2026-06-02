import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, ArrowRight, ExternalLink } from "lucide-react";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function StudentCertificatesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const certificates = await db.certificate.findMany({
    where: {
      enrollment: {
        userId: session.user.id,
      },
    },
    include: {
      enrollment: {
        include: {
          course: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-sm text-neutral-500">View and verify your earned certificates of course completion.</p>
      </div>

      {certificates.length === 0 ? (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Award className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mb-4" />
            <h3 className="font-semibold text-base text-neutral-700 dark:text-neutral-300">No certificates yet</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm">
              Complete a course syllabus with 100% progress and assessments to earn your first certified credential.
            </p>
            <Button className="mt-6 font-semibold" nativeButton={false} render={<Link href="/courses" />}>
              Explore Courses <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">{cert.enrollment.course.title}</CardTitle>
                <CardDescription className="text-xs">
                  Issued on: {new Date(cert.issuedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-neutral-400 font-mono tracking-tight">ID: {cert.certificateId}</span>
                <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/certificates/${cert.certificateId}`} target="_blank" />}>
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> Verify Credential
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
