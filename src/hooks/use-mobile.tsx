import * as React from "react"

const MOBILE_BREAKPOINT = 768

// ⚡ OPTIMIZED: Valeur initiale synchrone pour éviter les flashs
const getInitialMobileState = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
};

export function useIsMobile() {
  // ⚡ FIXED: Valeur initiale basée sur window.innerWidth, pas undefined
  const [isMobile, setIsMobile] = React.useState<boolean>(getInitialMobileState)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Synchroniser au cas où
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}