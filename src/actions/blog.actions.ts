"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createBlogPostSchema, blogCommentSchema } from "@/validations/blog.schema";
import { createBlogPost, addBlogComment, togglePublishBlogPost, getBlogPostDetail } from "@/data";
import db from "@/shared/lib/prisma";

// Helper to generate a URL friendly slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

export async function createBlogPostAction(values: z.infer<typeof createBlogPostSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createBlogPostSchema.parse(values);

    let baseSlug = slugify(validated.title);
    if (!baseSlug) baseSlug = "post";
    
    // Check if slug exists, add unique suffix if it does
    let slug = baseSlug;
    let count = 1;
    while (true) {
      const existing = await db.blogPost.findUnique({
        where: { slug },
      });
      if (!existing) break;
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const post = await createBlogPost(
      user.id!,
      validated.title,
      slug,
      validated.content,
      validated.excerpt,
      validated.coverImage
    );

    revalidatePath("/blog");
    return post;
  });
}

export async function addBlogCommentAction(postId: string, values: z.infer<typeof blogCommentSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = blogCommentSchema.parse(values);

    const comment = await addBlogComment(postId, user.id!, validated.content);
    
    const post = await db.blogPost.findUnique({
      where: { id: postId },
      select: { slug: true },
    });

    if (post) {
      revalidatePath(`/blog/${post.slug}`);
    }
    return comment;
  });
}

export async function togglePublishBlogPostAction(id: string, published: boolean) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    // Check if user is admin or author
    const post = await db.blogPost.findUnique({
      where: { id },
      select: { authorId: true, slug: true },
    });

    if (!post) {
      throw new Error("Blog post not found.");
    }

    if (post.authorId !== user.id && user.role !== "ADMIN") {
      throw new Error("You do not have permission to publish this post.");
    }

    const updated = await togglePublishBlogPost(id, published);
    
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return updated;
  });
}
