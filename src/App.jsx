import { useEffect, useReducer } from "react";
import { BlogHeader } from "./components/BlogHeader";
import { CategoryNav } from "./components/CategoryNav";
import { PostList } from "./components/PostList";
import { PostEditor } from "./components/PostEditor";
import { ProfileEditor } from "./components/ProfileEditor";
import { MyInfo } from "./components/MyInfo";
import { pastelThemes, BORDER_COLOR } from "./themeColors";
import { uiReducer, initialUIState } from "./reducers/uiReducer";
import { usePosts } from "./hooks/usePosts";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

const categories = ["일상", "맛집", "나의 정보", "기타"];

export default function App() {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);
  const { posts, createPost, updatePost, deletePost } = usePosts();

  //프로필 정보
  const [profile, setProfile] = useLocalStorageState("blog-profile", {
    name: "송수하",
  });
  //나의 정보
  const [userInfo, setUserInfo] = useLocalStorageState("blog-userinfo", {
    name: "송수하",
    hobbies: "영화보기, 노래부르기",
    favoriteMovie: "트루먼쇼",
  });

  //테마
  const [theme, setTheme] = useLocalStorageState("blog-theme", pastelThemes[0]);

  //useEffect로 state 바뀌면 localStorage 자동 저장
  useEffect(() => {
    if (typeof theme === "string") {
      const found = pastelThemes.find((t) => t.name === theme);
      if (found) setTheme(found);
    }
  });

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
        onEditProfile={() => dispatch({ type: "OPEN_PROFILE" })}
        borderColor={BORDER_COLOR}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="flex-1">
            {/* 카테고리가 "나의 정보"이면 MyInfo 컴포넌트, 아니면 PostList or PostEditor */}
            {state.currentCategory === "나의 정보" ? (
              <MyInfo
                userInfo={userInfo}
                onEdit={setUserInfo}
                theme={theme}
                borderColor={BORDER_COLOR}
                profile={profile}
              />
            ) : (
              <>
                {/**글 작성 or 수정 */}
                {state.isCreatingPost || state.editingPost ? (
                  <PostEditor
                    post={state.editingPost}
                    category={state.currentCategory}
                    onSave={(post) => {
                      if (state.editingPost) {
                        updatePost(post);
                      } else {
                        createPost(post);
                      }
                      dispatch({ type: "CANCEL_EDIT" });
                    }}
                    onCancel={() => dispatch({ type: "CANCEL_EDIT" })}
                    theme={theme}
                    borderColor={BORDER_COLOR}
                  />
                ) : (
                  <PostList
                    posts={posts.filter(
                      (p) => p.category === state.currentCategory
                    )}
                    onEdit={(post) =>
                      dispatch({ type: "EDIT_POST", payload: post })
                    }
                    onDelete={deletePost}
                    theme={theme}
                    borderColor={BORDER_COLOR}
                  />
                )}
              </>
            )}
          </div>

          <div className="w-64 flex-shrink-0">
            {/* 카테고리 네비게이션 */}
            <CategoryNav
              categories={categories}
              currentCategory={state.currentCategory}
              onCategoryChange={(c) =>
                dispatch({ type: "SET_CATEGORY", payload: c })
              }
              onNewPost={() => dispatch({ type: "NEW_POST" })}
              theme={theme}
              borderColor={BORDER_COLOR}
            />
          </div>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {state.isEditingProfile && (
        <ProfileEditor
          profile={profile}
          onSave={setProfile}
          onClose={() => dispatch({ type: "CLOSE_PROFILE" })}
          theme={theme}
          borderColor={BORDER_COLOR}
        />
      )}
    </div>
  );
}
