'use client'

import { useEffect } from 'react'

// Type definitions for Window extensions
interface WindowWithRTC extends Window {
  RTCPeerConnection?: unknown
  webkitRTCPeerConnection?: unknown
  mozRTCPeerConnection?: unknown
  RTCDataChannel?: unknown
  RTCSessionDescription?: unknown
  RTCIceCandidate?: unknown
  chrome?: {
    runtime?: {
      sendMessage?: unknown
      connect?: unknown
    }
  }
  MediaRecorder?: typeof MediaRecorder
  WebSocket: typeof WebSocket
}

interface XMLHttpRequestWithBlocked extends XMLHttpRequest {
  _blocked?: boolean
}

/**
 * Blocked monitoring domains
 */
const BLOCKED_DOMAINS = [
  // Linewize Filter
  'familyzone.com',
  'familyzone.com.au',
  'familyzone.io',
  'familyzone.tools',
  'linewize.com',
  'linewize.io',
  'linewize.net',
  'linewizereseller.net',
  'qoria.com',
  'qoria.cloud',
  'qoriaapis.cloud',
  'qoria-api.cloud',
  'sphirewall.net',
  'block.tools',
  'fzbox.tools',
  'home.tools',
  // Linewize Filter Content-aware Module
  'smoothwall.cloud',
  'smoothwall.com',
  // Classwize
  'ably.io',
  'ably-realtime.com',
  'xirsys.com',
  // Classwize Screen Share
  'stream-io-api.com',
  'stream-io-video.com',
  'stream-io-cdn.com',
  'getstream.io',
  // Pulse
  'educatorimpact.com',
  'zdassets.com',
  'zendesk.com',
  // Additional monitoring services
  'securly.com',
  'goguardian.com',
  'bark.us',
  'lightspeedsystems.com',
  'contentkeeper.com',
  'iboss.com',
  'fortigate.com',
  'fortinet.com'
]

/**
 * Telemetry patterns to block
 */
const TELEMETRY_PATTERNS = [
  /telemetry/i,
  /analytics/i,
  /tracking/i,
  /beacon/i,
  /metrics/i,
  /monitor/i,
  /capture/i,
  /screenshot/i,
  /screenrecord/i,
  /activity/i
]

/**
 * Check if a URL matches blocked domains
 */
function isBlockedDomain(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url, window.location.origin)
    const hostname = urlObj.hostname.toLowerCase()
    return BLOCKED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

/**
 * Check if URL should be blocked (domains + telemetry patterns)
 */
function shouldBlockUrl(url: string | null | undefined): boolean {
  if (!url) return false
  if (isBlockedDomain(url)) return true
  
  try {
    const urlObj = new URL(url, window.location.origin)
    if (urlObj.hostname !== window.location.hostname) {
      for (const pattern of TELEMETRY_PATTERNS) {
        if (pattern.test(url)) return true
      }
    }
  } catch {
    // Ignore URL parsing errors
  }
  return false
}

/**
 * Initialize all protection mechanisms
 */
