import { useState, useRef } from "react";
import { Image } from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function ProfileEditor({
  profile,
  onSave,
  onClose,
  open,
  theme,
  borderColor,
}) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar || "");
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    // ?.[0] 옵셔널 체이닝 문법 : files가 존재하면 [0]번째 파일을 가져오고, 없으면 에러 안 내고 undefined
    const file = e.target.files?.[0];
    // 진짜 파일이 선택된 경우에만 아래 로직 실행
    // 파일을 취소했거나, 선택하지 않으면 undefined
    if (file) {
      //브라우저에서 파일 내용을 읽어오는 객체
      const reader = new FileReader();
      //파일 읽기가 끝났을 때 호출되는 콜백 함수 설정
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      //실제 파일 읽기를 시작하는 부분
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    //페이지 새로 고침 X, 페이지 이동 X
    e.preventDefault();
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    //App.jsx - setProfile
    onSave({ name, avatar: avatar || undefined });
    //App.js- dispatch({type:"CLOSE_PROFILE"}) - uireducer로 가서 action처리
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          className=" z-50 bg-white rounded-lg shadow-xl max-w-md min-w-2xl p-4"
          style={{ border: `3px solid ${borderColor}` }}
        >
          <DialogHeader className="flex justify-between items-center mb-6">
            <DialogTitle className="text-lg">프로필 수정</DialogTitle>
            <DialogDescription className="sr-only">
              프로필 이름과 사진을 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ "--tw-ring-color": theme.color }}
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">프로필 사진</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0"
                  style={{ border: `3px solid ${theme.color}` }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">👧🏻</div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs relative overflow-hidden group"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}40 100%)`,
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <Image className="w-3 h-3" />
                      사진 선택
                    </span>
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar("")}
                      className="px-4 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors relative overflow-hidden group"
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background:
                            "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                        }}
                      />
                      <span className="relative z-10">사진 제거</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-2 text-white rounded-lg transition-all text-sm relative overflow-hidden group"
                style={{ backgroundColor: "#4A90E2" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)",
                  }}
                />
                <span className="relative z-10">저장</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2 bg-gray-200 rounded-lg transition-colors text-sm relative overflow-hidden group"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
                  }}
                />
                <span className="relative z-10">취소</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
