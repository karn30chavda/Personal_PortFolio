
"use client"
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    function checkDevice() {
        setIsMobile(mql.matches);
    }
    
    checkDevice();
    mql.addEventListener("change", checkDevice)

    return () => mql.removeEventListener("change", checkDevice)
  }, [])

  return isMounted ? isMobile : false;
}
