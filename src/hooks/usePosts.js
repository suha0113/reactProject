import { useLocalStorageState } from "./useLocalStorageState";

export function usePosts() {
  const [posts, setPosts] = useLocalStorageState("blog-posts", []);

  const createPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const updatePost = (post) => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return { posts, createPost, updatePost, deletePost };
}
