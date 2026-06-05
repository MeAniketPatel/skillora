import React from "react";
import { requireAdmin } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rss, Star, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminBlogPage() {
  await requireAdmin();

  // Mock posts as the full blog model is implemented in later phases
  const mockPosts = [
    {
      id: "blog_1",
      title: "Mastering Next.js 15 App Router Patterns",
      author: "Sarah Connor (Teacher)",
      publishedAt: "2026-06-01",
      status: "PUBLISHED",
    },
    {
      id: "blog_2",
      title: "How I Landed a Frontend Dev Role in 6 Months",
      author: "Alex Mercer (Student)",
      publishedAt: "2026-06-03",
      status: "UNDER_REVIEW",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Blog Editorial Control"
        description="Moderate platform publications, approve articles written by students/teachers, and manage publication queues."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full flex items-center justify-center">
              <Rss className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Total Articles</p>
              <h3 className="text-xl font-bold">48</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Pending Review</p>
              <h3 className="text-xl font-bold">3</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Monthly Readers</p>
              <h3 className="text-xl font-bold">12.5K</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-transparent">
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Article Title</TableHead>
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Author</TableHead>
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Created At</TableHead>
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Status</TableHead>
                <TableHead className="px-6 py-4 text-right font-bold text-neutral-500 text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPosts.map((post) => (
                <TableRow key={post.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50">
                  <TableCell className="px-6 py-4 font-semibold text-xs text-neutral-850 dark:text-neutral-550">
                    {post.title}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-neutral-500">
                    {post.author}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-neutral-550">
                    <span className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {post.publishedAt}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`text-[10px] font-bold border-none ${
                      post.status === "PUBLISHED"
                        ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                    }`}>
                      {post.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 rounded-xl text-xs text-indigo-500">
                      Moderate Post
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
