import { useState } from "react";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";

//글 삭제 시 확인 모달 띄우는 데 사용
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

//한 페이지에 5개의 글만 보여주기 위한(페이징) 상수
const POSTS_PER_PAGE = 5;

export function PostList({ posts, onEdit, onDelete, theme, borderColor }) {
  //현재 몇 페이지인지 저장
  const [currentPage, setCurrentPage] = useState(1);
  //펼쳐진 게시글들의 id를 저장 set/ 어떤 글이 펼쳐져 있는지 기록
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  //페이징 계산 / 전체 글 중 현재 페이지가 보여주는 구간만 잘라서 보여주는 방식
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  //날짜 포맷/ 0000년 0월 00일 00:00
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //글 펼치기, 접기 기능 토글
  //Set을 사용해 한 글만이 아니라 여러 글을 동시에 펼칠 수 있다. 게시글 id 기준으로 open close 상태 관리
  const togglePost = (postId) => {
    const newExpandedPosts = new Set(expandedPosts);
    if (newExpandedPosts.has(postId)) {
      newExpandedPosts.delete(postId);
    } else {
      newExpandedPosts.add(postId);
    }
    setExpandedPosts(newExpandedPosts);
  };

  //글이 없는 경우
  if (posts.length === 0) {
    return (
      <div>
        <h2 className="text-lg mb-4">✍️ 게시글</h2>
        <div
          className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-400"
          style={{ border: `2px solid ${borderColor}` }}
        >
          <p className="text-sm">아직 작성된 글이 없습니다.</p>
          <p className="text-xs mt-2">첫 번째 글을 작성해보세요! ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg mb-4">✍️ 게시글</h2>
      <div className="space-y-4">
        {currentPosts.map((post) => {
          const isExpanded = expandedPosts.has(post.id);
          return (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              style={{ border: `2px solid ${borderColor}` }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  {/*제목 클릭하면 접기/펼치기 */}
                  <button
                    onClick={() => togglePost(post.id)}
                    className="flex-1 text-left group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base mb-1 group-hover:underline">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                      <div className="ml-2">
                        {/*펼쳐져 있으면 ChevronUp / ChevronDown*/}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-2 ml-2">
                    {/*App.jsx에서 받은 onEdit 실행 -> PostEditor 열림*/}
                    <button
                      onClick={() => onEdit(post)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors relative overflow-hidden group"
                      title="수정"
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${theme.color}40 0%, ${theme.color}60 100%)`,
                        }}
                      />
                      <Edit2 className="w-3.5 h-3.5 relative z-10" />
                    </button>
                    {/*삭제 버튼 + alertDialog*/}
                    {/*실수로 삭제 되는 걸 방지, 경고 모달 띄우기*/}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600 relative overflow-hidden group"
                          title="삭제"
                        >
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background:
                                "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                            }}
                          />
                          <Trash2 className="w-3.5 h-3.5 relative z-10" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            글을 삭제하시겠습니까?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다. 정말로 이 글을
                            삭제하시겠습니까?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(post.id)}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/*글 내용 펼쳤을 때 / 전체 이미지, 내용 표시*/}
                {isExpanded && (
                  <>
                    {post.image && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt=""
                          className="w-full max-h-96 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </>
                )}
                {/* 접었을 때 / 작은 썸네일, 글 내용 일부(최대 2줄)*/}
                {!isExpanded && (
                  <>
                    {post.image && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt=""
                          className="max-w-xs max-h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-500 whitespace-pre-wrap line-clamp-2">
                      {post.content}
                    </p>
                  </>
                )}
              </div>
            </article>
          );
        })}

        {/*페이징 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            {/*이전 버튼 */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${borderColor}40 0%, ${borderColor}60 100%)`,
                }}
              />
              <ChevronLeft className="w-5 h-5 relative z-10" />
            </button>

            {/*페이지 번호 버튼들*/}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 rounded-lg transition-colors text-sm relative overflow-hidden group flex items-center justify-center"
                    style={{
                      backgroundColor:
                        currentPage === page ? borderColor : "white",
                      color: currentPage === page ? "#333" : "#666",
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${borderColor}60 0%, ${borderColor}90 100%)`,
                      }}
                    />
                    <span className="relative z-10">{page}</span>
                  </button>
                )
              )}
            </div>

            {/*다음 버튼*/}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${borderColor}40 0%, ${borderColor}60 100%)`,
                }}
              />
              <ChevronRight className="w-5 h-5 relative z-10" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
