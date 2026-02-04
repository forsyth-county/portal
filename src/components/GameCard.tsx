'use client'

import { useState } from 'react'

interface Game {
  name: string
  path: string
  category: string
  featured: boolean
}

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const handlePlay = () => {
    // Open game in current page
    window.location.href = `/games/${game.path}/`
  }

  return (
    <div className="group relative bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
      {/* Game Icon/Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative overflow-hidden">
        {!imageError ? (
          <img
            src={`/games/${game.path}/favicon.png`}
            alt={game.name}
            className="w-16 h-16 object-contain transition-transform group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-gamepad text-2xl text-white"></i>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm"
          >
            <i className="fas fa-play mr-2"></i>
            Play
          </button>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-2 right-2 bg-blue-600/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
          {game.category}
        </div>
        
        {/* Featured Badge */}
        {game.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500/80 backdrop-blur-sm text-black text-xs px-2 py-1 rounded-full font-medium">
            <i className="fas fa-star mr-1"></i>
            Featured
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors line-clamp-2 leading-tight">
          {game.name}
        </h3>
        
        <button
          onClick={handlePlay}
          className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
        >
          <i className="fas fa-play mr-2"></i>
          Play Game
        </button>
      </div>
    </div>
  )
}