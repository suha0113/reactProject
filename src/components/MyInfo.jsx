import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

export function MyInfo({ userInfo, onEdit, theme, borderColor, profile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userInfo.name);
  const [hobbies, setHobbies] = useState(userInfo.hobbies);
  const [favoriteMovie, setFavoriteMovie] = useState(userInfo.favoriteMovie);

  const handleSave = () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    onEdit({ name, hobbies, favoriteMovie });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(userInfo.name);
    setHobbies(userInfo.hobbies);
    setFavoriteMovie(userInfo.favoriteMovie);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg">👤 나의 정보</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm relative overflow-hidden group"
            style={{ 
              backgroundColor: borderColor + '60',
              color: '#333',
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${borderColor}80 0%, ${borderColor}A0 100%)`,
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              수정하기
            </span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8" style={{ border: `2px solid ${borderColor}` }}>
        {/* 프로필 캐릭터 */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
            style={{ border: `3px solid ${borderColor}` }}
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-5xl">👧🏻</div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
              />
            </div>

            <div>
              <label className="block text-xs mb-2">취미</label>
              <input
                type="text"
                value={hobbies}
                onChange={e => setHobbies(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
                placeholder="예: 영화보기, 노래듣기"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">인생 영화</label>
              <input
                type="text"
                value={favoriteMovie}
                onChange={e => setFavoriteMovie(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 text-white rounded-lg transition-opacity flex items-center gap-2 text-sm relative overflow-hidden group"
                style={{ backgroundColor: '#4A90E2' }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  저장
                </span>
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 rounded-lg transition-colors flex items-center gap-2 text-sm relative overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  취소
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-lg" style={{ backgroundColor: borderColor + '50' }}>
              <div className="text-sm mb-1 text-gray-600">👤 이름</div>
              <div className="text-base text-black">{userInfo.name}</div>
            </div>

            <div className="p-5 rounded-lg" style={{ backgroundColor: borderColor + '50' }}>
              <div className="text-sm mb-1 text-gray-600">🎨 취미</div>
              <div className="text-base text-black">{userInfo.hobbies}</div>
            </div>

            <div className="p-5 rounded-lg" style={{ backgroundColor: borderColor + '50' }}>
              <div className="text-sm mb-1 text-gray-600">🎬 인생 영화</div>
              <div className="text-base text-black">{userInfo.favoriteMovie}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
