"use client";

import * as React from "react";
//Radix UI는 DialogPrimitive는 기본 모달 로직(열기/닫기, 포커스 트랩 등)을 담당
//스타일링은 전부 이 컴포넌트에서 구성
import * as DialogPrimitive from "@radix-ui/react-dialog";
//우측 상단 모달 닫기 버튼
import { XIcon } from "lucide-react";

import { cn } from "./utils";

//Root / 모달 전체의 열림/닫힘 상태를 관리하는 최상위 컴포넌트
function Dialog(props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

//모달 열기
function DialogTrigger(props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

//모달이 DOM 최상단(body)에 렌더링되도록, 레이아웃 안 깨지게
function DialogPortal(props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

//모달 내부에서 닫기 버튼 누를 때 사용
function DialogClose(props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

//모달 열릴 때 배경 어둡게 레이어
//애니메이션 지원
const DialogOverlay = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      //data-state=open -> fade-in  / data-state=close -> fade-out
      //Radix UI의 state data attribute를 이용한 tailwind 애니메이션 활용
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...rest}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";

//모달 본체 / 핵심
function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      {/**모달 화면 정중앙에 위치, 열림/닫힘 애니메이션 fade+zoom, 둥근 모서리 + 그림자 + 패딩
       * z-index로 최상단 배치, children을 내부에 렌더링
       */}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}

        {/**오른쪽 상단 닫기 버튼 */}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

//모달 상단 전체 레이아웃 / Title + Description을 묶어주는 컨테이너
function DialogHeader({ className, ...props }) {
  return (
    <div
      //Radix UI 스타일링 또는 개발자 디버깅용 표시
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

//모달 상단 제목 Title / 모달 제목 텍스트 ex) 프로필 수정, 장소 검색, 설정 변경
function DialogTitle({ className, ...props }) {
  return (
    /*Radix Title 컴포넌트는 스크린 리더 접근성 자동 제공, 모달 focus trap과 잘 연결,
    Role=heading과 같은 접근성 기능 관리됨
    */
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

//부가 설명 텍스트 ex) 프로필 정보를 수정할 수 있습니다. 찾고 싶은 위치를 입력하세요. 등
function DialogDescription({ className, ...props }) {
  return (
    /*Title과 마찬가지로 접근성 자동 지원, 스크린 리더가 Description을 제목과 연결해서 읽음 */
    <DialogPrimitive.Description
      data-slot="dialog-description"
      //색을 약하게(회색) 만들어 제목 대비도가 생기게 함, 본문보다 작게 표시해 부가 설명 느낌
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

//버튼들을 아래쪽 정렬하는 담당 / PC: 오른쪽 , 모바일: 아래쪽에 세로
//tailwind + flex 조합으로 반응형 구성
function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
