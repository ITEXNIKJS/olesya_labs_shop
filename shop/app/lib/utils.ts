import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Утилити для работы с tailwind стилями
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
