'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white">
            <img 
              src="https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png" 
              alt="FCS Logo" 
              className="w-8 h-8"
            />
            Forsyth Games
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <i className="fas fa-home"></i>
              Home
            </Link>
            <Link 
              href="/games" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <i className="fas fa-gamepad"></i>
              Games
            </Link>
            <Link 
              href="/utilities" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <i className="fas fa-tools"></i>
              Utilities
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-home"></i>
                Home
              </Link>
              <Link 
                href="/games" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-gamepad"></i>
                Games
              </Link>
              <Link 
                href="/utilities" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-tools"></i>
                Utilities
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}