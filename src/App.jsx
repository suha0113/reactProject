import { useState, useEffect } from "react";
import { BlogHeader } from "./components/BlogHeader";
import { CategoryNav } from "./components/CategoryNav";
import { PostList } from "./components/PostList";
import { PostEditor } from "./components/PostEditor";
import { ProfileEditor } from "./components/ProfileEditor";
import { MyInfo } from "./components/MyInfo";
import { PlaylistManager } from "./components/PlaylistManager";
import { pastelThemes, BORDER_COLOR } from "./themeColors";

const categories = [
  "\uc77c\uc0c1",
  "\ub9db\uc9d1",
  "\ub098\uc758 \ud50c\ub808\uc774\ub9ac\uc2a4\ud2b8",
  "\ub098\uc758 \uc815\ubcf4",
  "\uae30\ud0c0",
];

export default function App() {
  const [currentCategory, setCurrentCategory] = useState("\uc77c\uc0c1");
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("blog-posts");
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("blog-profile");
    return saved ? JSON.parse(saved) : { name: "\uc0ac\uc6a9\uc790" };
  });

  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("blog-userinfo");
    return saved
      ? JSON.parse(saved)
      : {
          name: "\uc0ac\uc6a9\uc790",
          hobbies: "\uc601\ud654\ubcf4\uae30, \ub178\ub798\ubd80\ub974\uae30",
          favoriteMovie: "\ud2b8\ub8e8\uba3c\uc1fc",
        };
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("blog-theme");
    const find = pastelThemes.find((t) => t.name === savedTheme);
    return find || pastelThemes[0];
  });
  const [editingPost, setEditingPost] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [playlist, setPlaylist] = useState(() => {
    const saved = localStorage.getItem("blog-playlist");
    return saved ? JSON.parse(saved) : [];
  });

  /* ----------------------- LocalStorage Save ------------------------ */
  useEffect(
    () => localStorage.setItem("blog-posts", JSON.stringify(posts)),
    [posts]
  );
  useEffect(
    () => localStorage.setItem("blog-profile", JSON.stringify(profile)),
    [profile]
  );
  useEffect(
    () => localStorage.setItem("blog-userinfo", JSON.stringify(userInfo)),
    [userInfo]
  );
  useEffect(() => localStorage.setItem("blog-theme", theme.name), [theme]);
  useEffect(
    () => localStorage.setItem("blog-playlist", JSON.stringify(playlist)),
    [playlist]
  );

  /* ----------------------- Handlers ------------------------ */
  const handleCreatePost = (post) => {
    const newPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setIsCreatingPost(false);
  };

  const handleUpdatePost = (post) => {
    setPosts(posts.map((p) => (p.id === post.id ? post : p)));
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsCreatingPost(false);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setIsCreatingPost(false);
  };

  const handleNewPost = () => {
    setIsCreatingPost(true);
    setEditingPost(null);
  };

  const handleAddSong = (song) => {
    const newSong = {
      ...song,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    setPlaylist([...playlist, newSong]);
  };

  const handleDeleteSong = (id) => {
    setPlaylist(playlist.filter((s) => s.id !== id));
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setIsCreatingPost(false);
    setEditingPost(null);
  };
  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: (theme?.color || "#fff") + "20" }}
    >
      <BlogHeader
        profile={profile}
        theme={theme}
        themes={pastelThemes}
        onThemeChange={setTheme}
        onEditProfile={() => setIsEditingProfile(true)}
        borderColor={BORDER_COLOR}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="flex-1">
            {currentCategory === "\ub098\uc758 \uc815\ubcf4" ? (
              <MyInfo
                userInfo={userInfo}
                onEdit={setUserInfo}
                theme={theme}
                borderColor={BORDER_COLOR}
                profile={profile}
              />
            ) : currentCategory === "\ub098\uc758 \ud50c\ub808\uc774\ub9ac\uc2a4\ud2b8" ? (
              <PlaylistManager
                songs={playlist}
                onAdd={handleAddSong}
                onDelete={handleDeleteSong}
                theme={theme}
                borderColor={BORDER_COLOR}
              />
            ) : (
              <>
                {isCreatingPost || editingPost ? (
                  <PostEditor
                    post={editingPost}
                    category={currentCategory}
                    onSave={editingPost ? handleUpdatePost : handleCreatePost}
                    onCancel={handleCancelEdit}
                    theme={theme}
                    borderColor={BORDER_COLOR}
                  />
                ) : (
                  <PostList
                    posts={posts.filter((p) => p.category === currentCategory)}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    theme={theme}
                    borderColor={BORDER_COLOR}
                  />
                )}
              </>
            )}
          </div>

          <div className="w-64 flex-shrink-0">
            <CategoryNav
              categories={categories}
              currentCategory={currentCategory}
              onCategoryChange={handleCategoryChange}
              onNewPost={handleNewPost}
              theme={theme}
              borderColor={BORDER_COLOR}
            />
          </div>
        </div>
      </div>

      {isEditingProfile && (
        <ProfileEditor
          profile={profile}
          onSave={setProfile}
          onClose={() => setIsEditingProfile(false)}
          theme={theme}
          borderColor={BORDER_COLOR}
        />
      )}
    </div>
  );
}
