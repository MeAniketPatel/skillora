import { getDiscussionsList } from "@/features/discussions/server";
import { DiscussionList } from "@/features/discussions/server";
import { DiscussionEditor } from "@/features/discussions/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessageSquare, Flame } from "lucide-react";

export const metadata = {
  title: "Discussions Forum | Skillora",
  description: "Join community discussions, ask questions, and share knowledge with other learners.",
};

export default async function DiscussionsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const discussions = await getDiscussionsList();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-amber-500" />
            Discussions Forum
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Connect with peers, collaborate on coursework, and seek/share wisdom.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <DiscussionList discussions={discussions} />
        </div>

        {/* Sidebar Forum Actions */}
        <div className="space-y-6">
          <DiscussionEditor />
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" /> Forum Guidelines
            </h4>
            <ul className="text-[10px] text-neutral-500 space-y-2 list-disc list-inside">
              <li>Be respectful and constructive in all communication.</li>
              <li>Use search before posting to check if a question is answered.</li>
              <li>Tag code block formats correctly for technical questions.</li>
              <li>Keep topics related to the courses and skill concepts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

