import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false
  let lastArgs: Parameters<T> | null = null
  let lastContext: ThisParameterType<T> | null = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    lastArgs = args
    lastContext = this

    if (!inThrottle) {
      inThrottle = true
      fn.apply(lastContext, lastArgs)

      setTimeout(() => {
        inThrottle = false
        // Optional: execute again on the trailing edge if calls were made during the wait time
        if (lastArgs) {
          fn.apply(lastContext, lastArgs)
          lastArgs = null
          lastContext = null
        }
      }, wait)
    }
  }
}
