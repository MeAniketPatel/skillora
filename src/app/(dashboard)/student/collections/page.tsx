import React from "react";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserCollections } from "@/features/students";
import { PageHeader } from "@/shared/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { CreateCollectionForm } from "@/features/students";
import { CourseCollections } from "@/features/students";

export default async function CollectionsPage() {
  const user = await requireAuth();
  const collections = await getUserCollections(user.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="My Playlists"
        description="Organize and sequence courses into customized study collections."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Create collection form */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">New Playlist</CardTitle>
              <CardDescription>Assemble a new track of study material.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCollectionForm />
            </CardContent>
          </Card>
        </div>

        {/* Right column: Playlists list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold tracking-tight px-1">Curated Tracks</h3>
          <CourseCollections collections={collections} />
        </div>
      </div>
    </div>
  );
}
