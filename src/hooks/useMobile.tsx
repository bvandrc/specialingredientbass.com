/**
 * @fileoverview Mobile device detection hook based on viewport width.
 */

import { useLayoutEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

const getIsMobile = () =>
  typeof window !== 'undefined' &&
  window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile)

  useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
