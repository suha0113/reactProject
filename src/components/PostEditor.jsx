import { useState, useRef } from 'react';
import { Image, X, MapPin } from 'lucide-react';
import { MapSearch } from './MapSearch';

export function PostEditor({ post, category, onSave, onCancel, theme, borderColor }) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [image, setImage] = useState(post?.image || '');
  const [location, setLocation] = useState(post?.location || '');
  const [showMapSearch, setShowMapSearch] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    onSave({
      ...(post || {}),
      category,
      title,
      content,
      image: image || undefined,
      location: location || undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: `2px solid ${borderColor}` }}>
      <h2 className="text-lg mb-6">{post ? '글 수정하기' : '새 글 쓰기'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
            style={{ '--tw-ring-color': theme.color }}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-xs mb-2">내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 min-h-[200px] resize-y text-sm"
            style={{ '--tw-ring-color': theme.color }}
            placeholder="내용을 입력하세요"
          />
        </div>

        {category === '맛집' && (
          <div>
            <label className="block text-xs mb-2">위치</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
                placeholder="맛집 위치를 입력하거나 지도에서 검색하세요"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs mb-2">사진</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {image ? (
            <div className="relative inline-block">
              <img src={image} alt="Preview" className="max-w-xs max-h-40 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setImage('')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 relative overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  }}
                />
                <X className="w-4 h-4 relative z-10" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2 text-sm relative overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}40 100%)`,
                  }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  사진 선택
                </span>
              </button>
              
              {category === '맛집' && (
                <button
                  type="button"
                  onClick={() => setShowMapSearch(true)}
                  className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2 text-sm relative overflow-hidden group"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}40 100%)`,
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    지도
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2 text-white rounded-lg transition-opacity text-sm relative overflow-hidden group"
            style={{ backgroundColor: theme.color }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${theme.color} 0%, ${theme.color}cc 100%)`,
              }}
            />
            <span className="relative z-10">{post ? '수정 완료' : '작성 완료'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 rounded-lg transition-colors text-sm relative overflow-hidden group"
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
              }}
            />
            <span className="relative z-10">취소</span>
          </button>
        </div>
      </form>

      {showMapSearch && (
        <MapSearch
          onSelect={setLocation}
          onClose={() => setShowMapSearch(false)}
          theme={theme}
          borderColor={borderColor}
        />
      )}
    </div>
  );
}
