import { Plus } from "lucide-react";

const categoryIcons = {
  일상: "📝",
  맛집: "🍴",
  "나의 정보": "👤",
  기타: "📌",
};

export function CategoryNav({
  categories,
  currentCategory,
  onCategoryChange,
  onNewPost,
  theme,
  borderColor,
}) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 relative"
      style={{ border: `2px solid ${borderColor}`, zIndex: 1 }}
    >
      <h3 className="text-sm mb-4 text-center">📁 카테고리</h3>
      <div className="space-y-2">
        {/*카테고리는 .map()으로 반복 렌더링*/}
        {categories.map((category) => (
          <div key={category}>
            <button
              onClick={() => onCategoryChange(category)}
              className="w-full px-3 py-2 rounded-lg transition-all text-left text-sm relative overflow-hidden group"
              //색상 강조 + 테두리 강조
              style={{
                backgroundColor:
                  currentCategory === category ? theme.color : "transparent",
                color: currentCategory === category ? "#333" : "#666",
                border: `1px solid ${
                  currentCategory === category ? borderColor : "transparent"
                }`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  //카테고리 위에 마우스를 올리면 테마 기반 hover 효과 자동 적용
                  background: `linear-gradient(135deg, ${theme.color}80 0%, ${theme.color} 100%)`,
                }}
              />
              <span className="relative">
                {categoryIcons[category]} {category}
              </span>
            </button>
            {/* 조건부 렌더링: "새 글 쓰기" 버튼 */}
            {/*현재 클릭한 카테고리 아래에 표시. 나의 정보 카테고리는 글을 작성하는 카테고리가 아니라 표시 안 됨*/}
            {currentCategory === category && category !== "나의 정보" && (
              <button
                onClick={onNewPost}
                className="w-full mt-2 px-3 py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2 relative overflow-hidden group"
                style={{
                  backgroundColor: borderColor + "40",
                  color: "#333",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${borderColor}60 0%, ${borderColor}80 100%)`,
                  }}
                />
                <span className="relative flex items-center gap-2">
                  <Plus className="w-3 h-3" />새 글 쓰기
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
