import { requireAuth } from "@/lib/auth-helpers";
import { getUserCertificates } from "@/data";
import { DataTable } from "@/components/shared/data-table";
import { Award } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudentCertificatesPage() {
  const user = await requireAuth();
  const certificates = await getUserCertificates(user.id);

  const columns = [
    {
      header: "Course",
      cell: (item: any) => <span className="font-medium">{item.enrollment.course.title}</span>,
    },
    {
      header: "Issued On",
      cell: (item: any) => format(new Date(item.issuedAt), "MMMM d, yyyy"),
    },
    {
      header: "Certificate ID",
      cell: (item: any) => <span className="font-mono text-sm">{item.certificateId}</span>,
    },
    {
      header: "Action",
      cell: (item: any) => (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/certificates/${item.certificateId}`} target="_blank">
            View Certificate
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-muted-foreground">View and download your earned certificates.</p>
      </div>
      <DataTable 
        data={certificates} 
        columns={columns} 
        emptyIcon={Award}
        emptyTitle="No certificates yet"
        emptyDescription="Complete a course 100% to earn a certificate."
      />
    </div>
  );
}
