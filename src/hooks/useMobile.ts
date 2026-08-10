import { useMediaQuery } from 'usehooks-ts'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/** True below Tailwind's `md` breakpoint, matching the CSS the layout uses. */
export const useIsMobile = () => useMediaQuery(MOBILE_QUERY)
