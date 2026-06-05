// Auto-generated barrel: re-exports all repositories for the blog feature.
export * from "./repositories/blog.repository";

// Components
export { BlogCard } from "./components/blog-card";
export { BlogComments } from "./components/blog-comments";
export { BlogEditor } from "./components/blog-editor";

// Services
export { blogService } from "./services/blog.service";
export type { BlogService } from "./services/blog.service";

// Permissions
export { canBlog as canBlog, assertBlogAccess } from "./permissions/blog.permissions";

// Contracts
export { createBlogSchema, updateBlogSchema, listBlogQuerySchema } from "./contracts/blog.contract";
export type { CreateBlogInput, UpdateBlogInput, ListBlogQuery } from "./contracts/blog.contract";

// Hooks
export {  useBlogList, useBlogDetail, useBlogCreate, useBlogUpdate, useBlogDelete } from "./hooks/use-blog";

