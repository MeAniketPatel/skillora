"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/components/ui/hover-card";
import { Calendar, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/shared/lib/utils";


interface AuditLog {
  id: string;
  action: string;
  userId: string | null;
  email: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: any;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
}

interface AuditLogTableProps {
  logs: AuditLog[];
}

const ACTION_TYPES = [
  "ALL",
  "REGISTER",
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT_SESSION",
  "PASSWORD_RESET_REQUESTED",
  "PASSWORD_RESET_COMPLETED",
  "USER_BANNED",
  "USER_UNBANNED",
  "COURSE_APPROVED",
  "COURSE_REJECTED",
  "ROLE_CHANGED",
];

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleActionChange = (action: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (action === "ALL") {
      params.delete("action");
    } else {
      params.set("action", action);
    }
    params.set("page", "1"); // reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500">Filter by Action:</span>
          <select
            value={searchParams.get("action") || "ALL"}
            onChange={(e) => handleActionChange(e.target.value)}
            className="h-9 px-3 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-xs font-semibold focus:outline-none"
          >
            {ACTION_TYPES.map((act) => (
              <option key={act} value={act}>
                {act.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 italic text-sm">
              No audit logs match the active filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                    <TableHead className="py-3.5 pl-6">Timestamp</TableHead>
                    <TableHead className="py-3.5">Action</TableHead>
                    <TableHead className="py-3.5">Actor User</TableHead>
                    <TableHead className="py-3.5">IP Address</TableHead>
                    <TableHead className="py-3.5">User Agent</TableHead>
                    <TableHead className="py-3.5 pr-6 text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const isFailure = log.action.includes("FAILED") || log.action.includes("REJECTED") || log.action.includes("BANNED");
                    return (
                      <TableRow key={log.id} className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/20 dark:hover:bg-neutral-950/10">
                        <TableCell className="py-3.5 pl-6 text-xs text-neutral-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-bold text-[10px] uppercase rounded-full border-none px-2 py-0.5",
                              isFailure
                                ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                            )}
                          >
                            {log.action.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3.5 text-xs">
                          {log.user ? (
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {log.user.name || "User"}
                              </span>
                              <span className="text-[10px] text-neutral-400">{log.user.email}</span>
                            </div>
                          ) : (
                            <span className="text-neutral-400 italic">
                              {log.email || "System/Anonymous"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5 text-xs text-neutral-500 font-mono">
                          {log.ipAddress || "—"}
                        </TableCell>
                        <TableCell className="py-3.5 text-[10px] text-neutral-400 max-w-[150px] truncate" title={log.userAgent || ""}>
                          {log.userAgent || "—"}
                        </TableCell>
                        <TableCell className="py-3.5 pr-6 text-right">
                          {log.metadata ? (
                            <HoverCard openDelay={200}>
                              <HoverCardTrigger asChild>
                                <button className="p-1 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                  <Info className="h-4 w-4" />
                                </button>
                              </HoverCardTrigger>
                              <HoverCardContent align="end" className="w-80 p-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-lg">
                                <div className="space-y-2">
                                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5">
                                    <ShieldAlert className="h-4 w-4 text-indigo-500" />
                                    Audit Payload Metadata
                                  </span>
                                  <pre className="text-[10px] font-mono bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap text-left text-neutral-600 dark:text-neutral-400">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ) : (
                            <span className="text-neutral-300">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
