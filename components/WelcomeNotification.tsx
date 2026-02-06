'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function WelcomeNotification() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already seen the notification in this session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome')
    
    if (!hasSeenWelcome) {
      // Show notification after a short delay
      const showTimer = setTimeout(() => {
        setIsVisible(true)
        sessionStorage.setItem('hasSeenWelcome', 'true')
        
        // Auto-hide after 3 seconds
        const hideTimer = setTimeout(() => {
          setIsVisible(false)
        }, 3000)
        
        return () => clearTimeout(hideTimer)
      }, 1000)
      
      return () => clearTimeout(showTimer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-50 xs:top-6 xs:right-6 sm:top-8 sm:right-8"
        >
          <div className="glass rounded-xl xs:rounded-2xl border border-border/50 shadow-2xl p-3 xs:p-4 sm:p-6 w-64 xs:w-72 sm:w-80 md:min-w-[320px] md:max-w-md">
            <div className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm xs:text-lg">👋</span>
                </div>
                <div>
                  <h3 className="text-sm xs:text-base sm:text-lg font-bold text-foreground">Welcome Back!</h3>
                  <p className="text-xs xs:text-sm text-muted-foreground">Good to see you again</p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-background/50 transition-colors"
              >
                <X className="w-3 h-3 xs:w-4 xs:h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
