import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "./button-variants";

import { cn } from "./utils";

//asChild = true 일 때 Slot 사용
//Radix Slot은 <button> 대신 <a>나 <Link>을 버튼처럼 쓸 수 있게 해주는 기능
//Button 스타일을 다른 태그에 입힐 수 있게 해주는 고급 패턴
function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      //buttonVariants로 만들어진 클래스를 가져오고
      //사용자 className 합쳐주고 cn()으로 tailwind 충돌없이 병합
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
