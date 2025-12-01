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
  //테마 팝업이 열렸는지 닫혔는지 관리하는 state
  const [showThemes, setShowThemes] = useState(false);
  //테마 버튼을 가리키는 DOM 요소
  const themeRef = useRef(null);

  //팝업을 화면 어디에 위치시킬지 저장
  //테마 메뉴 위치 저장 (ref.current를 렌더에서 직접 읽지 않기 위해)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  //테마 박스 위치 계산 (렌더 중 접근 X)
  //useEffect는 렌더링 후에 실행돼서 화면이 깜빡일 수 있음
  //반면 useLayoutEffect는 브라우저가 화면을 그리기 전에 실행되기 때문에
  //정확한 위치에 자연스럽게 뜸
  useLayoutEffect(() => {
    if (showThemes && themeRef.current) {
      //element의 크기, 위치 정보 반환
      const rect = themeRef.current.getBoundingClientRect();

      //테마 버튼의 위치(좌표)를 가져옴
      //그 기준으로 팝업 menu의 top, right 값을 계산, 팝업이 버튼 바로 아래에 뜸
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showThemes]);

  //바깥 클릭 → 테마 메뉴 닫기
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
            {/* 프로필 영역 */}
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

            {/*버튼 영역 */}
            <div className="flex items-center gap-3 relative z-30">
              {/* 프로필 수정 버튼 클릭 시 모달 열림*/}
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

              {/* 테마 변경 버튼 */}
              <div className="relative" ref={themeRef}>
                {/* 테마 버튼 누르면 테마 선택창 토글 */}
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

                {/* 테마 팝업 */}
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
                        {/**테마 정보 배열, 테마 하나(t)마다 버튼 하나씩 렌더링, 즉 테마가 6개면 버튼도 6개 생김 */}
                        {themes.map((t) => (
                          //테마 선택 버튼
                          <button
                            //리액트에서 리스트 렌더링할 때 필수인 key속성, t.name을 key로 사용
                            key={t.name}
                            onClick={() => {
                              //선택한 테마 t로 넘김
                              onThemeChange(t);
                              //테마 선택 모달 닫는 역할
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
