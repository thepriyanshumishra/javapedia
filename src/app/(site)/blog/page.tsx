import { blogSource } from "@/lib/source";
import { BlogPosts } from "@/components/blog/blog-posts";

export default function BlogPage() {
  const posts = blogSource.getPages().sort((a, b) => {
    if (!a.data.date || !b.data.date) return 0;
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  // Serialize dates to strings to avoid passing Date objects to Client Components
  const serializedPosts = posts.map((post) => ({
    url: post.url,
    data: {
      title: post.data.title,
      description: post.data.description,
      date: post.data.date ? new Date(post.data.date).toISOString() : undefined,
      author: post.data.author,
    },
  }));

  return <BlogPosts posts={serializedPosts} />;
}
