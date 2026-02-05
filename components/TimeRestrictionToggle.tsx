'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Lock, Unlock } from 'lucide-react'

export function TimeRestrictionToggle() {
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Load saved preference on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('forsyth-time-restriction-enabled')
      // Default to true if not set, false if explicitly disabled
      setIsEnabled(saved === null ? true : saved === 'true')
    }
  }, [])

  const toggleRestriction = () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('forsyth-time-restriction-enabled', newValue.toString())
      
      // If we're disabling the restriction and currently on locked page, redirect to home
      if (!newValue && window.location.pathname.includes('/locked')) {
        window.location.href = '/'
      }
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-8 lg:p-10 space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
            <Clock className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">After School Hours Lock</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Control portal access times</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Control when the portal can be accessed. When enabled, the portal is only available during school hours (6 AM - 5 PM ET).
        </p>

        {/* Modern Toggle Switch */}
        <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              isEnabled 
                ? 'bg-red-500/20 border border-red-500/30' 
                : 'bg-green-500/20 border border-green-500/30'
            }`}>
              {isEnabled ? (
                <Lock className="w-6 h-6 text-red-400" />
              ) : (
                <Unlock className="w-6 h-6 text-green-400" />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-lg">
                {isEnabled ? 'Time Restriction Enabled' : 'Time Restriction Disabled'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEnabled 
                  ? 'Portal locked outside 6 AM - 5 PM ET' 
                  : 'Portal accessible at any time'}
              </div>
            </div>
          </div>
          
          {/* Modern Switch */}
          <button
            onClick={toggleRestriction}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
              isEnabled ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span className="sr-only">Toggle time restriction</span>
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                isEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Status Messages */}
        {!isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <p className="text-sm text-green-700/90 dark:text-green-300/90">
              ✓ <strong>Time restriction disabled:</strong> You can now access the portal at any time, including after school hours.
            </p>
          </motion.div>
        )}

        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
          >
            <p className="text-sm text-yellow-700/90 dark:text-yellow-300/90">
              ⏰ <strong>Note:</strong> The portal will only be accessible during school hours (6 AM - 5 PM Eastern Time) when this setting is enabled.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
