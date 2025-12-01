//Tailwind 스타일을 variant/size 마다 자동 조합해주는 라이브러리
import { cva } from "class-variance-authority";
/* 왜 CVA를 사용
  primary, outline, ghost 같은 버튼 종류들을 매번 tailwind로 직접 적으면 중복이 너무 많아짐
  CVA를 사용하면 버튼 스타일을 하나의 시스템으로 관리 
  대형 UI 라이브러리에서 쓰는 방식
*/

export const buttonVariants = cva(
  //약간 긴 tailwind 문자열은 버튼이 어떤 variant를 사용하든 항상 공통으로 적용되는 기본 스타일
  //ex) 인라인 플렉스, 가운데 정렬, 텍스트 크기, disabled 상태 처리, 아이콘 크기 자동 조정, 초점(focus) 테두리 효과
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    //variants 설정 / 어떤 종류의 버튼인지
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      //크기는 어떻게 할 것
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    //버튼을 사용할 때 variant/size를 안 넣으면 기본값 자동 선택
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
