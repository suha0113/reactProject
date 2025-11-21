import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Settings, Palette } from "lucide-react";

export function BlogHeader({
  profile,
  theme,
  themes,
  onThemeChange,
  onEditProfile,
  borderColor,
}) {
  const [showThemes, setShowThemes] = useState(false);
  const themeRef = useRef(null);

  // ⭐ 테마 메뉴 위치 저장 (ref.current를 렌더에서 직접 읽지 않기 위해)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  // ------------------------------
  // ① 테마 박스 위치 계산 (렌더 중 접근 X)
  // ------------------------------
  useLayoutEffect(() => {
    if (showThemes && themeRef.current) {
      const rect = themeRef.current.getBoundingClientRect();

      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showThemes]);

  // ------------------------------
  // ② 바깥 클릭 → 테마 메뉴 닫기
  // ------------------------------
  useEffect(() => {
    const currentRef = themeRef.current;

    const handleClickOutside = (event) => {
      if (currentRef && !currentRef.contains(event.target)) {
        setShowThemes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="bg-white shadow-sm"
      style={{ borderBottom: `3px solid ${borderColor}` }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div
          className="bg-white rounded-lg p-4 relative"
          style={{ border: `2px solid ${borderColor}`, overflow: "visible" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(135deg, ${theme.color}30 0%, ${theme.color}10 50%, ${theme.color}30 100%)`,
            }}
          />

          <div className="flex items-center justify-between relative z-10">
            {/* ---------------- 프로필 영역 ---------------- */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
                style={{ border: `3px solid ${theme.color}` }}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-3xl">👧🏻</div>
                )}
              </div>
              <div>
                <h1 className="text-xl">🏠 {profile.name}의 미니홈피</h1>
                <p className="text-gray-500 text-xs">
                  안녕하세요! 제 공간에 오신 걸 환영합니다 ✨
                </p>
              </div>
            </div>

            {/* ---------------- 버튼 영역 ---------------- */}
            <div className="flex items-center gap-3 relative z-30">
              <button
                onClick={onEditProfile}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative overflow-hidden group"
                title="프로필 수정"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${theme.color}40 0%, ${theme.color}60 100%)`,
                  }}
                />
                <Settings className="w-5 h-5 relative z-10" />
              </button>

              {/* ---------------- 테마 변경 버튼 ---------------- */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setShowThemes(!showThemes)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 relative overflow-hidden group"
                  title="테마 변경"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${theme.color}40 0%, ${theme.color}60 100%)`,
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    <span className="text-xs">테마</span>
                  </span>
                </button>

                {/* ---------------- 테마 팝업 ---------------- */}
                {showThemes && (
                  <>
                    <div
                      className="fixed inset-0 z-[9998]"
                      onClick={() => setShowThemes(false)}
                    />

                    <div
                      className="fixed bg-white rounded-lg shadow-lg p-4 z-[9999] min-w-[200px]"
                      style={{
                        border: `2px solid ${borderColor}`,
                        top: `${menuPos.top}px`,
                        right: `${menuPos.right}px`,
                      }}
                    >
                      <p className="text-xs mb-3">테마 색상 선택</p>

                      <div className="grid grid-cols-3 gap-2">
                        {themes.map((t) => (
                          <button
                            key={t.name}
                            onClick={() => {
                              onThemeChange(t);
                              setShowThemes(false);
                            }}
                            className="h-12 rounded-lg transition-transform hover:scale-105 relative overflow-hidden group flex items-center justify-center"
                            style={{
                              backgroundColor: t.color,
                              border:
                                theme.name === t.name
                                  ? "3px solid #333"
                                  : "2px solid #ddd",
                            }}
                            title={t.name}
                          >
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{
                                background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}cc 100%)`,
                              }}
                            />
                            <span className="text-xs relative z-10 text-center">
                              {t.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
