import { getPublishedCourses, getAllCategories } from "@/data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CourseCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryId, q } = await searchParams;
  
  const categories = await getAllCategories();
  const { courses } = await getPublishedCourses({
    categoryId: categoryId as string,
    query: q as string,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-muted-foreground mt-2">Find the perfect course to advance your skills.</p>
        </div>
        <form className="flex w-full md:w-auto gap-2">
          <input 
            type="search" 
            name="q" 
            defaultValue={q as string}
            placeholder="Search courses..." 
            className="flex h-10 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={!categoryId ? "default" : "outline"} asChild className="rounded-full">
          <Link href="/courses">All Categories</Link>
        </Button>
        {categories.map((c) => (
          <Button key={c.id} variant={categoryId === c.id ? "default" : "outline"} asChild className="rounded-full">
            <Link href={`/courses?categoryId=${c.id}`}>{c.name}</Link>
          </Button>
        ))}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all group">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <BookOpen className="h-10 w-10 text-muted-foreground opacity-50" />
                    </div>
                  )}
                  {course.category && (
                    <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur text-foreground hover:bg-background/90">
                      {course.category.name}
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-4 pb-2">
                  <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.teacher?.name}</p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-xs text-muted-foreground gap-4 mt-2">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course._count?.enrollments || 0} students</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Self-paced</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t flex items-center justify-between mt-auto bg-muted/10">
                  <span className="font-bold text-lg">
                    {course.price === 0 || course.price === null ? "Free" : `$${course.price.toFixed(2)}`}
                  </span>
                  <span className="text-primary text-sm font-medium">View Course &rarr;</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
