import { useState, useEffect } from 'react';
import { Search, Music, Play, X, Loader2 } from 'lucide-react';
import { searchTracks, formatDuration } from '../utils/spotify';

export function SpotifySearch({ accessToken, onSelect, onClose, theme, borderColor }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingPreview, setPlayingPreview] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tracks = await searchTracks(query, accessToken);
      setResults(tracks);
    } catch (err) {
      setError('검색에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPreview = (previewUrl, trackId) => {
    if (!previewUrl) {
      return;
    }

    if (playingPreview === trackId) {
      audio?.pause();
      setPlayingPreview(null);
      return;
    }

    if (audio) {
      audio.pause();
    }

    const newAudio = new Audio(previewUrl);
    newAudio.play();
    newAudio.onended = () => setPlayingPreview(null);
    setAudio(newAudio);
    setPlayingPreview(trackId);
  };

  const handleSelect = (track) => {
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    onSelect(track);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
        style={{ border: `3px solid ${borderColor}` }}
      >
        {/* 헤더 */}
        <div 
          className="p-6 flex items-center justify-between"
          style={{ backgroundColor: theme.color + '40' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1DB954' }}
            >
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg">Spotify에서 노래 검색</h2>
              <p className="text-xs text-gray-600">노래를 검색하고 선택하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 검색 */}
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="노래 제목, 아티스트 이름으로 검색..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: '#1DB954' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>검색 중...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>검색</span>
                </>
              )}
            </button>
          </form>
          {error && (
            <p className="text-sm text-red-500 mt-3">{error}</p>
          )}
        </div>

        {/* 결과 */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 250px)' }}>
          {results.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm">검색 결과가 없습니다</p>
              <p className="text-xs mt-2">노래를 검색해보세요</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map(track => (
                <div
                  key={track.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 group"
                >
                  {/* 앨범 커버 */}
                  <div className="flex-shrink-0">
                    {track.album.images[0] ? (
                      <img
                        src={track.album.images[0].url}
                        alt={track.album.name}
                        className="w-14 h-14 rounded shadow-sm"
                      />
                    ) : (
                      <div 
                        className="w-14 h-14 rounded shadow-sm flex items-center justify-center"
                        style={{ backgroundColor: theme.color + '60' }}
                      >
                        <Music className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* 노래 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm truncate">{track.name}</h3>
                    <p className="text-xs text-gray-600 truncate">
                      {track.artists.map(a => a.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">
                      💿 {track.album.name}
                    </p>
                  </div>

                  {/* 재생 시간 */}
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {formatDuration(track.duration_ms)}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {track.preview_url && (
                      <button
                        onClick={() => handlePlayPreview(track.preview_url, track.id)}
                        className="p-2 rounded-lg transition-all hover:bg-gray-200"
                        title="미리듣기"
                      >
                        <Play 
                          className="w-4 h-4"
                          style={{ 
                            color: playingPreview === track.id ? '#1DB954' : '#666',
                            fill: playingPreview === track.id ? '#1DB954' : 'none'
                          }}
                        />
                      </button>
                    )}
                    <button
                      onClick={() => handleSelect(track)}
                      className="px-4 py-2 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 text-xs"
                      style={{ backgroundColor: '#1DB954' }}
                    >
                      추가
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
