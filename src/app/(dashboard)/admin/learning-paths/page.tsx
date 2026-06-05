import React from "react";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Map, Plus, BookOpen, Layers } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default async function AdminLearningPathsPage() {
  await requireAdmin();

  // Mock paths since the model is created in later phases
  const mockPaths = [
    {
      id: "lp_1",
      title: "Frontend Engineering Career Path",
      courses: 4,
      students: 142,
      difficulty: "BEGINNER",
      status: "PUBLISHED",
    },
    {
      id: "lp_2",
      title: "Full-Stack Next.js Developer Journey",
      courses: 6,
      students: 98,
      difficulty: "ADVANCED",
      status: "DRAFT",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Learning Paths Administration"
          description="Design, group, and manage structured learning tracks composed of multiple courses."
        />
        <Button className="h-10 rounded-xl text-xs gap-2">
          <Plus className="h-4 w-4" />
          Create Path
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full flex items-center justify-center">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Total Paths</p>
              <h3 className="text-xl font-bold">{mockPaths.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-full flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Courses Associated</p>
              <h3 className="text-xl font-bold">10</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 bg-sky-50 dark:bg-sky-950/20 text-sky-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Enrolled Learners</p>
              <h3 className="text-xl font-bold">240</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-transparent">
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Path Title</TableHead>
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Courses Included</TableHead>
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Difficulty</TableHead>
                <TableHead className="px-6 py-4 font-bold text-neutral-500 text-xs">Status</TableHead>
                <TableHead className="px-6 py-4 text-right font-bold text-neutral-500 text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPaths.map((path) => (
                <TableRow key={path.id} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50">
                  <TableCell className="px-6 py-4 font-semibold text-xs text-neutral-850 dark:text-neutral-550">
                    {path.title}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-neutral-500">
                    {path.courses} courses
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {path.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`text-[10px] font-bold border-none ${
                      path.status === "PUBLISHED"
                        ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}>
                      {path.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 rounded-xl text-xs text-indigo-500">
                      Manage Path
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
