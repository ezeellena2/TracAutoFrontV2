import { useEffect } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: { readonly current: T | null },
  handler: () => void
): void {
  useEffect(function bindClickOutside() {
    function handleMousedown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }
    document.addEventListener('mousedown', handleMousedown)
    return () => document.removeEventListener('mousedown', handleMousedown)
  }, [ref, handler])
}
