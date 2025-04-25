import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const stringToColor = (string: string) => {
  const hash = string.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  return `hsl(${hash % 360}, 100%, 50%)`;
};


