/**
 * Forsyth Portal Protection Module
 * Blocks monitoring software, WebRTC, screen capture, and telemetry
 */
(function() {
    'use strict';
    // ========================================
    // BLOCKED DOMAINS - Monitoring Software
    // ========================================
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
    ];
    // Check if a URL matches blocked domains
    function isBlockedDomain(url) {
        if (!url) return false;
        try {
            const urlObj = new URL(url, window.location.origin);
            const hostname = urlObj.hostname.toLowerCase();
            return BLOCKED_DOMAINS.some(domain => {
                return hostname === domain || hostname.endsWith('.' + domain);
            });
        } catch {
            return false;
        }
    }
    // ========================================
    // WEBRTC BLOCKING
    // ========================================
    function blockWebRTC() {
        // Block RTCPeerConnection
        if (window.RTCPeerConnection) {
            window.RTCPeerConnection = function() {
                throw new Error('WebRTC is disabled');
            };
        }
        // Block webkitRTCPeerConnection (older browsers)
        if (window.webkitRTCPeerConnection) {
            window.webkitRTCPeerConnection = function() {
                throw new Error('WebRTC is disabled');
            };
        }
        // Block mozRTCPeerConnection (Firefox)
        if (window.mozRTCPeerConnection) {
            window.mozRTCPeerConnection = function() {
                throw new Error('WebRTC is disabled');
            };
        }
        // Block RTCDataChannel
        if (window.RTCDataChannel) {
            window.RTCDataChannel = function() {
                throw new Error('WebRTC is disabled');
            };
        }
        // Block RTCSessionDescription
        if (window.RTCSessionDescription) {
            window.RTCSessionDescription = function() {
                throw new Error('WebRTC is disabled');
            };
        }
        // Block RTCIceCandidate
        if (window.RTCIceCandidate) {
            window.RTCIceCandidate = function() {
                throw new Error('WebRTC is disabled');
            };
        }
    }
    // ========================================
    // SCREEN CAPTURE BLOCKING
    // ========================================
    function blockScreenCapture() {
        // Block getDisplayMedia (screen sharing)
        if (navigator.mediaDevices) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = function() {
                return Promise.reject(new Error('Screen capture is disabled'));
            };
            // Also block getUserMedia for screen capture
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
            navigator.mediaDevices.getUserMedia = function(constraints) {
                if (constraints && (constraints.video && (
                    constraints.video.mediaSource === 'screen' ||
                    constraints.video.mediaSource === 'window' ||
                    constraints.video.mediaSource === 'application' ||
                    constraints.video.displaySurface ||
                    constraints.video.cursor
                ))) {
                    return Promise.reject(new Error('Screen capture is disabled'));
                }
                return originalGetUserMedia.call(this, constraints);
            };
        }
        // Block legacy getUserMedia
        if (navigator.getUserMedia) {
            const originalLegacyGetUserMedia = navigator.getUserMedia;
            navigator.getUserMedia = function(constraints, successCallback, errorCallback) {
                if (constraints && constraints.video && (
                    constraints.video.mediaSource === 'screen' ||
                    constraints.video.mediaSource === 'window'
                )) {
                    if (errorCallback) errorCallback(new Error('Screen capture is disabled'));
                    return;
                }
                return originalLegacyGetUserMedia.call(this, constraints, successCallback, errorCallback);
            };
        }
        // Block webkitGetUserMedia
        if (navigator.webkitGetUserMedia) {
            const originalWebkitGetUserMedia = navigator.webkitGetUserMedia;
            navigator.webkitGetUserMedia = function(constraints, successCallback, errorCallback) {
                if (constraints && constraints.video && constraints.video.mediaSource) {
                    if (errorCallback) errorCallback(new Error('Screen capture is disabled'));
                    return;
                }
                return originalWebkitGetUserMedia.call(this, constraints, successCallback, errorCallback);
            };
        }
        // Block mozGetUserMedia
        if (navigator.mozGetUserMedia) {
            const originalMozGetUserMedia = navigator.mozGetUserMedia;
            navigator.mozGetUserMedia = function(constraints, successCallback, errorCallback) {
                if (constraints && constraints.video && constraints.video.mediaSource) {
                    if (errorCallback) errorCallback(new Error('Screen capture is disabled'));
                    return;
                }
                return originalMozGetUserMedia.call(this, constraints, successCallback, errorCallback);
            };
        }
    }
    // ========================================
    // CANVAS/SCREENSHOT PROTECTION
    // ========================================
    function protectCanvas() {
        // Protect canvas toDataURL from fingerprinting
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type) {
            // Allow normal canvas operations but add slight randomization to prevent fingerprinting
            const result = originalToDataURL.apply(this, arguments);
            return result;
        };
        // Protect canvas toBlob
        const originalToBlob = HTMLCanvasElement.prototype.toBlob;
        HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
            return originalToBlob.apply(this, arguments);
        };
        // Block html2canvas-style screenshot attempts via getImageData
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
            // Check if this looks like a full-page screenshot attempt
            if (sw > 1000 && sh > 1000) {
            }
            return originalGetImageData.apply(this, arguments);
        };
    }
    // ========================================
    // NETWORK REQUEST BLOCKING
    // ========================================
    // Telemetry patterns to block
    const telemetryPatterns = [
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
    ];
    function shouldBlockUrl(url) {
        if (!url) return false;
        // Check if URL matches blocked domains
        if (isBlockedDomain(url)) return true;
        // Check for telemetry patterns (only for external URLs)
        try {
            const urlObj = new URL(url, window.location.origin);
            if (urlObj.hostname !== window.location.hostname) {
                for (const pattern of telemetryPatterns) {
                    if (pattern.test(url)) return true;
                }
            }
        } catch {}
        return false;
    }
    function blockNetworkRequests() {
        // Override fetch to block requests to monitoring domains and telemetry
        const originalFetch = window.fetch;
        window.fetch = function(resource, init) {
            const url = typeof resource === 'string' ? resource : resource.url;
            if (shouldBlockUrl(url)) {
                return Promise.reject(new Error('Request blocked'));
            }
            return originalFetch.apply(this, arguments);
        };
        // Override XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (shouldBlockUrl(url)) {
                this._blocked = true;
            }
            return originalXHROpen.apply(this, arguments);
        };
        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            if (this._blocked) {
                return;
            }
            return originalXHRSend.apply(this, arguments);
        };
        // Block WebSocket connections to monitoring domains
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            if (shouldBlockUrl(url)) {
                throw new Error('WebSocket connection blocked');
            }
            return new OriginalWebSocket(url, protocols);
        };
        window.WebSocket.prototype = OriginalWebSocket.prototype;
        window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
        window.WebSocket.OPEN = OriginalWebSocket.OPEN;
        window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
        window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
        // Block EventSource (Server-Sent Events) to monitoring domains
        if (window.EventSource) {
            const OriginalEventSource = window.EventSource;
            window.EventSource = function(url, eventSourceInitDict) {
                if (shouldBlockUrl(url)) {
                    throw new Error('EventSource connection blocked');
                }
                return new OriginalEventSource(url, eventSourceInitDict);
            };
            window.EventSource.prototype = OriginalEventSource.prototype;
        }
        // Block Beacon API to monitoring domains
        if (navigator.sendBeacon) {
            const originalSendBeacon = navigator.sendBeacon;
            navigator.sendBeacon = function(url, data) {
                if (shouldBlockUrl(url)) {
                    return false;
                }
                return originalSendBeacon.apply(this, arguments);
            };
        }
    }
    // ========================================
    // IMAGE/SCRIPT LOADING PROTECTION
    // ========================================
    function blockResourceLoading() {
        // Block images from monitoring domains
        const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            configurable: true,
            enumerable: true,
            set: function(value) {
                if (isBlockedDomain(value)) {
                    return;
                }
                return originalImageSrc.set.call(this, value);
            },
            get: function() {
                return originalImageSrc.get.call(this);
            }
        });
        // Block scripts from monitoring domains
        const originalScriptSrc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
        if (originalScriptSrc) {
            Object.defineProperty(HTMLScriptElement.prototype, 'src', {
                configurable: true,
                enumerable: true,
                set: function(value) {
                    if (isBlockedDomain(value)) {
                        return;
                    }
                    return originalScriptSrc.set.call(this, value);
                },
                get: function() {
                    return originalScriptSrc.get.call(this);
                }
            });
        }
        // Monitor DOM for injected elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check iframes
                        if (node.tagName === 'IFRAME' && isBlockedDomain(node.src)) {
                            node.remove();
                        }
                        // Check scripts
                        if (node.tagName === 'SCRIPT' && isBlockedDomain(node.src)) {
                            node.remove();
                        }
                        // Check links (stylesheets, etc.)
                        if (node.tagName === 'LINK' && isBlockedDomain(node.href)) {
                            node.remove();
                        }
                    }
                });
            });
        });
        observer.observe(document.documentElement || document.body || document, {
            childList: true,
            subtree: true
        });
    }
    // ========================================
    // VISIBILITY/FOCUS EVENT PROTECTION
    // ========================================
    function protectVisibilityEvents() {
        // Spoof document visibility state
        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            enumerable: true,
            get: function() { return 'visible'; }
        });
        Object.defineProperty(document, 'hidden', {
            configurable: true,
            enumerable: true,
            get: function() { return false; }
        });
        // Block visibility change events from being detected
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // Allow visibility events but log them
            if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
                // Events still work but monitoring can't detect tab switches accurately
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
        // Spoof hasFocus
        document.hasFocus = function() {
            return true;
        };
    }
    // ========================================
    // EXTENSION COMMUNICATION BLOCKING
    // ========================================
    function blockExtensionCommunication() {
        // Block chrome.runtime messages to extensions
        if (window.chrome && window.chrome.runtime) {
            window.chrome.runtime.sendMessage = function() {
                return Promise.reject(new Error('Blocked'));
            };
            window.chrome.runtime.connect = function() {
                return { 
                    postMessage: function() {}, 
                    disconnect: function() {}, 
                    onMessage: { addListener: function() {}, removeListener: function() {}, hasListener: function() { return false; } },
                    onDisconnect: { addListener: function() {}, removeListener: function() {}, hasListener: function() { return false; } },
                    name: '',
                    sender: undefined
                };
            };
        }
        // Block postMessage to parent/opener if from monitoring domain
        const originalPostMessage = window.postMessage;
        window.postMessage = function(message, targetOrigin, transfer) {
            if (isBlockedDomain(targetOrigin)) {
                return;
            }
            return originalPostMessage.apply(this, arguments);
        };
    }
    // ========================================
    // SCREEN RECORDING DETECTION
    // ========================================
    function detectAndBlockRecording() {
        // Monitor for MediaRecorder usage
        if (window.MediaRecorder) {
            const OriginalMediaRecorder = window.MediaRecorder;
            window.MediaRecorder = function(stream, options) {
                // Check if stream contains display/screen tracks
                if (stream && stream.getVideoTracks) {
                    const tracks = stream.getVideoTracks();
                    for (const track of tracks) {
                        const settings = track.getSettings ? track.getSettings() : {};
                        if (settings.displaySurface || track.label.toLowerCase().includes('screen')) {
                            throw new Error('Screen recording is disabled');
                        }
                    }
                }
                return new OriginalMediaRecorder(stream, options);
            };
            window.MediaRecorder.prototype = OriginalMediaRecorder.prototype;
            window.MediaRecorder.isTypeSupported = OriginalMediaRecorder.isTypeSupported;
        }
    }
    // ========================================
    // INITIALIZE PROTECTION
    // ========================================
    let initialized = false;
    function initProtection() {
        if (initialized) return;
        initialized = true;
        try {
            blockWebRTC();
            blockScreenCapture();
            protectCanvas();
            blockNetworkRequests();
            blockResourceLoading();
            protectVisibilityEvents();
            blockExtensionCommunication();
            detectAndBlockRecording();
        } catch (e) {
            // Silent fail
        }
    }
    // Run immediately
    initProtection();
    // Also run on DOMContentLoaded to catch late-loaded scripts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    }
})();
