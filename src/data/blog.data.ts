import db from "@/shared/lib/prisma";

export async function getBlogPosts(publishedOnly = true) {
  return db.blogPost.findMany({
    where: publishedOnly ? { published: true } : {},
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
}

export async function getBlogPostDetail(slug: string) {
  return db.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
          headline: true,
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
      },
    },
  });
}

export async function createBlogPost(
  authorId: string,
  title: string,
  slug: string,
  content: string,
  excerpt?: string | null,
  coverImage?: string | null
) {
  return db.blogPost.create({
    data: {
      authorId,
      title,
      slug,
      content,
      excerpt,
      coverImage,
    },
  });
}

export async function addBlogComment(postId: string, userId: string, content: string) {
  return db.blogComment.create({
    data: {
      postId,
      userId,
      content,
    },
  });
}

export async function togglePublishBlogPost(id: string, published: boolean) {
  return db.blogPost.update({
    where: { id },
    data: { published },
  });
}
