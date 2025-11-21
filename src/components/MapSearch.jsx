import { useCallback, useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { MapPin, Search, X } from "lucide-react";

const KAKAO_APP_KEY = "ebb672f8668ef515c9e7a4cd8141af67";
const DEFAULT_CENTER = { lat: 37.566826, lng: 126.9786567 };

export function MapSearch({ onSelect, onClose, theme, borderColor }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [mapLevel, setMapLevel] = useState(3);
  const [isMapReady, setIsMapReady] = useState(false);

  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);

  const toLatLng = useCallback(
    (place) => ({
      lat: Number(place.y),
      lng: Number(place.x),
    }),
    []
  );

  const ensurePlacesService = useCallback(() => {
    if (placesServiceRef.current) return placesServiceRef.current;
    if (!window.kakao?.maps?.services) return null;

    placesServiceRef.current = new window.kakao.maps.services.Places();
    return placesServiceRef.current;
  }, []);

  const handleMapCreate = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
    setIsMapReady(true);

    if (!placesServiceRef.current && window.kakao?.maps?.services) {
      placesServiceRef.current = new window.kakao.maps.services.Places();
    }
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const service = ensurePlacesService();

    if (!service) {
      const mock = [
        {
          place_name: `${searchQuery} 본점`,
          address_name: "서울특별시 강남구 테헤란로 123",
          x: "127.0276",
          y: "37.4979",
        },
        {
          place_name: `${searchQuery} 지점`,
          address_name: "서울특별시 서초구 서초동 456",
          x: "126.9366",
          y: "37.5559",
        },
      ];
      setSearchResults(mock);
      setSelectedPlace(null);
      const nextCenter = toLatLng(mock[0]);
      setCenter(nextCenter);
      setMapLevel(3);
      return;
    }

    service.keywordSearch(searchQuery, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
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
      } else {
        alert("검색 결과가 없습니다.");
        setSearchResults([]);
      }
    });
  };

  const handleSelectPlace = (place) => {
    onSelect(`${place.place_name} (${place.address_name})`);
    onClose();
  };

  const handlePlaceClick = (place) => {
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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-5xl w-[300px] p-6"
        style={{ border: `3px solid ${borderColor}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            음식점 검색
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
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="음식점 이름을 입력하세요"
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
                검색
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 음식점 이름이나 지역을 입력하여 검색하세요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-y-auto max-h-96">
            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  검색어를 입력하고 검색 버튼을 눌러주세요
                </p>
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
                        이 위치 선택하기
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
            {!isMapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">지도를 불러오는 중...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
