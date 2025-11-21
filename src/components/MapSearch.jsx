import { useCallback, useEffect, useRef, useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { MapPin, Search, X } from "lucide-react";

const KAKAO_APP_KEY = "3d845dd0682685018a6da8b9e70e6b4c";
const DEFAULT_CENTER = { lat: 37.566826, lng: 126.9786567 };

const TEXT = {
  title: "장소 검색",
  mapLoadingAlert: "카카오 지도를 불러오는 중입니다. 잠시만 기다려 주세요.",
  noResultAlert: "검색 결과가 없습니다.",
  placeholder: "맛집 이름 또는 지점을 입력하세요",
  helper: "음식점 이름이나 지점을 입력하여 검색하세요.",
  empty: "검색어를 입력하고 검색 버튼을 눌러주세요.",
  select: "이 위치 선택하기",
  loading: "지도를 불러오는 중...",
};

export function MapSearch({ onSelect, onClose, theme, borderColor }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [mapLevel, setMapLevel] = useState(3);
  const [isMapReady, setIsMapReady] = useState(false);

  const mapRef = useRef(null);

  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_APP_KEY,
    libraries: ["services"],
  });

  const toLatLng = useCallback(
    (place) => ({
      lat: Number(place.y),
      lng: Number(place.x),
    }),
    []
  );

  const handleMapCreate = useCallback(
    (mapInstance) => {
      console.log("[MapSearch] Map created", {
        hasLoaderError: Boolean(error),
      });
      mapRef.current = mapInstance;
      setIsMapReady(true);
    },
    [error]
  );

  const handleSearch = () => {
    console.log("[MapSearch] handleSearch called with query: ", searchQuery);
    if (!searchQuery.trim()) return;

    if (loading) {
      console.warn("[MapSearch] still loading kakao SDK");
      alert(TEXT.mapLoadingAlert);
      return;
    }

    if (error) {
      console.error("[MapSearch] kakao loader error", error);
      alert("Kakao SDK load error. Console를 확인하세요.");
      return;
    }

    if (!isMapReady || !window.kakao?.maps?.services) {
      console.warn("[MapSearch] Kakao map not ready", {
        isMapReady,
        hasKakao: Boolean(window.kakao),
        hasServices: Boolean(window.kakao?.maps?.services),
      });
      alert(TEXT.mapLoadingAlert);
      return;
    }

    console.log("[MapSearch] Starting keyword search");
    const placesService = new window.kakao.maps.services.Places();

    placesService.keywordSearch(searchQuery, (data, status) => {
      console.log(
        "[MapSearch] keywordSearch status:",
        status,
        "data length:",
        data?.length
      );
      if (status !== window.kakao.maps.services.Status.OK) {
        alert(TEXT.noResultAlert);
        setSearchResults([]);
        return;
      }

      const sliced = data.slice(0, 5);
      setSearchResults(sliced);
      setSelectedPlace(null);

      if (sliced.length) {
        const nextCenter = toLatLng(sliced[0]);
        setCenter(nextCenter);
        setMapLevel(3);

        if (mapRef.current && window.kakao?.maps) {
          mapRef.current.setCenter(
            new window.kakao.maps.LatLng(nextCenter.lat, nextCenter.lng)
          );
          mapRef.current.setLevel(3);
        }
      }
    });
  };

  const handleSelectPlace = (place) => {
    console.log("[MapSearch] place selected:", place);
    onSelect(`${place.place_name} (${place.address_name})`);
    onClose();
  };

  const handlePlaceClick = (place) => {
    console.log("[MapSearch] place clicked:", place);
    const nextCenter = toLatLng(place);
    setSelectedPlace(place);
    setCenter(nextCenter);
    setMapLevel(2);

    if (mapRef.current && window.kakao?.maps) {
      mapRef.current.setCenter(
        new window.kakao.maps.LatLng(nextCenter.lat, nextCenter.lng)
      );
      mapRef.current.setLevel(2);
    }
  };

  useEffect(() => {
    console.log("[MapSearch] mounted with props", { borderColor, theme });
    return () => console.log("[MapSearch] unmounted");
  }, [borderColor, theme]);

  useEffect(() => {
    console.log("[MapSearch] map ready state changed:", isMapReady);
  }, [isMapReady]);

  useEffect(() => {
    console.log("[MapSearch] center/level changed:", center, mapLevel);
  }, [center, mapLevel]);

  useEffect(() => {
    console.log("[MapSearch] searchResults updated:", searchResults);
  }, [searchResults]);

  useEffect(() => {
    console.log("[MapSearch] selected place changed:", selectedPlace);
  }, [selectedPlace]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl min-w-5xl w-[300px] p-6"
        style={{ border: `3px solid ${borderColor}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {TEXT.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={TEXT.placeholder}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 text-sm"
              style={{ "--tw-ring-color": theme.color }}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 text-white rounded-lg transition-opacity text-sm flex items-center gap-2 relative overflow-hidden group"
              style={{ backgroundColor: borderColor }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${borderColor} 0%, ${borderColor}cc 100%)`,
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Search className="w-4 h-4" />
                \uAC80\uC0C9
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">{TEXT.helper}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-y-auto max-h-96">
            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{TEXT.empty}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((place, i) => (
                  <div key={i} className="space-y-2">
                    <button
                      onClick={() => handlePlaceClick(place)}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative overflow-hidden group"
                      style={{
                        borderColor:
                          selectedPlace?.place_name === place.place_name
                            ? borderColor
                            : "#e5e7eb",
                        backgroundColor:
                          selectedPlace?.place_name === place.place_name
                            ? borderColor + "20"
                            : "transparent",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}40 100%)`,
                        }}
                      />
                      <div className="relative z-10">
                        <h3 className="text-sm mb-1 flex items-center gap-2">
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: borderColor }}
                          />
                          {place.place_name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {place.address_name}
                        </p>
                      </div>
                    </button>
                    {selectedPlace?.place_name === place.place_name && (
                      <button
                        onClick={() => handleSelectPlace(place)}
                        className="w-full px-4 py-2 text-white rounded-lg transition-all text-sm"
                        style={{ backgroundColor: borderColor }}
                      >
                        {TEXT.select}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Map
              appkey={KAKAO_APP_KEY}
              center={center}
              level={mapLevel}
              style={{
                width: "100%",
                height: "24rem",
                border: `2px solid ${borderColor}`,
                borderRadius: "0.5rem",
              }}
              onCreate={handleMapCreate}
              draggable
              zoomable
            >
              {searchResults.map((place, i) => {
                const position = toLatLng(place);
                const isSelected =
                  selectedPlace?.place_name === place.place_name;

                return (
                  <MapMarker
                    key={`${place.id || place.place_name || i}-${i}`}
                    position={position}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div className="text-xs font-medium">
                      {place.place_name}
                    </div>
                    {isSelected && (
                      <div className="mt-1 text-[11px] text-gray-600">
                        {place.address_name}
                      </div>
                    )}
                  </MapMarker>
                );
              })}
            </Map>
            {(!isMapReady || loading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">
                  {loading ? "SDK \uB85C\uB4DC \uC911..." : TEXT.loading}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
