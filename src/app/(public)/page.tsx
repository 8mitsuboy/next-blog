import { getPosts, searchPosts } from "@/lib/post";
import PostCard from "@/components/post/PostCard";
import { Post } from "@/types/post";

// 初期表示は何もparamsに渡ってこないのでオプション型にする
type SearchParams = {
  search?: string;
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.search || "";

  const posts = query
    ? await searchPosts(query)
    : ((await getPosts()) as Post[]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
