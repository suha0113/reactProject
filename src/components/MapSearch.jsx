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
  //검색 입력값
  const [searchQuery, setSearchQuery] = useState("");
  //KaKao API에서 받아온 검색 결과
  const [searchResults, setSearchResults] = useState([]);
  //선택된 장소
  const [selectedPlace, setSelectedPlace] = useState(null);
  //지도 위치
  const [center, setCenter] = useState(DEFAULT_CENTER);
  //확대 레벨
  const [mapLevel, setMapLevel] = useState(3);
  //지도가 표시 가능한지 여부
  const [isMapReady, setIsMapReady] = useState(false);

  const mapRef = useRef(null);

  //kakao sdk 로드
  //useKakaoLoader를 사용해 sdk 로딩상태 체크, 로딩 중에는 지도 대신 메세지 띄워줌
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_APP_KEY,
    //Places() API를 사용하기 위해 services 필요
    libraries: ["services"],
  });

  //useCallback - 함수를 기억, 특정 의존성이 변경되지 않으면 함수가 다시 생성되지 않도록 하는 훅
  //첫번째 인자, 메모제이션할 콜백 함수 전달. 두번째 인자 의존성 배열 전달.
  //배열 값 중 하나라도 변경되면 useCallback은 새로운 함수 생성
  const toLatLng = useCallback(
    (place) => ({
      lat: Number(place.y),
      lng: Number(place.x),
    }),
    []
  );

  //지도가 생성되면 ref에 저장 / isMapReady -> true / Map 제어 가능
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

  //키워드 검색 기능
  const handleSearch = () => {
    console.log("[MapSearch] handleSearch called with query: ", searchQuery);
    //검색어에 글자가 있는지 확인, 공백이면 종료
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

    //지도 준비&kakao places 서비스 로딩 여부 확인 (안 되어 있으면 종료)
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

    //검색 함수 핵심, 서비스 객체 생성
    const placesService = new window.kakao.maps.services.Places();

    /* 키워드로 장소 검색 요청 맛집 이름 or 지역 + 맛집 검색 
    결과는 최대 5개로 제한, 첫 번째 검색 결과로 지도 중심 이동
    searchResults에 저장 -> 왼쪽 리스트 렌더링 
    검색 결과와 지도 상태를 연결해 사용자가 검색하면 바로 해당 위치로 지도가 이동
    */
    placesService.keywordSearch(searchQuery, (data, status) => {
      console.log(
        "[MapSearch] keywordSearch status:",
        status,
        "data length:",
        data?.length
      );
      //검색이 실패했거나 결과가 없을 때 처리
      if (status !== window.kakao.maps.services.Status.OK) {
        alert(TEXT.noResultAlert);
        setSearchResults([]);
        return;
      }

      //최대 5개까지만 결과를 사용
      const sliced = data.slice(0, 5);
      //상태에 검색 결과 저장
      setSearchResults(sliced);
      //새 검색을 햇으니 선택된 장소 초기화
      setSelectedPlace(null);

      //결과가 하나 이상 있을 때
      if (sliced.length) {
        //첫 번째 결과를 기준으로 지도 중심 좌표 계산
        const nextCenter = toLatLng(sliced[0]);
        //React state에 지도 중심과 레벨 저장
        setCenter(nextCenter);
        setMapLevel(3);

        if (mapRef.current && window.kakao?.maps) {
          //실제 kakao 지도 인스턴스도 같은 위치로 이동 + 줄 레벨 설정
          mapRef.current.setCenter(
            new window.kakao.maps.LatLng(nextCenter.lat, nextCenter.lng)
          );
          mapRef.current.setLevel(3);
        }
      }
    });
  };

  //목록에서 장소 클릭
  /* 리스트에서 클릭하면 선택된 장소 강조/ 지도 센터 이동/ 지도 확대 레벨 변경 */
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

  //선택 완료
  //부모 PostEditor 에게 위치 문자열을 넘기고 모달 닫기
  const handleSelectPlace = (place) => {
    console.log("[MapSearch] place selected:", place);
    onSelect(`${place.place_name} (${place.address_name})`);
    onClose();
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
      //배경 클릭하면 모달 닫기
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl min-w-5xl w-[300px] p-6"
        style={{ border: `3px solid ${borderColor}` }}
        //내부 클릭은 닫히지 않도록 stopPropagation
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
                검색
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

          {/**검색 결과마다 마커 표시 / 마커 클릭 시 selectedPlace 갱신 / 지도, 리스트가 양방향으로 연동 */}
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
                  //검색 결과 마커 표시 / 검색 결과 리스트와 지도 마커 연동
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
