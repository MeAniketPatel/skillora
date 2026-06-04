import { PageHeader } from "@/components/shared/page-header";
import { getAuditLogs } from "@/data/audit.data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";

interface AdminAuditPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminAuditPage({ searchParams }: AdminAuditPageProps) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  const limit = 20;

  const { logs, pages } = await getAuditLogs({
    page,
    limit,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Security & System Audit Logs"
        description="Monitor login flows, administrative actions, and authorization updates across the application."
      />

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 italic text-sm">
              No audit logs have been recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <TableHead className="py-3.5 pl-6">Action / Event</TableHead>
                    <TableHead className="py-3.5">User</TableHead>
                    <TableHead className="py-3.5">IP Address</TableHead>
                    <TableHead className="py-3.5">Device / User Agent</TableHead>
                    <TableHead className="py-3.5 pr-6 text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10 text-xs">
                      <TableCell className="py-4 pl-6 font-bold text-neutral-800 dark:text-neutral-200">
                        <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px]">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-neutral-500 font-medium">
                        {log.user?.email || log.email || "System"}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-neutral-500 text-[10px]">
                        {log.ipAddress || "—"}
                      </TableCell>
                      <TableCell className="py-4 text-neutral-400 max-w-[200px] truncate" title={log.userAgent || ""}>
                        {log.userAgent || "—"}
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right text-neutral-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination totalPages={pages} currentPage={page} />
    </div>
  );
}
