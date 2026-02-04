'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const url = pathname + searchParams.toString()
      
      // Track page view with Google Analytics
      window.gtag('config', 'G-FGXXN9EK0N', {
        page_path: url,
      })
      
      // Also track with PostHog
      if (window.posthog) {
        window.posthog.capture('$pageview', {
          path: url,
        })
      }
    }
  }, [pathname, searchParams])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    posthog: any
  }
}
