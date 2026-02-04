'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, Send, Trash2, Bell, CheckCircle, AlertTriangle, Copy, Download } from 'lucide-react'
import { withBasePath } from '@/lib/utils'

const ADMIN_PASSCODE = '1140' // Admin passcode

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success'>('info')
  const [currentAnnouncement, setCurrentAnnouncement] = useState<{message: string, type: string, enabled: boolean} | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [generatedJSON, setGeneratedJSON] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // Check if already authenticated this session
    const authSession = sessionStorage.getItem('forsyth-admin-auth')
    if (authSession === 'true') {
      setIsAuthenticated(true)
    }

    // Load current announcement from public JSON
    const loadCurrentAnnouncement = async () => {
      try {
        const response = await fetch(withBasePath('/announcement.json'), {
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.enabled && data.message) {
            setCurrentAnnouncement(data)
          }
        }
      } catch {
        // Ignore
      }
    }
    loadCurrentAnnouncement()
  }, [])

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true)
      sessionStorage.setItem('forsyth-admin-auth', 'true')
      setPasscodeError('')
    } else {
      setPasscodeError('Incorrect passcode')
      setPasscode('')
    }
  }

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcement.trim()) return

    const announcementData = {
      message: announcement.trim(),
      type: announcementType,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(7) + Date.now().toString(36),
      enabled: true
    }

    const jsonContent = JSON.stringify(announcementData, null, 2)
    setGeneratedJSON(jsonContent)
    setSubmitStatus('success')
  }

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(generatedJSON)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      // Ignore
    }
  }

  const handleDownloadJSON = () => {
    const blob = new Blob([generatedJSON], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'announcement.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAnnouncement = () => {
    const emptyAnnouncement = {
      message: '',
      type: 'info',
      timestamp: 0,
      id: '',
      enabled: false
    }
    const jsonContent = JSON.stringify(emptyAnnouncement, null, 2)
    setGeneratedJSON(jsonContent)
    setCurrentAnnouncement(null)
    setSubmitStatus('idle')
  }

  // Passcode screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl border border-border p-8 max-w-md w-full mx-4"
        >
          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm">
              Enter the admin passcode to continue
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground text-center text-lg tracking-widest"
                autoFocus
              />
              <AnimatePresence>
                {passcodeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {passcodeError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Admin Authenticated</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage site-wide announcements</p>
      </motion.div>

      {/* Current Announcement */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl border border-border p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Current Active Announcement
          </h2>
          {currentAnnouncement && (
            <button
              onClick={clearAnnouncement}
              className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Disable
            </button>
          )}
        </div>

        {currentAnnouncement ? (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-foreground">{currentAnnouncement.message}</p>
            <p className="text-xs text-muted-foreground mt-2">Type: {currentAnnouncement.type}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">No active announcement</p>
        )}
      </motion.section>

      {/* Create Announcement */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl border border-border p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          Create Announcement
        </h2>

        <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Announcement Type
            </label>
            <div className="flex gap-2">
              {(['info', 'warning', 'success'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAnnouncementType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    announcementType === type
                      ? type === 'info'
                        ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                        : type === 'warning'
                        ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                        : 'bg-green-500/20 border-2 border-green-500 text-green-400'
                      : 'bg-background/50 border-2 border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Enter your announcement message..."
              rows={4}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!announcement.trim()}
            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Broadcast Announcement
          </button>

          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center">
                  JSON generated successfully! Copy or download the content below.
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">
                      Generated JSON (Copy this to /public/announcement.json)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCopyJSON}
                        className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2"
                      >
                        {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadJSON}
                        className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-sm overflow-x-auto">
                    {generatedJSON}
                  </pre>
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                    <p className="font-semibold mb-1">📝 Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Copy the JSON content above</li>
                      <li>Update /public/announcement.json with this content</li>
                      <li>Commit and push to the repository</li>
                      <li>The announcement will appear for all users after deployment</li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.section>

      {/* Preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl border border-border p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Preview
        </h2>
        <p className="text-muted-foreground text-sm">
          This is how the announcement will appear to users:
        </p>

        {announcement.trim() && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            announcementType === 'info'
              ? 'bg-blue-500/10 border-blue-500/30'
              : announcementType === 'warning'
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-green-500/10 border-green-500/30'
          }`}>
            <Bell className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              announcementType === 'info'
                ? 'text-blue-400'
                : announcementType === 'warning'
                ? 'text-yellow-400'
                : 'text-green-400'
            }`} />
            <p className="text-foreground text-sm">{announcement}</p>
          </div>
        )}
      </motion.section>
    </div>
  )
}
