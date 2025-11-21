import { useState, useEffect } from 'react';
import { Plus, Trash2, Music, X, LogOut } from 'lucide-react';
import { SpotifySearch } from './SpotifySearch';
import { redirectToSpotifyAuth, getValidAccessToken, logout, formatDuration } from '../utils/spotify';

export function PlaylistManager({ songs, onAdd, onDelete, theme, borderColor }) {
  const [isAdding, setIsAdding] = useState(false);
  const [showSpotifySearch, setShowSpotifySearch] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    // Check for access token on mount
    checkAccessToken();

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const checkAccessToken = async () => {
    const token = await getValidAccessToken();
    setAccessToken(token);
  };

  const handleOAuthCallback = async (code) => {
    try {
      const { getAccessToken } = await import('../utils/spotify');
      const token = await getAccessToken(code);
      setAccessToken(token);
      
      // Remove code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Failed to get access token:', error);
      alert('Spotify 로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSpotifyLogin = () => {
    redirectToSpotifyAuth();
  };

  const handleSpotifyLogout = () => {
    logout();
    setAccessToken(null);
  };

  const handleSpotifySelect = (track) => {
    onAdd({
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      duration: formatDuration(track.duration_ms),
      coverImage: track.album.images[0]?.url,
      spotifyId: track.id,
    });
    setShowSpotifySearch(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !artist.trim()) {
      alert('노래 제목과 아티스트를 입력해주세요.');
      return;
    }

    onAdd({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || undefined,
      duration: duration.trim() || undefined,
    });

    setTitle('');
    setArtist('');
    setAlbum('');
    setDuration('');
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTitle('');
    setArtist('');
    setAlbum('');
    setDuration('');
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg">🎵 나의 플레이리스트</h2>
        <div className="flex items-center gap-2">
          {accessToken ? (
            <>
              <button
                onClick={() => setShowSpotifySearch(true)}
                className="px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm text-white"
                style={{ backgroundColor: '#1DB954' }}
              >
                <Music className="w-4 h-4" />
                Spotify에서 검색
              </button>
              <button
                onClick={handleSpotifyLogout}
                className="p-2 rounded-lg transition-all hover:bg-gray-200"
                title="Spotify 로그아웃"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={handleSpotifyLogin}
              className="px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm text-white"
              style={{ backgroundColor: '#1DB954' }}
            >
              <Music className="w-4 h-4" />
              Spotify 로그인
            </button>
          )}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm relative overflow-hidden group"
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
              <span className="relative flex items-center gap-2">
                <Plus className="w-4 h-4" />
                직접 추가
              </span>
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ border: `2px solid ${borderColor}` }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-2">노래 제목 *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
                placeholder="예: Bohemian Rhapsody"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">아티스트 *</label>
              <input
                type="text"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
                placeholder="예: Queen"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">앨범</label>
              <input
                type="text"
                value={album}
                onChange={e => setAlbum(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
                placeholder="예: A Night at the Opera"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">재생 시간</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ '--tw-ring-color': theme.color }}
                placeholder="예: 5:55"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-2 text-white rounded-lg transition-all text-sm relative overflow-hidden group"
                style={{ backgroundColor: '#4A90E2' }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  추가
                </span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-2 bg-gray-200 rounded-lg transition-all text-sm relative overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  취소
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: `2px solid ${borderColor}` }}>
        {songs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm">플레이리스트가 비어있습니다</p>
            <p className="text-xs mt-2">노래를 추가해보세요!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className="p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {song.coverImage ? (
                    <img
                      src={song.coverImage}
                      alt={song.album}
                      className="flex-shrink-0 w-14 h-14 rounded-lg shadow-sm object-cover"
                    />
                  ) : (
                    <div 
                      className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: theme.color + '60' }}
                    >
                      {index + 1}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm truncate">{song.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{song.artist}</p>
                    {song.album && (
                      <p className="text-xs text-gray-400 mt-1">💿 {song.album}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {song.duration && (
                      <span className="text-xs text-gray-400">{song.duration}</span>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('이 노래를 삭제하시겠습니까?')) {
                          onDelete(song.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {songs.length > 0 && (
        <div className="mt-4 text-center text-xs text-gray-500">
          총 {songs.length}곡
        </div>
      )}

      {showSpotifySearch && accessToken && (
        <SpotifySearch
          accessToken={accessToken}
          onSelect={handleSpotifySelect}
          onClose={() => setShowSpotifySearch(false)}
          theme={theme}
          borderColor={borderColor}
        />
      )}
    </div>
  );
}
