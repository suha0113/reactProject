import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind + clsx 조합
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
