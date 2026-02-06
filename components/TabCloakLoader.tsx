'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const CLOAK_OPTIONS = [
  {
    id: 'google-drive',
    title: 'My Drive - Google Drive',
    bgColor: '#000000', // black background
    cssClass: 'cloak-google-drive'
  },
  {
    id: 'canvas',
    title: 'Dashboard',
    bgColor: '#1a0000', // dark red background
    cssClass: 'cloak-canvas'
  },
  {
    id: 'classlink',
    title: 'ClassLink LaunchPad',
    bgColor: '#000a14', // dark blue background
    cssClass: 'cloak-classlink'
  },
  {
    id: 'linewize',
    title: 'Linewize',
    bgColor: '#000a14', // dark blue background
    cssClass: 'cloak-linewize'
  },
  {
    id: 'infinite-campus',
    title: 'Campus Portal',
    bgColor: '#001a00', // dark green background
    cssClass: 'cloak-infinite-campus'
  }
]

// Utility function to create a solid color favicon as a data URL
const createSolidColorFavicon = (color: string): string => {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 32, 32)
  }
  return canvas.toDataURL('image/png')
}

// Helper to remove all cloak classes from body
const removeCloakClasses = () => {
  CLOAK_OPTIONS.forEach(option => {
    document.body.classList.remove(option.cssClass)
  })
}

export function TabCloakLoader() {
  const pathname = usePathname()

  const applyCloak = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const savedCloak = localStorage.getItem('forsyth-tab-cloak')
    
    if (savedCloak && savedCloak !== 'none') {
      const option = CLOAK_OPTIONS.find(o => o.id === savedCloak)
      if (option) {
        // Set title
        document.title = option.title
        
        // Set favicon with solid color matching background
        let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (!favicon) {
          favicon = document.createElement('link')
          favicon.rel = 'icon'
          document.head.appendChild(favicon)
        }
        favicon.href = createSolidColorFavicon(option.bgColor)
        
        // Remove existing cloak classes and apply the saved one
        removeCloakClasses()
        document.body.classList.add(option.cssClass)
      }
    }
  }, [])

  // Apply cloak on mount and whenever pathname changes
  useEffect(() => {
    applyCloak()
    
    // Small delays to override Next.js metadata changes after navigation
    const initialCloakTimeout = setTimeout(applyCloak, 50)
    const secondaryCloakTimeout = setTimeout(applyCloak, 150)
    
    return () => {
      clearTimeout(initialCloakTimeout)
      clearTimeout(secondaryCloakTimeout)
    }
  }, [pathname, applyCloak])

  // Use MutationObserver to prevent title changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedCloak = localStorage.getItem('forsyth-tab-cloak')
    if (!savedCloak || savedCloak === 'none') return
    
    const option = CLOAK_OPTIONS.find(o => o.id === savedCloak)
    if (!option) return

    // Watch for title changes and revert them
    const titleObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && document.title !== option.title) {
          document.title = option.title
        }
      }
    })

    const titleElement = document.querySelector('title')
    if (titleElement) {
      titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true })
    }

    // Also watch for title element being added/changed in head
    const headObserver = new MutationObserver(() => {
      if (document.title !== option.title) {
        document.title = option.title
      }
    })

    headObserver.observe(document.head, { childList: true, subtree: true })

    return () => {
      titleObserver.disconnect()
      headObserver.disconnect()
    }
  }, [pathname])

  return null
}
