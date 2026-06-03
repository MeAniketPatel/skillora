import { requireAuth } from "@/lib/auth-helpers";
import { getUserWishlist } from "@/data";
import { DataTable } from "@/components/shared/data-table";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/actions";

export default async function StudentWishlistPage() {
  const user = await requireAuth();
  const wishlist = await getUserWishlist(user.id);

  const columns = [
    {
      header: "Course",
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          {item.course.thumbnail && (
            <img src={item.course.thumbnail} alt={item.course.title} className="w-16 h-12 object-cover rounded" />
          )}
          <div>
            <div className="font-medium">{item.course.title}</div>
            <div className="text-sm text-muted-foreground">{item.course.teacher.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      cell: (item: any) => (
        <span className="font-semibold">
          {item.course.price === 0 ? "Free" : `$${item.course.price?.toFixed(2)}`}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <Link href={`/courses/${item.course.slug}`}>View</Link>
          </Button>
          <form action={async () => {
            "use server";
            await toggleWishlist(item.course.id);
          }}>
            <Button size="sm" variant="destructive">Remove</Button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Wishlist</h1>
        <p className="text-muted-foreground">Courses you have saved for later.</p>
      </div>
      <DataTable 
        data={wishlist} 
        columns={columns} 
        emptyIcon={Heart}
        emptyTitle="Wishlist is empty"
        emptyDescription="You haven't saved any courses yet."
        emptyAction={
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        }
      />
    </div>
  );
}
