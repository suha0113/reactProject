//localStorage에 저장해두고, 앱을 새로 켜도 유지되도록 함
//첫 로딩 시 localStorage -> state로 불러옴
import { useEffect, useState } from "react";

export function useLocalStorageState(key, defaultValue) {
  //useState 초기값 함수 - 컴포넌트 렌더링 때마다 localStorage를 계속 읽지 않기 위해,
  //딱 처음 렌더링할 때만 localStorage에서 값을 읽도록 하기 위해.
  const [value, setValue] = useState(() => {
    //key에 해당하는 값이 있으면 문자열로 읽어옴, 없으면 null 반환
    const saved = localStorage.getItem(key);
    //localStorage에는 항상 문자열로 저장되기 때문에 객체/배열을 불러오려면 JSON.parse필요
    return saved ? JSON.parse(saved) : defaultValue;
  });

  //useEffect로 localStorage 자동 저장
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
