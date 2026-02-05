import { useEffect, useRef, useState } from 'react'

/**
 * SECURITY WARNING: Client-Side Only Turnstile Implementation
 * 
 * This implementation provides BASIC bot deterrent capabilities only.
 * Since this site deploys to GitHub Pages (pure static HTML/JS, no backend),
 * we CANNOT perform proper server-side Turnstile token validation.
 * 
 * What this provides:
 * - Client-side challenge that deters simple spam bots
 * - Invisible/non-interactive mode for legitimate users
 * 
 * What this DOES NOT provide:
 * - Real security against determined attackers
 * - Server-side token validation (required for full security)
 * - Protection against sophisticated bots that can bypass client-side checks
 * 
 * RECOMMENDATION:
 * For full security, migrate to a platform that supports server-side code:
 * - Cloudflare Pages + Functions (can validate tokens server-side)
 * - Vercel with API routes
 * - Netlify with Functions
 * - Any traditional backend (Node.js, Python, etc.)
 * 
 * The secret key should NEVER be exposed client-side or in this repository.
 */

interface TurnstileOptions {
  sitekey: string
  theme?: 'light' | 'dark' | 'auto'
  onSuccess?: (token: string) => void
  onError?: (error: any) => void
  onExpire?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      ready: (callback: () => void) => void
      render: (element: string | HTMLElement, options: any) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export function useTurnstile({
  sitekey,
  theme = 'auto',
  onSuccess,
  onError,
  onExpire,
}: TurnstileOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Wait for Turnstile to be ready
    const checkTurnstile = () => {
      if (window.turnstile) {
        window.turnstile.ready(() => {
          setIsReady(true)
        })
      } else {
        // Retry if Turnstile script hasn't loaded yet
        setTimeout(checkTurnstile, 100)
      }
    }

    checkTurnstile()
  }, [])

  useEffect(() => {
    if (!isReady || !containerRef.current || widgetIdRef.current) {
      return
    }

    // Render the Turnstile widget
    try {
      widgetIdRef.current = window.turnstile!.render(containerRef.current, {
        sitekey,
        theme,
        appearance: 'execute', // Invisible mode - runs challenge immediately on render
        callback: (responseToken: string) => {
          console.log('✓ Turnstile token received (client-side only - NO server validation)')
          setToken(responseToken)
          onSuccess?.(responseToken)
        },
        'error-callback': (error: any) => {
          console.error('✗ Turnstile error:', error)
          setToken(null)
          onError?.(error)
        },
        'expired-callback': () => {
          console.warn('⚠ Turnstile token expired - resetting')
          setToken(null)
          onExpire?.()
          // Auto-reset the widget when token expires
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current)
          }
        },
      })
    } catch (error) {
      console.error('Failed to render Turnstile widget:', error)
    }

    // Cleanup on unmount
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (e) {
          console.error('Error removing Turnstile widget:', e)
        }
      }
    }
  }, [isReady, sitekey, theme, onSuccess, onError, onExpire])

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
      setToken(null)
    }
  }

  return {
    containerRef,
    token,
    isReady,
    reset,
  }
}
