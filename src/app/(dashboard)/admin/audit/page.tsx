import React from "react";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getAuditLogs } from "@/features/admin";
import { PageHeader } from "@/shared/components/shared/page-header";
import { AuditLogTable } from "@/features/admin";
import { Pagination } from "@/shared/components/shared/pagination";
import { AuthAuditAction } from "@/features/auth";
interface PageProps {
  searchParams: Promise<{
    page?: string;
    action?: string;
  }>;
}

export default async function AdminAuditPage({ searchParams }: PageProps) {
  // Validate that user is Admin
  await requireAdmin();

  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const actionParam = resolvedSearchParams.action as AuthAuditAction | undefined;

  const { logs, total, pages } = await getAuditLogs({
    page,
    limit: 15,
    action: actionParam,
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Security & System Audit Logs"
        description={`Track system access controls, security incidents, and operational changes. Total records: ${total}`}
      />

      <AuditLogTable logs={logs as any} />

      {pages > 1 && (
        <div className="mt-4">
          <Pagination totalPages={pages} currentPage={page} />
        </div>
      )}
    </div>
  );
}
