// Auto-generated service wrapper for the blog feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as blogRepo from "../repositories/blog.repository";

export const blogService = {
  getBlogPosts: blogRepo.getBlogPosts,
  getBlogPostDetail: blogRepo.getBlogPostDetail,
  async createBlogPost(...args: Parameters<typeof blogRepo.createBlogPost>): Promise<Awaited<ReturnType<typeof blogRepo.createBlogPost>>> {
    const result = await blogRepo.createBlogPost(...args);
    await eventBus.emit({ name: "blog.createBlogPost", feature: "blog", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async addBlogComment(...args: Parameters<typeof blogRepo.addBlogComment>): Promise<Awaited<ReturnType<typeof blogRepo.addBlogComment>>> {
    const result = await blogRepo.addBlogComment(...args);
    await eventBus.emit({ name: "blog.addBlogComment", feature: "blog", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async togglePublishBlogPost(...args: Parameters<typeof blogRepo.togglePublishBlogPost>): Promise<Awaited<ReturnType<typeof blogRepo.togglePublishBlogPost>>> {
    const result = await blogRepo.togglePublishBlogPost(...args);
    await eventBus.emit({ name: "blog.togglePublishBlogPost", feature: "blog", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type BlogService = typeof blogService;
