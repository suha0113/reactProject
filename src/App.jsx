import { useState, useEffect } from "react";
import { BlogHeader } from "./components/BlogHeader";
import { CategoryNav } from "./components/CategoryNav";
import { PostList } from "./components/PostList";
import { PostEditor } from "./components/PostEditor";
import { ProfileEditor } from "./components/ProfileEditor";
import { MyInfo } from "./components/MyInfo";
import { PlaylistManager } from "./components/PlaylistManager";
import { pastelThemes, BORDER_COLOR } from "./themeColors";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Map } from "react-kakao-maps-sdk";

const categories = ["일상", "맛집", "나의 플레이리스트", "나의 정보", "기타"];

export default function App() {
  const [currentCategory, setCurrentCategory] = useState("일상");
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("blog-posts");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, error] = useKakaoLoader({
    appkey: "ebb672f8668ef515c9e7a4cd8141af67",
    libraries: ["services"],
  });

  if (loading) {
    console.log("로딩중");
  }
  if (error) {
    console.log(String(error.message || error));
  }
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("blog-profile");
    return saved ? JSON.parse(saved) : { name: "송수하" };
  });

  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("blog-userinfo");
    return saved
      ? JSON.parse(saved)
      : {
          name: "송수하",
          hobbies: "영화보기, 노래듣기",
          favoriteMovie: "트루먼쇼",
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
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {currentCategory === "나의 정보" ? (
              <MyInfo
                userInfo={userInfo}
                onEdit={setUserInfo}
                theme={theme}
                borderColor={BORDER_COLOR}
                profile={profile}
              />
            ) : currentCategory === "나의 플레이리스트" ? (
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

          {/* 오른쪽 카테고리 사이드바 */}
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
