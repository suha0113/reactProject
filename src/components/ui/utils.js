//조건에 따라 클래스를 넣고 빼는데 편해지는 라이브러리
import { clsx } from "clsx";
//tailwind는 같은 속성끼리 충돌하는 경우 많음
//단순 문자열로 합치면 충돌이 해결되지 않지만, twMerge가 자동으로 정리
import { twMerge } from "tailwind-merge";

// Tailwind + clsx 를 결합한 함수
export function cn(...inputs) {
  //1단계 clsx가 조건부 문자열 조립 / 2단계 twMerge가 tailwind 충돌을 자동 해결
  return twMerge(clsx(inputs));
  //이걸 하나의 함수로 묶어서 프로젝트 전체에서 깔끔하게 테일윈드 클래스를 조합할 수 있게 하는 유틸리티
}