function initProtection(): void {
  if (typeof window === 'undefined') return

  // ========================================
  // WEBRTC BLOCKING
  // ========================================
  const blockWebRTC = () => {
    const blockedRTC = function() {
      throw new Error('WebRTC is disabled')
    }
    
    const win = window as WindowWithRTC
    if (win.RTCPeerConnection) {
      win.RTCPeerConnection = blockedRTC as unknown as typeof RTCPeerConnection
    }
    if (win.webkitRTCPeerConnection) {
      win.webkitRTCPeerConnection = blockedRTC
    }
    if (win.mozRTCPeerConnection) {
      win.mozRTCPeerConnection = blockedRTC
    }
    if (win.RTCDataChannel) {
      win.RTCDataChannel = blockedRTC
    }
    if (win.RTCSessionDescription) {
      win.RTCSessionDescription = blockedRTC as unknown as typeof RTCSessionDescription
    }
    if (win.RTCIceCandidate) {
      win.RTCIceCandidate = blockedRTC as unknown as typeof RTCIceCandidate
    }
  }

  // ========================================
  // SCREEN CAPTURE BLOCKING
  // ========================================
  const blockScreenCapture = () => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getDisplayMedia = function() {
        return Promise.reject(new Error('Screen capture is disabled'))
      }
      
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
      navigator.mediaDevices.getUserMedia = function(constraints: MediaStreamConstraints) {
        if (constraints?.video && typeof constraints.video === 'object') {
          const videoConstraints = constraints.video as MediaTrackConstraints & {
            mediaSource?: string
            displaySurface?: string
            cursor?: string
          }
          if (
            videoConstraints.mediaSource === 'screen' ||
            videoConstraints.mediaSource === 'window' ||
            videoConstraints.mediaSource === 'application' ||
            videoConstraints.displaySurface ||
            videoConstraints.cursor
          ) {
            return Promise.reject(new Error('Screen capture is disabled'))
          }
        }
        return originalGetUserMedia(constraints)
      }
    }
  }

  // ========================================
  // NETWORK REQUEST BLOCKING
  // ========================================
  const blockNetworkRequests = () => {
    // Override fetch
    const originalFetch = window.fetch.bind(window)
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url
      if (shouldBlockUrl(url)) {
        return Promise.reject(new Error('Request blocked'))
      }
      return originalFetch(input, init)
    }

    // Override XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(this: XMLHttpRequest, method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
      const urlString = url instanceof URL ? url.href : url
      if (shouldBlockUrl(urlString)) {
        (this as XMLHttpRequestWithBlocked)._blocked = true
      }
      return originalXHROpen.call(this, method, url, async, username, password)
    }

    const originalXHRSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
      if ((this as XMLHttpRequestWithBlocked)._blocked) {
        return
      }
      return originalXHRSend.call(this, body)
    }

    // Block WebSocket
    const OriginalWebSocket = window.WebSocket
    const win = window as WindowWithRTC
    win.WebSocket = function(this: typeof WebSocket, url: string | URL, protocols?: string | string[]) {
      const urlString = url instanceof URL ? url.href : url
      if (shouldBlockUrl(urlString)) {
        throw new Error('WebSocket connection blocked')
      }
      return new OriginalWebSocket(url, protocols)
    } as unknown as typeof WebSocket
    Object.setPrototypeOf(win.WebSocket, OriginalWebSocket)
    win.WebSocket.prototype = OriginalWebSocket.prototype
    Object.defineProperty(win.WebSocket, 'CONNECTING', { value: OriginalWebSocket.CONNECTING })
    Object.defineProperty(win.WebSocket, 'OPEN', { value: OriginalWebSocket.OPEN })
    Object.defineProperty(win.WebSocket, 'CLOSING', { value: OriginalWebSocket.CLOSING })
    Object.defineProperty(win.WebSocket, 'CLOSED', { value: OriginalWebSocket.CLOSED })

    // Block Beacon API
    if (navigator.sendBeacon) {
      const originalSendBeacon = navigator.sendBeacon.bind(navigator)
      navigator.sendBeacon = function(url: string | URL, data?: BodyInit | null) {
        const urlString = url instanceof URL ? url.href : url
        if (shouldBlockUrl(urlString)) {
          return false
        }
        return originalSendBeacon(url, data)
      }
    }
  }

  // ========================================
  // VISIBILITY/FOCUS SPOOFING
  // ========================================
  const protectVisibility = () => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      enumerable: true,
      get: () => 'visible'
    })

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      enumerable: true,
      get: () => false
    })

    document.hasFocus = () => true
  }

  // ========================================
  // EXTENSION COMMUNICATION BLOCKING
  // ========================================
  const blockExtensions = () => {
    const win = window as WindowWithRTC
    if (win.chrome?.runtime) {
      if (win.chrome.runtime.sendMessage) {
        win.chrome.runtime.sendMessage = () => Promise.reject(new Error('Blocked'))
      }
      if (win.chrome.runtime.connect) {
        win.chrome.runtime.connect = () => ({
          postMessage: () => {},
          disconnect: () => {},
          onMessage: { addListener: () => {}, removeListener: () => {}, hasListener: () => false },
          onDisconnect: { addListener: () => {}, removeListener: () => {}, hasListener: () => false },
          name: '',
          sender: undefined
        })
      }
    }
  }

  // ========================================
  // DOM MUTATION OBSERVER
  // ========================================
  const blockDOMInjection = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement
            if (element.tagName === 'IFRAME' && isBlockedDomain((element as HTMLIFrameElement).src)) {
              element.remove()
            }
            if (element.tagName === 'SCRIPT' && isBlockedDomain((element as HTMLScriptElement).src)) {
              element.remove()
            }
            if (element.tagName === 'LINK' && isBlockedDomain((element as HTMLLinkElement).href)) {
              element.remove()
            }
          }
        })
      })
    })

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    })
  }

  // ========================================
  // SCREEN RECORDING BLOCKING
  // ========================================
  const blockRecording = () => {
    if (window.MediaRecorder) {
      const OriginalMediaRecorder = window.MediaRecorder
      const win = window as WindowWithRTC
      win.MediaRecorder = function(this: typeof MediaRecorder, stream: MediaStream, options?: MediaRecorderOptions) {
        if (stream?.getVideoTracks) {
          const tracks = stream.getVideoTracks()
          for (const track of tracks) {
            const settings = track.getSettings?.() || {}
            const extendedSettings = settings as MediaTrackSettings & { displaySurface?: string }
            if (extendedSettings.displaySurface || track.label.toLowerCase().includes('screen')) {
              throw new Error('Screen recording is disabled')
            }
          }
        }
        return new OriginalMediaRecorder(stream, options)
      } as unknown as typeof MediaRecorder
      Object.setPrototypeOf(win.MediaRecorder, OriginalMediaRecorder)
      win.MediaRecorder.prototype = OriginalMediaRecorder.prototype
      win.MediaRecorder.isTypeSupported = OriginalMediaRecorder.isTypeSupported
    }
  }

  // Run all protections
  try {
    blockWebRTC()
    blockScreenCapture()
    blockNetworkRequests()
    protectVisibility()
    blockExtensions()
    blockDOMInjection()
    blockRecording()
  } catch {
    // Silent fail
  }
}

/**
 * Protection component - blocks monitoring software, WebRTC, screen capture
 */
export function Protection() {
  useEffect(() => {
    initProtection()
  }, [])

  return null
}
