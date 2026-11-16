import HomeShell from "@/components/home/HomeShell";
import HomeStory from "@/components/home/HomeStory";
import { getLatestPosts } from "@/lib/log";

export default function Home() {
  // (05) From the log: latest published posts, none yet -> the block is not rendered.
  const posts = getLatestPosts(3);
  return (
    <HomeShell>
      <HomeStory posts={posts} />
    </HomeShell>
  );
}
