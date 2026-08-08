/**
 * @fileoverview Mobile device detection hook based on viewport width.
 */

import { useMediaQuery } from 'usehooks-ts'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY)

export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches
